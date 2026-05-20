# Archive

冻结的历史档。**只读 / 只供溯源**，不再维护。所有内容截止 v2.0.0 发布（2026-05-17）。

文件内部的相对链接（如 `docs-notes/design-audit/...`）是写入当时的路径，重构后可能失效；忽略即可，按本目录新结构定位文件。

## 内容索引

| 文件                                             | 时间       | 原始路径                                                 | 说明                                                                                                                                       |
| ------------------------------------------------ | ---------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| [roadmap-v2.0.md](./roadmap-v2.0.md)             | 2026-05-14 | `docs-notes/roadmap.md`                                  | v2.0 整体路线图（Tier S / M-A / M-B / L-1..4 / XL-1..6）。全部 `[x]` 收官，含每批次交付摘要。**「对标原则」节已抽到 decisions/benchmark-principles.md** |
| [components-diff.md](./components-diff.md)       | 2026-05-14 | `docs-notes/components-diff/references/components-diff.md` | 73 组件 vs Ant v6.3.7 对齐清单 + 40+ 批次交付历史 + API 风格审计                                                                            |
| [per-component/](./per-component/)               | 2026-05-14 | 同上 + `per-component/`                                  | 73 组件按 6 bucket 拆分的逐项 demo / props / events / 静态导出缺口（4305 行）                                                              |
| [ant-design-alignment-2026-05-10.md](./ant-design-alignment-2026-05-10.md) | 2026-05-10 | `docs-notes/design-audit/references/ant-design-alignment.md` | 主题层 + 73 组件 SCSS 全量审查报告（P0 / P1 / P2 整改建议；均已落地）                                                                       |
| [component-fixes-2026-05-10.md](./component-fixes-2026-05-10.md) | 2026-05-10 | `docs-notes/design-audit/history/2026-05-10-component-fixes.md` | Affix / Tour / Slider / Dropdown / Tabs + 全局 reset 批量修复 fix log                                                                       |

## 为什么放这里而不是删

- 决策溯源：`decisions/` 仍引用这些文件作为「为什么这个约束存在」的证据。
- 重构基线：未来若做主题/API 二次审查，这些档案是上一轮基线。
- Git 历史保留了文件，但翻起来比目录里直接打开慢得多。
