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

  let darkCssVariablesStr = Object.entries(darkTheme)
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
