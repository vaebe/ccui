const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const { defineConfig, build } = require('vite');
const vue = require('@vitejs/plugin-vue');
const vueJsx = require('@vitejs/plugin-vue-jsx');
const nuxtBuild = require('./build-nuxt-auto-import');
const { isReadyToRelease } = require('../shared/utils');

const entryDir = path.resolve(__dirname, '../../ccui/ui');
const outputDir = path.resolve(__dirname, '../../ccui/build');

const baseConfig = defineConfig({
  configFile: false,
  publicDir: false,
  plugins: [vue(), vueJsx()]
});

const rollupOptions = {
  external: ['vue', 'vue-router', '@vueuse/core', '@floating-ui/dom'],
  output: {
    globals: {
      vue: 'Vue'
    }
  }
};

const buildSingle = async (name) => {
  await build(
    defineConfig({
      ...baseConfig,
      build: {
        rollupOptions,
        emptyOutDir: true,
        lib: {
          entry: path.resolve(entryDir, name),
          name: 'index',
          fileName: (type) => `index.${type}.js`,
          formats: ['es', 'umd']
        },
        outDir: path.resolve(outputDir, name)
      }
    })
  );
};

const buildAll = async () => {
  await build(
    defineConfig({
      ...baseConfig,
      build: {
        rollupOptions,
        emptyOutDir: true,
        lib: {
          entry: path.resolve(entryDir, 'vue-ccui.ts'),
          name: 'VueCcui',
          fileName: (type) => `vue-ccui.${type}.js`,
          formats: ['es', 'umd']
        },
        outDir: outputDir
      }
    })
  );
};

const createPackageJson = (name) => {
  const fileStr = `{
  "name": "${name}",
  "version": "0.0.0",
  "main": "index.umd.js",
  "module": "index.es.js",
  "style": "style.css"
}`;

  fsExtra.outputFile(
    path.resolve(outputDir, `${name}/package.json`),
    fileStr,
    'utf-8'
  );
};

exports.build = async () => {
  await buildAll();

  const components = fs.readdirSync(entryDir).filter((name) => {
    const componentDir = path.resolve(entryDir, name);
    const isDir = fs.lstatSync(componentDir).isDirectory();
    return isDir && fs.readdirSync(componentDir).includes('index.ts');
  });

  for (const name of components) {
    if (!isReadyToRelease(name)) {
      continue;
    }
    await buildSingle(name);
    createPackageJson(name);
    nuxtBuild.createAutoImportedComponent(name);
  }

  nuxtBuild.createNuxtPlugin();
};
