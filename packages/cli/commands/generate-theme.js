require('esbuild-register');
const path = require('path');
const fs = require('fs-extra');
const logger = require('../shared/logger');
const { CSS_CLASS_PREFIX } = require('../shared/constant');
const lightTheme = require('../../ccui/ui/theme/themes/light.ts').default;
const darkTheme = require('../../ccui/ui/theme/themes/dark.ts').default;

const getFileStr = (data) => {
  return Object.entries(data)
    .map(
      ([key, value]) =>
        `$${CSS_CLASS_PREFIX}-${key}: var(--${CSS_CLASS_PREFIX}-${key}, ${value})`
    )
    .join(';\n');
};

const lightFileStr = getFileStr(lightTheme);

const darkFileStr = `.dark{
${getFileStr(darkTheme)}
}`;

exports.generateTheme = async () => {
  const lightThemeFilePath = path.resolve(
    __dirname,
    '../../ccui/ui/theme/theme.scss'
  );
  const darkThemeFilePath = path.resolve(
    __dirname,
    '../../ccui/ui/theme/darkTheme.scss'
  );

  try {
    await fs.outputFile(lightThemeFilePath, lightFileStr, 'utf-8');
    logger.success(`生成主题文件成功, ${lightThemeFilePath}!`);

    await fs.outputFile(darkThemeFilePath, darkFileStr, 'utf-8');
    logger.success(`生成主题文件成功, ${darkThemeFilePath}!`);
  } catch (err) {
    logger.success('生成主题文件失败！');
  }
};
