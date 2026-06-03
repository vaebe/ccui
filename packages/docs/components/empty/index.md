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
  <c-empty description="搜索没有命中任何条目" image="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI0MSIgdmlld0JveD0iMCAwIDY0IDQxIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwwLDAsMC4yNSkiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNOCAxNiBMMjAgMTYgTDI0IDIyIEw0MCAyMiBMNDQgMTYgTDU2IDE2IEw1MiAzNCBMMTIgMzQgWiIgZmlsbD0icmdiYSgwLDAsMCwwLjA0KSIvPjxwYXRoIGQ9Ik04IDE2IEwxNCA2IEw1MCA2IEw1NiAxNiIvPjwvZz48ZWxsaXBzZSBjeD0iMzIiIGN5PSIzOCIgcng9IjIyIiByeT0iMi41IiBmaWxsPSJyZ2JhKDAsMCwwLDAuMDYpIi8+PC9zdmc+" />
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

## 列表卡片内嵌

把 Empty 直接塞进 Card / 自定义边框容器里，配「立即创建」按钮做引导转化。

:::demo

```vue
<template>
  <div style="border: 1px solid #f0f0f0; border-radius: 6px; padding: 24px 16px; background: #fff">
    <c-empty description="该项目还没有任何成员" :image-style="{ height: '56px' }">
      <c-button type="primary">+ 邀请成员</c-button>
    </c-empty>
  </div>
</template>
```

:::

## 搜索无结果

搜索 / 筛选场景下空态附带「清除筛选」按钮，是一键重置的常用范式。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const keyword = ref('asdfqwer')
const results = ref([])
function reset() {
  keyword.value = ''
}
</script>

<template>
  <c-input v-model="keyword" placeholder="试着搜点什么" style="margin-bottom: 12px" />
  <c-empty v-if="results.length === 0" description="未匹配到任何结果" :image-style="{ height: '48px' }">
    <c-button @click="reset">清除筛选条件</c-button>
  </c-empty>
</template>
```

:::

## 复杂描述（description slot）

需要在描述里放链接 / 多行 / 富文本时改用 `#description` slot，`description` prop 主要面向单行短文案。

:::demo

```vue
<template>
  <c-empty>
    <template #description>
      <div style="color: rgba(0, 0, 0, 0.65); line-height: 1.6">
        当前账户尚未开通任何应用 <br />
        <a href="#" style="color: #1677ff">查看接入指引 <c-icon name="mdi:arrow-right" /></a>
      </div>
    </template>
    <c-button type="primary">立即开通</c-button>
  </c-empty>
</template>
```

:::

## 三种尺寸

`imageStyle.height` 控制插图尺寸：32 适合表格内嵌、80 默认、120 用于专门的空页面。

:::demo

```vue
<template>
  <div style="display: flex; gap: 24px; align-items: flex-end; flex-wrap: wrap">
    <div>
      <p style="color: #666; margin: 0 0 8px">迷你（嵌入式）</p>
      <c-empty description="无数据" :image-style="{ height: '32px' }" />
    </div>
    <div>
      <p style="color: #666; margin: 0 0 8px">默认</p>
      <c-empty description="暂无数据" />
    </div>
    <div>
      <p style="color: #666; margin: 0 0 8px">大插图（专题页）</p>
      <c-empty description="还没有任何项目" :image-style="{ height: '120px' }" />
    </div>
  </div>
</template>
```

:::

## Tabs 内嵌空态

不同 tab 下视为独立空状态：选中后展示对应文案，方便业务定位「具体哪个维度没数据」。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const active = ref('订单')
</script>

<template>
  <c-segmented v-model="active" :options="['订单', '退款', '评价']" style="margin-bottom: 16px" />
  <c-empty :description="`暂无任何${active}记录`" :image-style="{ height: '48px' }" />
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
