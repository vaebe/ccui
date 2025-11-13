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

## 右键菜单触发

支持右键菜单触发方式。

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
  <div class="demo-popover-contextmenu">
    <c-popover 
      trigger="contextmenu" 
      title="右键菜单"
      content="右键点击触发弹出框"
    >
      <c-button type="primary" plain>
        右键点击我
      </c-button>
    </c-popover>
  </div>
</template>

<style>
.demo-popover-contextmenu {
  padding: 20px;
}
</style>
```

:::

## 虚拟触发

支持虚拟元素触发，适用于触发元素和展示内容分离的场景。

:::demo

```vue
<script>
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  setup() {
    const triggerRef = ref()
    const visible = ref(false)

    const handleShow = () => {
      visible.value = true
    }

    const handleHide = () => {
      visible.value = false
    }

    return {
      triggerRef,
      visible,
      handleShow,
      handleHide
    }
  }
})
</script>

<template>
  <div class="demo-popover-virtual">
    <div class="virtual-trigger-area">
      <div 
        ref="triggerRef"
        class="virtual-trigger"
        @mouseenter="handleShow"
        @mouseleave="handleHide"
      >
        虚拟触发区域
      </div>
    </div>
    
    <c-popover
      :virtual-triggering="true"
      :virtual-ref="triggerRef"
      v-model:visible="visible"
      trigger="manual"
      content="这是通过虚拟触发显示的内容"
    />
  </div>
</template>

<style>
.demo-popover-virtual {
  padding: 20px;
}

.virtual-trigger-area {
  border: 2px dashed #ddd;
  padding: 20px;
  text-align: center;
  border-radius: 4px;
}

.virtual-trigger {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.virtual-trigger:hover {
  background: #e6f7ff;
}
</style>
```

:::

## 嵌套操作

可以在 Popover 中嵌套其他组件和操作。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const visible = ref(false)
    
    const handleConfirm = () => {
      console.log('确认操作')
      visible.value = false
    }
    
    const handleCancel = () => {
      console.log('取消操作')
      visible.value = false
    }

    return {
      visible,
      handleConfirm,
      handleCancel
    }
  }
})
</script>

<template>
  <div class="demo-popover-nested">
    <c-popover v-model:visible="visible" trigger="manual" width="300">
      <template #title>
        <span style="color: #f56c6c;">⚠️ 确认删除</span>
      </template>
      <template #content>
        <div class="nested-content">
          <p>此操作将永久删除该文件，是否继续？</p>
          <div class="action-buttons">
            <c-button size="small" @click="handleCancel">
              取消
            </c-button>
            <c-button type="primary" size="small" @click="handleConfirm">
              确定
            </c-button>
          </div>
        </div>
      </template>
      <c-button type="danger" plain @click="visible = true">
        删除文件
      </c-button>
    </c-popover>
  </div>
</template>

<style>
.demo-popover-nested {
  padding: 20px;
}

.nested-content {
  max-width: 260px;
}

.nested-content p {
  margin: 0 0 12px 0;
  color: #606266;
  line-height: 1.4;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
```

:::

## 自动关闭

设置自动关闭时间，弹出框会在指定时间后自动隐藏。

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
  <div class="demo-popover-autoclose">
    <c-popover 
      trigger="click"
      :auto-close="3000"
      title="自动关闭"
      content="这个弹出框将在3秒后自动关闭"
    >
      <c-button type="primary" plain>
        点击我（3秒后自动关闭）
      </c-button>
    </c-popover>
  </div>
</template>

<style>
.demo-popover-autoclose {
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
| trigger                   | 触发方式                                   | string         | hover/focus/click/manual/contextmenu                                                                      | click  |
| show-after                | 延迟出现，单位毫秒                         | number         | —                                                                                                         | 0      |
| hide-after                | 延迟关闭，单位毫秒                         | number         | —                                                                                                         | 200    |
| popper-class              | 为 Popover 的 popper 添加类名              | string         | —                                                                                                         | —      |
| offset                    | 出现位置的偏移量                           | number         | —                                                                                                         | 4      |
| raw-content               | 是否将 content 作为 HTML 字符串处理        | boolean        | —                                                                                                         | false  |
| enterable                 | 鼠标是否可进入到 popover 中                | boolean        | —                                                                                                         | true   |
| hide-on-click-outside     | 是否在点击外部时隐藏                       | boolean        | —                                                                                                         | true   |
| close-on-esc              | 是否支持 ESC 键关闭                        | boolean        | —                                                                                                         | true   |
| aria-label                | 屏幕阅读器标签                             | string         | —                                                                                                         | —      |
| width                     | 弹层宽度                                   | number\|string | —                                                                                                         | —      |
| transition                | 定义渐变动画                               | string         | —                                                                                                         | ccui-popover-fade |
| auto-close                | 自动关闭时间，单位毫秒                     | number         | —                                                                                                         | 0      |
| tabindex                  | Popover 组件的 tabindex                    | number\|string | —                                                                                                         | 0      |
| teleported                | 是否将 popover 插入至 body 元素            | boolean        | —                                                                                                         | true   |
| persistent                | 是否持久化                                 | boolean        | —                                                                                                         | true   |
| virtual-triggering        | 是否启用虚拟触发器                         | boolean        | —                                                                                                         | false  |
| virtual-ref               | 虚拟触发器的参照元素                       | HTMLElement    | —                                                                                                         | —      |
| trigger-keys              | 键盘触发按键                               | string[]       | —                                                                                                         | ['Enter', 'Space'] |

### Popover Events

| 事件名         | 说明               | 回调参数 |
| -------------- | ------------------ | -------- |
| before-show    | 显示前触发         | —        |
| show           | 显示时触发         | —        |
| before-hide    | 隐藏前触发         | —        |
| hide           | 隐藏时触发         | —        |
| update:visible | 状态变更时触发     | visible  |
| before-enter   | 显示动画播放前触发 | —        |
| after-enter    | 显示动画播放后触发 | —        |
| before-leave   | 隐藏动画播放前触发 | —        |
| after-leave    | 隐藏动画播放后触发 | —        |

### Popover Slots

| 插槽名  | 说明                      |
| ------- | ------------------------- |
| default | Popover 触发 & 引用的元素 |
| title   | 自定义标题                |
| content | 自定义内容                |

### Popover Exposes

| 方法名 | 说明       | 类型       |
| ------ | ---------- | ---------- |
| hide   | 隐藏弹出框 | () => void |
