# ConfigProvider locale / theme.algorithm 接通

> 状态：**已实施**

## 背景

`ConfigProvider` 的 `theme.algorithm` 与 `locale` 一度是「声明了但未兑现」的死接口：类型上接受值，组件却根本不读。声明了的 prop 必须工作——死接口让用户传值后毫无反馈，比「功能没做」更糟，因为它会被信任。

## 决策

**全部接通，不留死接口。**

- **`theme.algorithm`** —— `'default' | 'dark' | 'compact'` 全部生效。`dark` 在 wrapper 上叠 `.dark` 类级联 dark token；`compact` 注入紧凑尺寸 token（对齐 v6 compact：`controlHeight 32 → 24`，padding/margin 各缩一档，字号不动）；用户 `theme.token` 始终最后 `Object.assign`，胜过 compact 默认值。
- **`locale`** —— `Locale` 接口按组件 namespace（Modal / Popconfirm / Empty / AutoComplete / Mentions / Cascader / TreeSelect / Select / Pagination / Image / DatePicker 等）组织。`useConfig` 注入时按 namespace 浅合并，用户没覆盖的 key 自动回退 zhCN。运行时优先级：**用户显式 prop > `cfg.locale` > 内置 zhCN 兜底**。组件 locale 相关 prop 默认值为 `''`，空串即「走 locale 默认」。语言包通过 `import { zhCN, enUS, jaJP, koKR } from 'vue3-ccui'` 顶层导出。
- **Form scss token 化** —— Form 样式全量走 SCSS token（`#{$cls-prefix}-form` + `$ccui-color-*` / `$ccui-font-size*` / `$ccui-control-height` 等），不再用 1.x alias 与裸字面量。这是 `ConfigProvider` 的品牌色注入能在 Form 内生效的前提。

## 后续不变性约束

- **禁止**新增 `ConfigProvider` props 却不在 `config-provider.tsx` 中真正消费。声明即承诺。
- **新增** locale 文案的组件，必须同时在 `Locale` 接口加对应 namespace，并在 `zhCN` / `enUS` / `jaJP` / `koKR` 各加默认值。
- **新增** scss 样式禁止硬编码尺寸 / 1.x var 名 / 主色字面量。提交前 grep `1677ff` / `--ccui-text-color` / `var(--ccui-text\b` 自检。

## 后续 TODO

- **Drawer**：当前无默认底部按钮文案，留待真正引入默认底部按钮时再接 locale。
