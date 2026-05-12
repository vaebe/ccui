# Empty 空状态

数据缺失或还没创建时的占位提示。

## 何时使用

- 列表 / 表格当前没有任何数据。
- 详情页对应资源未创建（"创建第一个项目"）。
- 搜索、筛选后无结果。

## 基本使用

完全无参时显示默认插画 + 中文 "暂无数据"。

:::demo

```vue
<template>
  <c-empty />
</template>
```

:::

## 自定义文案

通过 `description` 改文案，让空态更贴合业务语义。

:::demo

```vue
<template>
  <c-empty description="还没有任何订单" />
  <c-empty description="未匹配到搜索结果" style="margin-top: 16px" />
</template>
```

:::

## 配合操作按钮

默认插槽放在描述下方，常用于"立即创建 / 重新搜索"等引导操作。

:::demo

```vue
<template>
  <c-empty description="还没有创建任何应用">
    <c-button type="primary">+ 立即创建</c-button>
  </c-empty>
</template>
```

:::

## 使用图片 URL

`image` 接受图片地址，替换默认插画。

:::demo

```vue
<template>
  <c-empty description="搜索没有命中任何条目" image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" />
</template>
```

:::

## 调整图片尺寸

`image-style` 接受任意 CSSProperties 对象，常用来缩放或限高。

:::demo

```vue
<template>
  <c-empty description="迷你空态" :image-style="{ height: '32px' }" />
  <c-empty description="大插图空态" :image-style="{ height: '120px' }" style="margin-top: 16px" />
</template>
```

:::

## 自定义插画

`#image` slot 可塞入任意 VNode（SVG / 图标组件）实现完全自定义。

:::demo

```vue
<template>
  <c-empty description="自定义插图">
    <template #image>
      <div
        style="
          width: 80px;
          height: 80px;
          margin: 0 auto;
          border-radius: 50%;
          background: linear-gradient(135deg, #1677ff 0%, #69b1ff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 32px;
        "
      >
        ?
      </div>
    </template>
    <c-button type="primary">了解更多</c-button>
  </c-empty>
</template>
```

:::

## API

### Props

| 参数        | 类型            | 默认值       | 说明           |
| ----------- | --------------- | ------------ | -------------- |
| description | string          | `'暂无数据'` | 描述文案       |
| image       | string          | `''`         | 自定义图片 URL |
| imageStyle  | `CSSProperties` | `{}`         | 图片元素样式   |

### Slots

| 名称        | 说明                                  |
| ----------- | ------------------------------------- |
| default     | 描述下方的额外内容                    |
| description | 自定义描述（覆盖 `description` 属性） |
| image       | 自定义插画                            |
