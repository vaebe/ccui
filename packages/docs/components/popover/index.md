# Popover 弹出框

用于在不打断用户流程的情况下展示补充信息和操作内容。支持标题 / 富文本内容 / 不同触发方式与位置控制。

## 何时使用

- 需要在不打断用户流程的情况下展示补充信息和操作内容
- 支持标题、富文本内容、不同触发方式与位置控制
- 需要展示比 Tooltip 更复杂的内容和操作

## 基本用法

最简单的用法，默认点击触发显示弹出框。

:::demo

```vue
<template>
  <c-popover title="标题" content="这是一段 Popover 内容">
    <c-button type="primary" plain>点击触发</c-button>
  </c-popover>
</template>
```

:::

## 悬停触发

`trigger="hover"` 鼠标悬停时显示弹出框。

:::demo

```vue
<template>
  <c-popover trigger="hover" content="鼠标悬停显示">
    <c-button type="primary" plain>Hover</c-button>
  </c-popover>
</template>
```

:::

## 自定义内容与标题插槽

`#title` / `#content` slot 可插入任意 VNode，常用于带操作按钮的富文本浮层。

:::demo

```vue
<template>
  <c-popover>
    <template #title>
      <span>自定义标题</span>
    </template>
    <template #content>
      <div style="max-width: 240px">
        <p style="margin: 0 0 8px">支持任意插槽内容</p>
        <c-button type="primary" plain size="small">操作</c-button>
      </div>
    </template>
    <c-button type="primary" plain>自定义内容</c-button>
  </c-popover>
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
  <div class="demo-popover-placement">
    <div class="row">
      <c-popover v-for="p in tops" :key="p" :placement="p" :content="`title ${p}`" trigger="hover">
        <c-button type="primary" plain>{{ p }}</c-button>
      </c-popover>
    </div>
    <div class="center">
      <div class="col">
        <c-popover v-for="p in lefts" :key="p" :placement="p" :content="`title ${p}`" trigger="hover">
          <c-button type="primary" plain>{{ p }}</c-button>
        </c-popover>
      </div>
      <div class="col">
        <c-popover v-for="p in rights" :key="p" :placement="p" :content="`title ${p}`" trigger="hover">
          <c-button type="primary" plain>{{ p }}</c-button>
        </c-popover>
      </div>
    </div>
    <div class="row">
      <c-popover v-for="p in bottoms" :key="p" :placement="p" :content="`title ${p}`" trigger="hover">
        <c-button type="primary" plain>{{ p }}</c-button>
      </c-popover>
    </div>
  </div>
</template>

<style scoped>
.demo-popover-placement { width: 460px; margin: 0 auto }
.demo-popover-placement .row { display: flex; justify-content: center; gap: 8px }
.demo-popover-placement .center { display: flex; justify-content: space-between; margin: 10px 0 }
.demo-popover-placement .col { display: flex; flex-direction: column; gap: 8px }
.demo-popover-placement .ccui-button { width: 110px; font-size: 12px }
</style>
```

:::

## 自定义背景色 color

`color` 优先于 `effect`，接受任意 CSS color 字符串，常用于品牌色 / 警告色 / 渐变。

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px">
    <c-popover content="品牌蓝" color="#1677ff" trigger="hover">
      <c-button type="primary" plain>蓝</c-button>
    </c-popover>
    <c-popover content="成功绿" color="#52c41a" trigger="hover">
      <c-button type="primary" plain>绿</c-button>
    </c-popover>
    <c-popover content="警告红" color="#f5222d" trigger="hover">
      <c-button type="primary" plain>红</c-button>
    </c-popover>
  </div>
</template>
```

:::

## 箭头配置 arrow

`arrow` 接受布尔（显隐）或对象 `{ pointAtCenter: true }`（箭头对准触发节点中心）。

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px">
    <c-popover content="默认箭头" placement="top" trigger="hover">
      <c-button type="primary" plain>默认</c-button>
    </c-popover>
    <c-popover content="对准中心" placement="top" trigger="hover" :arrow="{ pointAtCenter: true }">
      <c-button type="primary" plain>pointAtCenter</c-button>
    </c-popover>
    <c-popover content="无箭头" placement="top" trigger="hover" :arrow="false">
      <c-button type="primary" plain>无箭头</c-button>
    </c-popover>
  </div>
</template>
```

:::

## 弹层宽度 width

`width` 控制弹层固定宽度，常用于复杂内容场景避免内容塌缩。

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px">
    <c-popover title="说明" content="这段文字较短，无需固定宽度" trigger="hover">
      <c-button type="primary" plain>默认</c-button>
    </c-popover>
    <c-popover
      title="说明（固定 280px）"
      content="即便内容很短，弹层依然保持 280px 宽度；适合需要对齐的卡片样式场景"
      :width="280"
      trigger="hover"
    >
      <c-button type="primary" plain>width = 280</c-button>
    </c-popover>
  </div>
</template>
```

:::

## 触发方式

`hover` / `click` / `focus` / `manual` / `contextmenu` 五种。

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px">
    <c-popover trigger="hover" content="鼠标悬停">
      <c-button type="primary" plain>Hover</c-button>
    </c-popover>
    <c-popover trigger="click" content="点击触发">
      <c-button type="primary" plain>Click</c-button>
    </c-popover>
    <c-popover trigger="focus" content="聚焦触发">
      <c-button type="primary" plain>Focus</c-button>
    </c-popover>
    <c-popover trigger="contextmenu" title="右键菜单" content="右键点击触发">
      <c-button type="primary" plain>右键点击</c-button>
    </c-popover>
  </div>
</template>
```

:::

## 延迟显示 / 隐藏（新名）

`mouseEnterDelay` / `mouseLeaveDelay` 是 ant 主名（ms 单位）；旧名 `showAfter` / `hideAfter` 仍兼容但已 deprecated。

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px">
    <c-popover content="延迟 800ms 显示" :mouse-enter-delay="800" trigger="hover">
      <c-button type="primary" plain>延迟显示</c-button>
    </c-popover>
    <c-popover content="延迟 800ms 隐藏" :mouse-leave-delay="800" trigger="hover">
      <c-button type="primary" plain>延迟隐藏</c-button>
    </c-popover>
  </div>
</template>
```

:::

::: tip
旧版本 `:show-after` / `:hide-after` 仍然兼容，运行时与新名等价。新代码请直接用 `mouseEnterDelay` / `mouseLeaveDelay`，与 ant 命名对齐。
:::

## 受控显示 v-model:open

`open` 是 ant 主名，配合 `v-model:open` 双向同步；旧 `visible` / `v-model:visible` 仍兼容。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <div style="display: flex; gap: 12px; align-items: center">
    <c-popover v-model:open="open" title="v-model:open" content="通过 v-model:open 接管显隐状态" trigger="manual">
      <c-button type="primary" plain>受控触发器</c-button>
    </c-popover>
    <c-button type="primary" plain @click="open = !open">{{ open ? '隐藏' : '显示' }}</c-button>
    <span style="color: #666">open = {{ open }}</span>
  </div>
</template>
```

:::

## ref 调用 hide 方法

通过 ref 拿到组件实例后调用 `hide()` 可以在事件回调内主动关闭浮层，常用于「点确认后关闭」流程。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const popRef = ref(null)
function confirm() {
  console.log('确认操作')
  popRef.value?.hide()
}
function cancel() {
  popRef.value?.hide()
}
</script>

<template>
  <c-popover ref="popRef" trigger="click" :width="280">
    <template #title>
      <span style="color: #f5222d">⚠️ 确认删除</span>
    </template>
    <template #content>
      <p style="margin: 0 0 12px; color: #595959">此操作将永久删除该文件，是否继续？</p>
      <div style="display: flex; justify-content: flex-end; gap: 8px">
        <c-button size="small" @click="cancel">取消</c-button>
        <c-button type="primary" size="small" danger @click="confirm">确定</c-button>
      </div>
    </template>
    <c-button type="primary" plain danger>删除文件</c-button>
  </c-popover>
</template>
```

:::

## 自动关闭

`auto-close` 设置毫秒数，弹层在指定时间后自动隐藏；常用于 toast-like 提示场景。

:::demo

```vue
<template>
  <c-popover trigger="click" :auto-close="3000" title="自动关闭" content="3 秒后自动关闭">
    <c-button type="primary" plain>点击我（3 秒后自动关闭）</c-button>
  </c-popover>
</template>
```

:::

## 虚拟触发

`virtual-triggering` 配合 `virtual-ref`，让浮层挂在外部任意元素上，常用于「触发节点和声明位置分离」的场景。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const triggerRef = ref()
const visible = ref(false)
</script>

<template>
  <div class="demo-popover-virtual">
    <div class="virtual-trigger-area">
      <div
        ref="triggerRef"
        class="virtual-trigger"
        @mouseenter="visible = true"
        @mouseleave="visible = false"
      >
        虚拟触发区域（hover 我）
      </div>
    </div>
    <c-popover
      v-model:open="visible"
      :virtual-triggering="true"
      :virtual-ref="triggerRef"
      trigger="manual"
      content="这是通过虚拟触发显示的内容"
    />
  </div>
</template>

<style scoped>
.virtual-trigger-area { border: 2px dashed #ddd; padding: 18px; text-align: center; border-radius: 4px }
.virtual-trigger { background: #f5f5f5; padding: 10px; border-radius: 4px; cursor: pointer; transition: background 0.3s }
.virtual-trigger:hover { background: #e6f7ff }
</style>
```

:::

## 业务场景：用户卡片 hover

用户列表上 hover 头像 / 名字时展示完整用户卡，是 IM / 协作工具最常见的悬浮卡片范式。

:::demo

```vue
<script setup>
const users = [
  { value: 'alice', name: 'Alice', role: 'PM', desc: '负责需求评审与排期协调', color: '#1677ff' },
  { value: 'bob', name: 'Bob', role: 'Frontend', desc: '专注组件库与可视化', color: '#52c41a' },
  { value: 'carol', name: 'Carol', role: 'Backend', desc: '微服务与数据接口', color: '#fa8c16' },
]
</script>

<template>
  <div style="display: flex; gap: 16px">
    <c-popover v-for="u in users" :key="u.value" trigger="hover" :width="240" placement="bottom-start">
      <template #content>
        <div style="display: flex; gap: 12px; align-items: flex-start">
          <div
            :style="{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: u.color,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0,
            }"
          >
            {{ u.name.charAt(0) }}
          </div>
          <div>
            <strong>{{ u.name }}</strong>
            <p style="margin: 4px 0; color: #999; font-size: 12px">{{ u.role }}</p>
            <p style="margin: 0; color: #595959; font-size: 12px">{{ u.desc }}</p>
          </div>
        </div>
      </template>
      <a href="#" style="color: #1677ff">{{ u.name }}</a>
    </c-popover>
  </div>
</template>
```

:::

## Vue 状态语义

Popover 的显隐状态说明以 Vue API 为准：

- 需要业务状态接管时，使用 `v-model:open`（或 `v-model:visible` 旧名）接管显隐
- 由触发方式自行管理时，使用 `trigger="click"` / `trigger="hover"` / `trigger="focus"` 等内部状态路径
- 文档中避免使用 React 语境的 controlled / uncontrolled 作为主要说明

## API

### Popover Props

| 参数                      | 说明                                            | 类型                                              | 默认值             |
| ------------------------- | ----------------------------------------------- | ------------------------------------------------- | ------------------ |
| title                     | 标题文本，也可以通过 `slot#title` 传入           | string                                            | —                  |
| content                   | 显示的内容，也可以通过 `slot#content` 传入       | string                                            | —                  |
| placement                 | Popover 的出现位置                              | 12 种方位字符串                                   | bottom             |
| effect                    | 默认提供的主题                                  | `'dark' \| 'light'`                              | light              |
| open / v-model:open       | 显示状态（Ant 主名）                            | boolean                                           | false              |
| visible / v-model:visible | @deprecated 请改用 `open`                       | boolean                                           | false              |
| disabled                  | Popover 是否可用                                | boolean                                           | false              |
| color                     | 自定义背景色（覆盖 `effect`）                   | string                                            | —                  |
| arrow                     | 箭头配置；对象形 `{ pointAtCenter }`            | `boolean \| { pointAtCenter: boolean }`           | true               |
| show-arrow                | @deprecated 请改用 `arrow`                      | boolean                                           | true               |
| trigger                   | 触发方式                                        | `'hover' \| 'focus' \| 'click' \| 'manual' \| 'contextmenu'` | click  |
| mouseEnterDelay           | 进入显示延迟（ms，Ant 主名）                    | number                                            | 0                  |
| mouseLeaveDelay           | 离开隐藏延迟（ms，Ant 主名）                    | number                                            | 200                |
| show-after                | @deprecated 请改用 `mouseEnterDelay`            | number                                            | 0                  |
| hide-after                | @deprecated 请改用 `mouseLeaveDelay`            | number                                            | 200                |
| overlayClassName          | 弹层 class（Ant 主名）                          | string                                            | —                  |
| popper-class              | @deprecated 请改用 `overlayClassName`           | string                                            | —                  |
| fresh                     | 关闭后是否销毁内部内容                          | boolean                                           | false              |
| destroyTooltipOnHide      | 隐藏时销毁弹层节点                              | boolean                                           | false              |
| autoAdjustOverflow        | 自动调整方向避免溢出                            | boolean                                           | true               |
| align                     | floating-ui 微调对象                            | object                                            | —                  |
| getPopupContainer         | 自定义弹层容器；返回 `null` 内联不 Teleport     | `(trigger) => HTMLElement \| null`                | —                  |
| offset                    | 出现位置的偏移量                                | number                                            | 4                  |
| raw-content               | 是否将 content 作为 HTML 字符串处理             | boolean                                           | false              |
| enterable                 | 鼠标是否可进入到 popover 中                     | boolean                                           | true               |
| hide-on-click-outside     | 是否在点击外部时隐藏                            | boolean                                           | true               |
| close-on-esc              | 是否支持 ESC 键关闭                             | boolean                                           | true               |
| aria-label                | 屏幕阅读器标签                                  | string                                            | —                  |
| width                     | 弹层宽度                                        | `number \| string`                                | —                  |
| transition                | 定义渐变动画                                    | string                                            | ccui-popover-fade  |
| auto-close                | 自动关闭时间，单位毫秒                          | number                                            | 0                  |
| tabindex                  | Popover 组件的 tabindex                         | `number \| string`                                | 0                  |
| teleported                | @deprecated 请改用 `getPopupContainer` 函数形    | boolean                                           | true               |
| persistent                | 是否持久化                                      | boolean                                           | true               |
| virtual-triggering        | 是否启用虚拟触发器                              | boolean                                           | false              |
| virtual-ref               | 虚拟触发器的参照元素                            | HTMLElement                                       | —                  |
| trigger-keys              | 键盘触发按键                                    | string[]                                          | ['Enter', 'Space'] |

### Popover Events

| 事件名         | 说明                                            | 回调参数 |
| -------------- | ----------------------------------------------- | -------- |
| before-show    | 显示前触发                                      | —        |
| show           | 显示时触发                                      | —        |
| before-hide    | 隐藏前触发                                      | —        |
| hide           | 隐藏时触发                                      | —        |
| update:open    | v-model:open 同步（Ant 主名）                   | open     |
| update:visible | v-model:visible 同步（旧名，便于渐进迁移）      | visible  |
| before-enter   | 显示动画播放前触发                              | —        |
| after-enter    | 显示动画播放后触发                              | —        |
| before-leave   | 隐藏动画播放前触发                              | —        |
| after-leave    | 隐藏动画播放后触发                              | —        |

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
