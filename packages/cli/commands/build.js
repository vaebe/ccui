import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, build as viteBuild } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { isReadyToRelease } from '../shared/utils.js'
import { discoverComponents } from '../shared/discover-components.js'
import { outputFile } from '../shared/fs.js'
import { createAutoImportedComponent, createNuxtPlugin } from './build-nuxt-auto-import.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const entryDir = path.resolve(__dirname, '../../ccui/ui')
const outputDir = path.resolve(__dirname, '../../ccui/build')

const baseConfig = defineConfig({
  configFile: false,
  publicDir: false,
  plugins: [vue(), vueJsx()],
  oxc: {
    exclude: ['**/node_modules/**'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
})

const rollupOptions = {
  external: ['vue', 'vue-router', '@vueuse/core', '@floating-ui/dom'],
  output: {
    globals: { vue: 'Vue' },
    exports: 'named',
  },
  onwarn(warning, warn) {
    if (warning.code === 'MIXED_EXPORTS') return
    warn(warning)
  },
}

async function buildSingle(name) {
  await viteBuild(
    defineConfig({
      ...baseConfig,
      build: {
        rollupOptions,
        emptyOutDir: true,
        lib: {
          entry: path.resolve(entryDir, name),
          name: 'index',
          fileName: (type) => `index.${type}.js`,
          formats: ['es', 'umd'],
        },
        outDir: path.resolve(outputDir, name),
      },
    }),
  )
}

async function buildAll() {
  await viteBuild(
    defineConfig({
      ...baseConfig,
      build: {
        rollupOptions,
        emptyOutDir: true,
        lib: {
          entry: path.resolve(entryDir, 'vue-ccui.ts'),
          name: 'VueCcui',
          fileName: (type) => `vue-ccui.${type}.js`,
          formats: ['es', 'umd'],
        },
        outDir: outputDir,
      },
    }),
  )
}

async function createPackageJson(name) {
  const fileStr = `{
  "name": "${name}",
  "version": "0.0.0",
  "main": "index.umd.js",
  "module": "index.es.js",
  "style": "style.css"
}`
  await outputFile(path.resolve(outputDir, `${name}/package.json`), fileStr)
}

export const build = async () => {
  await buildAll()

  const components = discoverComponents(entryDir)

  for (const name of components) {
    if (!isReadyToRelease(name)) continue
    await buildSingle(name)
    await createPackageJson(name)
    await createAutoImportedComponent(name)
  }

  await createNuxtPlugin()
}
