# Popover 弹出框

用于在不打断用户流程的情况下展示补充信息和操作内容，支持标题、富文本内容、不同触发方式与位置控制。

## 何时使用

- 需要在不打断用户流程的情况下展示补充信息和操作内容
- 支持标题、富文本内容、不同触发方式与位置控制
- 需要展示比 Tooltip 更复杂的内容和操作

## 基本用法

最简单的用法，点击触发显示弹出框。

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
  <div class="demo-popover-basic">
    <c-popover title="标题" content="这是一段 Popover 内容">
      <c-button type="primary" plain>
        点击触发
      </c-button>
    </c-popover>
  </div>
</template>

<style>
.demo-popover-basic {
  padding: 20px;
}
</style>
```

:::

## 悬停触发

鼠标悬停时显示弹出框。

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
  <div class="demo-popover-hover">
    <c-popover trigger="hover" content="鼠标悬停显示">
      <c-button type="primary" plain>
        Hover
      </c-button>
    </c-popover>
  </div>
</template>

<style>
.demo-popover-hover {
  padding: 20px;
}
</style>
```

:::

## 自定义内容与标题插槽

支持自定义标题和内容插槽，可以插入任意 Vue 组件。

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
  <div class="demo-popover-custom">
    <c-popover>
      <template #title>
        <span>自定义标题</span>
      </template>
      <template #content>
        <div style="max-width: 240px">
          <p>支持任意插槽内容</p>
          <c-button type="primary" plain size="small">
            操作
          </c-button>
        </div>
      </template>
      <c-button type="primary" plain>
        自定义内容
      </c-button>
    </c-popover>
  </div>
</template>

<style>
.demo-popover-custom {
  padding: 20px;
}
</style>
```

:::

## 位置与主题

支持 12 个方向的位置和两种主题样式。

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
  <div class="demo-popover-placement">
    <div class="top">
      <c-popover placement="top" effect="light" content="Top">
        <c-button type="primary" plain>
          Top
        </c-button>
      </c-popover>
    </div>
    <div class="center">
      <c-popover placement="left" content="Left">
        <c-button type="primary" plain>
          Left
        </c-button>
      </c-popover>
      <c-popover placement="right" content="Right">
        <c-button type="primary" plain>
          Right
        </c-button>
      </c-popover>
    </div>
    <div class="bottom">
      <c-popover placement="bottom" effect="dark" content="Bottom">
        <c-button type="primary" plain>
          Bottom
        </c-button>
      </c-popover>
    </div>
  </div>
</template>

<style>
.demo-popover-placement {
  padding: 20px;
}

.demo-popover-placement .top {
  text-align: center;
  margin-bottom: 10px;
}

.demo-popover-placement .center {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.demo-popover-placement .bottom {
  text-align: center;
  margin-top: 10px;
}

.demo-popover-placement .ccui-button {
  margin: 5px;
}
</style>
```

:::

## 受控显示

通过 `v-model` 或 `visible` 属性手动控制弹出框的显示状态。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const visible = ref(false)
    const toggle = () => visible.value = !visible.value

    return {
      visible,
      toggle
    }
  }
})
</script>

<template>
  <div class="demo-popover-manual">
    <c-popover
      v-model:visible="visible"
      title="受控"
      content="通过 v-model 控制显隐"
      trigger="manual"
    >
      <c-button type="primary" plain @click="toggle">
        {{ visible ? '隐藏' : '显示' }}
      </c-button>
    </c-popover>
  </div>
</template>

<style>
.demo-popover-manual {
  padding: 20px;
}
</style>
```

:::

## API

### Popover Props

| 参数                      | 说明                                       | 类型           | 可选值                                                                                                    | 默认值 |
| ------------------------- | ------------------------------------------ | -------------- | --------------------------------------------------------------------------------------------------------- | ------ |
| title                     | 标题文本，也可以通过 `slot#title` 传入     | string         | —                                                                                                         | —      |
| content                   | 显示的内容，也可以通过 `slot#content` 传入 | string         | —                                                                                                         | —      |
| placement                 | Popover 的出现位置                         | string         | top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end | bottom |
| effect                    | 默认提供的主题                             | string         | dark/light                                                                                                | light  |
| visible / v-model:visible | 状态是否可见                               | boolean        | —                                                                                                         | false  |
| disabled                  | Popover 是否可用                           | boolean        | —                                                                                                         | false  |
| show-arrow                | 是否显示 Popover 箭头                      | boolean        | —                                                                                                         | true   |
| trigger                   | 触发方式                                   | string         | hover/focus/click/manual                                                                                  | click  |
| show-after                | 延迟出现，单位毫秒                         | number         | —                                                                                                         | 0      |
| hide-after                | 延迟关闭，单位毫秒                         | number         | —                                                                                                         | 200    |
| popper-class              | 为 Popover 的 popper 添加类名              | string         | —                                                                                                         | —      |
| offset                    | 出现位置的偏移量                           | number         | —                                                                                                         | 8      |
| raw-content               | 是否将 content 作为 HTML 字符串处理        | boolean        | —                                                                                                         | false  |
| enterable                 | 鼠标是否可进入到 popover 中                | boolean        | —                                                                                                         | true   |
| aria-label                | 屏幕阅读器标签                             | string         | —                                                                                                         | —      |
| width                     | 弹层宽度                                   | number\|string | —                                                                                                         | —      |

### Popover Events

| 事件名         | 说明           | 回调参数 |
| -------------- | -------------- | -------- |
| before-show    | 显示前触发     | —        |
| show           | 显示时触发     | —        |
| before-hide    | 隐藏前触发     | —        |
| hide           | 隐藏时触发     | —        |
| update:visible | 状态变更时触发 | visible  |

### Popover Slots

| 插槽名  | 说明                      |
| ------- | ------------------------- |
| default | Popover 触发 & 引用的元素 |
| title   | 自定义标题                |
| content | 自定义内容                |
