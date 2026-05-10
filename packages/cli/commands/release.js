import path, { dirname } from 'node:path'
import { promises as fsp } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { outputFile } from '../shared/fs.js'
import packageJson from '../../ccui/package.json' with { type: 'json' }

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputDir = path.resolve(__dirname, '../../ccui/build')
const sourceDir = path.resolve(__dirname, '../../ccui')
const themeDir = path.resolve(__dirname, '../../theme')

function getVersion(version) {
  if (version) return version
  const versionNums = packageJson.version.split('.')
  return versionNums.map((num, index) => (index === versionNums.length - 1 ? +num + 1 : num)).join('.')
}

async function createPackageJson(version) {
  const { scripts: _s, devDependencies: _d, ...rest } = packageJson
  rest.version = getVersion(version)
  // 移除所有 workspace: 协议引用，发布到 npm 后需要替换为实际版本号（此处置空交由 publish 流程补全）
  const fileStr = JSON.stringify(rest, null, 2).replace(/workspace:/g, '')
  await outputFile(path.resolve(outputDir, 'package.json'), fileStr)
}

async function copyAssets() {
  await fsp.mkdir(path.resolve(outputDir, 'theme'), { recursive: true })
  await Promise.all([
    fsp.cp(path.resolve(sourceDir, 'README.md'), path.resolve(outputDir, 'README.md')),
    fsp.cp(path.resolve(themeDir, 'theme.scss'), path.resolve(outputDir, 'theme/theme.scss')),
    fsp.cp(path.resolve(themeDir, 'darkTheme.css'), path.resolve(outputDir, 'theme/darkTheme.css')),
  ])
}

export const release = async ({ version }) => {
  await createPackageJson(version)
  await copyAssets()
  // npm publish 由外层 changelog/release 脚本触发
}
