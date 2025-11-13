# Timeline 时间线

可视化地呈现时间流信息。

### 何时使用

- 当有一系列信息需按时间排列时
- 需要有一条时间轴进行视觉上的串联时

### 基本用法

Timeline 可拆分成多个按照时间戳排列的活动，时间戳是其区分于其他控件的重要特征。

:::demo

```vue
<template>
  <c-timeline>
    <c-timeline-item timestamp="2018/4/12">
      <p>更新 Github 模板</p>
    </c-timeline-item>
    <c-timeline-item timestamp="2018/4/3">
      <p>更新 Github 模板</p>
    </c-timeline-item>
    <c-timeline-item timestamp="2018/4/2">
      <p>更新 Github 模板</p>
    </c-timeline-item>
  </c-timeline>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>
```

:::

### 自定义节点样式

可根据实际场景自定义节点尺寸、颜色，或直接使用图标。

:::demo

```vue
<template>
  <c-timeline>
    <c-timeline-item timestamp="2018/4/12" type="primary">
      <p>支持使用图标</p>
    </c-timeline-item>
    <c-timeline-item timestamp="2018/4/3" color="#0bbd87">
      <p>支持自定义颜色</p>
    </c-timeline-item>
    <c-timeline-item timestamp="2018/4/2" size="large">
      <p>支持自定义尺寸</p>
    </c-timeline-item>
    <c-timeline-item timestamp="2018/4/1" type="warning" hollow>
      <p>支持空心点</p>
    </c-timeline-item>
  </c-timeline>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>
```

:::

### 自定义时间戳

当内容在垂直方向上过高时，可将时间戳置于内容之上。

:::demo

```vue
<template>
  <c-timeline>
    <c-timeline-item timestamp="2018/4/12" placement="top">
      <div>
        <h4>更新 Github 模板</h4>
        <p>Tom 在 2018/4/12 20:46 提交了更新</p>
      </div>
    </c-timeline-item>
    <c-timeline-item timestamp="2018/4/3" placement="top">
      <div>
        <h4>更新 Github 模板</h4>
        <p>Tom 在 2018/4/3 20:46 提交了更新</p>
      </div>
    </c-timeline-item>
    <c-timeline-item timestamp="2018/4/2" placement="top">
      <div>
        <h4>更新 Github 模板</h4>
        <p>Tom 在 2018/4/2 20:46 提交了更新</p>
      </div>
    </c-timeline-item>
  </c-timeline>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>
```

:::

### 垂直居中

垂直居中样式的 Timeline-Item。

:::demo

```vue
<template>
  <c-timeline>
    <c-timeline-item timestamp="2018/4/12" center>
      <div>
        <h4>更新 Github 模板</h4>
        <p>Tom 在 2018/4/12 20:46 提交了更新</p>
      </div>
    </c-timeline-item>
    <c-timeline-item timestamp="2018/4/3" center>
      <div>
        <h4>更新 Github 模板</h4>
        <p>Tom 在 2018/4/3 20:46 提交了更新</p>
      </div>
    </c-timeline-item>
  </c-timeline>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>
```

:::

## Timeline API

### Timeline 插槽

| 插槽名 | 说明 | 子标签 |
| ---- | ---- | ---- |
| default | timeline 组件的自定义默认内容 | Timeline-Item |

## Timeline-Item API

### Timeline-Item 属性

| 参数 | 类型 | 默认值 | 说明 |
| ---- | ---- | ---- | ---- |
| timestamp | string | '' | 时间戳 |
| hide-timestamp | boolean | false | 是否隐藏时间戳 |
| center | boolean | false | 是否垂直居中 |
| placement | 'top' \| 'bottom' | 'bottom' | 时间戳位置 |
| type | 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| '' | '' | 节点类型 |
| color | string | '' | 节点颜色 |
| size | 'normal' \| 'large' | 'normal' | 节点尺寸 |
| icon | string \| Component | — | 自定义图标 |
| hollow | boolean | false | 是否空心点 |

### Timeline-Item 插槽

| 插槽名 | 说明 |
| ---- | ---- |
| default | 自定义内容 |
| dot | 自定义节点 |

