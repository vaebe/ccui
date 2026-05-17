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
 * `packages/ccui/build/`. We can't reuse the build package.json's `exports`
 * field via alias (alias is pure string prefix replacement and ignores `exports`
 * resolution), so we mirror what the published exports map declares: main →
 * `vue-ccui.es.js`, `./<comp>` → `./<comp>/index.es.js`, `*.css` / `*.scss`
 * assets keep their literal path. This exercises the *as-published* resolution
 * behaviour (subpath modules, sideEffects-aware CSS, tree-shake) end-to-end.
 */
const ccuiBuild = fileURLToPath(new URL('../../packages/ccui/build', import.meta.url))

export default defineConfig({
  resolve: {
    alias: [
      // 资产路径（style.css / scss / theme 等）保持字面，order 必须在 subpath 前匹配
      { find: /^@vaebe\/ccui\/(.+\.(css|scss))$/, replacement: `${ccuiBuild}/$1` },
      // 主入口
      { find: /^@vaebe\/ccui$/, replacement: `${ccuiBuild}/vue-ccui.es.js` },
      // 单组件 subpath → 显式指向 ESM 入口（已发布场景下走主 package.json exports map）
      { find: /^@vaebe\/ccui\/([^/]+)$/, replacement: `${ccuiBuild}/$1/index.es.js` },
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
