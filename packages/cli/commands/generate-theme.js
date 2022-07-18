require('esbuild-register');
const path = require('path');
const fs = require('fs-extra');
const logger = require('../shared/logger');
const theme = require('../../ccui/ui/theme/themes/light.ts').default;
const { CSS_CLASS_PREFIX } = require('../shared/constant');

const fileStr = Object.entries(theme)
  .map(([key, value]) => `$${CSS_CLASS_PREFIX}-${key}: var(--${key}, ${value})`)
  .join(';\n');

exports.generateTheme = async () => {
  const outputFilePath = path.resolve(
    __dirname,
    '../../ccui/ui/theme/theme.scss'
  );
  try {
    await fs.outputFile(outputFilePath, fileStr, 'utf-8');
    logger.success(`生成主题文件成功, ${outputFilePath}!`);
  } catch (err) {
    logger.success('生成主题文件失败！');
  }
};
