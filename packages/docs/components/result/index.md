# Result 结果

用于反馈一系列操作任务的处理结果。

## 何时使用

- 当有重要操作需要向用户进行反馈，且反馈内容较多时。

## 基本使用

:::demo

```vue
<template>
  <c-result status="success" title="成功提交！" sub-title="订单号 2017182818828182881 提交成功，结果将会在三天内反馈。">
    <template #extra>
      <c-button type="primary"> 返回 </c-button>
    </template>
  </c-result>
</template>
```

:::

## 不同状态

:::demo

```vue
<template>
  <c-result status="error" title="提交失败" sub-title="请核对并修改以下信息后，再重新提交。" />
  <c-result status="warning" title="There are some problems with your operation." />
  <c-result status="info" title="Your operation has been executed" />
</template>
```

:::

## HTTP 错误

:::demo

```vue
<template>
  <c-result status="404">
    <template #extra>
      <c-button type="primary"> Back Home </c-button>
    </template>
  </c-result>
  <c-result status="500" />
  <c-result status="403" />
</template>
```

:::

## Result 参数

| 参数     | 类型                                                             | 默认值 | 说明           |
| -------- | ---------------------------------------------------------------- | ------ | -------------- |
| status   | 'success' / 'error' / 'info' / 'warning' / '404' / '403' / '500' | 'info' | 状态           |
| title    | string                                                           | --     | 主标题         |
| subTitle | string                                                           | --     | 副标题         |
| icon     | string                                                           | --     | 自定义图标类名 |

## Result 插槽

| 插槽名  | 说明               |
| ------- | ------------------ |
| icon    | 自定义图标         |
| extra   | 自定义底部按钮区域 |
| default | 自定义内容区域     |
