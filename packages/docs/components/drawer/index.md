# Drawer 抽屉

从屏幕侧边滑入的浮层，承载较多详情或表单。相比 Modal，Drawer 不打断当前页面纵深，更适合"补充信息"场景。

## 基本使用

通过 `v-model:visible` 控制开合；默认从右侧滑入。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <c-button type="primary" @click="visible = true">打开抽屉</c-button>
  <c-drawer v-model:visible="visible" title="详情">
    <p>抽屉里可以放任意复杂内容：表单、表格、富文本……</p>
  </c-drawer>
</template>
```

:::

## 四个方向

`placement` 可选 `right` / `left` / `top` / `bottom`。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const top = ref(false)
const bottom = ref(false)
const left = ref(false)
const right = ref(false)
</script>

<template>
  <c-button @click="top = true">上</c-button>
  <c-button @click="bottom = true">下</c-button>
  <c-button @click="left = true">左</c-button>
  <c-button @click="right = true">右</c-button>
  <c-drawer v-model:visible="top" placement="top" title="顶部">从上方滑入</c-drawer>
  <c-drawer v-model:visible="bottom" placement="bottom" title="底部">从下方滑入</c-drawer>
  <c-drawer v-model:visible="left" placement="left" title="左侧">从左侧滑入</c-drawer>
  <c-drawer v-model:visible="right" placement="right" title="右侧">从右侧滑入</c-drawer>
</template>
```

:::

## 自定义尺寸

`size` 接受数字（px）或字符串（带单位）。横向 placement 控制 width，纵向控制 height。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const small = ref(false)
const big = ref(false)
const half = ref(false)
</script>

<template>
  <c-button @click="small = true">小 (260)</c-button>
  <c-button @click="big = true">大 (640)</c-button>
  <c-button @click="half = true">百分比 (50%)</c-button>
  <c-drawer v-model:visible="small" :size="260" title="小抽屉">size=260</c-drawer>
  <c-drawer v-model:visible="big" :size="640" title="大抽屉">size=640</c-drawer>
  <c-drawer v-model:visible="half" size="50%" title="半屏">size='50%'</c-drawer>
</template>
```

:::

## 自定义底部按钮

带操作的抽屉常需要底部按钮区。设置 `show-footer` 后用 `#footer` slot 自定义。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const visible = ref(false)
const result = ref('（未操作）')

function ok() {
  result.value = '已保存'
  visible.value = false
}
function cancel() {
  result.value = '已取消'
  visible.value = false
}
</script>

<template>
  <c-button type="primary" @click="visible = true">编辑</c-button>
  <span style="margin-inline-start: 12px; color: #666">最近操作：{{ result }}</span>
  <c-drawer v-model:visible="visible" title="编辑信息" show-footer>
    <p>这里放编辑表单……</p>
    <template #footer>
      <c-button @click="cancel">取消</c-button>
      <c-button type="primary" style="margin-inline-start: 8px" @click="ok">保存</c-button>
    </template>
  </c-drawer>
</template>
```

:::

## 关闭行为

`mask-closable` 控制点遮罩关；`close-on-esc` 控制 Esc 键关；都设为 `false` 时只能用 × 或外部代码关。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <c-button @click="visible = true">打开（不可点蒙层关、Esc 不关）</c-button>
  <c-drawer v-model:visible="visible" title="只能点 × 才能关" :mask-closable="false" :close-on-esc="false">
    <p>这种用法适合"必须显式确认"的流程。</p>
  </c-drawer>
</template>
```

:::

## 销毁内部 DOM

`destroy-on-close` 让抽屉关闭后清空内部内容（重置内嵌组件状态）。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const visible = ref(false)
const text = ref('')
</script>

<template>
  <c-button type="primary" @click="visible = true">打开</c-button>
  <c-drawer v-model:visible="visible" title="关后销毁" destroy-on-close>
    <p>关闭后下次重新打开，输入框会被清空：</p>
    <input
      v-model="text"
      placeholder="输点东西然后关掉再打开"
      style="width: 100%; padding: 6px 8px; border: 1px solid #d9d9d9; border-radius: 4px"
    />
  </c-drawer>
</template>
```

:::

## API

### Props

| 参数                   | 类型                                                                                 | 默认值    | 说明                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------ | --------- | -------------------------------------------------------------------------------------- |
| open                   | boolean                                                                              | `false`   | 是否显示（Ant 主名，支持 `v-model:open`）                                              |
| visible                | boolean                                                                              | `false`   | @deprecated 请改用 `open`                                                              |
| title                  | string                                                                               | `''`      | 标题                                                                                   |
| placement              | `DrawerPlacement`                                                                    | `'right'` | 弹出方向：`left` / `right` / `top` / `bottom`                                          |
| size                   | `number \| string`                                                                   | `378`     | 横向时为宽，纵向时为高（数字按 px，字符串按原值）                                      |
| closable               | `boolean \| { closeIcon?: VNode \| string; disabled?: boolean; ariaLabel?: string }` | `true`    | 关闭按钮配置；对象形支持自定义图标 / 禁用 / aria-label                                 |
| maskClosable           | boolean                                                                              | `true`    | 点遮罩是否关闭                                                                         |
| keyboard               | boolean                                                                              | `true`    | Esc 键是否关闭（Ant 主名）                                                             |
| closeOnEsc             | boolean                                                                              | `true`    | @deprecated 请改用 `keyboard`                                                          |
| mask                   | boolean                                                                              | `true`    | 是否显示遮罩                                                                           |
| loading                | boolean                                                                              | `false`   | 加载状态：渲染 3 行骨架占位 + `aria-busy="true"`，body 区被替换（v5.17+）              |
| footer                 | `string \| VNode \| null \| undefined`                                               | --        | 底部内容（`null` 等价 `showFooter=false`；string/VNode 直接渲染；undefined 启用 slot） |
| showFooter             | boolean                                                                              | `false`   | @deprecated 请改用 `footer` 或 `footer` slot                                           |
| destroyOnClose         | boolean                                                                              | `false`   | 关闭后销毁内部 DOM                                                                     |
| keepAlive              | boolean                                                                              | `false`   | 即使未打开也保留 DOM（与 `destroyOnClose` 互斥）                                       |
| focusTriggerAfterClose | boolean                                                                              | `true`    | 关闭后聚焦回打开前的触发元素                                                           |
| push                   | `boolean \| { distance?: number }`                                                   | `false`   | 嵌套抽屉时让位距离；父抽屉设 `push=false` 表示不让位（与 ant 一致）                    |
| zIndex                 | number                                                                               | `1000`    | 层级                                                                                   |
| getContainer           | `(trigger: HTMLElement \| null) => HTMLElement \| null`                              | --        | 自定义挂载容器；返回 `null` 时内联渲染                                                 |
| appendToBody           | boolean                                                                              | `true`    | @deprecated 请改用 `getContainer`                                                      |

### Events

| 事件名            | 回调签名             | 触发时机                                                 |
| ----------------- | -------------------- | -------------------------------------------------------- |
| update:open       | `(open: boolean)`    | 显示状态变化（v-model:open，Ant 主名）                   |
| update:visible    | `(visible: boolean)` | 同步触发的旧名，方便从 `v-model:visible` 渐进迁移        |
| after-open-change | `(open: boolean)`    | 打开 / 关闭动画完成后触发（immediate watch，首次 false） |
| open              | `()`                 | 开启动画开始                                             |
| opened            | `()`                 | 开启动画结束                                             |
| close             | `()`                 | 关闭被触发                                               |
| closed            | `()`                 | 关闭动画结束                                             |

### Slots

| 名称       | 说明                                              |
| ---------- | ------------------------------------------------- |
| default    | 抽屉主体内容                                      |
| title      | 自定义标题（覆盖 `title` 属性）                   |
| footer     | 自定义底部内容（优先级高于 `footer` prop）        |
| extra      | 标题右侧操作区（与 `title` 同行，inline-flex）    |
| close-icon | 自定义关闭图标（优先级高于 `closable.closeIcon`） |
