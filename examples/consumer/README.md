# consumer-fixture

End-to-end smoke fixture for `@vaebe/ccui` as consumed by a downstream Vite +
TS + Vue 3 app. The CI / publish pipeline builds this to assert all three
documented consumption paths still resolve and bundle cleanly after a
`packages/ccui/build/` regeneration:

1. **Main + tree-shake** — `import { Button, Modal } from '@vaebe/ccui'` plus a
   single `import '@vaebe/ccui/style.css'` at the entry.
2. **Subpath** — `import { Button } from '@vaebe/ccui/button'` plus
   `import '@vaebe/ccui/button/style.css'`. Per-component chunk + scoped CSS.
3. **Resolver** — `unplugin-vue-components` + `Vue3CCUIResolver({ importStyle: 'css' })`.
   `<c-button>` in templates is auto-imported and gets its sideEffect CSS
   injected automatically.

## How to run

The fixture depends on the built artifact in `packages/ccui/build/` (Vite alias
in `vite.config.ts` redirects there — the source `packages/ccui` package.json
has no subpath exports). Build that first, then build the fixture:

```bash
# from repo root
pnpm --filter ccui-cli exec node ./index.js create -t ccui --ignore-parse-error
pnpm --filter ccui-cli exec node ./index.js build
pnpm --filter ccui-cli exec node ./index.js release
pnpm --filter @vaebe/unplugin-vue-components-ccui build

pnpm --filter consumer-fixture build
```

A successful run:

- Emits `dist/` with one entry chunk containing `Button` / `Modal` symbols.
- Injects the resolver-driven `style.css` once (de-duped by
  `unplugin-vue-components`).
- Exits 0.
