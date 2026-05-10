import path, { dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import logger from '../shared/logger.js'
import { CSS_CLASS_PREFIX } from '../shared/constant.js'
import { outputFile } from '../shared/fs.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const themesDir = path.resolve(__dirname, '../../theme/themes')

async function loadTheme(name) {
  const url = pathToFileURL(path.join(themesDir, `${name}.ts`)).href
  const mod = await import(url)
  return mod.default
}

export const generateTheme = async () => {
  const lightTheme = await loadTheme('light')
  const darkTheme = await loadTheme('dark')

  const lightScssVars = Object.entries(lightTheme)
    .map(([key, value]) => `$${CSS_CLASS_PREFIX}-${key}: var(--${CSS_CLASS_PREFIX}-${key}, ${value})`)
    .join(';\n')

  const lightCssVars = Object.entries(lightTheme)
    .map(([key, value]) => `  --${CSS_CLASS_PREFIX}-${key}: ${value};`)
    .join('\n')

  const lightFileStr = `${lightScssVars};\n\n:root {\n${lightCssVars}\n}\n`

  // dark 主题只覆盖颜色相关 token（参见 themes/dark.ts），但运行期切换到 .dark
  // 时仍需要 border-radius / spacing / motion 这些非颜色 token。这里把 light 全集
  // 与 dark 合并，dark 命中的 key 用 dark 值，dark 未定义的 key 复用 light，
  // 保证切到 dark 后排版/形态/动画稳定，只换皮肤。
  const mergedDarkTheme = { ...lightTheme, ...darkTheme }

  const darkCssVars = Object.entries(mergedDarkTheme)
    .map(([key, value]) => `--${CSS_CLASS_PREFIX}-${key}: ${value}`)
    .join(';\n')
  const darkFileStr = `.dark{\n${darkCssVars}\n}`

  const lightThemeFilePath = path.resolve(__dirname, '../../theme/theme.scss')
  const darkThemeFilePath = path.resolve(__dirname, '../../theme/darkTheme.css')

  try {
    await outputFile(lightThemeFilePath, lightFileStr)
    logger.success(`生成theme主题文件成功, ${lightThemeFilePath}!`)

    await outputFile(darkThemeFilePath, darkFileStr)
    logger.success(`生成 darkTheme css 主题变量成功, ${darkThemeFilePath}!`)
  } catch (err) {
    logger.error(`生成主题文件失败！${err?.message ?? err}`)
    throw err
  }
}
