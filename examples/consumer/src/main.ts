import { createApp } from 'vue'
import App from './App.vue'

// Side-effect imports — make sure each consumption path's module is part of the
// graph even if its named exports aren't referenced from `App.vue`. The build
// log + bundle inspection then confirms all three resolve cleanly.
import './page-main'
import './page-subpath'
import './page-resolver'

createApp(App).mount('#app')
