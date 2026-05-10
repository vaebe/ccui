const path = require('node:path')
const { pathToFileURL } = require('node:url')
const fs = require('fs-extra')
const logger = require('../shared/logger')
const { CSS_CLASS_PREFIX } = require('../shared/constant')

const themesDir = path.resolve(__dirname, '../../theme/themes')

async function loadTheme(name) {
  const url = pathToFileURL(path.join(themesDir, `${name}.ts`)).href
  const mod = await import(url)
  return mod.default
}

exports.generateTheme = async () => {
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

  let darkCssVariablesStr = Object.entries(mergedDarkTheme)
    .map(([key, value]) => `--${CSS_CLASS_PREFIX}-${key}: ${value}`)
    .join(';\n')

  darkCssVariablesStr = `.dark{\n${darkCssVariablesStr}\n}`

  const lightThemeFilePath = path.resolve(__dirname, '../../theme/theme.scss')
  const darkThemeFilePath = path.resolve(__dirname, '../../theme/darkTheme.css')

  try {
    await fs.outputFile(lightThemeFilePath, lightFileStr, 'utf-8')
    logger.success(`生成theme主题文件成功, ${lightThemeFilePath}!`)

    await fs.outputFile(darkThemeFilePath, darkCssVariablesStr, 'utf-8')
    logger.success(`生成 darkTheme css 主题变量成功, ${darkThemeFilePath}!`)
  } catch (err) {
    logger.success('生成主题文件失败！')
  }
}
