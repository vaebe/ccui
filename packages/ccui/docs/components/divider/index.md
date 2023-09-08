# Divider 分隔线

+ 区隔内容的分隔线

## 何时使用

+ 对不同段落的文本进行分隔。

## Divider基本用法

:::demo Divider 示例

```vue

<template>
  <div>
    基础用法： 对段落的文本进行分隔。
    <c-divider></c-divider>

    虚线
    <c-divider border-style='dashed'></c-divider>

    自定义分隔线颜色
    <c-divider color='#7693f5'></c-divider>

    自定义文案
    <c-divider>北京</c-divider>

    在左侧的自定义文案
    <c-divider content-position='left'>上海</c-divider>

    在右侧的自定义文案
    <c-divider content-position='right'>广州</c-divider>

    文案的颜色
    <c-divider content-color='#7693f5'>广州</c-divider>

    文案的背景颜色
    <c-divider content-background-color='#7693f5'>广州</c-divider>

    垂直的分隔线
    <div>
      北京
      <c-divider direction='vertical'></c-divider>
      上海
      <c-divider direction='vertical' border-style='dashed'></c-divider>
      成都
    </div>
  </div>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  setup() {
    return {
      msg: 'Divider 分隔线 组件文档示例'
    }
  }
})
</script>

<style>

</style>
```

:::

## Divider参数

| 参数 | 类型                                          | 默认         | 说明           |
| ---- |---------------------------------------------|------------|--------------|
| color | string                                      | --| 设置分隔线的颜色     |
| direction | [DirectionType](#directiontype)             | horizontal | 设置分隔线方向      |
| border-style | [BorderStyleType](#borderstyletype)         | solid| 设置分隔符样式      |
| content-position | [ContentPositionType](#Contentpositiontype) | center     | 设置分隔线文案的位置   |
| content-color | string                                      | --     | 设置分隔线文案的颜色   |
| content-background-color | string                                      | --     | 设置分隔线文案的背景颜色 |

## Divider类型定义

### DirectionType

```ts
export type DirectionType = 'horizontal' | 'vertical';
```

### BorderStyleType

```ts
export type BorderStyleType = 'dashed' | 'solid';
```

### ContentPositionType

```ts
export type ContentPositionType = 'left' | 'right' | 'center';
```
