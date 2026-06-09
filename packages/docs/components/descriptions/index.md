# Descriptions 描述列表

成组展示多个只读字段，常用于详情页 / 资料卡。

## 何时使用

- 详情页展示订单 / 用户 / 资源的属性。
- 接口返回的多字段以"标签 + 值"形式呈现。

## 基本使用

`items` 描述每条字段；默认 `column=3` 三列均分。

:::demo

```vue
<template>
  <c-descriptions
    title="用户信息"
    :items="[
      { label: '用户名', value: 'Alice' },
      { label: '电话', value: '13888888888' },
      { label: '住址', value: '北京' },
      { label: '余额', value: '¥168.00' },
      { label: '会员', value: '黄金' },
      { label: '状态', value: '在线' },
    ]"
  />
</template>
```

:::

## 带边框

`bordered` 切换为表格风格，每个 cell 都带边框，便于阅读。

:::demo

```vue
<template>
  <c-descriptions
    title="订阅详情"
    bordered
    :column="2"
    :items="[
      { label: '产品', value: 'Cloud DB' },
      { label: '订阅', value: 'Pro' },
      { label: '账单', value: '¥99/月' },
      { label: '到期', value: '2026-12-31' },
    ]"
  />
</template>
```

:::

## 控制列数

`column` 改变列数；某项的 `span` 可让它跨多列。

:::demo

```vue
<template>
  <c-descriptions
    bordered
    :column="3"
    :items="[
      { label: '订单号', value: '#202504-001', span: 2 },
      { label: '状态', value: '已发货' },
      { label: '收件人', value: '张三' },
      { label: '电话', value: '13800001234' },
      { label: '收件地址', value: '北京市朝阳区某街某号 12-3-4', span: 3 },
    ]"
  />
</template>
```

:::

## 不同尺寸

`size`：`small` / `default` / `middle`，影响 padding 和字号。

:::demo

```vue
<template>
  <p style="color: var(--ccui-color-text-secondary); margin: 0 0 6px">small</p>
  <c-descriptions
    bordered
    size="small"
    :column="3"
    :items="[
      { label: 'A', value: '1' },
      { label: 'B', value: '2' },
      { label: 'C', value: '3' },
    ]"
  />

  <p style="color: var(--ccui-color-text-secondary); margin: 16px 0 6px">default</p>
  <c-descriptions
    bordered
    :column="3"
    :items="[
      { label: 'A', value: '1' },
      { label: 'B', value: '2' },
      { label: 'C', value: '3' },
    ]"
  />

  <p style="color: var(--ccui-color-text-secondary); margin: 16px 0 6px">middle</p>
  <c-descriptions
    bordered
    size="middle"
    :column="3"
    :items="[
      { label: 'A', value: '1' },
      { label: 'B', value: '2' },
      { label: 'C', value: '3' },
    ]"
  />
</template>
```

:::

## 纵向布局

`layout="vertical"` 把"标签 / 值"上下排，常用于较长内容。

:::demo

```vue
<template>
  <c-descriptions
    title="商品详情"
    layout="vertical"
    bordered
    :column="3"
    :items="[
      { label: '商品名', value: 'Cloud Database 高级版' },
      { label: '版本', value: 'v3.2.4' },
      { label: 'SLA', value: '99.95%' },
    ]"
  />
</template>
```

:::

## 隐藏冒号 / 自定义样式

`colon=false` 隐藏冒号；每项可单独传 `labelStyle` / `contentStyle`。

:::demo

```vue
<template>
  <c-descriptions
    :colon="false"
    :column="2"
    :items="[
      {
        label: '用户名',
        value: 'Alice',
        labelStyle: { color: '#1677ff', fontWeight: 600 },
      },
      {
        label: '余额',
        value: '¥168.00',
        contentStyle: { color: '#52c41a', fontWeight: 700 },
      },
    ]"
  />
</template>
```

:::

## API

### Descriptions Props

| 参数     | 类型                               | 默认值         | 说明               |
| -------- | ---------------------------------- | -------------- | ------------------ |
| title    | string                             | `''`           | 顶部标题           |
| extra    | string                             | `''`           | 标题右端附加内容   |
| bordered | boolean                            | `false`        | 表格风格的边框     |
| column   | number                             | `3`            | 列数               |
| size     | `'small' \| 'default' \| 'middle'` | `'default'`    | 尺寸               |
| layout   | `'horizontal' \| 'vertical'`       | `'horizontal'` | label / value 排布 |
| colon    | boolean                            | `true`         | 显示冒号           |
| items    | `DescriptionsItem[]`               | —              | 描述项数据         |

### DescriptionsItem

| 字段         | 类型               | 说明             |
| ------------ | ------------------ | ---------------- |
| label        | string             | 标签             |
| value        | `string \| number` | 值               |
| span         | number             | 跨列数（默认 1） |
| labelStyle   | `CSSProperties`    | 单项 label 样式  |
| contentStyle | `CSSProperties`    | 单项内容样式     |
