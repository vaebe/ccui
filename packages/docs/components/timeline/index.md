# Timeline 时间线

可视化地呈现时间流信息。

## 何时使用

- 当有一系列信息需按时间排列时
- 需要有一条时间轴进行视觉上的串联时

## 基本用法

Timeline 可拆分成多个按照时间戳排列的活动，时间戳是其区分于其他控件的重要特征。

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>

<template>
  <div class="demo-timeline-basic">
    <c-timeline>
      <c-timeline-item timestamp="2025/09/09">
        <p>更新 Github 模板</p>
      </c-timeline-item>
      <c-timeline-item timestamp="2025/09/08">
        <p>更新 Github 模板</p>
      </c-timeline-item>
      <c-timeline-item timestamp="2025/09/07">
        <p>更新 Github 模板</p>
      </c-timeline-item>
    </c-timeline>
  </div>
</template>

<style>
</style>
```

:::

## 自定义节点样式

可根据实际场景自定义节点尺寸、颜色，或直接使用图标。

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>

<template>
  <div class="demo-timeline-node">
    <c-timeline>
      <c-timeline-item timestamp="2025/09/09" type="primary">
        <p>支持使用图标</p>
      </c-timeline-item>
      <c-timeline-item timestamp="2025/09/08" color="#0bbd87">
        <p>支持自定义颜色</p>
      </c-timeline-item>
      <c-timeline-item timestamp="2025/09/07" size="large">
        <p>支持自定义尺寸</p>
      </c-timeline-item>
      <c-timeline-item timestamp="2025/09/06" type="warning" hollow>
        <p>支持空心点</p>
      </c-timeline-item>
    </c-timeline>
  </div>
</template>

<style>
</style>
```

:::

## 自定义时间戳

当内容在垂直方向上过高时，可将时间戳置于内容之上。

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>

<template>
  <div class="demo-timeline-timestamp">
    <c-timeline>
      <c-timeline-item timestamp="2025/09/09" placement="top">
        <div>
          <h4>更新 Github 模板</h4>
          <p>Tom 在 2025/09/09 20:46 提交了更新</p>
        </div>
      </c-timeline-item>
      <c-timeline-item timestamp="2025/09/08" placement="top">
        <div>
          <h4>更新 Github 模板</h4>
          <p>Tom 在 2025/09/08 20:46 提交了更新</p>
        </div>
      </c-timeline-item>
      <c-timeline-item timestamp="2025/09/07" placement="top">
        <div>
          <h4>更新 Github 模板</h4>
          <p>Tom 在 2025/09/07 20:46 提交了更新</p>
        </div>
      </c-timeline-item>
    </c-timeline>
  </div>
</template>

<style>
</style>
```

:::

## 垂直居中

垂直居中样式的 Timeline-Item。

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>

<template>
  <div class="demo-timeline-center">
    <c-timeline>
      <c-timeline-item timestamp="2025/09/09" center>
        <div>
          <h4>更新 Github 模板</h4>
          <p>Tom 在 2025/09/09 20:46 提交了更新</p>
        </div>
      </c-timeline-item>
      <c-timeline-item timestamp="2025/09/08" center>
        <div>
          <h4>更新 Github 模板</h4>
          <p>Tom 在 2025/09/08 20:46 提交了更新</p>
        </div>
      </c-timeline-item>
    </c-timeline>
  </div>
</template>

<style>
</style>
```

:::

## 自定义节点

可以通过插槽自定义节点。

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>

<template>
  <div class="demo-timeline-dot">
    <c-timeline>
      <c-timeline-item timestamp="2025/09/09">
        <template #dot>
          <div style="width: 16px; height: 16px; background: #409eff; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 10px;">✓</span>
          </div>
        </template>
        <p>自定义节点内容</p>
      </c-timeline-item>
      <c-timeline-item timestamp="2025/09/08" type="success">
        <p>普通节点</p>
      </c-timeline-item>
    </c-timeline>
  </div>
</template>

<style>
</style>
```

:::

## API

### Timeline Slots

| 插槽名 | 说明 | 子标签 |
| ---- | ---- | ---- |
| default | timeline 组件的自定义默认内容 | Timeline-Item |

### Timeline-Item Props

| 参数 | 说明      | 类型 | 可选值 | 默认值 |
| ---- | -------- | ---- | ---- | ---- |
| timestamp | 时间戳 | string | — | '' |
| hide-timestamp | 是否隐藏时间戳 | boolean | — | false |
| center | 是否垂直居中 | boolean | — | false |
| placement | 时间戳位置 | string | top/bottom | bottom |
| type | 节点类型 | string | [TimelineItemType](#timelineitemtype)  | — |
| color | 节点颜色 | string | — | — |
| size | 节点尺寸 | string | normal/large | normal |
| icon | 自定义图标 | string/Component | — | — |
| hollow | 是否空心点 | boolean | — | false |

### Timeline-Item Events

| 事件名 | 说明 | 回调参数 |
| ---- | ---- | ---- |
| — | — | — |

### Timeline-Item Slots

| 插槽名 | 说明 |
| ---- | ---- |
| default | 自定义内容 |
| dot | 自定义节点 |

## Timeline类型定义

### TimelineItemType

```ts
export type TimelineItemType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | ''
```
