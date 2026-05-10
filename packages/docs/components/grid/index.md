# Grid 栅格

24 等分的响应式栅格系统。`<c-row>` 是行容器，`<c-col>` 是列；列的 `span` 之和满 24 即填满一行。

## 何时使用

- 需要在多列之间对齐内容。
- 不同屏幕宽度下要切换列数。

## 基本使用

`gutter` 控制列与列的间距（px）。

:::demo

```vue
<template>
  <c-row :gutter="16">
    <c-col :span="6"><div class="g-block">col-6</div></c-col>
    <c-col :span="6"><div class="g-block">col-6</div></c-col>
    <c-col :span="6"><div class="g-block">col-6</div></c-col>
    <c-col :span="6"><div class="g-block">col-6</div></c-col>
  </c-row>
</template>

<style>
.g-block {
  background: #1677ff;
  color: #fff;
  text-align: center;
  padding: 8px 0;
  border-radius: 4px;
  margin-bottom: 8px;
}
</style>
```

:::

## 不等分

不同 `span` 拼成一行，剩余的列若不足 24 不会拉伸。

:::demo

```vue
<template>
  <c-row :gutter="16">
    <c-col :span="16"><div class="g-block">col-16</div></c-col>
    <c-col :span="8"><div class="g-block">col-8</div></c-col>
  </c-row>
</template>
```

:::

## 偏移与对齐

`offset` 让列前置留白；`justify` / `align` 控制行内对齐方式。

:::demo

```vue
<template>
  <c-row :gutter="16" justify="center" align="middle">
    <c-col :span="8"><div class="g-block" style="height: 60px; line-height: 60px">col-8</div></c-col>
    <c-col :span="8" :offset="4"><div class="g-block">col-8 offset-4</div></c-col>
  </c-row>
</template>
```

:::

## 响应式列数

`xs` / `sm` / `md` / `lg` / `xl` / `xxl` 按断点切换列数。

:::demo

```vue
<template>
  <c-row :gutter="16">
    <c-col v-for="i in 4" :key="i" :xs="24" :sm="12" :md="8" :lg="6">
      <div class="g-block">xs=24 sm=12 md=8 lg=6</div>
    </c-col>
  </c-row>
  <p style="margin-top: 8px; color: #666">缩窄浏览器观察列数变化</p>
</template>
```

:::

## 响应式间距

`gutter` 也支持 `[h, v]` 二元组或 `{ xs, sm, md, lg, xl }` 对象。

:::demo

```vue
<template>
  <c-row :gutter="[24, 12]">
    <c-col v-for="i in 6" :key="i" :span="8">
      <div class="g-block">col-8</div>
    </c-col>
  </c-row>
</template>
```

:::

## 列排序

`order` 改变列在视觉上的顺序，常用于响应式下"内容前置 / 侧栏后置"。

:::demo

```vue
<template>
  <c-row :gutter="16">
    <c-col :span="6" :order="4"><div class="g-block">DOM-1 / order=4</div></c-col>
    <c-col :span="6" :order="3"><div class="g-block">DOM-2 / order=3</div></c-col>
    <c-col :span="6" :order="2"><div class="g-block">DOM-3 / order=2</div></c-col>
    <c-col :span="6" :order="1"><div class="g-block">DOM-4 / order=1</div></c-col>
  </c-row>
</template>
```

:::

## flex 简写

`flex="1"` / `flex="0 0 200px"` 让列脱离 24 栅格，按 flex 行为分配空间。

:::demo

```vue
<template>
  <c-row :gutter="16">
    <c-col flex="120px"><div class="g-block">120px</div></c-col>
    <c-col flex="auto"><div class="g-block">auto（撑满）</div></c-col>
    <c-col flex="80px"><div class="g-block">80px</div></c-col>
  </c-row>
</template>
```

:::

## 断点

| 断点 | 触发宽度（px） |
| ---- | -------------- |
| xs   | 0              |
| sm   | 576            |
| md   | 768            |
| lg   | 992            |
| xl   | 1200           |
| xxl  | 1600           |

## API

### Row Props

| 参数    | 类型                                                                             | 默认值    | 说明           |
| ------- | -------------------------------------------------------------------------------- | --------- | -------------- |
| justify | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` | 水平对齐       |
| align   | `'top' \| 'middle' \| 'bottom' \| 'stretch'`                                     | `'top'`   | 垂直对齐       |
| gutter  | `number \| [number, number] \| Record<Breakpoint, number>`                       | `0`       | 栅格间距       |
| wrap    | boolean                                                                          | `true`    | 自动换行       |

### Col Props

| 参数               | 类型                                                              | 默认值 | 说明                           |
| ------------------ | ----------------------------------------------------------------- | ------ | ------------------------------ |
| span               | number                                                            | —      | 占据的栅格数 0–24              |
| order              | number                                                            | —      | 排序                           |
| offset             | number                                                            | —      | 左偏移                         |
| push               | number                                                            | —      | 向右推                         |
| pull               | number                                                            | —      | 向左拉                         |
| flex               | `number \| string`                                                | —      | flex 简写（脱离栅格按 flex 分配）|
| xs/sm/md/lg/xl/xxl | `number \| { span, offset, order, push, pull }`                   | —      | 响应式配置                     |
