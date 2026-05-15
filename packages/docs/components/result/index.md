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
  <c-result status="success" title="操作成功！" sub-title="订单 #2025-04-001 已提交，结果将于三天内反馈。">
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

## 极简版（仅标题）

不传 `sub-title` / `#extra` 时，只展示状态图标 + 标题，适合卡片内嵌空状态。

:::demo

```vue
<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
    <div style="border: 1px solid #eee; border-radius: 8px; padding: 16px">
      <c-result status="success" title="已激活" />
    </div>
    <div style="border: 1px solid #eee; border-radius: 8px; padding: 16px">
      <c-result status="info" title="等待审核" />
    </div>
  </div>
</template>
```

:::

## 注册成功 + 倒计时跳转

业务常见：成功页 N 秒后自动跳转，期间用户可点击「立即跳转」。

:::demo

```vue
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const seconds = ref(5)
let timer = null

function reset() {
  if (timer) clearInterval(timer)
  seconds.value = 5
  timer = setInterval(() => {
    seconds.value -= 1
    if (seconds.value <= 0) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

function goNow() {
  if (timer) clearInterval(timer)
  alert('跳转到工作台')
}

onMounted(reset)
onBeforeUnmount(() => timer && clearInterval(timer))
</script>

<template>
  <c-result
    status="success"
    title="注册成功"
    :sub-title="seconds > 0 ? `将于 ${seconds} 秒后自动跳转到工作台...` : '已跳转'"
  >
    <template #extra>
      <c-button type="primary" @click="goNow">立即跳转</c-button>
      <c-button style="margin-inline-start: 8px" @click="reset">重置倒计时</c-button>
    </template>
  </c-result>
</template>
```

:::

## 网络错误（带重试计数）

异步加载失败页，配合重试按钮 + 计数追踪连续失败次数。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const tries = ref(0)

function retry() {
  tries.value += 1
}
</script>

<template>
  <c-result status="error" title="网络异常" :sub-title="`连接超时，请检查网络后重试（已尝试 ${tries} 次）`">
    <template #extra>
      <c-button type="primary" @click="retry">重试</c-button>
      <c-button style="margin-inline-start: 8px">检查网络</c-button>
    </template>
  </c-result>
</template>
```

:::

## 权限不足（申请权限）

403 状态 + 申请权限按钮，是后台常见交互。

:::demo

```vue
<template>
  <c-result status="403" title="403" sub-title="抱歉，您的账号没有访问该页面的权限。">
    <template #extra>
      <c-button type="primary">申请权限</c-button>
      <c-button style="margin-inline-start: 8px">返回首页</c-button>
    </template>
  </c-result>
</template>
```

:::

## 自定义 SVG 图标

`#icon` slot 支持任意 VNode 内容（SVG / Iconify / 图片皆可）。

:::demo

```vue
<template>
  <c-result title="云端同步完成" sub-title="所有文件已上传至云端，可在任意设备访问。">
    <template #icon>
      <svg width="80" height="80" viewBox="0 0 80 80" style="display: block; margin: 0 auto">
        <circle cx="40" cy="40" r="36" fill="#e6f4ff" stroke="#1677ff" stroke-width="2" />
        <path
          d="M 26 40 L 35 50 L 56 28"
          stroke="#1677ff"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
        />
      </svg>
    </template>
    <template #extra>
      <c-button type="primary">打开文件夹</c-button>
    </template>
  </c-result>
</template>
```

:::

## 在 Modal 中使用

成功提示作为 Modal 内容，配合 `closable=false` 强制走主操作按钮。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <c-button type="primary" @click="open = true">完成订单</c-button>
  <c-modal v-model:open="open" :footer="null" :width="520" :closable="false">
    <c-result
      status="success"
      title="支付成功"
      sub-title="您的订单已生成，预计 3 个工作日内发货。"
    >
      <template #extra>
        <c-button type="primary" @click="open = false">查看订单</c-button>
        <c-button style="margin-inline-start: 8px" @click="open = false">关闭</c-button>
      </template>
    </c-result>
  </c-modal>
</template>
```

:::

## 多按钮组合

`#extra` 可以放多个按钮，按业务优先级排列。

:::demo

```vue
<template>
  <c-result status="success" title="部署完成" sub-title="新版本 v2.1.0 已成功上线生产环境。">
    <template #extra>
      <c-button type="primary">查看监控</c-button>
      <c-button style="margin-inline-start: 8px">查看日志</c-button>
      <c-button style="margin-inline-start: 8px">回滚版本</c-button>
      <c-button type="danger" style="margin-inline-start: 8px">紧急停止</c-button>
    </template>
  </c-result>
</template>
```

:::

## API

### Props

| 参数     | 类型                                                                     | 默认值   | 说明           |
| -------- | ------------------------------------------------------------------------ | -------- | -------------- |
| status   | `'success' \| 'error' \| 'info' \| 'warning' \| '404' \| '403' \| '500'` | `'info'` | 状态           |
| title    | string                                                                   | —        | 主标题         |
| subTitle | string                                                                   | —        | 副标题         |
| icon     | string                                                                   | —        | 自定义图标类名 |

### Slots

| 名称    | 说明               |
| ------- | ------------------ |
| icon    | 自定义图标         |
| extra   | 自定义底部按钮区域 |
| default | 副标题下方的内容   |
