// @vaebe/ccui 发布产物准备：
//   - 把源 package.json 抽到 packages/ccui/build/，剥 scripts/devDeps，展开 workspace: 协议
//   - 拷贝 README / LICENSE / theme.scss / darkTheme.css
//
// **不**执行 npm publish。正式发包走 `node scripts/publish.mjs`（passkey 流程），
// 它会先调用本步骤生成产物，再走 npm publish + git tag。
import path, { dirname } from 'node:path'
import { promises as fsp } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { outputFile } from '../shared/fs.js'
import packageJson from '../../ccui/package.json' with { type: 'json' }
import iconsPackageJson from '../../icons/package.json' with { type: 'json' }

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputDir = path.resolve(__dirname, '../../ccui/build')
const sourceDir = path.resolve(__dirname, '../../ccui')
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

async function createPackageJson(version) {
  const { scripts: _s, devDependencies: _d, ...rest } = packageJson
  rest.version = getVersion(version)
  rest.dependencies = replaceWorkspaceDeps(rest.dependencies)
  rest.peerDependencies = replaceWorkspaceDeps(rest.peerDependencies)
  await outputFile(path.resolve(outputDir, 'package.json'), JSON.stringify(rest, null, 2))
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
