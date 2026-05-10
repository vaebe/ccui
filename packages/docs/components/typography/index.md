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
      In the process of internal desktop applications development, many different design specs and implementations
      would be involved.
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
  <c-typography-text mark>Marked</c-typography-text>&nbsp;
  <c-typography-text code>code()</c-typography-text>&nbsp;
  <c-typography-text keyboard>Cmd+K</c-typography-text>&nbsp;
  <c-typography-text underline>Underline</c-typography-text>&nbsp;
  <c-typography-text delete>Deleted</c-typography-text>&nbsp;
  <c-typography-text strong>Strong</c-typography-text>&nbsp;
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

## API

### Title Props

| 参数  | 类型              | 默认值 | 说明     |
| ----- | ----------------- | ------ | -------- |
| level | `1 \| 2 \| 3 \| 4 \| 5` | `1`    | 标题级别 |

### Link Props

| 参数   | 类型   | 默认值 | 说明          |
| ------ | ------ | ------ | ------------- |
| href   | string | —      | 链接地址      |
| target | string | —      | 链接 target   |

### 通用 Props（Text / Paragraph / Title / Link）

| 参数      | 类型                                                | 默认值 | 说明     |
| --------- | --------------------------------------------------- | ------ | -------- |
| type      | `'secondary' \| 'success' \| 'warning' \| 'danger'` | —      | 文本类型 |
| disabled  | boolean                                             | `false`| 禁用     |
| mark      | boolean                                             | `false`| 高亮     |
| code      | boolean                                             | `false`| 代码样式 |
| keyboard  | boolean                                             | `false`| 键盘样式 |
| underline | boolean                                             | `false`| 下划线   |
| delete    | boolean                                             | `false`| 删除线   |
| strong    | boolean                                             | `false`| 加粗     |
| italic    | boolean                                             | `false`| 斜体     |
