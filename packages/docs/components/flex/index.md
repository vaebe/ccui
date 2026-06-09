# Flex 弹性布局

封装 CSS flexbox 的常用属性，配合主题间距 token 让"行内 / 垂直 / 两端对齐"等场景更直白。

## 何时使用

- 行内或垂直排列一组组件，间距用 token 控制。
- 两端对齐：左侧标题 + 右侧操作按钮。
- 子元素需要 `flex-grow` 自动撑开剩余空间。

## 基本使用

默认水平方向，`gap` 决定间距（数字按 px，也可用 `small` / `middle` / `large`）。

:::demo

```vue
<template>
  <c-flex :gap="12">
    <c-button>Button 1</c-button>
    <c-button>Button 2</c-button>
    <c-button>Button 3</c-button>
  </c-flex>
</template>
```

:::

## 间距预设

`gap` 接收 `'small'` / `'middle'` / `'large'`，分别对应 8 / 16 / 24px。

:::demo

```vue
<template>
  <p style="color: var(--ccui-color-text-secondary); margin: 0 0 4px">small</p>
  <c-flex gap="small"><c-tag>tag</c-tag><c-tag>tag</c-tag><c-tag>tag</c-tag></c-flex>

  <p style="color: var(--ccui-color-text-secondary); margin: 12px 0 4px">middle</p>
  <c-flex gap="middle"><c-tag>tag</c-tag><c-tag>tag</c-tag><c-tag>tag</c-tag></c-flex>

  <p style="color: var(--ccui-color-text-secondary); margin: 12px 0 4px">large</p>
  <c-flex gap="large"><c-tag>tag</c-tag><c-tag>tag</c-tag><c-tag>tag</c-tag></c-flex>
</template>
```

:::

## 垂直布局

`vertical` 把方向切到列。

:::demo

```vue
<template>
  <c-flex vertical :gap="8" style="width: 200px">
    <c-button>Button 1</c-button>
    <c-button>Button 2</c-button>
    <c-button>Button 3</c-button>
  </c-flex>
</template>
```

:::

## 对齐方式

`justify` 对应 `justify-content`，`align` 对应 `align-items`。

:::demo

```vue
<template>
  <p style="color: var(--ccui-color-text-secondary); margin: 0 0 4px">justify="space-between"（两端对齐）</p>
  <c-flex justify="space-between" align="center" style="background: var(--ccui-area); padding: 8px; border-radius: 6px">
    <c-tag>左</c-tag>
    <c-button>右</c-button>
  </c-flex>

  <p style="color: var(--ccui-color-text-secondary); margin: 12px 0 4px">justify="space-evenly"（等距）</p>
  <c-flex justify="space-evenly" align="center" style="background: var(--ccui-area); padding: 8px; border-radius: 6px">
    <c-tag>1</c-tag>
    <c-tag>2</c-tag>
    <c-tag>3</c-tag>
  </c-flex>

  <p style="color: var(--ccui-color-text-secondary); margin: 12px 0 4px">justify="center"（居中）</p>
  <c-flex justify="center" align="center" gap="small" style="background: var(--ccui-area); padding: 8px; border-radius: 6px">
    <c-tag>居中</c-tag>
    <c-button type="primary">操作</c-button>
  </c-flex>
</template>
```

:::

## 自动换行

`wrap` 设为 `true`（或具体的 `wrap` / `wrap-reverse` / `nowrap`）控制超出容器时是否换行。

:::demo

```vue
<template>
  <c-flex wrap gap="small" style="background: var(--ccui-area); padding: 8px; border-radius: 6px">
    <c-tag v-for="i in 12" :key="i">Tag {{ i }}</c-tag>
  </c-flex>
</template>
```

:::

## 用 `flex` 简写撑满剩余空间

子组件包一层 `<c-flex>` 并设置 `flex="1"` 可以让它独占剩余空间。

:::demo

```vue
<template>
  <c-flex gap="middle" style="background: var(--ccui-area); padding: 8px; border-radius: 6px">
    <c-button>固定</c-button>
    <c-flex flex="1" justify="center" align="center" style="background: var(--ccui-color-bg-container); border-radius: 4px; padding: 8px">
      撑开剩余空间
    </c-flex>
    <c-button type="primary">固定</c-button>
  </c-flex>
</template>
```

:::

## 自定义元素

`component` 改变渲染的标签，常用于语义化（`section` / `nav` / `header` 等）。

:::demo

```vue
<template>
  <c-flex component="nav" gap="middle" style="background: var(--ccui-area); padding: 12px; border-radius: 6px">
    <a href="#" style="color: inherit">首页</a>
    <a href="#" style="color: inherit">文档</a>
    <a href="#" style="color: inherit">关于</a>
  </c-flex>
</template>
```

:::

## `justify` 全枚举

横轴对齐六种取值的视觉对照。

:::demo

```vue
<script setup>
const justifies = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly']
</script>

<template>
  <c-flex vertical :gap="12">
    <div v-for="j in justifies" :key="j">
      <p style="color: var(--ccui-color-text-secondary); margin: 0 0 4px">justify="{{ j }}"</p>
      <c-flex
        :justify="j"
        align="center"
        style="background: var(--ccui-area); padding: 8px; border-radius: 6px; min-height: 40px"
      >
        <c-tag>A</c-tag>
        <c-tag>B</c-tag>
        <c-tag>C</c-tag>
      </c-flex>
    </div>
  </c-flex>
</template>
```

:::

## `align` 全枚举

纵轴对齐五种取值的视觉对照（容器有显式高度时差异最明显）。

:::demo

```vue
<script setup>
const aligns = ['flex-start', 'center', 'flex-end', 'baseline', 'stretch']
</script>

<template>
  <c-flex vertical :gap="12">
    <div v-for="a in aligns" :key="a">
      <p style="color: var(--ccui-color-text-secondary); margin: 0 0 4px">align="{{ a }}"</p>
      <c-flex :align="a" gap="small" style="background: var(--ccui-area); padding: 8px; border-radius: 6px; height: 80px">
        <c-tag style="font-size: 12px">12px</c-tag>
        <c-tag style="font-size: 20px">20px</c-tag>
        <c-tag style="font-size: 14px">14px</c-tag>
      </c-flex>
    </div>
  </c-flex>
</template>
```

:::

## 反向换行

`wrap="wrap-reverse"` 让超出的子项在前一行的上方折回。

:::demo

```vue
<template>
  <c-flex wrap="wrap-reverse" gap="small" style="background: var(--ccui-area); padding: 8px; border-radius: 6px">
    <c-tag v-for="i in 10" :key="i">Tag {{ i }}</c-tag>
  </c-flex>
</template>
```

:::

## 嵌套布局：页面骨架

`vertical` + 子级 `<c-flex>` 组合可以快速搭出「页头 / 主体（侧栏 + 内容）/ 页脚」三段式骨架。

:::demo

```vue
<template>
  <c-flex vertical style="background: var(--ccui-area); border-radius: 6px; height: 240px; overflow: hidden">
    <c-flex
      justify="space-between"
      align="center"
      style="padding: 12px 16px; background: var(--ccui-color-bg-container); border-bottom: 1px solid var(--ccui-color-border-secondary)"
    >
      <strong>页头</strong>
      <c-button size="small">登出</c-button>
    </c-flex>
    <c-flex flex="1" style="overflow: hidden">
      <c-flex
        vertical
        gap="small"
        style="width: 120px; padding: 12px; background: var(--ccui-area); border-right: 1px solid var(--ccui-color-border-secondary)"
      >
        <c-tag>菜单 1</c-tag>
        <c-tag>菜单 2</c-tag>
        <c-tag>菜单 3</c-tag>
      </c-flex>
      <c-flex flex="1" justify="center" align="center" style="padding: 16px; background: var(--ccui-color-bg-container)">
        <span style="color: var(--ccui-color-text-tertiary)">主内容区</span>
      </c-flex>
    </c-flex>
    <c-flex
      justify="center"
      align="center"
      style="padding: 8px; background: var(--ccui-color-bg-container); border-top: 1px solid var(--ccui-color-border-secondary); color: var(--ccui-color-text-tertiary); font-size: 12px"
    >
      © 2026 ccui
    </c-flex>
  </c-flex>
</template>
```

:::

## 业务工具栏（与 Space 区别）

`<c-flex justify="space-between">` 适合「左标题 / 右操作」两端分布；`<c-space>` 更适合一组按钮挨在一起的等距间隔。两者可以套用：外 Flex 分两端，内 Space 排操作组。

:::demo

```vue
<template>
  <c-flex
    justify="space-between"
    align="center"
    style="background: var(--ccui-color-bg-container); border: 1px solid var(--ccui-color-border-secondary); padding: 12px 16px; border-radius: 6px"
  >
    <strong>订单列表</strong>
    <c-space>
      <c-button size="small">导出</c-button>
      <c-button size="small">筛选</c-button>
      <c-button size="small" type="primary">新建</c-button>
    </c-space>
  </c-flex>
</template>
```

:::

## API

### Props

| 参数      | 类型                                              | 默认值     | 说明                                      |
| --------- | ------------------------------------------------- | ---------- | ----------------------------------------- |
| vertical  | boolean                                           | `false`    | 垂直方向                                  |
| wrap      | `boolean \| 'wrap' \| 'nowrap' \| 'wrap-reverse'` | `false`    | 是否换行                                  |
| justify   | `CSSProperties['justifyContent']`                 | `'normal'` | 对应 `justify-content`                    |
| align     | `CSSProperties['alignItems']`                     | `'normal'` | 对应 `align-items`                        |
| flex      | string                                            | `'normal'` | flex 简写（如 `'1'`, `'0 0 auto'`）       |
| gap       | `string \| number`                                | —          | 间距：`small` / `middle` / `large` 或数字 |
| component | string                                            | `'div'`    | 渲染的标签                                |
