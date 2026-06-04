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

  // 同时产出一个 `.light{}` 块，内容为 light 全集。它的用途是「在已处于
  // 深色（祖先带 .dark）的子树里把某一块强制切回浅色」：CSS 自定义属性按元素
  // 就近解析，离用得最近的祖先上的声明胜出，因此在子树容器上挂 `.light` 即可
  // 覆盖更外层 `html.dark` 下传的取值。`.dark` / `.light` 互为对称的作用域类，
  // 任一模式都能就地反向覆盖，文档站的 demo 浅/深就地预览即依赖此能力。
  const lightScopeVars = Object.entries(lightTheme)
    .map(([key, value]) => `--${CSS_CLASS_PREFIX}-${key}: ${value}`)
    .join(';\n')
  const darkFileStr = `.dark{\n${darkCssVars}\n}\n.light{\n${lightScopeVars}\n}`

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
