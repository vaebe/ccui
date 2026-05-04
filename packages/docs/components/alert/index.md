# Alert 警告提示

警告提示，展现需要关注的信息。

## 何时使用

- 当某个页面需要向用户显示警告的信息时。
- 非浮层的静态展现形式，始终展现，不会自动消失，用户可以点击关闭。

## 基本使用

:::demo

```vue
<template>
  <c-alert type="success" message="Success Tips" />
  <br />
  <c-alert type="info" message="Informational Notes" />
  <br />
  <c-alert type="warning" message="Warning" />
  <br />
  <c-alert type="error" message="Error" />
</template>
```

:::

## 含有辅助性文字介绍

:::demo

```vue
<template>
  <c-alert
    type="success"
    message="Success Tips"
    description="Detailed description and advice about successful copywriting."
  />
  <br />
  <c-alert
    type="info"
    message="Informational Notes"
    description="Additional description and information about copywriting."
  />
</template>
```

:::

## 显示图标

:::demo

```vue
<template>
  <c-alert show-icon type="success" message="Success Tips" />
  <br />
  <c-alert show-icon type="info" message="Informational Notes" />
  <br />
  <c-alert show-icon type="warning" message="Warning" />
  <br />
  <c-alert show-icon type="error" message="Error" />
</template>
```

:::

## 可关闭

:::demo

```vue
<script>
export default {
  methods: {
    onClose(e) {
      console.log('alert closed', e)
    },
  },
}
</script>

<template>
  <c-alert closable type="warning" message="Warning Text" @close="onClose" />
</template>
```

:::

## Alert 参数

| 参数        | 类型                                     | 默认值 | 说明               |
| ----------- | ---------------------------------------- | ------ | ------------------ |
| type        | 'success' / 'info' / 'warning' / 'error' | 'info' | 类型               |
| message     | string                                   | --     | 警告主标题         |
| description | string                                   | --     | 辅助性文字描述     |
| showIcon    | boolean                                  | false  | 是否显示图标       |
| closable    | boolean                                  | false  | 默认显示关闭按钮   |
| closeText   | string                                   | --     | 自定义关闭按钮文本 |
| banner      | boolean                                  | false  | 是否用作顶部公告   |

## Alert 事件

| 事件名 | 参数 | 说明           |
| ------ | ---- | -------------- |
| close  | --   | 关闭按钮被点击 |
