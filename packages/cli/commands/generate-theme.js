require('esbuild-register');
const path = require('path');
const fs = require('fs-extra');
const logger = require('../shared/logger');
const { CSS_CLASS_PREFIX } = require('../shared/constant');
const lightTheme = require('../../ccui/ui/theme/themes/light.ts').default;
const darkTheme = require('../../ccui/ui/theme/themes/dark.ts').default;

const lightFileStr = Object.entries(lightTheme)
  .map(
    ([key, value]) =>
      `$${CSS_CLASS_PREFIX}-${key}: var(--${CSS_CLASS_PREFIX}-${key}, ${value})`
  )
  .join(';\n');

let darkCssVariablesStr = Object.entries(darkTheme)
  .map(([key, value]) => `--${CSS_CLASS_PREFIX}-${key}: ${value}`)
  .join(';\n');

darkCssVariablesStr = `.dark{
${darkCssVariablesStr}
}`;

exports.generateTheme = async () => {
  const lightThemeFilePath = path.resolve(
    __dirname,
    '../../ccui/ui/theme/theme.scss'
  );

  // 生成深色主题css文件
  const darkThemeFilePath = path.resolve(
    __dirname,
    '../../ccui/ui/theme/darkTheme.css'
  );

  try {
    await fs.outputFile(lightThemeFilePath, lightFileStr, 'utf-8');
    logger.success(`生成theme主题文件成功, ${lightThemeFilePath}!`);

    await fs.outputFile(darkThemeFilePath, darkCssVariablesStr, 'utf-8');
    logger.success(`生成 darkTheme css 主题变量成功, ${darkThemeFilePath}!`);
  } catch (err) {
    logger.success('生成主题文件失败！');
  }
};
