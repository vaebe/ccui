# 品牌色决策记录

> 决策日期：2026-05-10
> 状态：**已实施**
> 关联：审查报告 [archive/ant-design-alignment-2026-05-10.md](../archive/ant-design-alignment-2026-05-10.md) P1 #1

## 背景

ccui 1.x 历史品牌色为 `#5e7ce0`（柔和蓝），与 Ant Design v6 默认主色 `#1677ff`（鲜蓝）存在视觉差异。`packages/theme/themes/light.ts` 与 `dark.ts`（v6 SeedToken/MapToken 源）已默认对齐 `#1677ff`，但 `packages/theme/theme.scss`（自动生成产物）一度滞留 1.x 旧值，导致组件实际外观双轨。

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

## 影响范围

已落地的改动（在本会话内）：

- Batch 34（commit `1a4ec62`）：theme.scss 重生 + Form 9 处错误命名空间 var 修正 + 24 处硬编码 `#1677ff` → `var(--ccui-brand)`。
- Result.tsx（commit `84e5e2f`）：4 处 JS fill 字符串 → `currentColor` + 状态修饰类驱动。
- 主题对齐（commits `cb57837` / `ef29d93` / `05663a7`）：control-outline / dark 非颜色 token / 12 色板 × 10 阶。

## 反向决策的开销估算

如未来要切回 `#5e7ce0`：

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
