# 品牌色决策记录

> 状态：**已实施**

## 背景

ccui 默认主色对齐 Ant Design v6 的 `#1677ff`（鲜蓝）。品牌色相关 token 集中在 `packages/theme/themes/light.ts` 与 `dark.ts`（v6 SeedToken/MapToken 源），`packages/theme/theme.scss` 是其自动生成产物。

## 决策

**保留 `#1677ff`，全量对齐 Ant Design v6。**

具体：

- `themes/light.ts` 的 `colorPrimary` / `brand` / `link` 系列 token 保持 `#1677ff` 及其官方派生阶。
- `themes/dark.ts` 用 antd dark algorithm 派生（`#1668dc` + dark 1-10 阶）。
- 组件 SCSS 不再硬编码主色，统一通过 `var(--ccui-brand)` / `$ccui-color-primary` 等 token 消费。

## 理由

1. **生态一致性优先**：项目对照 Ant Design v6.3.7 做组件交付，主色不一致会让用户每次接入都需要手动覆盖一次品牌色，对开发者体验是减分项。
2. **差异化成本不对等**：保留 `#5e7ce0` 需要：
   - 同步重算 1-10 阶派生色板（10 种颜色 × 10 阶 = 100 个 token 全部要 antd algorithm 推一遍）
   - 提供独立的 `antd-compat` preset 给希望 `#1677ff` 的用户
   - 文档双重维护
   - 对应的 brand 派生色（hover/active/border 等）在所有 token 层重写
3. **`ConfigProvider` 已支持运行时定制**：使用方若需要 `#5e7ce0`（或任意自定义品牌色），可通过 `<ConfigProvider :theme="{ token: { colorPrimary: '#5e7ce0' } }">` 一行接入，差异化能力下沉到使用方而非组件库默认。
4. **品牌识别度让位实用性**：ccui 不是企业级专属设计系统，没有刚性的品牌识别需求；与同生态对齐降低用户迁移成本。

## 反向决策的开销估算

如未来要切换默认主色（如切回历史的 `#5e7ce0`）：

- 仅修改 `themes/light.ts` / `dark.ts` 的 `colorPrimary*` 系列 + `brand*` 旧 key + `link*` + 12 色板的 `blue-*` 阶 ≈ 30 个 token 值。
- 跑 `pnpm exec node packages/cli/index.js generate:theme` 重生 SCSS / CSS。
- **不需要**改任何组件源码（已全部走 token）。

切换成本一次性、可逆。

## 后续不变性约束

为保持本决策的可执行性：

- **禁止**在组件 SCSS / TSX 中硬编码任何主色字面量（hex / rgb）。所有引用一律通过 token。
- 新增组件提交前必须 grep `1677ff` / `5e7ce0` 自检。
- `result.tsx` 这种"SVG fill 不接受 var()"的场景：用 `currentColor` + CSS 类驱动，不写字面量颜色。

如需破例，必须在组件 README 注明并写入 `docs-notes/decisions/`（新增一份「exception-<topic>.md」决策）。
