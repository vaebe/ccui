# ConfigProvider 全局配置

为内部所有组件提供统一的全局配置。

## 何时使用

- 全局切换组件尺寸、语言、方向、主题 Token。

## 基本使用

:::demo

```vue
<template>
  <c-config-provider :theme="{ token: { colorPrimary: '#52c41a' } }">
    <c-button type="primary"> 绿色主题主按钮 </c-button>
  </c-config-provider>
</template>
```

:::

## 全局尺寸

:::demo

```vue
<template>
  <c-config-provider component-size="small">
    <c-button>小尺寸</c-button>
  </c-config-provider>
</template>
```

:::

## ConfigProvider 参数

| 参数          | 类型                           | 默认值      | 说明         |
| ------------- | ------------------------------ | ----------- | ------------ |
| prefixCls     | string                         | 'ccui'      | 类名前缀     |
| componentSize | `'small' / 'middle' / 'large'` | 'middle'    | 默认组件尺寸 |
| locale        | object                         | --          | 语言包       |
| direction     | `'ltr' / 'rtl'`                | 'ltr'       | 文字方向     |
| theme         | `{ token, algorithm, cssVar }` | --          | 主题配置     |
| iconPrefixCls | string                         | 'ccui-icon' | 图标前缀     |

## useConfig

子组件可通过组合 API 获取当前配置：

```ts
import { useConfig } from 'vue3-ccui'

const cfg = useConfig()
console.log(cfg.componentSize, cfg.direction)
```
