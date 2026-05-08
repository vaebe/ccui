# Menu Vue 语义说明

## Vue 状态语义

- 需要业务状态接管时，使用 `v-model:selected-keys` 和 `v-model:open-keys`
- 只需要初始化状态时，使用 `default-selected-keys` 和 `default-open-keys`，后续由组件内部状态维护
- 文档中避免使用 React 语境的 `controlled` / `uncontrolled` 作为主要说明

## API 对齐说明

- `Menu` 的功能参考 Ant Design Menu 的常用能力：`items`、`mode`、`theme`、`selectedKeys`、`openKeys`、`defaultSelectedKeys`、`defaultOpenKeys`、`inlineCollapsed`、`multiple`、`selectable`、`forceSubMenuRender`、`triggerSubMenuAction`
- Vue 项目优先使用 `v-model:selected-keys` 替代 `selectedKeys + onSelect`
- Vue 项目优先使用 `v-model:open-keys` 替代 `openKeys + onOpenChange`
- `items` 支持普通对象、分组和分割线；复杂节点建议用 Vue 插槽或 VNode，不要求 ReactNode
