# Typography 排版

文本内容的基本格式。

## 何时使用

- 文章 / 博客 / 详情页中的标题、段落、引用、链接。
- 需要一组语义化的文本类型（强调、次要、错误等）。

## 基本使用

`<c-typography>` 是排版的容器，里面可以放 Title / Paragraph / Text / Link。

:::demo

```vue
<template>
  <c-typography>
    <c-typography-title>Introduction</c-typography-title>
    <c-typography-paragraph>
      In the process of internal desktop applications development, many different design specs and implementations would
      be involved.
    </c-typography-paragraph>
    <c-typography-paragraph>
      After massive project practice and summaries, Ant Design, a design language for background applications, is
      refined.
    </c-typography-paragraph>
    <c-typography-title :level="2">Guidelines and Resources</c-typography-title>
    <c-typography-paragraph>
      <c-typography-link href="#">Ant Design</c-typography-link>
      <c-typography-text> · </c-typography-text>
      <c-typography-text type="secondary">A UI design language</c-typography-text>
    </c-typography-paragraph>
  </c-typography>
</template>
```

:::

## 五级标题

`level` 取 1–5，对应 `<h1>`–`<h5>`。

:::demo

```vue
<template>
  <c-typography-title>h1. Title</c-typography-title>
  <c-typography-title :level="2">h2. Title</c-typography-title>
  <c-typography-title :level="3">h3. Title</c-typography-title>
  <c-typography-title :level="4">h4. Title</c-typography-title>
  <c-typography-title :level="5">h5. Title</c-typography-title>
</template>
```

:::

## 语义化文本

`type` 表达"次要 / 成功 / 警告 / 危险"四种语义。

:::demo

```vue
<template>
  <c-typography-text>Default</c-typography-text>
  <br />
  <c-typography-text type="secondary">Secondary</c-typography-text>
  <br />
  <c-typography-text type="success">Success</c-typography-text>
  <br />
  <c-typography-text type="warning">Warning</c-typography-text>
  <br />
  <c-typography-text type="danger">Danger</c-typography-text>
  <br />
  <c-typography-text disabled>Disabled</c-typography-text>
</template>
```

:::

## 文本样式装饰

可叠加：`mark` 高亮 / `code` 代码 / `keyboard` 键盘 / `underline` 下划线 / `delete` 删除线 / `strong` 加粗 / `italic` 斜体。

:::demo

```vue
<template>
  <c-typography-text mark>Marked</c-typography-text>&nbsp; <c-typography-text code>code()</c-typography-text>&nbsp;
  <c-typography-text keyboard>Cmd+K</c-typography-text>&nbsp;
  <c-typography-text underline>Underline</c-typography-text>&nbsp;
  <c-typography-text delete>Deleted</c-typography-text>&nbsp; <c-typography-text strong>Strong</c-typography-text>&nbsp;
  <c-typography-text italic>Italic</c-typography-text>
</template>
```

:::

## 链接

`<c-typography-link>` 与 `<a>` 用法一致，自动附带主色 / hover 风格。

:::demo

```vue
<template>
  <c-typography-link href="https://ant.design" target="_blank">Ant Design</c-typography-link>
  <br />
  <c-typography-link href="#" type="warning">警告链接</c-typography-link>
  <br />
  <c-typography-link href="#" disabled>禁用链接</c-typography-link>
</template>
```

:::

## 段落组合

实战示例：用 Typography 组合标题 / 段落 / 链接构成一个迷你文章页。

:::demo

```vue
<template>
  <c-typography style="max-width: 720px">
    <c-typography-title>设计语言与组件库</c-typography-title>
    <c-typography-paragraph type="secondary">
      在企业级中后台体系中，统一的设计语言是规模化协作的基石。
    </c-typography-paragraph>
    <c-typography-title :level="3">为什么需要组件库？</c-typography-title>
    <c-typography-paragraph>
      把<c-typography-text mark>设计 token</c-typography-text>沉淀到组件，避免每个页面重新发明轮子；
      把<c-typography-text code>常见交互</c-typography-text>抽象成统一行为，降低用户认知负担。
    </c-typography-paragraph>
    <c-typography-paragraph>
      详细方法可参考
      <c-typography-link href="#">设计指南</c-typography-link>。
    </c-typography-paragraph>
  </c-typography>
</template>
```

:::

## 可复制（copyable，L-3.7）

文本右侧渲染复制按钮，点击调用 `navigator.clipboard.writeText`。3 秒后图标恢复。

::: tip slot 替代 React render props

ant `copyable.icon` (函数) → ccui **slot `copy-icon`** + scope `{ copied }`（与 [[feedback-vue-first-benchmark]] 「render props 翻 slot」原则一致）。`tooltips: [before, after]` 是数据元组保留为 prop。

:::

:::demo

```vue
<template>
  <c-typography-text :copyable="true">复制这段文本</c-typography-text>
  <br />
  <c-typography-text :copyable="{ text: '强制复制的内容', tooltips: ['点我复制', '已成功复制'] }">
    显示的是这一段，实际复制另一段
  </c-typography-text>
  <br />
  <c-typography-text :copyable="true">
    带自定义 icon
    <template #copy-icon="{ copied }">
      {{ copied ? '✅ 已复制' : '📋' }}
    </template>
  </c-typography-text>
</template>
```

:::

### CopyableConfig

| 字段          | 类型                              | 默认           | 说明                                          |
| ------------- | --------------------------------- | -------------- | --------------------------------------------- |
| text          | string                            | slot.text      | 实际复制的文本；不传则取 default slot 的纯文本 |
| copyableDelay | number                            | `3000`         | 复制后图标恢复延时（ms）                       |
| tooltips      | `[string, string] \| false`       | `['复制','已复制']` | 鼠标 hover 时的 title 文字（hover tooltip）   |
| onCopy        | `(text: string) => void`          | —              | 复制完成回调                                  |

### slot

| 名称       | 作用域       | 说明                                |
| ---------- | ------------ | ----------------------------------- |
| copy-icon  | `{ copied }` | 自定义复制按钮 icon（替代默认 ⎘ / ✓） |

## 可编辑（editable，L-3.7）

点击编辑按钮（或文本本身，配置 `triggerType: ['text']`）切入 textarea 内联编辑；Enter 提交、Escape 取消。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const text = ref('双击我编辑')

function onChange(v) {
  text.value = v
}
</script>

<template>
  <c-typography-text :editable="{ text, onChange }">{{ text }}</c-typography-text>
  <br />
  <c-typography-text :editable="{ triggerType: ['text'], onChange }">
    点文本即编辑（无 icon）
  </c-typography-text>
</template>
```

:::

### EditableConfig

| 字段        | 类型                                          | 默认       | 说明                                                       |
| ----------- | --------------------------------------------- | ---------- | ---------------------------------------------------------- |
| triggerType | `Array<'icon' \| 'text'>`                     | `['icon']` | 编辑触发方式                                               |
| tooltip     | `string \| false`                             | —          | icon hover tooltip 文字                                    |
| editing     | boolean                                       | —          | 受控编辑态                                                 |
| text        | string                                        | slot.text  | 初始编辑文本                                               |
| maxLength   | number                                        | —          | 最大字符数                                                 |
| onStart     | `() => void`                                  | —          | 进入编辑回调                                               |
| onChange    | `(value: string) => void`                     | —          | Enter 提交时回调                                           |
| onCancel    | `() => void`                                  | —          | Escape 取消时回调                                          |
| onEnd       | `() => void`                                  | —          | 编辑完成回调（onChange 之后触发）                          |

### slot

| 名称      | 作用域 | 说明                              |
| --------- | ------ | --------------------------------- |
| edit-icon | —      | 自定义编辑按钮 icon（替代默认 ✎） |

## 截断（ellipsis，L-3.7）

文字超出指定行数自动截断；可配合 `expandable` 展开 / 收起。

::: warning jsdom 不能测真实尺寸

`ellipsis` 的视觉效果靠 CSS `text-overflow: ellipsis` + `-webkit-line-clamp`。jsdom 无 layout 引擎，**测试只覆盖逻辑分支**（class 是否挂载 / slot 是否渲染 / expand state 切换 / title attribute），实际截断效果请在浏览器 demo 中肉眼验证。

:::

:::demo

```vue
<template>
  <c-typography-paragraph :ellipsis="true">
    这是一段很长的文字，单行截断，超出部分会被省略号代替。Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.
  </c-typography-paragraph>
  <c-typography-paragraph :ellipsis="{ rows: 2 }">
    两行截断。Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum, debitis quasi quaerat quibusdam earum sed odio nemo quos repudiandae illo ratione quod sequi animi cumque expedita facere?
  </c-typography-paragraph>
  <c-typography-paragraph :ellipsis="{ rows: 2, expandable: 'collapsible' }">
    可展开 + 可收起。Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum, debitis quasi quaerat quibusdam earum sed odio nemo quos repudiandae illo ratione quod sequi animi cumque expedita facere?
  </c-typography-paragraph>
</template>
```

:::

### EllipsisConfig

| 字段        | 类型                                  | 默认       | 说明                                                           |
| ----------- | ------------------------------------- | ---------- | -------------------------------------------------------------- |
| rows        | number                                | `1`        | 截断行数（>1 走 `-webkit-line-clamp` 多行）                    |
| expandable  | `boolean \| 'collapsible'`            | `false`    | true 显示展开按钮；`'collapsible'` 同时支持展开 + 收起          |
| expanded    | boolean                               | —          | 受控展开态                                                     |
| tooltip     | `boolean \| string`                   | `false`    | true 显示 `title` 原生 tooltip（jsdom 友好）；字符串则用该字符串 |
| onExpand    | `(expanded: boolean) => void`         | —          | 展开 / 收起回调                                                |
| onEllipsis  | `(clipped: boolean) => void`          | —          | 文本是否被截断的状态变化回调（v2.x 待接入实际 measure）         |

### slot

| 名称           | 作用域 | 说明                                  |
| -------------- | ------ | ------------------------------------- |
| expand-text    | —      | 自定义「展开」按钮文字（替代默认）    |
| collapse-text  | —      | 自定义「收起」按钮文字（替代默认）    |

## API

### Title Props

| 参数  | 类型                    | 默认值 | 说明     |
| ----- | ----------------------- | ------ | -------- |
| level | `1 \| 2 \| 3 \| 4 \| 5` | `1`    | 标题级别 |

### Link Props

| 参数   | 类型   | 默认值 | 说明        |
| ------ | ------ | ------ | ----------- |
| href   | string | —      | 链接地址    |
| target | string | —      | 链接 target |

### 通用 Props（Text / Paragraph / Title / Link）

| 参数      | 类型                                                | 默认值  | 说明     |
| --------- | --------------------------------------------------- | ------- | -------- |
| type      | `'secondary' \| 'success' \| 'warning' \| 'danger'` | —       | 文本类型 |
| disabled  | boolean                                             | `false` | 禁用     |
| mark      | boolean                                             | `false` | 高亮     |
| code      | boolean                                             | `false` | 代码样式 |
| keyboard  | boolean                                             | `false` | 键盘样式 |
| underline | boolean                                             | `false` | 下划线   |
| delete    | boolean                                             | `false` | 删除线   |
| strong    | boolean                                             | `false` | 加粗     |
| italic    | boolean                                             | `false` | 斜体     |
