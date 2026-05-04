# Descriptions 描述列表

展示多个只读字段。

## 基本使用

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
    ]"
  />
</template>
```

:::

## 带边框

:::demo

```vue
<template>
  <c-descriptions
    title="带边框"
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

## 纵向布局

:::demo

```vue
<template>
  <c-descriptions
    layout="vertical"
    bordered
    :items="[
      { label: 'A', value: '1' },
      { label: 'B', value: '2' },
      { label: 'C', value: '3' },
    ]"
  />
</template>
```

:::
