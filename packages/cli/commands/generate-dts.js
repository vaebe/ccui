import path, { dirname } from 'node:path'
import { promises as fsp } from 'node:fs'
import { fileURLToPath } from 'node:url'
import logger from '../shared/logger.js'
import { discoverComponents } from '../shared/discover-components.js'
import { outputFile } from '../shared/fs.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const entryDir = path.resolve(__dirname, '../../ccui')
const outputDir = path.resolve(__dirname, '../../ccui/build')

const INDEX_DTS_CONTENT = `import { App } from 'vue';
  declare function install(app: App): void
  declare const _default: {
      install: typeof install;
      version: string;
  };
  export default _default;`

export const generateDts = async () => {
  const srcDts = path.resolve(outputDir, 'index.d.ts')
  await outputFile(srcDts, INDEX_DTS_CONTENT)

  const components = discoverComponents(entryDir)

  await Promise.all(
    components.map(async (name) => {
      const destDts = path.resolve(outputDir, `${name}/index.d.ts`)
      try {
        await fsp.mkdir(path.dirname(destDts), { recursive: true })
        await fsp.copyFile(srcDts, destDts)
      } catch (err) {
        logger.error(`拷贝组件 ${name} 的 ts 类型文件失败！${err?.message ?? err}`)
      }
    }),
  )
}
