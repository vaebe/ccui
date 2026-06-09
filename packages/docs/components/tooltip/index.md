# Tooltip 文字提示

常用于展示鼠标 hover 时的提示信息。

## 何时使用

- 鼠标移入则显示提示，移出消失，气泡浮层不承载复杂文本和操作
- 可用来代替系统默认的 title 提示，提供一个更好的用户体验
- 当某个页面元素需要解释或描述时

## 基本使用

最简单的用法，浮层的大小由内容区域决定。文本内容可通过 `content` 或同名 slot 传入。

:::demo

```vue
<template>
  <c-tooltip content="这是一段提示文字">
    <c-button type="primary" plain>鼠标悬停显示</c-button>
  </c-tooltip>
</template>
```

:::

## 12 个出现位置

通过 `placement` 控制方位。

:::demo

```vue
<script setup>
const tops = ['top-start', 'top', 'top-end']
const lefts = ['left-start', 'left', 'left-end']
const rights = ['right-start', 'right', 'right-end']
const bottoms = ['bottom-start', 'bottom', 'bottom-end']
</script>

<template>
  <div class="demo-tooltip-placement">
    <div class="row">
      <c-tooltip v-for="p in tops" :key="p" :content="`tooltip ${p}`" :placement="p">
        <c-button type="primary" plain>{{ p }}</c-button>
      </c-tooltip>
    </div>
    <div class="center">
      <div class="col">
        <c-tooltip v-for="p in lefts" :key="p" :content="`tooltip ${p}`" :placement="p">
          <c-button type="primary" plain>{{ p }}</c-button>
        </c-tooltip>
      </div>
      <div class="col">
        <c-tooltip v-for="p in rights" :key="p" :content="`tooltip ${p}`" :placement="p">
          <c-button type="primary" plain>{{ p }}</c-button>
        </c-tooltip>
      </div>
    </div>
    <div class="row">
      <c-tooltip v-for="p in bottoms" :key="p" :content="`tooltip ${p}`" :placement="p">
        <c-button type="primary" plain>{{ p }}</c-button>
      </c-tooltip>
    </div>
  </div>
</template>

<style scoped>
.demo-tooltip-placement {
  width: 420px;
  margin: 0 auto;
}
.demo-tooltip-placement .row {
  display: flex;
  justify-content: center;
  gap: 8px;
}
.demo-tooltip-placement .center {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
.demo-tooltip-placement .col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.demo-tooltip-placement .ccui-button {
  width: 96px;
}
</style>
```

:::

## 内置主题

`effect` 提供 `dark` / `light` 两套内置背景；要更精细的颜色用 `color`。

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px">
    <c-tooltip content="Dark 主题" effect="dark">
      <c-button type="primary" plain>Dark</c-button>
    </c-tooltip>
    <c-tooltip content="Light 主题" effect="light">
      <c-button type="primary" plain>Light</c-button>
    </c-tooltip>
  </div>
</template>
```

:::

## 自定义背景色 color

`color` 优先于 `effect`，接受任意 CSS color，常用于品牌色 / 警告色提示。

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px">
    <c-tooltip content="品牌蓝" color="#1677ff">
      <c-button type="primary" plain>蓝</c-button>
    </c-tooltip>
    <c-tooltip content="成功绿" color="#52c41a">
      <c-button type="primary" plain>绿</c-button>
    </c-tooltip>
    <c-tooltip content="警告红" color="#f5222d">
      <c-button type="primary" plain>红</c-button>
    </c-tooltip>
    <c-tooltip content="紫色渐变" color="linear-gradient(135deg, #722ed1, #eb2f96)">
      <c-button type="primary" plain>渐变</c-button>
    </c-tooltip>
  </div>
</template>
```

:::

## 显隐箭头 show-arrow

通过 `show-arrow` 控制箭头显示/隐藏。

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px">
    <c-tooltip content="默认带箭头" placement="top">
      <c-button type="primary" plain>带箭头</c-button>
    </c-tooltip>
    <c-tooltip content="无箭头" placement="top" :show-arrow="false">
      <c-button type="primary" plain>无箭头</c-button>
    </c-tooltip>
  </div>
</template>
```

:::

## 多行 / HTML 内容

`#content` slot 支持任意 VNode；要把字符串当 HTML 渲染用 `rawContent`。

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px">
    <c-tooltip placement="top">
      <template #content>
        <div>多行信息</div>
        <div>第二行信息</div>
      </template>
      <c-button type="primary" plain>多行</c-button>
    </c-tooltip>
    <c-tooltip content="<div style='color: #fff700'>HTML 内容</div>" :raw-content="true">
      <c-button type="primary" plain>HTML</c-button>
    </c-tooltip>
  </div>
</template>
```

:::

## 触发方式

`hover` / `click` / `focus` / `manual` 四种。

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px">
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
```

:::

## 延迟显示 / 隐藏

通过 `show-after` / `hide-after` 控制显隐延迟（ms）。

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px">
    <c-tooltip content="延迟 1 秒显示" :show-after="1000">
      <c-button type="primary" plain>延迟显示</c-button>
    </c-tooltip>
    <c-tooltip content="延迟 1 秒隐藏" :hide-after="1000">
      <c-button type="primary" plain>延迟隐藏</c-button>
    </c-tooltip>
  </div>
</template>
```

:::

## 禁用

`disabled=true` 时永远不触发显示。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const disabled = ref(false)
</script>

<template>
  <div style="display: flex; gap: 12px">
    <c-tooltip content="禁用状态" :disabled="disabled">
      <c-button type="primary" plain>{{ disabled ? '禁用' : '启用' }}</c-button>
    </c-tooltip>
    <c-button type="primary" plain @click="disabled = !disabled">切换状态</c-button>
  </div>
</template>
```

:::

## 受控显示 v-model:visible

`visible` 配合 `v-model:visible` 双向同步。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>

<template>
  <div style="display: flex; gap: 12px; align-items: center">
    <c-tooltip v-model:visible="visible" content="手动控制显示" trigger="manual">
      <c-button type="primary" plain>受控触发器</c-button>
    </c-tooltip>
    <c-button type="primary" plain @click="visible = !visible">
      {{ visible ? '隐藏' : '显示' }}
    </c-button>
    <span style="color: var(--ccui-color-text-secondary)">visible = {{ visible }}</span>
  </div>
</template>
```

:::

## show / hide 事件追踪

`before-show` / `show` / `before-hide` / `hide` 四个事件覆盖完整生命周期，常用于埋点。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const logs = ref([])
function log(type) {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${type}`)
  if (logs.value.length > 5) logs.value.length = 5
}
</script>

<template>
  <div style="display: flex; gap: 16px; align-items: flex-start">
    <c-tooltip
      content="hover 我观察事件"
      @before-show="log('before-show')"
      @show="log('show')"
      @before-hide="log('before-hide')"
      @hide="log('hide')"
    >
      <c-button type="primary" plain>触发器</c-button>
    </c-tooltip>
    <ul style="margin: 0; padding-left: 18px; color: var(--ccui-color-text-secondary); font-size: 12px">
      <li v-if="!logs.length">尚无事件</li>
      <li v-for="(log, i) in logs" :key="i">{{ log }}</li>
    </ul>
  </div>
</template>
```

:::

## 业务场景：图标提示

「图标 + Tooltip 文字解释」是后台管理表单 / 配置项最常见的辅助说明范式。

:::demo

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex; align-items: center; gap: 6px">
      <span>邮箱地址</span>
      <c-tooltip content="用于接收账号通知与重置密码邮件" placement="right">
        <span
          style="display: inline-flex; width: 16px; height: 16px; border-radius: 50%; background: var(--ccui-area); color: var(--ccui-color-text-secondary); align-items: center; justify-content: center; font-size: 11px; cursor: help"
        >
          ?
        </span>
      </c-tooltip>
    </div>
    <div style="display: flex; align-items: center; gap: 6px">
      <span>API 密钥</span>
      <c-tooltip content="密钥泄露后请立即重置；不要提交到代码仓库" color="#f5222d" placement="right">
        <span
          style="display: inline-flex; width: 16px; height: 16px; border-radius: 50%; background: #fff1f0; color: #cf1322; align-items: center; justify-content: center; font-size: 11px; cursor: help"
        >
          !
        </span>
      </c-tooltip>
    </div>
  </div>
</template>
```

:::

## API

### Tooltip Props

| 参数                      | 说明                                                  | 类型                                         | 默认值 |
| ------------------------- | ----------------------------------------------------- | -------------------------------------------- | ------ |
| content                   | 浮层显示文本。也可用同名 `content` slot 传入富文本    | string                                       | —      |
| visible / v-model:visible | 受控显示状态                                          | boolean                                      | false  |
| placement                 | 出现位置（12 种）                                     | `'top' \| 'top-start' \| ... \| 'right-end'` | bottom |
| effect                    | 内置主题                                              | `'dark' \| 'light'`                          | dark   |
| color                     | 自定义背景色（覆盖 `effect`）                         | string                                       | —      |
| show-arrow                | 是否显示箭头                                          | boolean                                      | true   |
| show-after                | 鼠标进入触发显示的延迟（ms）                          | number                                       | 0      |
| hide-after                | 鼠标离开触发隐藏的延迟（ms）                          | number                                       | 200    |
| popper-class              | 浮层根节点 class                                      | string                                       | —      |
| trigger                   | 触发方式                                              | `'hover' \| 'focus' \| 'click' \| 'manual'`  | hover  |
| disabled                  | 是否禁用                                              | boolean                                      | false  |
| offset                    | 距触发器的偏移量（px）                                | number                                       | 8      |
| enterable                 | 鼠标是否可进入到 tooltip 中                           | boolean                                      | true   |
| raw-content               | 是否将 content 作为 HTML 字符串处理                   | boolean                                      | false  |
| fresh                     | 关闭后是否销毁内部内容                                | boolean                                      | false  |
| destroyTooltipOnHide      | 隐藏时销毁 tooltip 节点                               | boolean                                      | false  |
| autoAdjustOverflow        | 自动调整方向避免溢出（接 floating-ui flip）           | boolean                                      | true   |
| align                     | floating-ui offset / flip 等微调参数                  | object                                       | —      |
| getPopupContainer         | 自定义弹层容器（返回 `null` 不 Teleport）             | `(trigger) => HTMLElement \| null`           | —      |
| aria-label                | 屏幕阅读器标签                                        | string                                       | —      |

### Tooltip Events

| 事件名         | 说明                 | 回调参数 |
| -------------- | -------------------- | -------- |
| before-show    | 显示前触发           | —        |
| show           | 显示时触发           | —        |
| before-hide    | 隐藏前触发           | —        |
| hide           | 隐藏时触发           | —        |
| update:visible | v-model:visible 同步 | visible  |

### Tooltip Slots

| 插槽名  | 说明                                |
| ------- | ----------------------------------- |
| default | Tooltip 触发 & 引用的元素           |
| content | 自定义浮层内容（优先于 `content` prop） |
