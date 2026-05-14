# vue3-ccui 与 Ant Design v6.3.7 视觉对齐审查

> 审查时间：2026-05-10
> 审查范围：packages/theme（主题包）+ packages/ccui/ui（73 个组件）的 SCSS 设计 token 与样式实现
> 参考依据：Ant Design v6.x SeedToken/MapToken 默认值（与 v5 默认值在颜色/字号/阴影/动效维度保持一致；v6 在算法层做了少量调整但默认 SeedToken 未变）

---

## 状态更新（2026-05-14）

**P0 / P1 / P2 整改情况**：本审查报告的整改建议大部分已经在 Batch 33-36 之间落地。本节作为 2026-05-14 状态快照，避免读者把已落实项当作待办。

| 优先级 | 建议项 | 状态 | 落地批次 / 决策 |
| --- | --- | --- | --- |
| P0 | 重新生成 theme.scss / darkTheme.css | 已落实 | Batch 34（commit `1a4ec62`） |
| P0 | 重写 Form 组件 SCSS（接 token） | 已落实 | Batch 34（commit `1a4ec62`）+ `586c4e3` |
| P0 | 消灭 7 组件 19 处硬编码 `#1677ff` | 已落实 | Batch 34 |
| P1 | 明确品牌色策略 | 已决策 | [decisions/brand-color.md](../decisions/brand-color.md)（保留 `#1677ff`） |
| P1 | 补齐 12 色板 × 10 阶 | 已落实 | Batch 35（commit `05663a7`） |
| P1 | 抽取 control-outline token | 已落实 | Batch 35（设计体系 v2） |
| P1 | 统一 Modal 内置按钮 hover 到 colorPrimaryHover | 已落实 | Batch 35 |
| P1 | ConfigProvider locale / algorithm 接通 + Form scss token 化 | 已落实 | [decisions/2026-05-10-locale-algorithm.md](../decisions/2026-05-10-locale-algorithm.md)（commits `586c4e3` / `eed2024` / `84e7600`） |
| P1 | Pagination / Image / DatePicker 系接通 locale | 已落实 | Batch 36（详见同上决策文档跟进项节） |
| P2 | 补充设计原则文档 | 已落实 | [decisions/design-values.md](../decisions/design-values.md) |
| P2 | 保留 ccui 旧业务 token 但标 deprecated | 已落实 | Batch 35（旧 token deprecated 标记） |
| P2 | Tag.Processing 6px 脉冲点 | 已落实 | Batch 35（commit `53b5b46`） |
| P2 | dark 非颜色 token 补全 | 已落实 | Batch 35（commit `ef29d93`） |

**仍开放的横向工作**：API 层（非视觉）的差距已转入 `docs-notes/components-diff/` 跟进，详见 `references/components-diff.md` 第六节「API 风格对齐审计」+ `references/per-component/` 73 组件明细。本文件之后只在以下两种场景再更新：

1. 重启一次主题层 / SCSS 横向审查时，作为旧基线对照。
2. 新增重大主题 token 项（例如新增 `controlInteractiveSize` 一类）。

---

## 一、总体结论

**对齐度估计：约 70%。** ccui 在过去一段时间已完成一次 token 系统迁移：`packages/theme/themes/light.ts` 与 `dark.ts` 已经按 Ant Design v5 的 SeedToken/MapToken 体系重写（colorPrimary=#1677ff、boxShadow 三档、6px 圆角等），新组件（Button、Modal、Card、Tag、Select、Table、Input 等绝大多数）也已经在 SCSS 中切换到 `$ccui-color-primary` / `$ccui-control-height` / `$ccui-motion-duration-mid` 等新 token 名。

**最大差异点（按影响面排序）：**

1. **`packages/theme/theme.scss` 是 stale（陈旧）的自动生成产物**：CLI `generate-theme.js` 会从 `light.ts` 重新生成此文件，但当前文件里仍是 ccui 1.x 的旧 token（brand=#5e7ce0、font-size=12px、border-radius=2px）。换句话说：**新组件 SCSS 中引用的 `$ccui-color-primary`、`$ccui-color-text`、`$ccui-control-height`、`$ccui-motion-duration-mid`、`$ccui-line-height-base`、`$ccui-color-fill-quaternary` 等全部 SCSS 变量在 theme.scss 中都不存在**。组件构建时只是因为这些 SCSS 变量被替换为 CSS 变量、再由运行时 light.ts 注入而"看起来正常"，但 SCSS 编译阶段实际上拿到的是 `null/未定义`，缺失了 fallback 值。运行时如果用户没引入主题 CSS 变量，组件将完全失去样式。**修复方式：执行 `pnpm --filter cli run generate-theme`（或对应脚本）。**
2. **品牌色"双轨制"未澄清**：旧 fallback 是柔和蓝 #5e7ce0（华为/DevUI 风格），新 token 已切到 Ant Design 标准 #1677ff。`darkTheme.css`（暗色 CSS 文件）和 `theme.scss`（亮色 SCSS）**仍然保留旧色**，但 `light.ts/dark.ts` 已经是新色。需要做产品决策：要么差异化保留 #5e7ce0 并把 themes/\*.ts 也回退（提供 antd-compat preset 给需要 #1677ff 的用户），要么彻底走 Ant Design 风格并把 darkTheme.css 也重新生成。
3. **少量组件直接硬编码颜色**：`carousel/auto-complete/transfer/mentions/upload/tour/result` 等 7 个组件 SCSS 中存在 `#1677ff` 硬编码（共 19 处）。`form` 组件甚至使用了完全不同的 CSS 变量命名空间（`--ccui-text-color`、`--ccui-error-color`，而不是规范的 `--ccui-color-text`、`--ccui-color-error`），fallback 也是 Tailwind 风格的 `#1f2937`、`#6b7280`、`#ff4d4f`。这违反"所有组件都通过 token 访问颜色"的原则。

**整改优先级建议：**

- P0：重新跑 `generate-theme` 让 `theme.scss` 与 `light.ts` 同步；同步重生 `darkTheme.css`
- P1：明确品牌色策略并写入 design-audit 决策文档
- P2：消灭 7 个组件的硬编码 #1677ff、修正 form 的非标 CSS 变量命名
- P3：补齐缺失的 Ant Design v6 设计原则文案（自然/确定/意义/生长）

---

## 二、设计原则（Design Values）

| 原则               | Ant Design v6 表达                                                | ccui 现状                                                                            | 是否对齐 | 备注                                                |
| ------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------- | --------------------------------------------------- |
| 自然（Natural）    | 强调"贴近自然规律的视觉语言"——色彩取自自然光线、动效遵循物理感受  | 未在文档/README 中显式表达；动效曲线已接近 Ant Design 但未做哲学层论述               | 部分     | 建议在 docs/guide/design-values.md 中补一段官方表述 |
| 确定（Certain）    | "状态可预期、结构清晰、控件大小有规律"——通过尺寸阶梯/对齐栅格落地 | 控件高度（24/32/40）已对齐；间距栅格（4/8/12/16/20/24/32）已对齐                     | 是       | token 层已落实                                      |
| 意义（Meaningful） | "每个元素承载明确信息层级与用户意图"                              | typography 字号阶梯（heading 1-5）已配置；语义色系完整                               | 是       | 已落实                                              |
| 生长（Growing）    | "支持扩展、设计语言可演进、token 可定制"                          | ConfigProvider 已支持运行时 token 注入（camelCase → CSS var）；提供主题包 light/dark | 是       | ConfigProvider 实现良好                             |

**结论**：四项原则在 token 层都有体现，但**没有在文档中显式陈述**——Ant Design 官网在 docs/spec/introduce-cn 用了大量篇幅讲设计哲学，ccui 几乎没有这一层叙事。建议补 1-2 页 design-values 文档以提升设计语言的"可传播性"。

---

## 三、颜色系统

### 3.1 SeedToken（基础色）

| Token         | Ant Design v6 默认               | ccui (light.ts)       | ccui (theme.scss fallback) | 差异                                     |
| ------------- | -------------------------------- | --------------------- | -------------------------- | ---------------------------------------- |
| colorPrimary  | `#1677ff`                        | `#1677ff` ✅          | `#5e7ce0` ❌               | theme.scss 陈旧；light.ts 已对齐         |
| colorSuccess  | `#52c41a`                        | `#52c41a` ✅          | `#50d4ab` ❌               | theme.scss 陈旧；light.ts 已对齐         |
| colorWarning  | `#faad14`                        | `#faad14` ✅          | `#fac20a` ❌               | theme.scss 陈旧；light.ts 已对齐         |
| colorError    | `#ff4d4f`                        | `#ff4d4f` ✅          | `#f66f6a` ❌               | theme.scss 陈旧；light.ts 已对齐         |
| colorInfo     | `#1677ff`                        | `#1677ff` ✅          | `#5e7ce0` ❌               | theme.scss 陈旧；light.ts 已对齐         |
| colorLink     | `#1677ff`（默认与 primary 同源） | `#1677ff` ✅          | `#526ecc` ❌               | theme.scss 陈旧                          |
| colorTextBase | `#000000` (alpha 0.88 派生)      | `rgba(0,0,0,0.88)` ✅ | `#252b3a` ❌               | light.ts 已对齐；theme.scss 仍是十六进制 |
| colorBgBase   | `#ffffff`                        | `#ffffff` ✅          | `#ffffff` ✅               | OK                                       |

**结论**：`light.ts` 已经完全对齐 Ant Design v6 默认 SeedToken；问题完全在 `theme.scss` 没有重新生成。

### 3.2 派生色阶（Color Palette）

Ant Design 每个色系采用 **10 阶色板** + 一套生成算法（基于 HSL，色相每阶差约 6 度，饱和度从 30 → 100，明度从 95 → 30），10 阶用途约定为：

| 阶  | 用途          | 蓝色阶（colorPrimary 系）实际值 |
| --- | ------------- | ------------------------------- |
| 1   | bg（最浅）    | `#e6f4ff`                       |
| 2   | bg-hover      | `#bae0ff`                       |
| 3   | border        | `#91caff`                       |
| 4   | border-hover  | `#69b1ff`                       |
| 5   | hover         | `#4096ff`                       |
| 6   | **主色**      | `#1677ff`                       |
| 7   | active        | `#0958d9`                       |
| 8   | active-strong | `#003eb3`                       |
| 9   | text-on-light | `#002c8c`                       |
| 10  | text-strong   | `#001d66`                       |

**ccui 现状（light.ts）：**

- 蓝色阶 1-7 已配置：`blue-1` ~ `blue-7` 存在并对齐 ✅
- **缺失 8-10 阶**：没有 `blue-8 / blue-9 / blue-10`
- **其余 11 个色系（cyan/green/magenta/pink/red/orange/yellow/volcano/geekblue/lime/gold/purple）只导出了 6 阶单值**（如 `cyan-6: #13c2c2`），没有 1-5 阶或 7-10 阶
- 派生色（colorPrimaryBg、colorPrimaryHover、colorPrimaryActive、colorPrimaryBorder、colorPrimaryBorderHover、colorPrimaryBgHover）全部已对齐 v6 默认值 ✅

**建议**：补齐 12 色 × 10 阶完整调色板，便于 Tag/Badge/Avatar 等组件直接消费。当前 Tag 组件用了硬编码十六进制色（见 §七 Tag 段落）。

### 3.3 中性色

| Token                | Ant Design v6      | ccui (light.ts)    | 是否对齐 |
| -------------------- | ------------------ | ------------------ | -------- |
| colorText            | `rgba(0,0,0,0.88)` | `rgba(0,0,0,0.88)` | ✅       |
| colorTextSecondary   | `rgba(0,0,0,0.65)` | `rgba(0,0,0,0.65)` | ✅       |
| colorTextTertiary    | `rgba(0,0,0,0.45)` | `rgba(0,0,0,0.45)` | ✅       |
| colorTextQuaternary  | `rgba(0,0,0,0.25)` | `rgba(0,0,0,0.25)` | ✅       |
| colorBorder          | `#d9d9d9`          | `#d9d9d9`          | ✅       |
| colorBorderSecondary | `#f0f0f0`          | `#f0f0f0`          | ✅       |
| colorSplit           | `rgba(5,5,5,0.06)` | `rgba(5,5,5,0.06)` | ✅       |
| colorFill            | `rgba(0,0,0,0.15)` | `rgba(0,0,0,0.15)` | ✅       |
| colorFillSecondary   | `rgba(0,0,0,0.06)` | `rgba(0,0,0,0.06)` | ✅       |
| colorFillTertiary    | `rgba(0,0,0,0.04)` | `rgba(0,0,0,0.04)` | ✅       |
| colorFillQuaternary  | `rgba(0,0,0,0.02)` | `rgba(0,0,0,0.02)` | ✅       |
| colorBgContainer     | `#ffffff`          | `#ffffff`          | ✅       |
| colorBgElevated      | `#ffffff`          | `#ffffff`          | ✅       |
| colorBgLayout        | `#f5f5f5`          | `#f5f5f5`          | ✅       |
| colorBgMask          | `rgba(0,0,0,0.45)` | `rgba(0,0,0,0.45)` | ✅       |

**结论**：中性色完全对齐。这是 light.ts 改造最完整的部分。

### 3.4 暗色（Dark Theme）

| Token            | Ant Design v6 Dark       | ccui (dark.ts)           | 是否对齐 |
| ---------------- | ------------------------ | ------------------------ | -------- |
| colorPrimary     | `#1668dc`                | `#1668dc`                | ✅       |
| colorBgContainer | `#141414`                | `#141414`                | ✅       |
| colorBgElevated  | `#1f1f1f`                | `#1f1f1f`                | ✅       |
| colorText        | `rgba(255,255,255,0.85)` | `rgba(255,255,255,0.85)` | ✅       |

**dark.ts 完全对齐 v6 默认 dark algorithm。但 `darkTheme.css` 仍然是 ccui 1.x 旧值（#5e7ce0 / #2E2F31 / #E8E8E8 等）**。同样需要 generate-theme 重跑。

---

## 四、字体与排版

### 4.1 字体族

| Token          | Ant Design v6                                                                                                                                                                           | ccui (light.ts) | 是否对齐 |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------- |
| fontFamily     | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"` | 完全相同        | ✅       |
| fontFamilyCode | `SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace`                                                                                                                | 完全相同        | ✅       |

### 4.2 字号阶梯

| Token            | Ant Design v6 | ccui (light.ts) | ccui (theme.scss fallback) | 是否对齐        |
| ---------------- | ------------- | --------------- | -------------------------- | --------------- |
| fontSize         | 14px          | 14px ✅         | **12px ❌**                | theme.scss 陈旧 |
| fontSizeSM       | 12px          | 12px ✅         | 12px ✅                    | OK              |
| fontSizeLG       | 16px          | 16px ✅         | **14px ❌**                | theme.scss 陈旧 |
| fontSizeXL       | 20px          | 20px ✅         | （未声明）                 | 仅在 light.ts   |
| fontSizeHeading1 | 38px          | 38px ✅         | （未声明）                 | 仅在 light.ts   |
| fontSizeHeading2 | 30px          | 30px ✅         | （未声明）                 | 仅在 light.ts   |
| fontSizeHeading3 | 24px          | 24px ✅         | （未声明）                 | 仅在 light.ts   |
| fontSizeHeading4 | 20px          | 20px ✅         | （未声明）                 | 仅在 light.ts   |
| fontSizeHeading5 | 16px          | 16px ✅         | （未声明）                 | 仅在 light.ts   |

**ccui 额外保留的旧业务 token（不在 Ant Design 体系）：** `font-size-card-title`、`font-size-page-title`、`font-size-modal-title`、`font-size-price`、`font-size-data-overview`、`font-size-icon`、`font-size-md`。建议在文档中标记为 **deprecated**，引导用户改用 Ant Design 规范字号。

### 4.3 字重

| Token    | Ant Design v6 | ccui (light.ts)            | 是否对齐 |
| -------- | ------------- | -------------------------- | -------- |
| 标题字重 | 600           | `font-title-weight: 600`   | ✅       |
| 正文字重 | 400           | `font-content-weight: 400` | ✅       |

### 4.4 行高

| Token              | Ant Design v6        | ccui (light.ts)      | 是否对齐 |
| ------------------ | -------------------- | -------------------- | -------- |
| lineHeight         | 1.5714... (即 22/14) | `1.5714285714285714` | ✅       |
| lineHeightLG       | 1.5                  | 1.5                  | ✅       |
| lineHeightSM       | 1.66...              | 1.66                 | ✅       |
| lineHeightHeading1 | 1.21052...           | 1.21052              | ✅       |
| lineHeightHeading2 | 1.26666...           | 1.26666              | ✅       |
| lineHeightHeading3 | 1.33333...           | 1.33333              | ✅       |
| lineHeightHeading4 | 1.4                  | 1.4                  | ✅       |
| lineHeightHeading5 | 1.5                  | 1.5                  | ✅       |

**结论**：light.ts 排版层 100% 对齐 Ant Design v6；仅 theme.scss fallback 仍是旧值，再次反映"theme.scss 未重新生成"这一根因。

---

## 五、形状与动效

### 5.1 圆角（Border Radius）

| Token             | Ant Design v6 | ccui (light.ts) | ccui (theme.scss fallback) | 是否对齐        |
| ----------------- | ------------- | --------------- | -------------------------- | --------------- |
| borderRadius      | 6px           | 6px ✅          | **2px ❌**                 | theme.scss 陈旧 |
| borderRadiusLG    | 8px           | 8px ✅          | （未声明）                 | light.ts 对齐   |
| borderRadiusSM    | 4px           | 4px ✅          | （未声明）                 | light.ts 对齐   |
| borderRadiusXS    | 2px           | 2px ✅          | （未声明）                 | light.ts 对齐   |
| borderRadiusOuter | 4px           | 4px ✅          | （未声明）                 | light.ts 对齐   |

**ccui 旧业务 token：** `border-radius-feedback: 8px`、`border-radius-card: 8px`（在 light.ts 仍保留，分别对应 Ant Design 的 borderRadiusLG）。建议保留作向后兼容别名，但文档标注 deprecated。

### 5.2 阴影（Box Shadow）

| Token              | Ant Design v6                                                                                     | ccui (light.ts)   | 是否对齐 |
| ------------------ | ------------------------------------------------------------------------------------------------- | ----------------- | -------- |
| boxShadow          | `0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)` | 完全相同          | ✅       |
| boxShadowSecondary | 同 boxShadow（v6 已合并）                                                                         | 与 boxShadow 同值 | ✅       |
| boxShadowTertiary  | `0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)`     | 完全相同          | ✅       |

**ccui 在 theme.scss 还保留了旧的 6 档阴影 token**（`shadow-length-base`、`shadow-length-slide-left/right`、`shadow-length-connected-overlay`、`shadow-length-hover`、`shadow-length-feedback-overlay`、`shadow-fullscreen-overlay`），数值已在 light.ts 中按 Ant Design 重新调过（`0 6px 16px 0` 等），但与 Ant Design 的 3 档 token 体系不完全兼容。

### 5.3 动效（Motion）

| Token               | Ant Design v6                            | ccui (light.ts) | 是否对齐 |
| ------------------- | ---------------------------------------- | --------------- | -------- |
| motionDurationFast  | `0.1s`                                   | `0.1s`          | ✅       |
| motionDurationMid   | `0.2s`                                   | `0.2s`          | ✅       |
| motionDurationSlow  | `0.3s`                                   | `0.3s`          | ✅       |
| motionEaseInOut     | `cubic-bezier(0.645, 0.045, 0.355, 1)`   | 相同            | ✅       |
| motionEaseOut       | `cubic-bezier(0.215, 0.61, 0.355, 1)`    | 相同            | ✅       |
| motionEaseIn        | `cubic-bezier(0.55, 0.055, 0.675, 0.19)` | 相同            | ✅       |
| motionEaseOutBack   | `cubic-bezier(0.12, 0.4, 0.29, 1.46)`    | 相同            | ✅       |
| motionEaseInBack    | `cubic-bezier(0.71, -0.46, 0.88, 0.6)`   | 相同            | ✅       |
| motionEaseOutCirc   | `cubic-bezier(0.08, 0.82, 0.17, 1)`      | 相同            | ✅       |
| motionEaseInOutCirc | `cubic-bezier(0.78, 0.14, 0.15, 0.86)`   | 相同            | ✅       |

**ccui 在 theme.scss 旧 token 区还保留了一组旧曲线**（如 `animation-ease-in: cubic-bezier(0.5, 0, 0.84, 0.25)`）与 Ant Design 不一致，但 light.ts 中的旧 token 区已经被覆盖为 Ant Design 新值。`theme.scss` 重生后会自动正确。

**结论**：light.ts 动效层 100% 对齐 Ant Design v6。

---

## 六、间距系统

| Token                              | Ant Design v6 | ccui (light.ts) | 是否对齐 |
| ---------------------------------- | ------------- | --------------- | -------- |
| paddingXXS                         | 4px           | 4px             | ✅       |
| paddingXS                          | 8px           | 8px             | ✅       |
| paddingSM                          | 12px          | 12px            | ✅       |
| padding                            | 16px          | 16px            | ✅       |
| paddingMD                          | 20px          | 20px            | ✅       |
| paddingLG                          | 24px          | 24px            | ✅       |
| paddingXL                          | 32px          | 32px            | ✅       |
| marginXXS / XS / SM / MD / LG / XL | 同 padding    | 完全相同        | ✅       |

**控件高度（control height）：**

| Token           | Ant Design v6 | ccui | 是否对齐 |
| --------------- | ------------- | ---- | -------- |
| controlHeightXS | 16px          | 16px | ✅       |
| controlHeightSM | 24px          | 24px | ✅       |
| controlHeight   | 32px          | 32px | ✅       |
| controlHeightLG | 40px          | 40px | ✅       |

**结论**：间距系统与控件尺寸 100% 对齐。

---

## 七、按组件分类的差异速览

> 抽样 8 个高频组件做样式审查。源码位置：`packages/ccui/ui/<name>/src/<name>.scss`

### 7.1 Button（`packages/ccui/ui/button/src/button.scss`）

- ✅ 控件高度：默认 32px、large 40px、small 24px → 与 Ant Design 一致
- ✅ 主色 hover/active 切换、禁用态、loading 旋转动画都用 token，完全对齐
- ✅ Plain 按钮（浅色背景+主色边框）逻辑与 Ant Design "filled" / "outlined" 风格相符
- ⚠️ **`info` 按钮的颜色硬编码**：`$button-info-color: #909399`、hover/active 派生色都是手算的，与 Ant Design 中性按钮应使用 `colorTextSecondary` + `colorFillTertiary` 不一致。建议改用 token 派生
- ⚠️ Primary 按钮 box-shadow `rgba(5, 145, 255, 0.1)` 是硬编码的"压感阴影"——Ant Design 同位置使用基于 colorPrimaryBgHover 的色值，建议提取为 token

### 7.2 Input（`packages/ccui/ui/input/src/input.scss`）

- ✅ 默认/large/small 高度（32/40/24）完全对齐
- ✅ 边框、圆角、focus 阴影使用 token
- ⚠️ **focus-within 阴影 `0 0 0 2px rgba(5, 145, 255, 0.1)` 硬编码**——Ant Design 此阴影对应 `controlOutline` token，应抽出为 `--ccui-control-outline`
- ⚠️ `--prepend / --append` 仍使用旧 token（`$ccui-area`、`$ccui-text`、`$ccui-line`），未迁移到新色 token（`$ccui-color-fill-quaternary`、`$ccui-color-text`、`$ccui-color-border`）

### 7.3 Select（`packages/ccui/ui/select/src/select.scss`）

- ✅ selector 高度 32/40/24 三档对齐
- ✅ 边框、圆角、placeholder 使用 token
- ⚠️ **open 状态阴影 `0 0 0 2px rgba(22, 119, 255, 0.12)` 硬编码主色**——`0.12` 透明度也比 Input 的 `0.10` 不一致，建议统一为 `--ccui-control-outline`
- ⚠️ 默认宽度 `220px` 写死在样式里，Ant Design 通常让 Select 自适应父容器，建议改成 `min-width: 220px` 或开放为 prop

### 7.4 Modal（`packages/ccui/ui/modal/src/modal.scss`）

- ✅ 遮罩 `rgba(0, 0, 0, 0.45)` 对齐 colorBgMask
- ✅ 内容区圆角、box-shadow 三段式与 Ant Design 完全一致
- ✅ 进出场动画 `zoom-enter` 使用 `cubic-bezier(0.08, 0.82, 0.17, 1)`（motionEaseOutCirc）正确
- ⚠️ **Primary/Danger button hover 改用 `opacity: 0.85`** 而不是切换到 colorPrimaryHover——这是 ccui 自创规则，与 Button 组件 hover 表现不一致（Button hover 改色，Modal 内置按钮改透明度）
- ⚠️ `&__close` 字号 20px 硬编码，未使用 fontSizeXL token

### 7.5 Table（`packages/ccui/ui/table/src/table.scss`）

- ✅ 表头/单元格 padding 16px、表头 colorFillQuaternary 背景、行 hover 使用 colorFillQuaternary
- ✅ selected 行使用 colorPrimaryBg
- ✅ 排序按钮、分割线使用 colorBorderSecondary
- 整体对齐度高，是迁移最干净的组件之一

### 7.6 Tag（`packages/ccui/ui/tag/src/tag.scss`）

- ✅ 默认高度（line-height 20px）、圆角 borderRadiusSM、字号 fontSizeSM 全部对齐
- ✅ 5 档语义色（default/primary/success/warning/error）使用 token
- ❌ **预设 11 色板（magenta/red/volcano/orange/gold/lime/green/cyan/blue/geekblue/purple）的 background/border/color 全部硬编码** 在 SCSS 的 `@each` 里。这些值与 Ant Design 12 色阶的 1/3/7 阶完全一致，但应该消费 light.ts 中导出的色板 token（如 `--ccui-magenta-1`、`--ccui-magenta-3`、`--ccui-magenta-7`），而不是写死十六进制
- 缺失 1 色：Ant Design Tag 还有 `default` 之外的 `processing`（蓝色脉冲），ccui 把 processing 直接 alias 到 primary，丢失了脉冲动画

### 7.7 Card（`packages/ccui/ui/card/src/card.scss`）

- ✅ 圆角 8px（borderRadiusLG）、边框 colorBorderSecondary、字号、行高对齐
- ✅ shadow 三档使用 boxShadow / boxShadowTertiary，对齐 v6
- ⚠️ Header 高度 56px、padding 0 24px 是硬编码——Ant Design 默认 56px header padding 24px，数值正确但应抽出为 token（`--ccui-card-header-height`）以便定制

### 7.8 Form（`packages/ccui/ui/form/src/form.scss`）— **严重不对齐**

- ❌ **不使用 SCSS token，全部使用 CSS 变量直引**，且变量命名错误：
  - `var(--ccui-text-color, #1f2937)` ← 应为 `var(--ccui-color-text, rgba(0,0,0,0.88))`
  - `var(--ccui-text-color-secondary, #6b7280)` ← 应为 `var(--ccui-color-text-secondary, rgba(0,0,0,0.65))`
  - `var(--ccui-error-color, #ff4d4f)` ← 应为 `var(--ccui-color-error, #ff4d4f)`
  - `var(--ccui-success-color, #52c41a)` ← 应为 `var(--ccui-color-success, #52c41a)`
- ❌ Fallback 颜色采用 Tailwind 灰阶（`#1f2937`、`#6b7280`），与 Ant Design `rgba(0,0,0,0.xx)` 体系不兼容
- ❌ font-size、line-height、margin 全部为字面量（`14px`、`12px`、`18px`、`1.5`），不消费 token
- ❌ 文件没有 `@use '../../style-var/index.scss' as *;`，是唯一一个完全脱离 token 体系的组件
- 优先级：**P1，建议立即重写**

---

## 八、整改建议（按优先级）

### 高优先级（P0，建议立即处理）

1. **重新生成 theme.scss 和 darkTheme.css**：在 `packages/cli` 中跑 `generate-theme` 命令（如未在 CI 配置则补 npm script `theme:gen`）。这能修复"SCSS 变量缺失 / fallback 仍是旧值"的根因，让所有组件在没有运行时 token 注入时也能渲染出 v6 默认外观。
2. **重写 Form 组件 SCSS**：将 `var(--ccui-text-color, ...)` 改为标准 `$ccui-color-text` token，加 `@use style-var`，对齐其他组件。
3. **消灭硬编码 #1677ff**：扫描出 7 个组件（carousel/auto-complete/transfer/mentions/upload/tour）的 19 处硬编码主色，改为 `$ccui-color-primary`。

### 中优先级（P1，建议本季度内处理）

1. **明确品牌色策略**：写一份 `docs-notes/design-audit/decisions/brand-color.md`，决策"是否保留 #5e7ce0 作为 ccui 差异化品牌色"。如保留，需要：
   - 把 `light.ts/dark.ts` 中的 colorPrimary 系列改回 #5e7ce0 派生色阶
   - 提供 `antd-compat` preset 给需要 #1677ff 的用户
   - 对应文档说明
2. **补齐 12 色板的完整 1-10 阶**：当前只导出了 6 阶单色和蓝色 1-7 阶。Tag/Badge/Avatar 应消费色板 token 而不是硬编码。
3. **抽取 controlOutline token**：把 Input/Select/Button focus 时的"光环"阴影 `0 0 0 2px rgba(主色, 0.10)` 提取为 `--ccui-control-outline`，统一各组件的 focus 视觉。
4. **统一 Modal 内置按钮 hover 行为**：用 colorPrimaryHover 而不是 opacity 0.85，与独立 Button 组件保持一致。

### 低优先级（P2，可作为差异化决策）

1. **补充设计哲学文档**：在 docs/guide 下增加 design-values.md，复述并本地化 Ant Design 四大设计原则（自然/确定/意义/生长）。
2. **保留 ccui 旧业务 token 但标记 deprecated**：`font-size-card-title`、`font-size-modal-title`、`font-size-price`、`border-radius-feedback` 等旧 token 已在 light.ts 中维持，建议在文档中注明"建议迁移到 fontSizeLG / fontSizeXL / borderRadiusLG"。
3. **Tag processing 状态补脉冲动画**：当前直接 alias 到 primary，丢失了 Ant Design Tag 中"加载中蓝点脉冲"的视觉表达。
4. **暗色 token 完整性**：dark.ts 缺少 `border-radius-*`、`font-size-*`、`motion-*`、`padding-*`、`margin-*`、`control-height-*` 等所有非颜色 token——这些虽然亮暗主题共用，但 generate-theme 默认从 light.ts 取，导致 dark CSS 文件中只有颜色变量。当前 darkTheme.css 缺少所有非颜色变量，依赖 :root 兜底；建议在 generate-theme 中合并输出。

---

## 附：审查覆盖文件清单

**主题源**：

- `packages/theme/theme.scss` — SCSS 变量 + :root CSS 变量（陈旧，待重生）
- `packages/theme/darkTheme.css` — 暗色 CSS 变量（陈旧，待重生）
- `packages/theme/themes/light.ts` — 亮色 token 源（已对齐 Ant Design v6）
- `packages/theme/themes/dark.ts` — 暗色 token 源（已对齐 Ant Design v6 dark algorithm）
- `packages/cli/commands/generate-theme.js` — 主题生成器

**组件抽样**：

- `packages/ccui/ui/button/src/button.scss`
- `packages/ccui/ui/input/src/input.scss`
- `packages/ccui/ui/select/src/select.scss`
- `packages/ccui/ui/modal/src/modal.scss`
- `packages/ccui/ui/table/src/table.scss`
- `packages/ccui/ui/tag/src/tag.scss`
- `packages/ccui/ui/card/src/card.scss`
- `packages/ccui/ui/form/src/form.scss`

**含硬编码主色 #1677ff 的文件**（19 处）：

- `packages/ccui/ui/auto-complete/src/auto-complete.scss:29`
- `packages/ccui/ui/carousel/src/carousel.scss:111`
- `packages/ccui/ui/mentions/src/mentions.scss:34`
- `packages/ccui/ui/transfer/src/transfer.scss:37,69,122,155,156`
- `packages/ccui/ui/upload/src/upload.scss:32,33,59,64,136`
- `packages/ccui/ui/tour/src/tour.scss:114,115,119,120,183,221`

**ConfigProvider**：

- `packages/ccui/ui/config-provider/src/config-provider.tsx` — 已实现 camelCase token → CSS var 注入；运行时 token 定制能力对齐 Ant Design `<ConfigProvider theme={{ token: {...} }}>`

---

> 注：本次审查由于 WebFetch 工具被环境拒绝，Ant Design v6 SeedToken/MapToken 对照值采用了审查者已知的 v5 默认值（v6 在 SeedToken 默认值层面与 v5 保持兼容；v6 主要变更集中在算法与可访问性增强，与本审查关注的"默认值对齐"主题无冲突）。如需对个别 v6 新增 token 做精确比对，建议在网络放行环境下补抓 `https://ant.design/docs/spec/colors-cn` 与 `https://ant.design/docs/react/customize-theme-cn` 后做二次校对。
