# List 列表

通用的列表展示。

## 基本使用

:::demo

```vue
<template>
  <c-list
    bordered
    :data-source="['Racing car', 'Japanese printing', 'Lazy dog', 'Quick brown fox']"
  >
    <template #renderItem="{ item }">{{ item }}</template>
  </c-list>
</template>
```

:::

## 带头尾

:::demo

```vue
<template>
  <c-list bordered :data-source="['项目一', '项目二', '项目三']">
    <template #header><b>标题</b></template>
    <template #renderItem="{ item }">{{ item }}</template>
    <template #footer><i>页脚</i></template>
  </c-list>
</template>
```

:::

## 加载状态

:::demo

```vue
<template>
  <c-list loading bordered :data-source="['加载中…']">
    <template #renderItem="{ item }">{{ item }}</template>
  </c-list>
</template>
```

:::

## 空状态

:::demo

```vue
<template>
  <c-list bordered :data-source="[]" />
</template>
```

:::
