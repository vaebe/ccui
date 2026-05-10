import path, { dirname } from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { outputFile } from '../shared/fs.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputDir = path.resolve(__dirname, '../../ccui/build')
const outputNuxtDir = path.resolve(__dirname, '../../ccui/build/nuxt')

export const createNuxtPlugin = async () => {
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

  await outputFile(path.resolve(outputNuxtDir, 'index.js'), fileStr)
}

export const createAutoImportedComponent = async (dirName) => {
  const importStyle = existsSync(path.resolve(outputDir, `${dirName}/style.css`))
    ? `import '../../${dirName}/style.css' \n`
    : ''

  const compsModule = await import(pathToFileURL(path.resolve(outputDir, `${dirName}/index.es.js`)).href)
  const comps = compsModule.default || compsModule

  await Promise.all(
    Object.keys(comps)
      .filter((compName) => compName !== 'default' && !compName.includes('Directive'))
      .map((compName) => {
        const fileStr = `${importStyle}\nexport  { ${compName} as default } from '../../${dirName}/index.es.js'`
        return outputFile(path.resolve(outputNuxtDir, `components/${compName}.js`), fileStr)
      }),
  )
}
