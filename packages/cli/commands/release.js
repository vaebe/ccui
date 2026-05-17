// @vaebe/ccui 发布产物准备：
//   - 把源 package.json 抽到 packages/ccui/build/，剥 scripts/devDeps，展开 workspace: 协议
//   - 程序化注入 exports map（主入口 + 每个 ready 组件 + style.css），加 sideEffects
//   - 收紧 files 字段（明列产物，避免误带 stage 临时 chunk）
//   - 修正无样式组件子目录 package.json 里的 style 字段
//   - 拷贝 README / LICENSE / theme.scss / darkTheme.css
//
// **不**执行 npm publish。正式发包走 `node scripts/publish.mjs`（passkey 流程），
// 它会先调用本步骤生成产物，再走 npm publish + git tag。
import path, { dirname } from 'node:path'
import { promises as fsp, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { outputFile } from '../shared/fs.js'
import { discoverComponents } from '../shared/discover-components.js'
import packageJson from '../../ccui/package.json' with { type: 'json' }
import iconsPackageJson from '../../icons/package.json' with { type: 'json' }

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputDir = path.resolve(__dirname, '../../ccui/build')
const sourceDir = path.resolve(__dirname, '../../ccui')
const entryDir = path.resolve(sourceDir, 'ui')
const themeDir = path.resolve(__dirname, '../../theme')

// workspace 包真实版本号，用于发布时替换 workspace: 协议。
const WORKSPACE_VERSIONS = {
  '@vaebe/ccui-icons': iconsPackageJson.version,
}

function getVersion(version) {
  if (version) return version
  return packageJson.version
}

// pnpm workspace 协议语义：
//   workspace:*  → 精确版本
//   workspace:^  → ^版本
//   workspace:~  → ~版本
//   workspace:^x.y.z / workspace:x.y.z → 显式范围（去掉前缀即可）
function resolveWorkspaceRange(name, spec) {
  const real = WORKSPACE_VERSIONS[name]
  if (!real) {
    throw new Error(`未知的 workspace 依赖 ${name}，请在 release.js 的 WORKSPACE_VERSIONS 中登记`)
  }
  const range = spec.slice('workspace:'.length)
  if (range === '*') return real
  if (range === '^') return `^${real}`
  if (range === '~') return `~${real}`
  return range
}

function replaceWorkspaceDeps(deps) {
  if (!deps) return deps
  const out = {}
  for (const [name, spec] of Object.entries(deps)) {
    out[name] = typeof spec === 'string' && spec.startsWith('workspace:') ? resolveWorkspaceRange(name, spec) : spec
  }
  return out
}

// 取出 build/ 下实际可发布的组件 + 是否有 d.ts/style/es.js 产物。
// 范围 = discoverComponents(entryDir)（已排掉 locale 等非组件目录），与 build.js 完全一致。
// 是否进入 exports map 取决于 build 产物是否 existsSync——不再用 isReadyToRelease/WHITE_LIST
// 做二次过滤，避免和 build.js 范围错位导致 dts-only / es.js-only 的 silent 不一致。
function resolveReleasableComponents() {
  const all = discoverComponents(entryDir)
  return all.map((name) => ({
    name,
    hasStyle: existsSync(path.resolve(outputDir, name, 'style.css')),
    hasDts: existsSync(path.resolve(outputDir, name, 'index.d.ts')),
    hasJs: existsSync(path.resolve(outputDir, name, 'index.es.js')),
  }))
}

function buildExportsMap(components) {
  const exportsMap = {
    '.': {
      types: './index.d.ts',
      import: './vue-ccui.es.js',
      require: './vue-ccui.umd.js',
    },
    './style.css': './style.css',
    './theme/theme.scss': './theme/theme.scss',
    './theme/darkTheme.css': './theme/darkTheme.css',
    './package.json': './package.json',
  }
  for (const { name, hasStyle, hasDts, hasJs } of components) {
    if (!hasJs) continue // 没产 JS（理论上不应发生，保险跳过）
    const entry = {
      import: `./${name}/index.es.js`,
      require: `./${name}/index.umd.js`,
    }
    if (hasDts) entry.types = `./${name}/index.d.ts`
    // exports 字段约定 types 在最前面
    exportsMap[`./${name}`] = entry.types
      ? { types: entry.types, import: entry.import, require: entry.require }
      : { import: entry.import, require: entry.require }
    if (hasStyle) exportsMap[`./${name}/style.css`] = `./${name}/style.css`
  }
  return exportsMap
}

function buildFilesField(components) {
  // 主入口 + vite 拆出来的根级 lazy chunk + 单组件目录 + 资产 + 主题。
  // 不能只列 vue-ccui.{es,umd}.js —— 主 bundle 会动态 import 一组 hash 化
  // 的 chunk-*.js / <locale>-*.js（dayjs locale 拆分），漏掉它们会让运行时
  // ERR_MODULE_NOT_FOUND。
  //
  // 用 `*-*.js` 通配 hash 后缀的拆分文件（`chunk-<hash>.js` / `en-<hash>.js` 等），
  // 比 `*.js` 精确——避免开发者临时落到 build/ 的脚本被一起带进 npm 包。
  const files = new Set([
    'vue-ccui.es.js',
    'vue-ccui.umd.js',
    '*-*.js',
    'style.css',
    'index.d.ts',
    'theme',
    'README.md',
    'LICENSE',
  ])
  for (const { name } of components) files.add(`${name}/**`)
  return [...files].sort()
}

// 子目录 package.json 是 build.js 用统一模板写的，每个都带 "style": "style.css"。
// 对没产出 style.css 的组件目录（如 config-provider），删掉 style 字段，避免下游
// 工具按 "style" 字段加载时撞到不存在的文件。
async function fixSubdirPackageJsons(components) {
  for (const { name, hasStyle } of components) {
    if (hasStyle) continue
    const pj = path.resolve(outputDir, name, 'package.json')
    if (!existsSync(pj)) continue
    const raw = await fsp.readFile(pj, 'utf8')
    const obj = JSON.parse(raw)
    if (obj.style === undefined) continue
    delete obj.style
    await fsp.writeFile(pj, `${JSON.stringify(obj, null, 2)}\n`)
  }
}

async function createPackageJson(version) {
  const components = resolveReleasableComponents()

  const { scripts: _s, devDependencies: _d, ...rest } = packageJson
  rest.version = getVersion(version)
  rest.dependencies = replaceWorkspaceDeps(rest.dependencies)
  rest.peerDependencies = replaceWorkspaceDeps(rest.peerDependencies)

  // main 路径保留 legacy 字段（不带 ./ 前缀的老格式工具仍有人吃）；exports 覆盖现代解析。
  rest.main = './vue-ccui.umd.js'
  rest.module = './vue-ccui.es.js'
  rest.types = './index.d.ts'
  rest.style = './style.css'
  rest.sideEffects = ['**/*.css', '**/*.scss']
  rest.exports = buildExportsMap(components)
  rest.files = buildFilesField(components)

  await outputFile(path.resolve(outputDir, 'package.json'), JSON.stringify(rest, null, 2))
  await fixSubdirPackageJsons(components)
}

async function copyAssets() {
  await fsp.mkdir(path.resolve(outputDir, 'theme'), { recursive: true })
  await Promise.all([
    fsp.cp(path.resolve(sourceDir, 'README.md'), path.resolve(outputDir, 'README.md')),
    fsp.cp(path.resolve(themeDir, 'theme.scss'), path.resolve(outputDir, 'theme/theme.scss')),
    fsp.cp(path.resolve(themeDir, 'darkTheme.css'), path.resolve(outputDir, 'theme/darkTheme.css')),
  ])
  // LICENSE：仓库根 → build 根
  const repoLicense = path.resolve(__dirname, '../../../LICENSE')
  await fsp.cp(repoLicense, path.resolve(outputDir, 'LICENSE')).catch(() => {})
}

export const release = async ({ version }) => {
  await createPackageJson(version)
  await copyAssets()
  // 真正的 npm publish 由根目录 scripts/publish.mjs 触发（passkey 流程）。
}
