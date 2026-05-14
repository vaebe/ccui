# Docs Notes

> **vue3-ccui 是一个 Vue 3 组件库。** 与 Ant Design 的关系是「对标」而不是「移植」——视觉/Token/心智模型对齐，但 React-only 模式（render props / forwardRef / shouldUpdate / 受控-非受控二分法 / Hook 元组返回 等）一律不照搬，要么不做，要么翻译成 Vue 习惯（v-model / slot / composable / KeepAlive）。详见 [roadmap.md](./roadmap.md) 顶部「对标原则」一节。

跨组件 / 跨主题的内部协作笔记。**不进入 VitePress 文档站发布产物**，是工程层的「shared memory」：批次交付记录、设计决策、视觉审查、API diff 等。

## 目录

| 子目录 / 文件 | SKILL | 用途 | 最新状态 |
| --- | --- | --- | --- |
| [components-diff/](./components-diff/SKILL.md) | components-diff-notes | Ant Design API/Demo diff、组件批次交付记录、剩余 gap | 截至 Batch 40（2026-05-14），含 73 组件逐项明细 `per-component/` |
| [design-audit/](./design-audit/SKILL.md) | design-audit-notes | 主题 token、品牌色、locale、设计原则等决策 + 视觉对齐审查 | 2026-05-10 审查的 P0/P1/P2 均已落地 |
| [roadmap.md](./roadmap.md) | — | 后续任务清单，按 T-Shirt Size（S/M/L/XL）分级 | 2026-05-14 初版，5 大 Tier 共 60+ 可执行 batch |

## 何时进 docs-notes vs 进 packages/docs

- **packages/docs/** — 面向库使用方的 VitePress 站，写组件 demo / props / events / 类型表。
- **docs-notes/** — 面向开发者本人/AI/未来贡献者的协作笔记。写「为什么这样做」「跨组件视角」「批次交付记录」「未决项」。

如果一份笔记的读者是「下一次启动会话的我自己 / Codex / Claude」，放 docs-notes；如果读者是「用 vue3-ccui 写业务的工程师」，放 packages/docs。

## 写新笔记的约定

1. **每个新 skill 起一个目录**，目录里放 `SKILL.md`（前言 + 入口） + `references/`（横向资料） + 可选 `decisions/`（不变性约束） + 可选 `history/`（已合入的 fix log）。
2. **SKILL.md 用前言 YAML**（`name` / `description`），方便 Claude Code skill 系统识别。
3. **决策 vs 修复区分**：
   - `decisions/`：有「反向决策成本」+「不变性约束」段的才进。
   - `history/`：只是记录"做了哪些 fix"，没有决策性约束。
4. **过期文档处理**：不删除，加状态前言（参考 [ant-design-alignment.md](./design-audit/references/ant-design-alignment.md) 顶部"状态更新"节）。

## 已废弃的目录

- ~~`menu-vue-api/`~~ — 2026-05-14 移除。该目录仅含 14 行 Menu API 对齐说明，信息已合入 `components-diff/references/per-component/5-nav-general.md` 与 Menu 组件源码。
