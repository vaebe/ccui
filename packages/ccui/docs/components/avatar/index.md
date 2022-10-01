# Avatar 头像

- Avatar 头像组件可以用来代表人物或对象， 支持使用图片、文字作为 Avatar。

## 何时使用

- 展示用户头像

## 基本用法

- 已经提供 `width、height` 属性，所以不在提供 `size` 默认值属性。

:::demo 基本使用示例

```vue

<template>
  <div style="display: flex; align-items: center; justify-content: space-between;">
    <k-avatar name="张三"></k-avatar>
    <k-avatar :width="50" :height="50" name="张三张三张三张三张三大壮"></k-avatar>
    <k-avatar :width="80" :height="80" name="lihua"></k-avatar>
    <k-avatar :width="110" :height="110" name="hua li" :isRound="false"></k-avatar>
    <k-avatar name="李六" customText="王二"></k-avatar>
    <k-avatar
        name="刘武"
        imgSrc="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
    ></k-avatar>
    <k-avatar
        name="刘武"
        fit="contain"
        imgSrc="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
    ></k-avatar>
    <k-avatar name="孙六" :isRound="false" imgSrc="https://fuss10.1171jpeg.jpeg"></k-avatar>
    <k-avatar></k-avatar>
  </div>
</template>

<script>
import {defineComponent} from 'vue';

export default defineComponent({
  setup() {
    return {
      msg: 'Avatar 头像 组件文档示例'
    };
  }
});
</script>

<style></style>
```

:::

## 展示规则

- 显示优先级排序 `imgSrc > customText > name`
- 头像显示基本规则
    1. 中文开头：取传入字符串的最后两个字符
    1. 英文开头：取传入字符串的前面两个字符
    1. 多个英文名连用：取传入字符串的前两个英文名首字母
    1. 非中英文开头：取传入字符串的前两个字符

## Avatar 参数

| 参数       | 类型    | 默认  | 说明                                                           |
| ---------- | ------- | ----- | -------------------------------------------------------------- |
| name       | string  | -     | 必选，传入字符串用于制作头像 （可以不传 展示默认）             |
| gender     | string  | -     | 可选，根据性别区分头像颜色，传入 `string。可以是 male、female` |
| width      | number  | 36    | 可选，设定组件的宽度， 单位为 px                               |
| height     | number  | 36    | 可选，设定组件的高度，单位为 px                                |
| isRound    | boolean | true  | 可选，是否显示为圆形                                           |
| imgSrc     | string  | -     | 可选，传入自定义图片作为头像                                   |
| customText | string  | -     | 可选，传入自定义显示文字，不做处理                             |
| fit        | string  | cover | 可以是 `fill、contain、cover、none、scale-down`                |

## Avatar 事件

- 无