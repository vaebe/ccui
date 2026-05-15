# FormErrorList 表单错误列表

独立于 FormItem 自渲染的错误 / 警告列表，对标 Ant Design `Form.ErrorList`，作为独立顶层组件存在（**不挂 Form.ErrorList 静态属性**）。

::: tip 与 FormItem 内置 message 的关系
`<c-form-item>` 内置只显示**一条**校验 message。当业务侧需要：

- 展示多条错误（如来自后端的字段级错误数组）
- 把错误列表渲染到 FormItem 外部（如表单顶部的汇总区）
- 同时显示错误 + 警告
- 纯展示错误，不绑定校验逻辑

就用 `<c-form-error-list>`。它和 FormItem 完全解耦，可放在任何位置。
:::

## 何时使用

- 后端返回字段级错误数组，前端循环展示。
- 表单顶部 / 底部统一汇总区。
- 自定义错误展示（不走 FormItem 校验流）。

## 基本使用

:::demo

```vue
<template>
  <c-form-error-list :errors="['用户名不能为空', '至少 4 个字符']" />
</template>
```

:::

## errors + warnings 同时存在

:::demo

```vue
<template>
  <c-form-error-list :errors="['用户名重复']" :warnings="['密码强度较弱']" />
</template>
```

:::

## help 在 errors / warnings 都为空时显示

与 `<c-form-item>` 的 `help` 同义。

:::demo

```vue
<template>
  <c-form-error-list help="提示：用户名只能由英文 + 数字组成" />
</template>
```

:::

## 渲染优先级

`errors` > `warnings` > `help`：

- `errors` 非空：只显示 errors（红色）。
- `errors` 空 + `warnings` 非空：显示 warnings（黄色）。
- 都空 + `help` 非空：显示 help（次级灰色）。
- 全部空：组件返回 `null`，不渲染外层 `<ul>`。

## FormErrorList 参数

| 参数     | 类型       | 默认 | 说明                                          |
| -------- | ---------- | ---- | --------------------------------------------- |
| errors   | `string[]` | `[]` | 错误列表（红色显示）                            |
| warnings | `string[]` | `[]` | 警告列表（黄色显示）；可与 errors 并存          |
| help     | `string`   | `''` | 单条 help 文本，仅 errors+warnings 都空时显示    |
