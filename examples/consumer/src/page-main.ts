// Path 1 — main package + tree-shake.
// Single root import; bundler tree-shakes unused exports based on the package
// `sideEffects: ['**/*.css', '**/*.scss']` whitelist. CSS comes from the one
// global bundle.
import { Button, Modal } from '@vaebe/ccui'
import '@vaebe/ccui/style.css'

export { Button, Modal }
