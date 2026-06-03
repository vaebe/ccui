# FloatButton 悬浮按钮

固定在视图角落的按钮。

## 基本使用

:::demo

```vue
<template>
  <div style="position: relative; height: 200px; background: #f6f8fa">
    <c-float-button :style="{ insetBlockEnd: '16px', insetInlineEnd: '16px', position: 'absolute' }">
      <template #icon>
        <c-icon name="mdi:help-circle-outline" />
      </template>
    </c-float-button>
  </div>
</template>
```

:::

## 主色 + 徽标

:::demo

```vue
<template>
  <div style="position: relative; height: 200px; background: #f6f8fa">
    <c-float-button
      type="primary"
      :badge="5"
      :style="{ insetBlockEnd: '16px', insetInlineEnd: '16px', position: 'absolute' }"
    >
      <template #icon>
        <c-icon name="mdi:bell-outline" />
      </template>
    </c-float-button>
  </div>
</template>
```

:::

## 方形

:::demo

```vue
<template>
  <div style="position: relative; height: 200px; background: #f6f8fa">
    <c-float-button shape="square" :style="{ insetBlockEnd: '16px', insetInlineEnd: '16px', position: 'absolute' }">
      <template #icon>
        <c-icon name="mdi:home-outline" />
      </template>
    </c-float-button>
  </div>
</template>
```

:::

## 图标按钮

通过 `#icon` slot 放入任意图标组件（推荐 `<c-icon>`）；`description` 同时存在时图标在上、文字在下。`icon` prop 仅适用于 iconfont 类名（无内置字体图标时为空，按需使用）。

:::demo

```vue
<template>
  <div style="position: relative; height: 200px; background: #f6f8fa">
    <c-float-button description="帮助" :style="{ insetBlockEnd: '16px', insetInlineEnd: '16px', position: 'absolute' }">
      <template #icon>
        <c-icon name="mdi:help-circle-outline" :size="20" />
      </template>
    </c-float-button>
    <c-float-button
      type="primary"
      description="客服"
      :style="{ insetBlockEnd: '80px', insetInlineEnd: '16px', position: 'absolute' }"
    >
      <template #icon>
        <c-icon name="mdi:message-text-outline" :size="20" />
      </template>
    </c-float-button>
  </div>
</template>
```

:::

## 链接跳转

`href` + `target` 使按钮作为链接使用，例如「联系我们」「打开文档」。

:::demo

```vue
<template>
  <div style="position: relative; height: 200px; background: #f6f8fa">
    <c-float-button
      href="https://github.com/vaebe/ccui"
      target="_blank"
      :style="{ insetBlockEnd: '16px', insetInlineEnd: '16px', position: 'absolute' }"
    >
      <template #icon>
        <c-icon name="mdi:file-document-outline" />
      </template>
    </c-float-button>
  </div>
</template>
```

:::

## 悬浮提示（tooltip）

`tooltip` 鼠标 hover 时显示提示文字。

:::demo

```vue
<template>
  <div style="position: relative; height: 200px; background: #f6f8fa">
    <c-float-button
      type="primary"
      tooltip="点击查看帮助文档"
      :style="{ insetBlockEnd: '16px', insetInlineEnd: '16px', position: 'absolute' }"
    >
      <template #icon>
        <c-icon name="mdi:help-circle-outline" />
      </template>
    </c-float-button>
  </div>
</template>
```

:::

## 多按钮组合

通过 `inset-*` 偏移叠放多个 FloatButton，构成右下角操作组。

:::demo

```vue
<template>
  <div style="position: relative; height: 280px; background: #f6f8fa">
    <c-float-button tooltip="帮助" :style="{ insetBlockEnd: '16px', insetInlineEnd: '16px', position: 'absolute' }">
      <template #icon>
        <c-icon name="mdi:help-circle-outline" />
      </template>
    </c-float-button>
    <c-float-button tooltip="反馈" :style="{ insetBlockEnd: '80px', insetInlineEnd: '16px', position: 'absolute' }">
      <template #icon>
        <c-icon name="mdi:email-outline" />
      </template>
    </c-float-button>
    <c-float-button
      type="primary"
      :badge="3"
      tooltip="新建工单"
      :style="{ insetBlockEnd: '144px', insetInlineEnd: '16px', position: 'absolute' }"
    >
      <template #icon>
        <c-icon name="mdi:plus" />
      </template>
    </c-float-button>
  </div>
</template>
```

:::

## BackTop 回到顶部

> 滚动到 400px 以下后右下角出现「回到顶部」按钮，点击平滑滚回顶端。

:::demo

```vue
<template>
  <c-back-top />
</template>
```

:::

## BackTop 自定义阈值

`visibility-height` 控制按钮出现的滚动阈值（默认 400px），`duration` 控制滚回动画时长（默认 450ms）。

:::demo

```vue
<template>
  <c-back-top :visibility-height="100" :duration="800" />
  <div style="color: #999; font-size: 12px">滚动超过 100px 即出现按钮，动画时长 800ms。</div>
</template>
```

:::

## BackTop 自定义形状 / 类型

`shape` / `type` / `icon` 与 FloatButton 一致，可定制按钮外观。

:::demo

```vue
<template>
  <c-back-top type="primary" shape="square" />
</template>
```

:::

## API

### FloatButton Props

| 参数        | 类型                     | 默认值      | 说明                                                   |
| ----------- | ------------------------ | ----------- | ------------------------------------------------------ |
| shape       | `'circle' \| 'square'`   | `'circle'`  | 形状                                                   |
| type        | `'default' \| 'primary'` | `'default'` | 类型                                                   |
| description | string                   | —           | 内部文字（与 icon 同时存在时在下方）                   |
| icon        | string                   | —           | iconfont CSS 类名；推荐改用 `#icon` slot 放 `<c-icon>` |
| badge       | `number \| string`       | —           | 右上角徽标数                                           |
| href        | string                   | —           | 链接地址                                               |
| target      | string                   | —           | 链接 target（`_blank` 等）                             |
| tooltip     | string                   | —           | 悬浮提示文字                                           |

### FloatButton Slots

| 名称        | 说明                                            |
| ----------- | ----------------------------------------------- |
| icon        | 自定义图标（覆盖 `icon` prop，推荐 `<c-icon>`） |
| description | 自定义文字内容（覆盖 `description` prop）       |

### BackTop Props

| 参数             | 类型                                           | 默认值      | 说明                                                   |
| ---------------- | ---------------------------------------------- | ----------- | ------------------------------------------------------ |
| visibilityHeight | number                                         | `400`       | 滚动条到达多少 px 时显示按钮                           |
| duration         | number                                         | `450`       | 滚回顶部的动画时长（ms）                               |
| target           | `string \| HTMLElement \| (() => HTMLElement)` | `window`    | 监听滚动的目标容器                                     |
| shape            | `'circle' \| 'square'`                         | `'circle'`  | 形状                                                   |
| type             | `'default' \| 'primary'`                       | `'default'` | 类型                                                   |
| icon             | string                                         | —           | iconfont CSS 类名；推荐改用 `#icon` slot 放 `<c-icon>` |
