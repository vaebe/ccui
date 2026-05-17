import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { Vue3CCUIResolver } from '@vaebe/unplugin-vue-components-ccui'

/**
 * Consumer fixture vite config.
 *
 * The workspace `@vaebe/ccui` package symlink points at `packages/ccui/` source,
 * which has no subpath `exports` map. The actual published artifact lives in
 * `packages/ccui/build/`. Alias `@vaebe/ccui` (root + subpaths) to that build
 * directory so the fixture exercises the *as-published* resolution behaviour
 * (subpath exports, sideEffects-aware CSS, tree-shake) end-to-end.
 */
const ccuiBuild = fileURLToPath(new URL('../../packages/ccui/build', import.meta.url))

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@vaebe\/ccui$/, replacement: ccuiBuild },
      { find: /^@vaebe\/ccui\/(.*)$/, replacement: `${ccuiBuild}/$1` },
    ],
  },
  plugins: [
    vue(),
    Components({
      dts: 'components.d.ts',
      resolvers: [Vue3CCUIResolver({ importStyle: 'css' })],
    }),
  ],
})
