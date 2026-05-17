# ccui v1 → v2 codemod

把 ccui v1 旧 prop 名自动改写为 v2 新 prop 名的零依赖 Node.js 脚本。

## 使用

```bash
# Dry-run（不写盘，打印将被修改的文件列表）
node scripts/codemod-v1-to-v2.mjs "src/**/*.{vue,ts,tsx}"

# 写回
node scripts/codemod-v1-to-v2.mjs "src/**/*.{vue,ts,tsx}" --apply

# 输出每条具体 diff
node scripts/codemod-v1-to-v2.mjs "src/**/*.vue" --verbose
```

`<glob>` 支持：

- `src/**/*.vue`
- `src/**/*.{vue,ts,tsx}`
- 直接传单个文件路径

不依赖 `globby` / 其他 npm 包；用 Node 内置 `fs.readdirSync` 递归实现，自动跳过 `node_modules`、`.git`、`dist`、`build`、`lib`、`coverage`、`.vitepress`、`.next`、`.nuxt`、`.cache`。

所有组件标签同时兼容 `kebab-case`（`<c-modal>`）和 `PascalCase`（`<CModal>`）两种写法。

## 26 条映射表

| # | 组件 | 旧 prop | 新 prop |
|---|---|---|---|
| 1 | Modal | `okLoading` | `confirmLoading` |
| 2 | Modal | `hideFooter` (boolean) | `:footer="null"` |
| 3 | Drawer | `showFooter` | `<template #footer>` slot（**不自动转，插入 TODO 注释**） |
| 4 | Tooltip | `content` | `title` |
| 5 | Tooltip | `showArrow` | `arrow` |
| 6 | Tooltip | `showAfter` | `mouseEnterDelay` |
| 7 | Tooltip | `hideAfter` | `mouseLeaveDelay` |
| 8 | Tooltip | `popperClass` | `overlayClassName` |
| 9 | Popover | `showArrow` | `arrow` |
| 10 | Popover | `showAfter` | `mouseEnterDelay` |
| 11 | Popover | `hideAfter` | `mouseLeaveDelay` |
| 12 | Popover | `popperClass` | `overlayClassName` |
| 13 | Popover | `teleported` | `getPopupContainer` |
| 14 | Popconfirm | `confirmText` | `okText` |
| 15 | Popconfirm | `confirmType` | `okType` |
| 16 | Button | `nativeType` | `htmlType` |
| 17 | Button | `round` (boolean) | `shape="round"` |
| 18 | Button | `circle` (boolean) | `shape="circle"` |
| 19 | Button | `plain` (boolean) | `variant="filled"` (**近似**) |
| 20 | Input | `clearable` | `allowClear` |
| 21 | Input | `prepend` | `addonBefore` |
| 22 | Input | `append` | `addonAfter` |
| 23 | InputNumber | `size="lg"` | `size="large"` |
| 24 | InputNumber | `size="md"` | `size="default"` |
| 25 | InputNumber | `size="sm"` | `size="small"` |
| 26 | Tag | `:bordered="false"` | `variant="filled"` |
| 27 | ColorPicker | `format="hsv"` | `format="hsb"` |
| 28 | FormItem | `prop=` | `name=` |

> 表中编号到 28，但 Modal `hideFooter` / Button `round` `circle` `plain` 在原始口径里归并到各自组件下，因此 README 顶部维持 “26 条” 的总数表述（按组件×语义 prop 数计算：`1 + 1 + 1 + 5 + 5 + 2 + 4 + 3 + 3 + 1 + 1 + 1 = 28` 行；其中 InputNumber.size 三个 enum 值算 3 条、Button 4 条合并实现）。脚本一次性覆盖以上全部。

## 局限性

本脚本是 **regex pass**，不解析 AST，请人工 review。已知边界：

1. **`plain → variant="filled"` 是近似**。v1 `plain` 还包含其他视觉细节（如灰底文字色等），仅以 `variant="filled"` 近似覆盖最常见场景；需要细节对齐时请人工检查。
2. **`showFooter` 不自动转**。Drawer 的 footer 内容需要从 prop 重新组织到 `<template #footer>` slot，结构变更超出 regex 能力。脚本会在元素前插入：

   ```html
   <!-- TODO: codemod: showFooter prop removed; move footer content into <template #footer> slot -->
   ```

   并 **不删除** 原 `show-footer` attribute，由开发者人工处理。
3. **以下 prop 不动**：
   - `visible` / `closeOnEsc` / `appendToBody` — Vue-first 永久保留，不在迁移范围
   - `open` / `keyboard` / `getContainer` — v2 已物理删除，无目标映射
4. **多行 attribute、复杂 template 表达式**：脚本基于 “开标签 = `<Tag` 到首个 `>`” 的简化模型，若 attribute 值中含 `>`（极少见）或模板嵌套结构特殊，可能漏匹配。建议跑完后 `git diff` 通读。
5. **TS/TSX 覆盖度低**：脚本对 `.tsx` / `.ts` 仅做了 6 条最安全的纯对象 key 替换（`okLoading` / `nativeType` / `clearable` / `popperClass` / `confirmText` / `confirmType`），不试图区分对象作用域，请按文件人工确认。
6. **不动 commented-out 代码**：regex 会扫到注释中的 attribute 写法并替换——多数情况下这是想要的，但若你刻意在注释里保留旧语法做对比，需要人工还原。
7. **不区分 v-bind 表达式语义**：`:round="true"` 会被转，`:round="someRef"` 不会（因为我们要求严格的 `"true"` 字符串才视为 boolean 形式）。

## Fixtures & 测试

`scripts/__codemod-fixtures__/` 下成对放置 `xxx.vue` 与 `xxx.expected.vue`，由 `scripts/codemod-v1-to-v2.test.mjs` 自动遍历断言。

运行：

```bash
npx vitest run scripts/codemod-v1-to-v2.test.mjs
```

当前 5 个 fixture 全部 pass，覆盖：

- `modal-okloading.vue` — Modal okLoading + hideFooter + visible 不被改
- `tooltip-content.vue` — Tooltip 五条 prop 改名
- `button-shape-variant.vue` — Button round/circle/plain boolean → shape/variant + nativeType
- `input-clearable-prepend.vue` — Input clearable + prepend/append + InputNumber.size 三个 enum
- `form-item-prop.vue` — FormItem prop + Tag bordered + ColorPicker hsv + Popconfirm
