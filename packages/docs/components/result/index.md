# Result 结果

为重要操作给出明确的最终反馈页（成功 / 失败 / 警告 / 找不到）。

## 何时使用

- 用户完成一个表单 / 交易 / 创建流程后展示总结。
- 路由命中"未授权 / 找不到 / 服务异常"时渲染语义化页面。

## 基本使用

最简形式：`status` + `title` + `sub-title`。`#extra` slot 放主操作按钮。

:::demo

```vue
<template>
  <c-result
    status="success"
    title="操作成功！"
    sub-title="订单 #2025-04-001 已提交，结果将于三天内反馈。"
  >
    <template #extra>
      <c-button type="primary">查看订单</c-button>
      <c-button style="margin-inline-start: 8px">返回首页</c-button>
    </template>
  </c-result>
</template>
```

:::

## 不同状态

`status` 决定图标与色彩：`success` / `error` / `warning` / `info`。

:::demo

```vue
<template>
  <c-result status="error" title="提交失败" sub-title="请核对并修改下面的信息后重试。" />
  <c-result status="warning" title="磁盘容量已超 90%" sub-title="请在系统繁忙之前清理或扩容。" />
  <c-result status="info" title="操作已执行" sub-title="可能需要 1-2 分钟才能在控制台看到结果。" />
</template>
```

:::

## HTTP 错误页

`status="404"` / `'403'` / `'500'` 自带专门的 HTTP 错误插画。

:::demo

```vue
<template>
  <c-result status="404" title="404" sub-title="抱歉，您访问的页面不存在。">
    <template #extra>
      <c-button type="primary">返回首页</c-button>
    </template>
  </c-result>
</template>
```

:::

:::demo

```vue
<template>
  <c-result status="403" title="403" sub-title="抱歉，您无权访问该页面。" />
</template>
```

:::

:::demo

```vue
<template>
  <c-result status="500" title="500" sub-title="抱歉，服务器出错了。">
    <template #extra>
      <c-button type="primary">刷新页面</c-button>
    </template>
  </c-result>
</template>
```

:::

## 自定义图标

用 `#icon` slot 覆盖默认插画，常用于业务自定义视觉。

:::demo

```vue
<template>
  <c-result title="审核通过" sub-title="资质审核已完成，可以开始发布。">
    <template #icon>
      <div
        style="
          width: 80px;
          height: 80px;
          margin: 0 auto;
          border-radius: 50%;
          background: linear-gradient(135deg, #52c41a 0%, #95de64 100%);
          color: white;
          font-size: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        ✓
      </div>
    </template>
    <template #extra>
      <c-button type="primary">前往发布</c-button>
    </template>
  </c-result>
</template>
```

:::

## 携带详细内容

默认插槽展示在副标题下方，常用于"成功后展示订单详情 / 失败后列出错误项"。

:::demo

```vue
<template>
  <c-result status="error" title="提交失败" sub-title="请处理以下问题后重新提交。">
    <ul style="margin: 0; padding-left: 20px; color: #666">
      <li>用户名不能为空</li>
      <li>身份证号格式错误</li>
      <li>地址必须填写省 / 市 / 区</li>
    </ul>
    <template #extra>
      <c-button type="primary">返回修改</c-button>
    </template>
  </c-result>
</template>
```

:::

## API

### Props

| 参数     | 类型                                                                  | 默认值   | 说明           |
| -------- | --------------------------------------------------------------------- | -------- | -------------- |
| status   | `'success' \| 'error' \| 'info' \| 'warning' \| '404' \| '403' \| '500'` | `'info'` | 状态           |
| title    | string                                                                | —        | 主标题         |
| subTitle | string                                                                | —        | 副标题         |
| icon     | string                                                                | —        | 自定义图标类名 |

### Slots

| 名称    | 说明               |
| ------- | ------------------ |
| icon    | 自定义图标         |
| extra   | 自定义底部按钮区域 |
| default | 副标题下方的内容   |
