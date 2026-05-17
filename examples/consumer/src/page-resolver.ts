// Path 3 — unplugin-vue-components resolver (auto-import + auto sideEffect CSS).
// No imports of components or styles needed at the call site; `<c-button>` in a
// template is transformed to `import { Button } from '@vaebe/ccui'` plus the
// matching `import '@vaebe/ccui/style.css'` side-effect. See `App.vue` for the
// template-side usage.
export {}
