# Divider 分割线

+ 区隔内容的分割线

## 何时使用

+ 对不同段落的文本进行分割。

## Divider基本用法

:::demo Divider 示例

```vue

<template>
  <div>
    基础用法： 对段落的文本进行分割。
    <k-divider></k-divider>

    虚线
    <k-divider border-style='dashed'></k-divider>

    自定义分割线颜色
    <k-divider color='#7693f5'></k-divider>

    自定义文案
    <k-divider>北京</k-divider>

    在左侧的自定义文案
    <k-divider content-position='left'>上海</k-divider>

    在右侧的自定义文案
    <k-divider content-position='right'>广州</k-divider>

    文案的颜色
    <k-divider content-color='#7693f5'>广州</k-divider>

    文案的背景颜色
    <k-divider content-background-color='#7693f5'>广州</k-divider>

    垂直的分割线
    <div>
      北京
      <k-divider direction='vertical'></k-divider>
      上海
      <k-divider direction='vertical' border-style='dashed'></k-divider>
      成都
    </div>
  </div>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  setup() {
    return {
      msg: 'Divider 分割线 组件文档示例'
    }
  }
})
</script>

<style>

</style>
```

:::

## Divider参数

| 参数 | 类型                            | 默认         | 说明           |
| ---- |-------------------------------|------------|--------------|
| color | string                        | --| 设置分割线的颜色     |
| direction | string `horizontal / vertical` | horizontal | 设置分割线方向      |
| border-style | string `dashed / solid`       | solid| 设置分隔符样式      |
| content-position | string`left / right / center` | center     | 设置分割线文案的位置   |
| content-color | string                        | --     | 设置分割线文案的颜色   |
| content-background-color | string                        | --     | 设置分割线文案的背景颜色 |

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
