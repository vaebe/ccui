const { relative } = require('node:path')
const { INDEX_FILE_NAME, VERSION, VUE_UI_FILE } = require('../shared/constant')

exports.createUiTemplate = (exportModules = []) => {
  const packages = []
  const imports = []
  const installs = []

  exportModules.forEach((m) => {
    const { fileInfo } = m
    const relativePath = relative(VUE_UI_FILE, fileInfo.path)
      .replace(/\\/g, '/')
      .replace('..', '.')
      .replace(`/${INDEX_FILE_NAME}`, '')

    const importStr = `import ${m.default}, { ${m.parts.join(', ')} } from '${relativePath}';`

    packages.push(...m.parts)
    imports.push(importStr)
    installs.push(m.default)
  })

  return `\
import type { App } from 'vue';

import './shared/styles/base.scss';
${imports.join('\n')}

// 国际化语言包导出（cli 在 vue-ui 模板内静态注入；语言包文件不是组件、走单独路径）
export { zhCN, enUS, defaultLocale } from './locale';

const installs = [
  ${installs.join(',\n\t')}
];

export {
  ${packages.join(',\n\t')}
};

export default {
  version: '1.0.8',
  install(app: App): void {
    installs.forEach((p) => app.use(p));
  }
};
`
}
