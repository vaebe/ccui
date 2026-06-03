# Docs Notes

ccui 工程层的 **shared memory**：决策约束、发布流程、维护基线。面向开发者本人 / AI / 未来贡献者，**不进入 VitePress 文档站**。

> 与 [`packages/docs/`](../packages/docs/)（VitePress 文档站）的分工：
> - `packages/docs/` —— 面向使用方，写 demo / props / events。
> - `docs-notes/` —— 面向贡献者，写决策、约束、流程、未决项。
>
> 一句话判别：读者是「写业务的工程师」→ `packages/docs/`；读者是「下一次会话的我自己 / Claude / Codex」→ `docs-notes/`。

## 目录

| 文件 / 目录                                                | 用途                                              |
| ---------------------------------------------------------- | ------------------------------------------------- |
| [decisions/](./decisions/)                                 | 不变性约束（一旦合入，后续工作必须遵守）          |
| [releasing.md](./releasing.md)                             | npm 发布流程、2FA / passkey、故障排查             |
| [bundle-size-baseline.md](./bundle-size-baseline.md)       | 当前体积基线（v2.0 snapshot）                     |

## decisions/

约束类决策。**和「修复记录」严格区分**：只有具备「反向决策成本」与「长期不变性约束」的内容才进。

| 文件                                                                       | 主题                                                  |
| -------------------------------------------------------------------------- | ----------------------------------------------------- |
| [benchmark-principles.md](./decisions/benchmark-principles.md)             | 对标 Ant Design 的边界：不照搬 React-only，翻译 Vue 化 |
| [brand-color.md](./decisions/brand-color.md)                               | 默认主色 `#1677ff` 全量对齐 v6                        |
| [design-values.md](./decisions/design-values.md)                           | 自然 / 确定 / 意义 / 生长 四原则在 ccui 的体现        |
| [config-provider-locale.md](./decisions/config-provider-locale.md)         | ConfigProvider locale / theme.algorithm 接通承诺      |
| [testing-principles.md](./decisions/testing-principles.md)                 | 测试术语用 Vue 语境 + 测试优先级（先测真实行为）       |

## 写新笔记的约定

1. **决策**：进 `decisions/`，文件名 `<topic>.md`。顶部写「决策日期 / 状态 / 反向决策开销 / 不变性约束」。
2. **流程 / 基线**：直接放顶层（如 `releasing.md` / `bundle-size-baseline.md`）。
3. **修复记录 / 批次记录**：**不再单独写**。提交 PR / 走 git log 即可，避免和 `decisions/` 混淆。
4. **过期内容**：直接删，靠 git 历史溯源；不在本目录沉淀历史档。
