# QRCode 二维码

将文本或链接编码成可被扫码识别的二维码。基于 `qrcode-generator` 自渲 SVG，零 canvas 依赖；支持自定义颜色、容错率、中心 logo、`active` / `loading` / `expired` / `scanned` 四种状态。

## 基本用法

把 URL 直接传给 `value` 即可生成二维码。

:::demo

```vue
<template>
  <c-qr-code value="https://github.com/vaebe/ccui" />
</template>
```

:::

## 自定义颜色与边长

`size` 控制整体边长（含 padding），`color` 与 `bg-color` 调整深色模块和底色。

:::demo

```vue
<template>
  <c-qr-code value="https://example.com" :size="200" color="#1677ff" bg-color="#f5f5f5" />
</template>
```

:::

## 容错率

`error-level` 决定纠错码字占比，越高对污损/遮挡越鲁棒，但会让二维码模块更密。

- `L` 7%
- `M` 15%（默认）
- `Q` 25%
- `H` 30%

:::demo

```vue
<template>
  <c-qr-code value="https://example.com" error-level="L" />
  <c-qr-code value="https://example.com" error-level="H" />
</template>
```

:::

## 嵌入 logo

`icon` 在中心叠一张图片，`icon-size` 控制 logo 边长。`icon-size` 自动被截到整体边长的 30% 以内，避免覆盖到关键定位图形。叠 logo 时建议把 `error-level` 设为 `H`。

:::demo

```vue
<template>
  <c-qr-code
    value="https://github.com/vaebe/ccui"
    :size="200"
    :icon-size="48"
    icon="https://avatars.githubusercontent.com/u/24416222"
    error-level="H"
  />
</template>
```

:::

## 状态

`status` 切换状态遮罩：

- `active`（默认）：正常显示
- `loading`：spinner 转圈
- `expired`：「已过期」文案 + 「点击刷新」按钮（点击触发 `refresh` 事件）
- `scanned`：「已扫描」文案

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const status = ref<'active' | 'loading' | 'expired' | 'scanned'>('expired')

function onRefresh() {
  status.value = 'loading'
  setTimeout(() => (status.value = 'active'), 800)
}
</script>

<template>
  <c-qr-code value="https://example.com" :status="status" @refresh="onRefresh" />
  <div style="margin-top: 12px; display: flex; gap: 8px">
    <c-button @click="status = 'active'">active</c-button>
    <c-button @click="status = 'loading'">loading</c-button>
    <c-button @click="status = 'expired'">expired</c-button>
    <c-button @click="status = 'scanned'">scanned</c-button>
  </div>
</template>
```

:::

## 自定义状态遮罩

提供 `status-render` 插槽自渲遮罩内容，回调参数 `{ status }`。

:::demo

```vue
<template>
  <c-qr-code value="https://example.com" status="loading">
    <template #statusRender="{ status }">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 6px">
        <c-spin />
        <span style="font-size: 12px; color: rgba(0, 0, 0, 0.55)">{{ status }}</span>
      </div>
    </template>
  </c-qr-code>
</template>
```

:::

## 圆角点阵

`dot-radius` 控制每个模块的圆角半径，取值 0（方形）到 0.5（正圆）。

:::demo

```vue
<template>
  <div style="display: flex; gap: 16px">
    <c-qr-code value="https://example.com" :dot-radius="0" />
    <c-qr-code value="https://example.com" :dot-radius="0.25" />
    <c-qr-code value="https://example.com" :dot-radius="0.5" />
  </div>
</template>
```

:::

## 渐变前景

`gradient` 设置渐变前景色，支持 `from` / `to` / `direction`（`to right` / `to bottom` / `to bottom right` 等）。

:::demo

```vue
<template>
  <div style="display: flex; gap: 16px">
    <c-qr-code
      value="https://example.com"
      :gradient="{ from: '#1677ff', to: '#69c0ff', direction: 'to bottom right' }"
    />
    <c-qr-code value="https://example.com" :dot-radius="0.5" :gradient="{ from: '#ff4d4f', to: '#ffa940' }" />
  </div>
</template>
```

:::

## 无边框

`bordered=false` 去掉外侧灰边和圆角，纯净嵌入到深色容器或卡片底纹。

:::demo

```vue
<template>
  <c-qr-code value="https://example.com" :bordered="false" :size="180" />
</template>
```

:::

## API

### Props

| 参数        | 类型                                               | 默认值     | 说明                                         |
| ----------- | -------------------------------------------------- | ---------- | -------------------------------------------- |
| value       | string                                             | --（必传） | 编码内容（文本 / URL）                       |
| size        | number                                             | `160`      | 整体边长（px）                               |
| color       | string                                             | `#000000`  | 前景色（深色模块）                           |
| bgColor     | string                                             | `#FFFFFF`  | 背景色                                       |
| errorLevel  | `'L' \| 'M' \| 'Q' \| 'H'`                         | `'M'`      | 容错率档位                                   |
| bordered    | boolean                                            | `true`     | 是否显示外边框                               |
| icon        | string                                             | --         | 中心 logo 图片地址                           |
| iconSize    | number                                             | `40`       | logo 边长（px），自动截到整体边长的 30% 以内 |
| status      | `'active' \| 'expired' \| 'loading' \| 'scanned'`  | `'active'` | 状态                                         |
| refreshText | string                                             | `点击刷新` | `expired` 状态下刷新按钮文案                 |
| dotRadius   | number                                             | `0`        | 模块圆角半径（0=方形，0.5=正圆）             |
| gradient    | `{ from: string, to: string, direction?: string }` | --         | 渐变前景色；设置后 `color` 作为 fallback     |

### Events

| 事件名  | 回调签名     | 触发时机                                |
| ------- | ------------ | --------------------------------------- |
| refresh | `() => void` | `status='expired'` 状态下点击刷新按钮时 |

### Slots

| 名称         | 参数                 | 说明                                                                        |
| ------------ | -------------------- | --------------------------------------------------------------------------- |
| statusRender | `{ status: string }` | 自定义状态遮罩内容；提供后默认遮罩内容（spinner / 文字 / 刷新按钮）不再渲染 |

### Exposed methods

| 方法      | 签名                                                   | 说明                               |
| --------- | ------------------------------------------------------ | ---------------------------------- |
| toDataURL | `(type?: string, quality?: number) => Promise<string>` | 将 SVG 通过 canvas 转换为 data URL |

## 已知限制（未交付）

- **超长 value**：`qrcode-generator` 在 typeNumber=0（自动）模式下最多支持 version 40。超过后组件会回退到空 SVG（`viewBox="0 0 1 1"`），不会抛错；调用方需要自行做长度校验或预先短链。
- **logo 自动外圈**：当前 logo 用 2px 白色 padding 简单勾边；Ant Design 的「白底 + 圆角 + 阴影」精修样式留后续。
