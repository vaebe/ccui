import { installCcuiMdiIcons } from './mdi-collection'

// 副作用入口：被 `import '@vaebe/ccui-icons/install'` 触发时
// 自动把 ccui 内置 mdi 图标注册到 Iconify 本地数据源。
installCcuiMdiIcons()
