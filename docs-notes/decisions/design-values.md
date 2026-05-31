# vue3-ccui 设计原则

> 状态：**已采纳**
> 参考：[Ant Design 设计价值观](https://ant.design/docs/spec/values-cn)

参考 Ant Design 提出的「自然 / 确定 / 意义 / 生长」四大原则，结合 ccui 作为「构建示例」型组件库的定位，我们采用同一价值观，但在执行细节上做相应裁剪。

> 本文档当前作为 `docs-notes/` 内部决策记录。后续若公开化到 `packages/docs/guide/design-values.md`，需配套补 `.vitepress` 侧边栏配置。

## 一、自然（Natural）

设计的呈现要源于本能与共识，不应让用户花精力去解读。

**在 ccui 的体现**：

- 所有交互反馈遵循 Web 平台默认时序：hover / focus / active 用 `motion-duration-mid`（200ms），不引入夸张缓动。
- 表单错误态 / 校验消息不强制 modal 中断，而是 inline 跟随字段下方显示。
- Modal / Drawer 等浮层默认从「来源方向」滑入（drawer left/right、modal center 缩放），而不是不相关的 axis 跳变。

## 二、确定（Certain）

设计的目标和路径要清晰，让用户在有限选择中获得稳定结果。

**在 ccui 的体现**：

- 所有 `v-model:*` 协议、事件 payload、props 类型在类型声明里完整暴露，不依赖文档隐式约定。
- 同一类组件用统一交互模式：所有浮层组件（Select / Cascader / TreeSelect / DatePicker / TimePicker / RangePicker / ColorPicker / AutoComplete / Mentions）共享 `floating-ui placement` + `Teleport` + click outside 关闭 + Form 联动。
- 状态 token（success / warning / error / info）在所有组件里语义一致，不随组件作再解释。

## 三、意义（Meaningful）

每个设计选择都要有动机；不为装饰而装饰。

**在 ccui 的体现**：

- 默认禁用所有非功能性动效：没有"为了好看的"渐变、阴影、缩放。仅在传递状态变化（loading / processing / hover / disabled）时启用。
- Tag.Processing 的 6px 脉冲点是必要语义：传达"持续中"，不是装饰。
- 阴影分 5 档（`box-shadow` / `-secondary` / `-tertiary`），用于区分浮层层级，不滥用。

## 四、生长（Growing）

设计要能伴随产品演进，不为短期需求拍死长期形状。

**在 ccui 的体现**：

- 主题层 SeedToken / MapToken 双层结构（`themes/light.ts` / `dark.ts`），新增 token 不破坏既有消费。
- 12 色板 × 10 阶覆盖 Tag / Badge / Avatar / Status 的色彩需求，组件可按调色阶任意取色而无需新增 hex。
- `ConfigProvider` 提供运行时 token 定制能力，使用方升级 ccui 主版本不影响品牌色 / 圆角 / 字号等定制项。

## 与 Ant Design 的差异化

ccui 在以下几点做差异化决策（详见对应文档）：

| 项                  | Ant Design | ccui               | 决策记录                           |
| ------------------- | ---------- | ------------------ | ---------------------------------- |
| 默认主色            | `#1677ff`  | `#1677ff`（对齐）  | [brand-color.md](./brand-color.md) |
| 状态 Tag.Processing | 内置脉冲   | 内置脉冲（已对齐） | —                                  |
| 12 色板默认值       | 官方算法   | 官方算法（对齐）   | —                                  |

> 本文档随大版本升级时复审；如有原则级偏离，需在此文档增加修订记录。
