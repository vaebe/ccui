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
  },
})
</script>

<template>
  <div class="demo-tooltip-basic">
    <c-tooltip content="这是一段提示文字">
      <c-button type="primary" plain> 鼠标悬停显示 </c-button>
    </c-tooltip>
  </div>
</template>

<style></style>
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
  },
})
</script>

<template>
  <div class="demo-tooltip-placement">
    <div class="top">
      <c-tooltip content="Top Left 提示文字" placement="top-start">
        <c-button type="primary" plain> 上左 </c-button>
      </c-tooltip>
      <c-tooltip content="Top Center 提示文字" placement="top">
        <c-button type="primary" plain> 上边 </c-button>
      </c-tooltip>
      <c-tooltip content="Top Right 提示文字" placement="top-end">
        <c-button type="primary" plain> 上右 </c-button>
      </c-tooltip>
    </div>
    <div class="center">
      <div class="center-left">
        <c-tooltip content="Left Top 提示文字" placement="left-start">
          <c-button type="primary" plain> 左上 </c-button>
        </c-tooltip>
        <c-tooltip content="Left Center 提示文字" placement="left">
          <c-button type="primary" plain> 左边 </c-button>
        </c-tooltip>
        <c-tooltip content="Left Bottom 提示文字" placement="left-end">
          <c-button type="primary" plain> 左下 </c-button>
        </c-tooltip>
      </div>
      <div class="center-right">
        <c-tooltip content="Right Top 提示文字" placement="right-start">
          <c-button type="primary" plain> 右上 </c-button>
        </c-tooltip>
        <c-tooltip content="Right Center 提示文字" placement="right">
          <c-button type="primary" plain> 右边 </c-button>
        </c-tooltip>
        <c-tooltip content="Right Bottom 提示文字" placement="right-end">
          <c-button type="primary" plain> 右下 </c-button>
        </c-tooltip>
      </div>
    </div>
    <div class="bottom">
      <c-tooltip content="Bottom Left 提示文字" placement="bottom-start">
        <c-button type="primary" plain> 下左 </c-button>
      </c-tooltip>
      <c-tooltip content="Bottom Center 提示文字" placement="bottom">
        <c-button type="primary" plain> 下边 </c-button>
      </c-tooltip>
      <c-tooltip content="Bottom Right 提示文字" placement="bottom-end">
        <c-button type="primary" plain> 下右 </c-button>
      </c-tooltip>
    </div>
  </div>
</template>

<style>
.demo-tooltip-placement {
  width: 400px;
  margin: 0 auto;
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
  },
})
</script>

<template>
  <div class="demo-tooltip-theme">
    <c-tooltip content="Dark 主题" effect="dark">
      <c-button type="primary" plain> Dark </c-button>
    </c-tooltip>
    <c-tooltip content="Light 主题" effect="light">
      <c-button type="primary" plain> Light </c-button>
    </c-tooltip>
  </div>
</template>

<style>
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
  },
})
</script>

<template>
  <div class="demo-tooltip-content">
    <c-tooltip placement="top">
      <template #content>
        <div>多行信息</div>
        <div>第二行信息</div>
      </template>
      <c-button type="primary" plain> 多行文本 </c-button>
    </c-tooltip>

    <c-tooltip content="<div style='color: red;'>HTML 内容</div>" :raw-content="true" placement="top">
      <c-button type="primary" plain> HTML 内容 </c-button>
    </c-tooltip>
  </div>
</template>

<style>
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
  },
})
</script>

<template>
  <div class="demo-tooltip-trigger">
    <c-tooltip content="鼠标悬停触发" trigger="hover">
      <c-button type="primary" plain> Hover </c-button>
    </c-tooltip>

    <c-tooltip content="点击触发" trigger="click">
      <c-button type="primary" plain> Click </c-button>
    </c-tooltip>

    <c-tooltip content="聚焦触发" trigger="focus">
      <c-button type="primary" plain> Focus </c-button>
    </c-tooltip>
  </div>
</template>

<style>
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
  },
})
</script>

<template>
  <div class="demo-tooltip-delay">
    <c-tooltip content="延迟 1 秒显示" :show-after="1000">
      <c-button type="primary" plain> 延迟显示 </c-button>
    </c-tooltip>

    <c-tooltip content="延迟 1 秒隐藏" :hide-after="1000">
      <c-button type="primary" plain> 延迟隐藏 </c-button>
    </c-tooltip>
  </div>
</template>

<style>
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
      disabled,
    }
  },
})
</script>

<template>
  <div class="demo-tooltip-disabled">
    <c-tooltip content="禁用状态" :disabled="disabled">
      <c-button type="primary" plain>
        {{ disabled ? '禁用' : '启用' }}
      </c-button>
    </c-tooltip>

    <c-button type="primary" plain @click="disabled = !disabled"> 切换状态 </c-button>
  </div>
</template>

<style>
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
      visible,
    }
  },
})
</script>

<template>
  <div class="demo-tooltip-manual">
    <c-tooltip content="手动控制显示" :visible="visible" trigger="manual">
      <c-button type="primary" plain> 手动控制 </c-button>
    </c-tooltip>

    <c-button type="primary" plain @click="visible = !visible">
      {{ visible ? '隐藏' : '显示' }}
    </c-button>
  </div>
</template>

<style>
.demo-tooltip-manual .ccui-button {
  margin: 0 10px;
}
</style>
```

:::

## API

### Tooltip Props

| 参数                                 | 说明                                                                                                  | 类型                                              | 默认值 |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------ |
| title                                | 显示的内容（Ant 主名）。也可用 `slot#title` 传入                                                       | string \| VNode                                   | —      |
| content                              | 同 `title`（保留 ccui 旧名，slot 同名 `content` 可用）                                                  | string                                            | —      |
| open / v-model:open                  | 显示状态（Ant 主名）                                                                                  | boolean                                           | false  |
| visible / v-model:visible            | @deprecated 请改用 `open`                                                                             | boolean                                           | false  |
| placement                            | 出现位置                                                                                              | `'top' \| 'top-start' \| 'top-end' \| 'bottom*' \| 'left*' \| 'right*'`（12 种） | bottom |
| effect                               | 内置主题                                                                                              | `'dark' \| 'light'`                              | dark   |
| color                                | 自定义背景色（覆盖 `effect`）                                                                          | string                                            | —      |
| arrow                                | 箭头配置；对象形 `{ pointAtCenter: true }` 让箭头对准触发器中心                                       | `boolean \| { pointAtCenter: boolean }`           | true   |
| show-arrow                           | @deprecated 请改用 `arrow`                                                                            | boolean                                           | true   |
| mouseEnterDelay                      | 鼠标进入触发显示的延迟（ms，Ant 主名）                                                                | number                                            | 0      |
| show-after                           | @deprecated 请改用 `mouseEnterDelay`                                                                  | number                                            | 0      |
| mouseLeaveDelay                      | 鼠标离开触发隐藏的延迟（ms，Ant 主名）                                                                | number                                            | 200    |
| hide-after                           | @deprecated 请改用 `mouseLeaveDelay`                                                                  | number                                            | 200    |
| overlayClassName                     | 弹层 class（Ant 主名）                                                                                | string                                            | —      |
| popper-class                         | @deprecated 请改用 `overlayClassName`                                                                 | string                                            | —      |
| trigger                              | 触发方式                                                                                              | `'hover' \| 'focus' \| 'click' \| 'manual'`     | hover  |
| disabled                             | 是否禁用                                                                                              | boolean                                           | false  |
| offset                               | 距触发器的偏移量（px）                                                                                | number                                            | 8      |
| enterable                            | 鼠标是否可进入到 tooltip 中                                                                           | boolean                                           | true   |
| raw-content                          | 是否将 content 作为 HTML 字符串处理                                                                   | boolean                                           | false  |
| fresh                                | 关闭后是否销毁内部内容（覆盖一次性数据用）                                                            | boolean                                           | false  |
| destroyTooltipOnHide                 | 隐藏时销毁 tooltip 节点（与 `fresh` 类似的清理语义）                                                  | boolean                                           | false  |
| autoAdjustOverflow                   | 自动调整方向避免溢出（接 floating-ui flip middleware）                                                | boolean                                           | true   |
| align                                | 自定义 floating-ui `offset` / `flip` 等微调参数                                                       | object                                            | —      |
| getPopupContainer                    | 自定义弹层容器（返回 `null` 不 Teleport）                                                              | `(trigger: HTMLElement \| null) => HTMLElement \| null` | —      |
| aria-label                           | 屏幕阅读器标签                                                                                        | string                                            | —      |

### Tooltip Events

| 事件名      | 说明       | 回调参数 |
| ----------- | ---------- | -------- |
| before-show | 显示前触发 | —        |
| show        | 显示时触发 | —        |
| before-hide | 隐藏前触发 | —        |
| hide        | 隐藏时触发 | —        |

### Tooltip Slots

| 插槽名  | 说明                                     |
| ------- | ---------------------------------------- |
| default | Tooltip 触发 & 引用的元素                |
| title   | 自定义内容（Ant 主名，优先于 `title` prop） |
| content | 同 `title`（旧名 slot，仍可用）          |
