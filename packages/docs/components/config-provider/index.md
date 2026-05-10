# ConfigProvider 全局配置

为内部所有 ccui 组件提供统一的全局配置：尺寸、方向、品牌色、语言、类名前缀。

## 何时使用

- 应用根部统一覆盖：默认尺寸、文字方向、品牌色 token。
- 多语言场景下注入语言包。
- 与外部库共存时需要换 `prefixCls` 避免类名冲突。

## 自定义品牌色

`theme.token` 接收 camelCase 形式的 token（如 `colorPrimary`），ConfigProvider 会把它映射为对应 CSS 变量并下传到子组件。

:::demo

```vue
<template>
  <c-config-provider :theme="{ token: { colorPrimary: '#52c41a' } }">
    <c-button type="primary">绿色主题主按钮</c-button>
  </c-config-provider>
</template>
```

:::

## 同时调多个 token

`colorPrimary` / `borderRadius` / `colorError` 等都可以一起传。

:::demo

```vue
<template>
  <c-config-provider
    :theme="{
      token: {
        colorPrimary: '#722ed1',
        borderRadius: 16,
        colorError: '#ff7875',
      },
    }"
  >
    <c-button type="primary">紫色 + 大圆角</c-button>
    <c-button type="danger" style="margin-inline-start: 8px">浅红 danger</c-button>
  </c-config-provider>
</template>
```

:::

## 全局组件尺寸

`component-size` 让作用域内的 `c-button` / `c-input` 等组件默认走对应尺寸（仍可被组件自身的 `size` 覆盖）。

:::demo

```vue
<template>
  <c-config-provider component-size="small">
    <c-button>小尺寸默认</c-button>
    <c-button type="primary" style="margin-inline-start: 8px">小尺寸 primary</c-button>
  </c-config-provider>
  <div style="margin-top: 12px">
    <c-config-provider component-size="large">
      <c-button>大尺寸默认</c-button>
      <c-button type="primary" style="margin-inline-start: 8px">大尺寸 primary</c-button>
    </c-config-provider>
  </div>
</template>
```

:::

## 文字方向

`direction="rtl"` 让内部组件在阿拉伯语 / 希伯来语等场景下从右向左排布。

:::demo

```vue
<template>
  <c-config-provider direction="rtl">
    <c-button>زر</c-button>
    <c-button type="primary" style="margin-inline-start: 8px">زر رئيسي</c-button>
  </c-config-provider>
</template>
```

:::

## 多个 ConfigProvider 嵌套

后代的 ConfigProvider 会覆盖外层配置；这样可以在页面局部使用不同主题。

:::demo

```vue
<template>
  <c-config-provider :theme="{ token: { colorPrimary: '#1677ff' } }">
    <c-button type="primary">外层蓝</c-button>
    <c-config-provider :theme="{ token: { colorPrimary: '#fa541c' } }">
      <c-button type="primary" style="margin-inline-start: 8px">局部橙</c-button>
    </c-config-provider>
    <c-button type="primary" style="margin-inline-start: 8px">外层蓝</c-button>
  </c-config-provider>
</template>
```

:::

## 在组件内读取配置

业务组件用组合 API `useConfig` 读当前生效的配置。

```ts
import { useConfig } from 'vue3-ccui'

const cfg = useConfig()
// cfg.componentSize / cfg.direction / cfg.locale / cfg.theme / cfg.prefixCls
```

## API

### Props

| 参数          | 类型                                 | 默认值        | 说明                                                                                                              |
| ------------- | ------------------------------------ | ------------- | ----------------------------------------------------------------------------------------------------------------- |
| prefixCls     | string                               | `'ccui'`      | 类名前缀                                                                                                          |
| componentSize | `'small' \| 'middle' \| 'large'`     | `'middle'`    | 默认组件尺寸                                                                                                      |
| direction     | `'ltr' \| 'rtl'`                     | `'ltr'`       | 文字方向                                                                                                          |
| locale        | `Locale`                             | —             | 语言包                                                                                                            |
| theme         | `{ token, algorithm, cssVar }`       | —             | 主题配置：`token` 用 camelCase（colorPrimary / borderRadius 等），自动映射为 CSS 变量并下传                       |
| iconPrefixCls | string                               | `'ccui-icon'` | 图标类名前缀                                                                                                      |

### useConfig

返回当前生效的 `ConfigContext`：`{ prefixCls, componentSize, direction, locale, theme, iconPrefixCls }`。
