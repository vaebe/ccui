const path = require('node:path')
const fs = require('node:fs')
const fsExtra = require('fs-extra')
const { defineConfig, build } = require('vite')
const vue = require('@vitejs/plugin-vue')
const vueJsx = require('@vitejs/plugin-vue-jsx')
const { isReadyToRelease } = require('../shared/utils')
const nuxtBuild = require('./build-nuxt-auto-import')

const entryDir = path.resolve(__dirname, '../../ccui/ui')
const outputDir = path.resolve(__dirname, '../../ccui/build')

const baseConfig = defineConfig({
  configFile: false,
  publicDir: false,
  plugins: [vue(), vueJsx()],
  esbuild: {
    exclude: ['**/node_modules/**', '**/esbuild-register/**']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }
})

const rollupOptions = {
  external: ['vue', 'vue-router', '@vueuse/core', '@floating-ui/dom'],
  output: {
    globals: {
      vue: 'Vue',
    },
    exports: 'named'
  },
  onwarn(warning, warn) {
    // 忽略此特定警告
    if (warning.code === 'MIXED_EXPORTS') return;
    warn(warning);
  }
}

async function buildSingle(name) {
  await build(
    defineConfig({
      ...baseConfig,
      build: {
        rollupOptions,
        emptyOutDir: true,
        lib: {
          entry: path.resolve(entryDir, name),
          name: 'index',
          fileName: type => `index.${type}.js`,
          formats: ['es', 'umd'],
        },
        outDir: path.resolve(outputDir, name),
      },
    }),
  )
}

async function buildAll() {
  await build(
    defineConfig({
      ...baseConfig,
      build: {
        rollupOptions,
        emptyOutDir: true,
        lib: {
          entry: path.resolve(entryDir, 'vue-ccui.ts'),
          name: 'VueCcui',
          fileName: type => `vue-ccui.${type}.js`,
          formats: ['es', 'umd'],
        },
        outDir: outputDir,
      },
    }),
  )
}

function createPackageJson(name) {
  const fileStr = `{
  "name": "${name}",
  "version": "0.0.0",
  "main": "index.umd.js",
  "module": "index.es.js",
  "style": "style.css"
}`

  fsExtra.outputFile(
    path.resolve(outputDir, `${name}/package.json`),
    fileStr,
    'utf-8',
  )
}

exports.build = async () => {
  await buildAll()

  const components = fs.readdirSync(entryDir).filter((name) => {
    const componentDir = path.resolve(entryDir, name)
    const isDir = fs.lstatSync(componentDir).isDirectory()
    return isDir && fs.readdirSync(componentDir).includes('index.ts')
  })

  for (const name of components) {
    if (!isReadyToRelease(name)) {
      continue
    }
    await buildSingle(name)
    createPackageJson(name)
    await nuxtBuild.createAutoImportedComponent(name)
  }

  nuxtBuild.createNuxtPlugin()
}
