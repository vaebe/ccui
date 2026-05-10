# ConfigProvider locale / algorithm 接通 + Form scss 复审

> 决策日期：2026-05-10
> 状态：**已实施**
> 关联：审查报告 `docs-notes/design-audit/references/ant-design-alignment.md`、设计审查后的"对齐缺口扫描"

## 背景

审查报告把主题层和样式层的对齐缺口推完后，往里再走一层会撞上几条"已声明但未兑现"的接口：

1. **`ConfigProvider.theme.algorithm`**：类型上接受 `'default' | 'dark' | 'compact'`，但 `config-provider.tsx` 只处理 `theme.token`，`algorithm` 字段读都没读。
2. **`ConfigProvider.locale`**：被 `inject` 进 ctx，但仓库里 grep 不到任何组件消费它（除了 Transfer，那是组件自身的 `locale` prop，不是 ConfigProvider 的）。Modal / Popconfirm / Empty 等内置中文文案完全是 props default 字面量。
3. **Form scss "严重不对齐"**：审查报告原标 P1，commit `1a4ec62` 改过一轮 fallback 颜色，但还残留：
   - 没 `@use style-var`，类名直接写 `.ccui-form` 字面量。
   - 用 `var(--ccui-text)` / `var(--ccui-text-weak)` / `var(--ccui-danger)` / `var(--ccui-success)` —— 这些是 ccui 1.x 的 alias，v6 标准是 `var(--ccui-color-text)` / `--ccui-color-text-secondary` / `--ccui-color-error` / `--ccui-color-success`。ConfigProvider 的 token 注入是按 v6 名字下发的，不会触达 1.x alias。
   - 字面量 `14px / 12px / 32px / 18px` 全裸出现，不消费 token。

## 决策

**全部接通，不留死接口。**

### 1. theme.algorithm

- `'dark'`：在 ConfigProvider wrapper 上叠加 `.dark` 类。`darkTheme.css` 里 `.dark { --ccui-color-text: ...; --ccui-border-radius: 6px; ... }` 自动级联到子树（颜色 + 非颜色 token 都覆盖，因为上一轮 cli 已经把 light 非颜色 token 合并进 dark 输出）。
- `'compact'`：注入紧凑尺寸 token 集，对齐 Ant Design v6 compact 算法：`controlHeight 32 → 24`，`padding/margin` 各档缩小一档。font 不动（ant 的 compact 也只改尺寸）。
- `'default'`：保留现行行为。
- 用户 `theme.token` 在 compact 之后被 `Object.assign` 覆盖，仍然胜过 compact 默认值。

### 2. locale

- 新增 `packages/ccui/ui/locale/{zh-CN,en-US,index}.ts`。`Locale` 接口加 namespace（`Modal` / `Popconfirm` / `Empty` / `AutoComplete` / `Mentions` / `Cascader` / `TreeSelect` / `Select`），每个 namespace 是 `{ key: text }` 对象。
- `useConfig` 在 `inject` 时跑 `mergeLocale(user)`，按 namespace 浅合并：用户没覆盖的 key 自动回退 zhCN。这样 `cfg.locale.Modal?.okText` 永远不会变 `undefined`。
- 7 个组件改读 locale：Modal / Popconfirm 的 ok / cancel 文案，Empty 的 description，AutoComplete / Mentions / Cascader / TreeSelect 的 notFoundContent。
- prop 默认值由 `'确 定'` 等 → `''`。运行时优先级：**用户显式 prop > cfg.locale > 内置 zhCN 兜底**。
- cli `vue-ui` 模板静态注入 `export { zhCN, enUS, defaultLocale } from './locale'`，让顶层包能 `import { zhCN, enUS } from 'vue3-ccui'`。

### 3. Form scss 重写

- 加 `@use '../../style-var/index.scss' as *;`，类名走 `#{$cls-prefix}-form`。
- 9 处 var 名对齐：`--ccui-text` → `$ccui-color-text`、`--ccui-text-weak` → `$ccui-color-text-secondary`、`--ccui-danger` → `$ccui-color-error`、`--ccui-success` → `$ccui-color-success`。
- 字面量全部 → token：`14px` → `$ccui-font-size`，`12px` → `$ccui-font-size-sm`，`32px` → `$ccui-control-height`，padding / margin 系列对应 token。
- form-item `margin-bottom` 由 18px 调到 24px（`$ccui-margin-lg`），与 Ant Design v6 `Form.Item` 默认间距对齐。是有意的视觉调整。

## 理由

1. **接口诚实**：声明了的 prop 必须工作。`algorithm` 和 `locale` 的死接口让用户传值后毫无反馈，比"功能没做"更糟糕——它会被信任。
2. **国际化基础设施先于多语言落地**：先把 zhCN / enUS 两端打通做 PoC，再往里铺 DatePicker 月份名 / Pagination 文案这种重活。基础设施不立起来，重活越拖越散。
3. **Form scss 的样式 token 化**是品牌色注入能不能在 Form 里生效的前提。否则 ConfigProvider 改 colorPrimary，Form 内的输入框边框还是 1.x 老色。

## 影响范围

落地的 4 个 commit：

- `586c4e3` `refactor(form): form.scss 全量改走 SCSS token`
- `eed2024` `feat(locale): ConfigProvider.locale 接通，新增 zhCN/enUS 语言包`
- `84e7600` `feat(config-provider): 实现 theme.algorithm（dark / compact / default）`
- `2378078` `docs(form): 补 layout / methods 两个 :::demo`

测试：1289 → 1294（+5 个 algorithm / locale 浅合并测试）。vue-tsc 0 错。

## 后续 P1 跟进项（暂未做）

- **DatePicker / RangePicker / TimePicker**：月份名、周名、format 默认值未走 locale。需要补 `DatePickerLocale` namespace + 替换组件内硬编码字符串。
- **Pagination**："共"、"页"、"上一页"、"下一页"、"跳至"、"条/页" 等仍硬编码中文。
- **Image** 加载中 / 加载失败提示。
- **Drawer**：当前没文案，但后续如果加默认底部按钮要走 locale。
- **正向消费方文档**：在 `docs/components/config-provider/index.md` 补一个"切换语言"的 demo（`<ConfigProvider :locale="enUS">`）。

## 反向决策开销

如未来想"反对接通 locale / algorithm"：

- **algorithm**：删 `wrapperClass` 计算属性 + `COMPACT_TOKENS` 即可。零兼容代价。
- **locale**：组件内 `cfg.locale.{ns}.{key}` 调用是 fallback 链的中间一档，去掉只会让 prop 默认 `''` → 走最后兜底 `'确 定'`。但 prop 默认从 `'确 定'` 改到 `''` 是 breaking——用户写 `<c-modal>` 不传 okText 时，行为从"中文"变成"空字符串再被 fallback"，文案不变但空字符串校验等用法可能会踩。建议保持现状。
- **Form scss**：完全可逆——只是 token 名替换，没行为变化。`margin-bottom` 由 24 → 18 单值调整即可。

## 后续不变性约束

- **禁止**新增 ConfigProvider props 但不在 `config-provider.tsx` 中真正消费。声明即承诺。
- **新增** locale 文案的组件，必须同时在 `Locale` 接口加对应 namespace、在 zhCN.ts 和 enUS.ts 各加默认值。
- **新增** scss 样式，禁止硬编码尺寸 / 1.x var 名 / 主色。grep `1677ff` / `--ccui-text-color` / `var(--ccui-text\b` 自检。
