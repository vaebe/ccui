import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, build as viteBuild } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { discoverComponents } from '../shared/discover-components.js'
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

// Vite lib 模式下 CSS 默认按 `lib.cssFileName`/`lib.fileName`/cwd `package.json.name`
// 顺序推导，在我们这套构建里 cwd 是 packages/cli，会拿到 CLI 内部名 → 产出 `ccui-cli.css`。
// 显式锁定 lib.cssFileName='style'（vite 自动追加 `.css`），让 `exports` map 里 `./<comp>/style.css`
// 与 resolver 的 cssBundlePath 三处保持一致。
const LIB_CSS_FILE_NAME = 'style'

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
          cssFileName: LIB_CSS_FILE_NAME,
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
          cssFileName: LIB_CSS_FILE_NAME,
          formats: ['es', 'umd'],
        },
        outDir: outputDir,
      },
    }),
  )
}

export const build = async () => {
  await buildAll()

  // 所有 discovered 组件（discoverComponents 已经把 locale 等非组件目录排掉）
  // 都进入 buildSingle pipeline——不再用 isReadyToRelease/WHITE_LIST 二选一过滤。
  // 让 buildSingle / generate-dts / release 三处范围拉齐，避免 d.ts 全产但 es.js 只有部分、
  // 下游 `import { Cascader } from '@vaebe/ccui/cascader'` 撞 404 的 silent 不一致。
  //
  // 注意：此处不再为每个组件目录写 legacy `package.json` (main/module/style 字段)。
  // 主包 `exports` map 已经完整登记每个 `./<comp>` 与 `./<comp>/style.css`，
  // 现代 ESM-aware 工具链（Vite 5+ / Webpack 5+ / TS bundler|nodenext）走 exports 即可。
  const components = discoverComponents(entryDir)

  for (const name of components) {
    await buildSingle(name)
    await createAutoImportedComponent(name)
  }

  await createNuxtPlugin()
}
