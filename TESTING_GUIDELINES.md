# 测试与术语约定

## Vue 状态语义

本项目是 Vue 组件库，文档、测试描述和评审说明应优先使用 Vue 语境：

- 使用 `v-model:*`、`update:*`、`props 驱动`、`外部状态接管` 描述由父组件维护的状态。
- 使用 `default*`、`内部状态`、`组件自行维护` 描述组件内部维护的状态。
- 避免把 React 生态里的 `controlled / uncontrolled` 作为主要表述。

可以在内部讨论中用“类似 controlled/uncontrolled 的状态模式”辅助理解，但落到文档和测试命名时，应写成 Vue 用户实际会使用的 API。

## 测试优先级

不要为了覆盖率数字而测试。新增测试应优先证明以下真实行为：

- 用户可感知的渲染、交互、键盘、滚动、拖拽和定时器行为。
- `v-model:*` 与 `update:*` 事件协议。
- `default*` 初始值和组件内部状态变化。
- disabled、readonly、loading、empty、error、fallback 等边界状态。
- slot、自定义渲染、自定义 class/icon/style 等公开 API。
- 组件卸载、容器清理、事件监听清理等容易回归的副作用。

不建议为了覆盖率硬测：

- 私有实现细节。
- 只为命中行数的 Transition hook。
- 类型文件默认值。
- 对用户行为没有证明价值、且会让测试变脆弱的 DOM 细节。
