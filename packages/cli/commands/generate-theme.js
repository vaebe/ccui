require('esbuild-register');
const path = require('path');
const fs = require('fs-extra');
const theme = require('../../okUiVue/okUi/theme/themes/light.ts').default;

const fileStr = Object.entries(theme)
  .map(([key, value]) => `$${key}: var(--${key}, ${value})`)
  .join(';\n');

exports.generateTheme = async () => {
  await fs.outputFile(
    path.resolve(__dirname, '../../okUiVue/okUi/theme/theme.scss'),
    fileStr,
    'utf-8'
  );
};
