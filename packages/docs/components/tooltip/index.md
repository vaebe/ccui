# Tooltip 文字提示

常用于展示鼠标 hover 时的提示信息。

## 何时使用

- 鼠标移入则显示提示，移出消失，气泡浮层不承载复杂文本和操作
- 可用来代替系统默认的 title 提示，提供一个更好的用户体验
- 当某个页面元素需要解释或描述时

## 基本用法

最简单的用法，浮层的大小由内容区域决定。

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
  <div class="demo-tooltip-basic">
    <c-tooltip content="这是一段提示文字">
      <c-button type="primary" plain>鼠标悬停显示</c-button>
    </c-tooltip>
  </div>
</template>

<style>
.demo-tooltip-basic {
  text-align: center;
  padding: 20px;
}
</style>
```

:::

## 位置

共有 12 个方向。

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
  <div class="demo-tooltip-placement">
    <div class="top">
      <c-tooltip content="Top Left 提示文字" placement="top-start">
        <c-button type="primary" plain>上左</c-button>
      </c-tooltip>
      <c-tooltip content="Top Center 提示文字" placement="top">
        <c-button type="primary" plain>上边</c-button>
      </c-tooltip>
      <c-tooltip content="Top Right 提示文字" placement="top-end">
        <c-button type="primary" plain>上右</c-button>
      </c-tooltip>
    </div>
    <div class="center">
      <div class="center-left">
        <c-tooltip content="Left Top 提示文字" placement="left-start">
          <c-button type="primary" plain>左上</c-button>
        </c-tooltip>
        <c-tooltip content="Left Center 提示文字" placement="left">
          <c-button type="primary" plain>左边</c-button>
        </c-tooltip>
        <c-tooltip content="Left Bottom 提示文字" placement="left-end">
          <c-button type="primary" plain>左下</c-button>
        </c-tooltip>
      </div>
      <div class="center-right">
        <c-tooltip content="Right Top 提示文字" placement="right-start">
          <c-button type="primary" plain>右上</c-button>
        </c-tooltip>
        <c-tooltip content="Right Center 提示文字" placement="right">
          <c-button type="primary" plain>右边</c-button>
        </c-tooltip>
        <c-tooltip content="Right Bottom 提示文字" placement="right-end">
          <c-button type="primary" plain>右下</c-button>
        </c-tooltip>
      </div>
    </div>
    <div class="bottom">
      <c-tooltip content="Bottom Left 提示文字" placement="bottom-start">
        <c-button type="primary" plain>下左</c-button>
      </c-tooltip>
      <c-tooltip content="Bottom Center 提示文字" placement="bottom">
        <c-button type="primary" plain>下边</c-button>
      </c-tooltip>
      <c-tooltip content="Bottom Right 提示文字" placement="bottom-end">
        <c-button type="primary" plain>下右</c-button>
      </c-tooltip>
    </div>
  </div>
</template>

<style>
.demo-tooltip-placement {
  width: 400px;
  margin: 20px auto;
}

.demo-tooltip-placement .top {
  text-align: center;
  margin-bottom: 10px;
}

.demo-tooltip-placement .center {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.demo-tooltip-placement .center-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.demo-tooltip-placement .center-right {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.demo-tooltip-placement .bottom {
  text-align: center;
  margin-top: 10px;
}

.demo-tooltip-placement .ccui-button {
  width: 80px;
  margin: 5px;
}
</style>
```

:::

## 主题

Tooltip 组件内置了两个主题：`dark` 和 `light`。

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
  <div class="demo-tooltip-theme">
    <c-tooltip content="Dark 主题" effect="dark">
      <c-button type="primary" plain>Dark</c-button>
    </c-tooltip>
    <c-tooltip content="Light 主题" effect="light">
      <c-button type="primary" plain>Light</c-button>
    </c-tooltip>
  </div>
</template>

<style>
.demo-tooltip-theme {
  text-align: center;
  padding: 20px;
}

.demo-tooltip-theme .ccui-button {
  margin: 0 10px;
}
</style>
```

:::

## 更多内容

展示多行文本或者是设置文本内容的格式。

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
  <div class="demo-tooltip-content">
    <c-tooltip placement="top">
      <template #content>
        <div>多行信息</div>
        <div>第二行信息</div>
      </template>
      <c-button type="primary" plain>多行文本</c-button>
    </c-tooltip>

    <c-tooltip
      content="<div style='color: red;'>HTML 内容</div>"
      :raw-content="true"
      placement="top"
    >
      <c-button type="primary" plain>HTML 内容</c-button>
    </c-tooltip>
  </div>
</template>

<style>
.demo-tooltip-content {
  text-align: center;
  padding: 20px;
}

.demo-tooltip-content .ccui-button {
  margin: 0 10px;
}
</style>
```

:::

## 触发方式

鼠标悬停、聚焦、点击。

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
  <div class="demo-tooltip-trigger">
    <c-tooltip content="鼠标悬停触发" trigger="hover">
      <c-button type="primary" plain>Hover</c-button>
    </c-tooltip>
    
    <c-tooltip content="点击触发" trigger="click">
      <c-button type="primary" plain>Click</c-button>
    </c-tooltip>
    
    <c-tooltip content="聚焦触发" trigger="focus">
      <c-button type="primary" plain>Focus</c-button>
    </c-tooltip>
  </div>
</template>

<style>
.demo-tooltip-trigger {
  text-align: center;
  padding: 20px;
}

.demo-tooltip-trigger .ccui-button {
  margin: 0 10px;
}
</style>
```

:::

## 延迟

鼠标移入后延迟出现的时间，单位毫秒。

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
  <div class="demo-tooltip-delay">
    <c-tooltip content="延迟 1 秒显示" :show-after="1000">
      <c-button type="primary" plain>延迟显示</c-button>
    </c-tooltip>
    
    <c-tooltip content="延迟 1 秒隐藏" :hide-after="1000">
      <c-button type="primary" plain>延迟隐藏</c-button>
    </c-tooltip>
  </div>
</template>

<style>
.demo-tooltip-delay {
  text-align: center;
  padding: 20px;
}

.demo-tooltip-delay .ccui-button {
  margin: 0 10px;
}
</style>
```

:::

## 禁用

Tooltip 可以被禁用。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const disabled = ref(false)

    return {
      disabled
    }
  }
})
</script>

<template>
  <div class="demo-tooltip-disabled">
    <c-tooltip content="禁用状态" :disabled="disabled">
      <c-button type="primary" plain>{{ disabled ? '禁用' : '启用' }}</c-button>
    </c-tooltip>
    
    <c-button type="primary" plain @click="disabled = !disabled">
      切换状态
    </c-button>
  </div>
</template>

<style>
.demo-tooltip-disabled {
  text-align: center;
  padding: 20px;
}

.demo-tooltip-disabled .ccui-button {
  margin: 0 10px;
}
</style>
```

:::

## 手动控制

通过设置 `visible` 属性来手动控制提示的显示。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const visible = ref(false)

    return {
      visible
    }
  }
})
</script>

<template>
  <div class="demo-tooltip-manual">
    <c-tooltip content="手动控制显示" :visible="visible" trigger="manual">
      <c-button type="primary" plain>手动控制</c-button>
    </c-tooltip>
    
    <c-button type="primary" plain @click="visible = !visible">
      {{ visible ? '隐藏' : '显示' }}
    </c-button>
  </div>
</template>

<style>
.demo-tooltip-manual {
  text-align: center;
  padding: 20px;
}

.demo-tooltip-manual .ccui-button {
  margin: 0 10px;
}
</style>
```

:::

## API

### Tooltip Props

| 参数                      | 说明                                       | 类型    | 可选值                                                                                                    | 默认值 |
| ------------------------- | ------------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------- | ------ |
| content                   | 显示的内容，也可以通过 `slot#content` 传入 | string  | —                                                                                                         | —      |
| placement                 | Tooltip 的出现位置                         | string  | top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end | bottom |
| effect                    | 默认提供的主题                             | string  | dark/light                                                                                                | dark   |
| visible / v-model:visible | 状态是否可见                               | boolean | —                                                                                                         | false  |
| disabled                  | Tooltip 是否可用                           | boolean | —                                                                                                         | false  |
| offset                    | 出现位置的偏移量                           | number  | —                                                                                                         | 12     |
| show-after                | 延迟出现，单位毫秒                         | number  | —                                                                                                         | 0      |
| hide-after                | 延迟关闭，单位毫秒                         | number  | —                                                                                                         | 200    |
| show-arrow                | 是否显示 Tooltip 箭头                      | boolean | —                                                                                                         | true   |
| popper-class              | 为 Tooltip 的 popper 添加类名              | string  | —                                                                                                         | —      |
| enterable                 | 鼠标是否可进入到 tooltip 中                | boolean | —                                                                                                         | true   |
| raw-content               | 是否将 content 作为 HTML 字符串处理        | boolean | —                                                                                                         | false  |
| trigger                   | 触发方式                                   | string  | hover/focus/click/manual                                                                                  | hover  |
| aria-label                | 屏幕阅读器标签                             | string  | —                                                                                                         | —      |

### Tooltip Events

| 事件名      | 说明       | 回调参数 |
| ----------- | ---------- | -------- |
| before-show | 显示前触发 | —        |
| show        | 显示时触发 | —        |
| before-hide | 隐藏前触发 | —        |
| hide        | 隐藏时触发 | —        |

### Tooltip Slots

| 插槽名  | 说明                      |
| ------- | ------------------------- |
| default | Tooltip 触发 & 引用的元素 |
| content | 自定义内容                |
