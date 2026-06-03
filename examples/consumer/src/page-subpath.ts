// Path 2 — explicit subpath import.
// Pulls only the component's own ESM chunk + its scoped style. Useful when the
// consumer wants zero reliance on tree-shake correctness.
import { Button } from '@vaebe/ccui/button'
import '@vaebe/ccui/button/style.css'

export { Button }
