# Divider 分隔线

区隔内容的分隔线。

## 何时使用

- 对不同段落的文本进行分隔
- 对行内文字、链接进行分隔，例如表格的操作列
- 配合标题作为章节分割

## 基本使用

最常见的水平分隔线。

:::demo

```vue
<template>
  <p>第一段：我们终将远行，和过去稚嫩的自己告别。</p>
  <c-divider />
  <p>第二段：保持冷静，继续前行。</p>
</template>
```

:::

## 虚线

`border-style="dashed"` 渲染虚线。

:::demo

```vue
<template>
  <p>实线分隔</p>
  <c-divider />
  <p>虚线分隔</p>
  <c-divider border-style="dashed" />
  <p>结束</p>
</template>
```

:::

## 自定义颜色

`color` 改变分隔线颜色。

:::demo

```vue
<template>
  <p>默认</p>
  <c-divider />
  <p>自定义颜色</p>
  <c-divider color="#7693f5" />
</template>
```

:::

## 带文案

把文案放进默认插槽，分隔线会被中断；用 `content-position` 控制文案位置。

:::demo

```vue
<template>
  <c-divider>居中文案</c-divider>
  <c-divider content-position="left">左侧文案</c-divider>
  <c-divider content-position="right">右侧文案</c-divider>
</template>
```

:::

## 自定义文案样式

`content-color` 改文字颜色，`content-background-color` 改文字底色（在彩色背景上常用）。钉死一个固定浅色底时，记得同时钉死文字色，否则深色模式下文字会变白、落在浅底上不可读。

:::demo

```vue
<template>
  <c-divider content-color="#7693f5">蓝色文字</c-divider>
  <c-divider content-color="#874d00" content-background-color="#fff7e6">米色背景</c-divider>
</template>
```

:::

## 垂直分隔线

`direction="vertical"` 用于行内分隔，常见于操作列。

:::demo

```vue
<template>
  <c-button type="text">编辑</c-button>
  <c-divider direction="vertical" />
  <c-button type="text">复制</c-button>
  <c-divider direction="vertical" />
  <c-button type="text" danger>删除</c-button>
</template>
```

:::

## 虚线 + 文案

`border-style="dashed"` 与文案 / `content-position` 可以自由组合，常用于「可选区块分隔」「业务流程节点」。

:::demo

```vue
<template>
  <c-divider border-style="dashed">虚线居中</c-divider>
  <c-divider border-style="dashed" content-position="left">虚线靠左</c-divider>
  <c-divider border-style="dashed" content-position="right" content-color="#1677ff"> 可选区块 → </c-divider>
</template>
```

:::

## 章节标题分隔

把 `<h3>` 与 Divider 搭配使用，是长文档 / 长表单常见的「视觉分章」范式。

:::demo

```vue
<template>
  <h3 style="margin: 16px 0 0">基本信息</h3>
  <c-divider style="margin: 12px 0" />
  <p style="color: var(--ccui-color-text-secondary); margin: 0">姓名 / 头像 / 联系方式</p>

  <h3 style="margin: 24px 0 0">账号设置</h3>
  <c-divider style="margin: 12px 0" />
  <p style="color: var(--ccui-color-text-secondary); margin: 0">密码 / 双因素验证 / 登录历史</p>

  <h3 style="margin: 24px 0 0">通知偏好</h3>
  <c-divider style="margin: 12px 0" />
  <p style="color: var(--ccui-color-text-secondary); margin: 0">邮件 / 短信 / 站内消息</p>
</template>
```

:::

## 线型动态切换

`border-style` 接收响应式值，可以与开关 / 单选联动，便于业务上「打印模式 / 编辑模式」切换。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const styleMode = ref('solid')
</script>

<template>
  <c-segmented v-model="styleMode" :options="['solid', 'dashed']" style="margin-bottom: 12px" />
  <c-divider :border-style="styleMode">当前线型：{{ styleMode }}</c-divider>
</template>
```

:::

## 行内多段分组

垂直 Divider 配合一行多段操作时，可以用多个 `c-divider direction="vertical"` 把按钮分成「编辑组 / 状态组 / 危险操作组」三段。

:::demo

```vue
<template>
  <div style="display: flex; align-items: center; gap: 4px">
    <c-button type="text">复制</c-button>
    <c-button type="text">编辑</c-button>
    <c-divider direction="vertical" />
    <c-button type="text">归档</c-button>
    <c-button type="text">置顶</c-button>
    <c-divider direction="vertical" />
    <c-button type="text" danger>删除</c-button>
  </div>
</template>
```

:::

## API

### Props

| 参数                   | 类型                            | 默认值       | 说明           |
| ---------------------- | ------------------------------- | ------------ | -------------- |
| color                  | string                          | -            | 分隔线颜色     |
| direction              | `'horizontal' \| 'vertical'`    | `horizontal` | 分隔线方向     |
| borderStyle            | `'solid' \| 'dashed'`           | `solid`      | 线型           |
| contentPosition        | `'left' \| 'right' \| 'center'` | `center`     | 文案位置       |
| contentColor           | string                          | -            | 文案文字颜色   |
| contentBackgroundColor | string                          | -            | 文案文字背景色 |
