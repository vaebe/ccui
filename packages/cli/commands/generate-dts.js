// 真实生成 .d.ts —— vue-tsc 跑 tsconfig.build.json，把组件类型逐个落到
// build/<comp>/index.d.ts，主入口落到 build/index.d.ts。
//
// 历史：之前是把一段硬编码的 "install + version" 壳字符串 copy 给每个组件目录，
// 用户在 TS 项目里完全拿不到组件 props/emits 类型（TS7016 implicit-any）。
// 已废弃的旧实现还有一个 entryDir bug —— 写成了 packages/ccui 而非 packages/ccui/ui，
// 导致 discoverComponents 永远返回空数组，实际只生成根 index.d.ts 一个壳。
import path, { dirname } from 'node:path'
import { promises as fsp } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import logger from '../shared/logger.js'
import { discoverComponents } from '../shared/discover-components.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgRoot = path.resolve(__dirname, '../../ccui')
const entryDir = path.resolve(pkgRoot, 'ui')
const outputDir = path.resolve(pkgRoot, 'build')
const typesDir = path.resolve(outputDir, 'types') // vue-tsc 的中间产物，最后会清掉

async function pathExists(p) {
  try {
    await fsp.access(p)
    return true
  } catch {
    return false
  }
}

async function moveDts(from, to) {
  if (!(await pathExists(from))) return false
  await fsp.mkdir(path.dirname(to), { recursive: true })
  await fsp.rename(from, to)
  return true
}

// 搬整个目录（含 src/*.d.ts），rename 跨设备时 fallback 到 cp+rm
async function moveDir(from, to) {
  if (!(await pathExists(from))) return false
  await fsp.mkdir(path.dirname(to), { recursive: true })
  try {
    await fsp.rename(from, to)
  } catch (err) {
    if (err.code === 'EXDEV' || err.code === 'ENOTEMPTY') {
      await fsp.cp(from, to, { recursive: true, force: true })
      await fsp.rm(from, { recursive: true, force: true })
    } else {
      throw err
    }
  }
  return true
}

export const generateDts = async () => {
  // 1) 跑 vue-tsc 把所有声明文件落到 build/types/
  // Windows shell: Node 20+ CVE-2024-27980 后 spawnSync 不再自动解析 pnpm.cmd（同 run-command.js 处理）
  const result = spawnSync('pnpm', ['exec', 'vue-tsc', '-p', 'tsconfig.build.json'], {
    cwd: pkgRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  // result.error 单独看：PATH 找不到 `pnpm` 时 status === null，否则
  // 错误会被 "退出码 null" 这种无信息抛错盖掉真实的 ENOENT。
  if (result.error) {
    throw new Error(`无法执行 pnpm exec vue-tsc：${result.error.message}`)
  }
  if (result.status !== 0) {
    throw new Error(`vue-tsc 退出码 ${result.status}，类型生成失败`)
  }

  const components = discoverComponents(entryDir)
  let movedCount = 0
  let strippedFiles = 0

  try {
    // 2) 主入口：build/types/ui/vue-ccui.d.ts → build/index.d.ts
    const rootMoved = await moveDts(path.resolve(typesDir, 'ui/vue-ccui.d.ts'), path.resolve(outputDir, 'index.d.ts'))
    if (!rootMoved) {
      throw new Error('vue-tsc 未产出 ui/vue-ccui.d.ts，请检查 tsconfig.build.json include')
    }

    // 3) 每个组件目录：整个 build/types/ui/<comp>/ 搬到 build/<comp>/
    //    必须连 src/*.d.ts 一并搬（index.d.ts 里 `import X from './src/x'` 才能 resolve）。
    //    目标目录可能已经有 build.js 写的 package.json + index.{es,umd}.js + style.css —— 我们只覆盖 d.ts。
    for (const name of components) {
      const src = path.resolve(typesDir, 'ui', name)
      if (!(await pathExists(src))) continue
      const dest = path.resolve(outputDir, name)
      await fsp.mkdir(dest, { recursive: true })
      // 把整个 src/ 子树（含 src/*.d.ts）搬过去，加 index.d.ts
      const subSrc = path.resolve(src, 'src')
      if (await pathExists(subSrc)) {
        await moveDir(subSrc, path.resolve(dest, 'src'))
      }
      const idx = path.resolve(src, 'index.d.ts')
      if (await pathExists(idx)) {
        await fsp.rename(idx, path.resolve(dest, 'index.d.ts'))
      }
      movedCount += 1
    }

    // 4) post-process：去掉 d.ts 里对 .scss/.css 的副作用 import —— 下游 TS 项目
    //    通常没声明 *.scss / *.css ambient module，会报 "Cannot find module './x.scss'"。
    //    这些副作用 import 在类型上零意义，只是 vue-tsc 把源码里 `import './x.scss'`
    //    原样保留下来了。
    const sideEffectStyleRe = /^\s*import\s+["'][^"']+\.(scss|css)["'];?\s*$/gm
    const stripFile = async (full) => {
      const content = await fsp.readFile(full, 'utf8')
      const stripped = content.replace(sideEffectStyleRe, '')
      if (stripped !== content) {
        await fsp.writeFile(full, stripped)
        strippedFiles += 1
      }
    }
    // 根 index.d.ts 也要剥（vue-ccui.ts 顶部有 `import './shared/styles/base.scss'`）
    await stripFile(path.resolve(outputDir, 'index.d.ts'))
    for (const name of components) {
      const dir = path.resolve(outputDir, name)
      const stripFromDir = async (d) => {
        let entries
        try {
          entries = await fsp.readdir(d, { withFileTypes: true })
        } catch {
          return
        }
        for (const e of entries) {
          const full = path.resolve(d, e.name)
          if (e.isDirectory()) await stripFromDir(full)
          else if (e.name.endsWith('.d.ts')) await stripFile(full)
        }
      }
      await stripFromDir(dir)
    }
  } finally {
    // 不管搬运/剥离是否成功，build/types/ 都不能留 —— 残留旧 d.ts 会被下次构建
    // 搬进新的 build/<comp>/ 冒充新产物。
    await fsp.rm(typesDir, { recursive: true, force: true })
  }

  logger.success(
    `vue-tsc 生成完成：根 index.d.ts + ${movedCount}/${components.length} 个组件 d.ts（剥离 ${strippedFiles} 处样式副作用 import）`,
  )
}
