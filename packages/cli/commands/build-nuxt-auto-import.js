const path = require('node:path')
const fsExtra = require('fs-extra')

const outputDir = path.resolve(__dirname, '../../ccui/build')
const outputNuxtDir = path.resolve(__dirname, '../../ccui/build/nuxt')

exports.createNuxtPlugin = () => {
  const fileStr = `import { join } from 'pathe'
  import { defineNuxtModule } from '@nuxt/kit'
  
  export default defineNuxtModule({
    hooks: {
      'components:dirs'(dirs) {
        dirs.push({
          path: join(__dirname,'./components'),
          prefix:'D'
        })
      }
    }
  })`

  fsExtra.outputFile(path.resolve(outputNuxtDir, `index.js`), fileStr, 'utf-8')
}

exports.createAutoImportedComponent = async (dirName) => {
  const importStyle = fsExtra.pathExistsSync(
    path.resolve(outputDir, `${dirName}/style.css`),
  )
    ? `import '../../${dirName}/style.css' \n`
    : ``

  // 使用动态 import 替代 require 来加载 ES 模块
  const compsModule = await import(pathToFileURL(path.resolve(outputDir, `${dirName}/index.es.js`)))
  const comps = compsModule.default || compsModule

  Object.keys(comps).forEach((compName) => {
    if (compName !== 'default' && !compName.includes('Directive')) {
      const fileStr = `${importStyle}\nexport  { ${compName} as default } from '../../${dirName}/index.es.js'`

      fsExtra.outputFile(
        path.resolve(outputNuxtDir, `components/${compName}.js`),
        fileStr,
        'utf-8',
      )
    }
  })
}

// 辅助函数：将文件路径转换为 file:// URL
function pathToFileURL(path) {
  const { pathToFileURL: _pathToFileURL } = require('url')
  return _pathToFileURL(path).href
}
