# Typography 排版

文本的基本格式。

## 何时使用

- 在需要展示标题、段落、列表内容时使用，例如文章/博客/日志。
- 需要一列基于文本的基础操作时，例如复制/省略/可编辑。

## 基本使用

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
    <c-typography-title :level="2"> Guidelines and Resources </c-typography-title>
    <c-typography-paragraph>
      <c-typography-link href="#"> Ant Design </c-typography-link>
      <c-typography-text> · </c-typography-text>
      <c-typography-text type="secondary"> A UI design language </c-typography-text>
    </c-typography-paragraph>
  </c-typography>
</template>
```

:::

## 文本与超链接

:::demo

```vue
<template>
  <div>
    <c-typography-text>Default Text</c-typography-text>
    <br />
    <c-typography-text type="secondary"> Secondary Text </c-typography-text>
    <br />
    <c-typography-text type="success"> Success Text </c-typography-text>
    <br />
    <c-typography-text type="warning"> Warning Text </c-typography-text>
    <br />
    <c-typography-text type="danger"> Danger Text </c-typography-text>
    <br />
    <c-typography-text disabled> Disabled Text </c-typography-text>
    <br />
    <c-typography-text mark> Marked Text </c-typography-text>
    <br />
    <c-typography-text code> Code Text </c-typography-text>
    <br />
    <c-typography-text keyboard> Keyboard </c-typography-text>
    <br />
    <c-typography-text underline> Underline </c-typography-text>
    <br />
    <c-typography-text delete> Deleted </c-typography-text>
    <br />
    <c-typography-text strong> Strong </c-typography-text>
    <br />
    <c-typography-text italic> Italic </c-typography-text>
  </div>
</template>
```

:::

## 标题组件

:::demo

```vue
<template>
  <c-typography-title>h1. Title</c-typography-title>
  <c-typography-title :level="2"> h2. Title </c-typography-title>
  <c-typography-title :level="3"> h3. Title </c-typography-title>
  <c-typography-title :level="4"> h4. Title </c-typography-title>
  <c-typography-title :level="5"> h5. Title </c-typography-title>
</template>
```

:::

## 通用 Props（Text/Paragraph/Title/Link）

| 参数      | 类型                                           | 默认值 | 说明         |
| --------- | ---------------------------------------------- | ------ | ------------ |
| type      | 'secondary' / 'success' / 'warning' / 'danger' | --     | 文本类型     |
| disabled  | boolean                                        | false  | 是否禁用     |
| mark      | boolean                                        | false  | 添加标记样式 |
| code      | boolean                                        | false  | 添加代码样式 |
| keyboard  | boolean                                        | false  | 添加键盘样式 |
| underline | boolean                                        | false  | 下划线       |
| delete    | boolean                                        | false  | 删除线       |
| strong    | boolean                                        | false  | 加粗         |
| italic    | boolean                                        | false  | 斜体         |

## Title 额外参数

| 参数  | 类型              | 默认值 | 说明     |
| ----- | ----------------- | ------ | -------- |
| level | 1 / 2 / 3 / 4 / 5 | 1      | 标题级别 |

## Link 额外参数

| 参数   | 类型   | 默认值 | 说明          |
| ------ | ------ | ------ | ------------- |
| href   | string | --     | 链接地址      |
| target | string | --     | 链接的 target |
