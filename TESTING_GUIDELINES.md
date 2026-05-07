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

## 后续任务入口

当前覆盖率基线：

- Statements: `93.76%`
- Branches: `84.26%`
- Functions: `94.10%`
- Lines: `94.08%`

后续不建议为了数字硬追 `95%`。新任务应先筛选真实行为缺口，再决定是否补测。

建议任务顺序：

1. 审查新增测试质量，移除或改写过度依赖 DOM 细节、Transition 时序、内部实现变量的低价值断言。
2. 继续补高价值剩余缺口：
   - `statistic/countdown`：日期解析、结束态、格式化边界。
   - `collapse-item`：键盘、禁用、slot、aria 行为，避免只测 Transition hook。
   - `slider/use-slider`：拖拽、键盘、边界值、tooltip 行为。
   - `float-button/back-top`：仅在能稳定 mock window scroll 时补 window 分支。
   - `popover/tooltip`：只补外部交互和事件协议，不补动画 hook。
3. 清理 coverage 输出噪声：
   - `vitest@0.1.20` 与 `@vitest/coverage-v8@4.1.5` mixed versions 提示。
   - `window.scrollTo` jsdom not implemented 噪声。
4. 重新记录覆盖率基线，并明确说明覆盖率目标服从真实行为测试质量。
