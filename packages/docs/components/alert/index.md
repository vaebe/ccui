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

## 顶部公告（banner）

`banner` 模式去边框、改背景，常用于页面顶部的全局提示。

:::demo

```vue
<template>
  <c-alert banner type="info" message="系统将于本周日 02:00 - 04:00 进行升级维护，请合理安排时间。" />
  <br />
  <c-alert banner show-icon type="warning" message="您的浏览器版本过低，可能影响部分功能体验。建议升级到最新版。" />
  <br />
  <c-alert banner show-icon type="error" message="账号余额不足，请尽快充值以避免服务中断。" closable />
</template>
```

:::

## 自定义关闭文字

`close-text` 替换默认的 × 按钮，常用于"知道了" / "我已了解"等业务文案。

:::demo

```vue
<template>
  <c-alert
    type="info"
    message="新功能上线：支持批量导出 Excel"
    description="您可以在「订单中心 → 批量操作」中找到该功能。"
    show-icon
    closable
    close-text="知道了"
  />
  <br />
  <c-alert
    type="warning"
    message="您正在测试环境"
    closable
    close-text="切换到生产"
  />
</template>
```

:::

## 图标 + 描述完整版

`show-icon` + `description` + `closable` 三者组合是最饱满的提示形式。

:::demo

```vue
<template>
  <c-alert
    show-icon
    closable
    type="success"
    message="同步完成"
    description="共同步 245 条数据，耗时 3.2 秒。详情可查看「同步记录」页。"
  />
  <br />
  <c-alert
    show-icon
    closable
    type="error"
    message="支付失败"
    description="您的银行卡余额不足，订单已暂存。请充值后在「待支付订单」中继续支付，30 分钟内有效。"
  />
</template>
```

:::

## 长内容自动换行

`message` 与 `description` 都会随容器宽度自动换行。

:::demo

```vue
<template>
  <div style="max-width: 480px">
    <c-alert
      show-icon
      type="info"
      message="本月统计周期变更通知"
      description="自 2026 年 5 月起，月度数据统计周期由「自然月 1 日 - 月末」调整为「每月 5 日 - 次月 4 日」。此变更不影响您的历史数据，但会影响下月起的统计报表生成时间。如有疑问请联系您的客户经理或在工单系统中提交问题。"
    />
  </div>
</template>
```

:::

## 表单顶部错误汇总（业务场景）

复杂表单提交失败时，把所有错误项放在顶部 Alert，便于用户快速定位。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const errors = ref(['用户名不能为空', '密码长度至少 8 位', '手机号格式错误'])
const dismissed = ref(false)

function reset() {
  dismissed.value = false
}
</script>

<template>
  <c-button @click="reset" style="margin-bottom: 12px">重置 alert</c-button>
  <c-alert
    v-if="!dismissed && errors.length > 0"
    show-icon
    closable
    type="error"
    :message="`表单有 ${errors.length} 项错误，请修正后重新提交`"
    @close="dismissed = true"
  >
    <template #default>
      <ul style="margin: 8px 0 0; padding-left: 20px">
        <li v-for="e in errors" :key="e" style="color: #d32029">{{ e }}</li>
      </ul>
    </template>
  </c-alert>
</template>
```

:::

## 行内嵌入卡片

Alert 嵌在卡片或表单内部，作为局部提示。

:::demo

```vue
<template>
  <div style="border: 1px solid #eee; border-radius: 8px; padding: 16px; max-width: 480px">
    <h3 style="margin: 0 0 12px">API 接入配置</h3>
    <c-alert
      show-icon
      type="warning"
      message="生产环境密钥泄露将导致严重后果，请妥善保管。"
    />
    <div style="margin-top: 12px; color: #666; font-size: 13px">
      App Key：sk-prod-XXXXXXXXXXXX
    </div>
  </div>
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
