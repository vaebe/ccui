---
name: design-audit-notes
description: Theme tokens, design values, brand-color and locale/algorithm decisions, plus the 2026-05-10 alignment audit and historical fix logs.
---

# Design Audit Notes

Use this folder when discussing theme tokens、品牌色策略、Locale/algorithm 接入、设计原则、或一次性的视觉对齐审查。

## 结构

- `decisions/` — 真决策记录（一旦合入，保留作不变性约束）：
  - [brand-color.md](decisions/brand-color.md) — 默认主色 `#1677ff` 全量对齐 v6 的决策与反向开销
  - [design-values.md](decisions/design-values.md) — 自然 / 确定 / 意义 / 生长 四原则在 ccui 的体现
  - [2026-05-10-locale-algorithm.md](decisions/2026-05-10-locale-algorithm.md) — ConfigProvider locale / theme.algorithm 接通 + Form scss 重写
- `references/` — 横向审查报告：
  - [ant-design-alignment.md](references/ant-design-alignment.md) — 2026-05-10 主题层 + 73 组件 SCSS 全量审查（P0/P1 已落实）
- `history/` — 已合入的 fix log，归档保留以便溯源（不是决策）：
  - [2026-05-10-component-fixes.md](history/2026-05-10-component-fixes.md) — Affix / Tour / Slider / Dropdown / Tabs + 全局 reset 修复记录

## 何时更新

- 新增决策：在 `decisions/` 起一份新文件，文件名 `<topic>.md` 或 `<date>-<topic>.md`，顶部写日期 / 状态 / 关联文档。
- 完成横向审查：在 `references/` 起一份 `<date>-<topic>.md`，并在 `decisions/` 内附跟进决策。
- 完成批量 fix 但需溯源：放 `history/`，**不要**放 `decisions/`（混淆"决策"与"修复"语义）。

## 约束（来自历史决策）

- 组件 SCSS / TSX 禁止硬编码主色字面量（hex / rgb）—— 详见 [brand-color.md](decisions/brand-color.md)。
- ConfigProvider 声明的 props 必须真消费，禁止留死接口 —— 详见 [2026-05-10-locale-algorithm.md](decisions/2026-05-10-locale-algorithm.md)。
- 新增 locale 文案必须同步 zhCN / enUS / Locale 接口三处 —— 详见同上。
