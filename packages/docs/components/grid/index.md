# Grid 栅格

24 栅格响应式布局系统。

## 何时使用

- 在多个元素需要按列对齐排列时。
- 需要响应不同屏幕宽度自适应布局时。

## 基本使用

:::demo

```vue
<template>
  <c-row :gutter="16">
    <c-col :span="6">
      <div class="demo-block">
        col-6
      </div>
    </c-col>
    <c-col :span="6">
      <div class="demo-block">
        col-6
      </div>
    </c-col>
    <c-col :span="6">
      <div class="demo-block">
        col-6
      </div>
    </c-col>
    <c-col :span="6">
      <div class="demo-block">
        col-6
      </div>
    </c-col>
  </c-row>
</template>

<style>
.demo-block {
  background: rgba(0, 128, 255, 0.5);
  color: #fff;
  padding: 8px 0;
  text-align: center;
  margin-bottom: 8px;
}
</style>
```

:::

## 偏移与对齐

:::demo

```vue
<template>
  <c-row :gutter="16" justify="center" align="middle">
    <c-col :span="8" :offset="0">
      <div class="demo-block">
        col-8
      </div>
    </c-col>
    <c-col :span="8" :offset="4">
      <div class="demo-block">
        col-8 offset-4
      </div>
    </c-col>
  </c-row>
</template>
```

:::

## 响应式

:::demo

```vue
<template>
  <c-row :gutter="16">
    <c-col :xs="24" :sm="12" :md="8" :lg="6">
      <div class="demo-block">
        xs=24 sm=12 md=8 lg=6
      </div>
    </c-col>
    <c-col :xs="24" :sm="12" :md="8" :lg="6">
      <div class="demo-block">
        xs=24 sm=12 md=8 lg=6
      </div>
    </c-col>
    <c-col :xs="24" :sm="12" :md="8" :lg="6">
      <div class="demo-block">
        xs=24 sm=12 md=8 lg=6
      </div>
    </c-col>
    <c-col :xs="24" :sm="12" :md="8" :lg="6">
      <div class="demo-block">
        xs=24 sm=12 md=8 lg=6
      </div>
    </c-col>
  </c-row>
</template>
```

:::

## 断点

| 断点 | 最小宽度 |
| ---- | -------- |
| xs   | 0        |
| sm   | 576px    |
| md   | 768px    |
| lg   | 992px    |
| xl   | 1200px   |
| xxl  | 1600px   |

## Row 参数

| 参数    | 类型                                                                             | 默认值  | 说明                                 |
| ------- | -------------------------------------------------------------------------------- | ------- | ------------------------------------ |
| justify | `'start' / 'end' / 'center' / 'space-around' / 'space-between' / 'space-evenly'` | 'start' | 水平对齐方式                         |
| align   | `'top' / 'middle' / 'bottom' / 'stretch'`                                        | 'top'   | 垂直对齐方式                         |
| gutter  | `number / [number, number] / object`                                             | 0       | 栅格间距，可数字、二元组或按断点对象 |
| wrap    | boolean                                                                          | true    | 是否自动换行                         |

## Col 参数

| 参数               | 类型                                           | 默认值 | 说明              |
| ------------------ | ---------------------------------------------- | ------ | ----------------- |
| span               | number                                         | --     | 占据的栅格数 0-24 |
| order              | number                                         | --     | 排序顺序          |
| offset             | number                                         | --     | 左偏移            |
| push               | number                                         | --     | 向右移动          |
| pull               | number                                         | --     | 向左移动          |
| flex               | number / string                                | --     | flex 简写         |
| xs/sm/md/lg/xl/xxl | number / `{ span, offset, order, push, pull }` | --     | 响应式配置        |
