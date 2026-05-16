# Typography 排版

文本内容的基本格式。

## 何时使用

- 文章 / 博客 / 详情页中的标题、段落、引用、链接。
- 需要一组语义化的文本类型（强调、次要、错误等）。

## 基本使用

`<c-typography>` 是排版的容器，里面可以放 Title / Paragraph / Text / Link。

:::demo

```vue
<template>
  <c-typography>
    <c-typography-title>Introduction</c-typography-title>
    <c-typography-paragraph>
      In the process of internal desktop applications development, many different design specs and implementations would
      be involved.
    </c-typography-paragraph>
    <c-typography-paragraph>
      After massive project practice and summaries, a coherent design language for background applications can
      take shape.
    </c-typography-paragraph>
    <c-typography-title :level="2">Guidelines and Resources</c-typography-title>
    <c-typography-paragraph>
      <c-typography-link href="#">Design system</c-typography-link>
      <c-typography-text> · </c-typography-text>
      <c-typography-text type="secondary">A UI design language</c-typography-text>
    </c-typography-paragraph>
  </c-typography>
</template>
```

:::

## 五级标题

`level` 取 1–5，对应 `<h1>`–`<h5>`。

:::demo

```vue
<template>
  <c-typography-title>h1. Title</c-typography-title>
  <c-typography-title :level="2">h2. Title</c-typography-title>
  <c-typography-title :level="3">h3. Title</c-typography-title>
  <c-typography-title :level="4">h4. Title</c-typography-title>
  <c-typography-title :level="5">h5. Title</c-typography-title>
</template>
```

:::

## 语义化文本

`type` 表达"次要 / 成功 / 警告 / 危险"四种语义。

:::demo

```vue
<template>
  <c-typography-text>Default</c-typography-text>
  <br />
  <c-typography-text type="secondary">Secondary</c-typography-text>
  <br />
  <c-typography-text type="success">Success</c-typography-text>
  <br />
  <c-typography-text type="warning">Warning</c-typography-text>
  <br />
  <c-typography-text type="danger">Danger</c-typography-text>
  <br />
  <c-typography-text disabled>Disabled</c-typography-text>
</template>
```

:::

## 文本样式装饰

可叠加：`mark` 高亮 / `code` 代码 / `keyboard` 键盘 / `underline` 下划线 / `delete` 删除线 / `strong` 加粗 / `italic` 斜体。

:::demo

```vue
<template>
  <c-typography-text mark>Marked</c-typography-text>&nbsp; <c-typography-text code>code()</c-typography-text>&nbsp;
  <c-typography-text keyboard>Cmd+K</c-typography-text>&nbsp;
  <c-typography-text underline>Underline</c-typography-text>&nbsp;
  <c-typography-text delete>Deleted</c-typography-text>&nbsp; <c-typography-text strong>Strong</c-typography-text>&nbsp;
  <c-typography-text italic>Italic</c-typography-text>
</template>
```

:::

## 链接

`<c-typography-link>` 与 `<a>` 用法一致，自动附带主色 / hover 风格。

:::demo

```vue
<template>
  <c-typography-link href="https://vuejs.org" target="_blank">Vue.js 官网</c-typography-link>
  <br />
  <c-typography-link href="#" type="warning">警告链接</c-typography-link>
  <br />
  <c-typography-link href="#" disabled>禁用链接</c-typography-link>
</template>
```

:::

## 段落组合

实战示例：用 Typography 组合标题 / 段落 / 链接构成一个迷你文章页。

:::demo

```vue
<template>
  <c-typography style="max-width: 720px">
    <c-typography-title>设计语言与组件库</c-typography-title>
    <c-typography-paragraph type="secondary">
      在企业级中后台体系中，统一的设计语言是规模化协作的基石。
    </c-typography-paragraph>
    <c-typography-title :level="3">为什么需要组件库？</c-typography-title>
    <c-typography-paragraph>
      把<c-typography-text mark>设计 token</c-typography-text>沉淀到组件，避免每个页面重新发明轮子；
      把<c-typography-text code>常见交互</c-typography-text>抽象成统一行为，降低用户认知负担。
    </c-typography-paragraph>
    <c-typography-paragraph>
      详细方法可参考
      <c-typography-link href="#">设计指南</c-typography-link>。
    </c-typography-paragraph>
  </c-typography>
</template>
```

:::

## 可复制（copyable）

文本右侧渲染复制按钮，点击调用 `navigator.clipboard.writeText`。3 秒后图标自动恢复。

::: tip 自定义复制图标

通过 **slot `copy-icon`** + scope `{ copied }` 自定义图标，渲染回调式 API 一律走 slot（数据元组 `tooltips: [before, after]` 保留为 prop）。

:::

### 基本复制

最简形式 `:copyable="true"`，复制文字 = 显示文字。

:::demo

```vue
<template>
  <c-typography-text :copyable="true">复制这段文本</c-typography-text>
</template>
```

:::

### 复制不同的文本（cfg.text）

显示一段、复制另一段；典型场景是显示脱敏文本而复制原值。

:::demo

```vue
<template>
  <c-typography-text :copyable="{ text: 'sk-fullsecret123456' }"> sk-***456（点 ⎘ 复制完整 token） </c-typography-text>
</template>
```

:::

### onCopy 回调与计数

复制完成后触发 `onCopy(text)`，可用于埋点 / 提示 / 计数。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
const lastText = ref('')

function handleCopy(text) {
  count.value += 1
  lastText.value = text
}
</script>

<template>
  <c-typography-text :copyable="{ onCopy: handleCopy }">复制我看看</c-typography-text>
  <br />
  <span style="color: #666; font-size: 13px">
    已复制 {{ count }} 次<span v-if="lastText">，上次内容：「{{ lastText }}」</span>
  </span>
</template>
```

:::

### 自定义 tooltips（hover 文字）

`tooltips: [复制前, 复制后]` 替换默认 `['复制', '已复制']`；传 `false` 完全关闭 hover title。

:::demo

```vue
<template>
  <c-typography-text :copyable="{ tooltips: ['点我复制', '搞定！'] }"> 自定义 hover 文字 </c-typography-text>
  <br />
  <c-typography-text :copyable="{ tooltips: false }"> 不显示 hover 提示 </c-typography-text>
</template>
```

:::

### 自定义图标（copy-icon slot）

slot 接收 `{ copied }` 作用域参数，可根据复制态切换图标。

:::demo

```vue
<template>
  <c-typography-text :copyable="true">
    带自定义 icon
    <template #copy-icon="{ copied }">
      {{ copied ? '✅ 已复制' : '📋' }}
    </template>
  </c-typography-text>
</template>
```

:::

### 短延时（copyableDelay）

`copyableDelay` 控制复制后图标恢复的毫秒数（默认 3000），可改为更激进的 800ms。

:::demo

```vue
<template>
  <c-typography-text :copyable="{ copyableDelay: 800 }"> 快速恢复（0.8s） </c-typography-text>
</template>
```

:::

### 在 Title / Paragraph / Link 上的复制

`copyable` 是 Text / Title / Paragraph / Link 4 组件共享 prop。

:::demo

```vue
<template>
  <c-typography-title :level="4" :copyable="true"> 可复制的 H4 标题 </c-typography-title>
  <c-typography-paragraph :copyable="true"> 可复制的段落。Lorem ipsum dolor sit amet. </c-typography-paragraph>
  <c-typography-link href="#" :copyable="{ text: 'https://example.com/full' }"> 可复制的链接 </c-typography-link>
</template>
```

:::

### CopyableConfig

| 字段          | 类型                        | 默认                | 说明                                           |
| ------------- | --------------------------- | ------------------- | ---------------------------------------------- |
| text          | string                      | slot.text           | 实际复制的文本；不传则取 default slot 的纯文本 |
| copyableDelay | number                      | `3000`              | 复制后图标恢复延时（ms）                       |
| tooltips      | `[string, string] \| false` | `['复制','已复制']` | 鼠标 hover 时的 title 文字（hover tooltip）    |
| onCopy        | `(text: string) => void`    | —                   | 复制完成回调                                   |

### slot

| 名称      | 作用域       | 说明                                  |
| --------- | ------------ | ------------------------------------- |
| copy-icon | `{ copied }` | 自定义复制按钮 icon（替代默认 ⎘ / ✓） |

## 可编辑（editable）

点击编辑按钮（或文本本身，配置 `triggerType: ['text']`）切入 textarea 内联编辑；Enter 提交、Escape 取消，blur 自动提交。

### 基本编辑

点 ✎ 进入编辑态；textarea 自动 focus；Enter 提交，Escape 取消。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const text = ref('点 ✎ 编辑我')
</script>

<template>
  <c-typography-text :editable="{ text, onChange: (v) => (text = v) }">
    {{ text }}
  </c-typography-text>
</template>
```

:::

### 点文本即编辑（triggerType=['text']）

省去 icon，点击文本本身进入编辑态；适合「就地修改」场景。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const text = ref('点这段文字试试')
</script>

<template>
  <c-typography-text
    :editable="{
      text,
      triggerType: ['text'],
      onChange: (v) => (text = v),
    }"
  >
    {{ text }}
  </c-typography-text>
</template>
```

:::

### icon + text 双触发

两种触发方式可以组合，点 icon 或文本都能进入编辑。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const text = ref('点 icon 或点文字都可以')
</script>

<template>
  <c-typography-text
    :editable="{
      text,
      triggerType: ['icon', 'text'],
      onChange: (v) => (text = v),
    }"
  >
    {{ text }}
  </c-typography-text>
</template>
```

:::

### maxLength 限制

限制最大字符数；超出后 textarea 原生阻断输入。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const text = ref('最多 10 个字符')
</script>

<template>
  <c-typography-text
    :editable="{
      text,
      maxLength: 10,
      onChange: (v) => (text = v),
    }"
  >
    {{ text }}
  </c-typography-text>
  <br />
  <span style="color: #666; font-size: 13px">当前 {{ text.length }} / 10 字</span>
</template>
```

:::

### onStart / onCancel / onEnd 三态回调

完整生命周期：进入 → 修改 → 提交（onChange + onEnd）或 取消（onCancel）。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const text = ref('编辑追踪 demo')
const log = ref([])

function push(msg) {
  log.value.unshift(`${new Date().toLocaleTimeString()}  ${msg}`)
  if (log.value.length > 5) log.value.length = 5
}
</script>

<template>
  <c-typography-text
    :editable="{
      text,
      onStart: () => push('进入编辑'),
      onChange: (v) => {
        text = v
        push(`提交：${v}`)
      },
      onCancel: () => push('Escape 取消'),
      onEnd: () => push('编辑结束'),
    }"
  >
    {{ text }}
  </c-typography-text>
  <ul style="color: #666; font-size: 12px; margin-top: 8px">
    <li v-for="l in log" :key="l">{{ l }}</li>
  </ul>
</template>
```

:::

### 自定义 edit-icon

通过 `#edit-icon` slot 替换默认 ✎ 图标。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const text = ref('自定义 icon')
</script>

<template>
  <c-typography-text :editable="{ text, onChange: (v) => (text = v), tooltip: '点我编辑' }">
    {{ text }}
    <template #edit-icon>🖊️</template>
  </c-typography-text>
</template>
```

:::

### 用 @update:editable-text 同步外部状态

除 `onChange`，组件还会 emit `update:editable-text` 事件，可直接监听同步外部 ref（与 `onChange` 二选一即可）。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const text = ref('emit 同步')
</script>

<template>
  <c-typography-text :editable="{ text }" @update:editable-text="text = $event">
    {{ text }}
  </c-typography-text>
  <br />
  <span style="color: #666; font-size: 13px">外部 ref：「{{ text }}」</span>
</template>
```

:::

### EditableConfig

| 字段        | 类型                      | 默认       | 说明                              |
| ----------- | ------------------------- | ---------- | --------------------------------- |
| triggerType | `Array<'icon' \| 'text'>` | `['icon']` | 编辑触发方式                      |
| tooltip     | `string \| false`         | —          | icon hover tooltip 文字           |
| editing     | boolean                   | —          | 受控编辑态                        |
| text        | string                    | slot.text  | 初始编辑文本                      |
| maxLength   | number                    | —          | 最大字符数                        |
| onStart     | `() => void`              | —          | 进入编辑回调                      |
| onChange    | `(value: string) => void` | —          | Enter 提交时回调                  |
| onCancel    | `() => void`              | —          | Escape 取消时回调                 |
| onEnd       | `() => void`              | —          | 编辑完成回调（onChange 之后触发） |

### slot

| 名称      | 作用域 | 说明                              |
| --------- | ------ | --------------------------------- |
| edit-icon | —      | 自定义编辑按钮 icon（替代默认 ✎） |

## 截断（ellipsis）

文字超出指定行数自动截断；可配合 `expandable` 展开 / 收起，或 `tooltip` 鼠标 hover 看完整内容。

::: warning jsdom 不能测真实尺寸

`ellipsis` 的视觉效果靠 CSS `text-overflow: ellipsis` + `-webkit-line-clamp`。jsdom 无 layout 引擎，**测试只覆盖逻辑分支**（class 是否挂载 / slot 是否渲染 / expand state 切换 / title attribute），实际截断效果请在浏览器 demo 中肉眼验证。

:::

### 单行截断

最常见用法，`ellipsis: true` 等价于 `{ rows: 1 }`。

:::demo

```vue
<template>
  <c-typography-paragraph :ellipsis="true" style="max-width: 300px">
    这是一段很长的文字，单行截断，超出部分会被省略号代替。Lorem ipsum dolor sit amet consectetur adipisicing elit.
    Quisquam, voluptatum.
  </c-typography-paragraph>
</template>
```

:::

### 多行截断

`rows` 控制截断行数（基于 `-webkit-line-clamp`）。

:::demo

```vue
<template>
  <c-typography-paragraph :ellipsis="{ rows: 2 }" style="max-width: 360px">
    两行截断。Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum, debitis quasi quaerat
    quibusdam earum sed odio nemo quos repudiandae illo ratione quod sequi animi cumque expedita facere?
  </c-typography-paragraph>
  <c-typography-paragraph :ellipsis="{ rows: 3 }" style="max-width: 360px">
    三行截断。Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum, debitis quasi quaerat
    quibusdam earum sed odio nemo quos repudiandae illo ratione quod sequi animi cumque expedita facere? Doloribus
    excepturi nesciunt fuga, dolore minus eligendi tempora?
  </c-typography-paragraph>
  <c-typography-paragraph :ellipsis="{ rows: 5 }" style="max-width: 360px">
    五行截断。Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum, debitis quasi quaerat
    quibusdam earum sed odio nemo quos repudiandae illo ratione quod sequi animi cumque expedita facere? Doloribus
    excepturi nesciunt fuga, dolore minus eligendi tempora? Excepturi animi corrupti, alias modi sapiente ipsam
    reiciendis. Atque rem culpa quam debitis pariatur eum laborum modi.
  </c-typography-paragraph>
</template>
```

:::

### 可展开（单向）

`expandable: true` 显示「展开」按钮；展开后按钮消失。

:::demo

```vue
<template>
  <c-typography-paragraph :ellipsis="{ rows: 2, expandable: true }" style="max-width: 360px">
    单向展开。Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum, debitis quasi quaerat
    quibusdam earum sed odio nemo quos repudiandae illo ratione quod sequi animi cumque expedita facere?
  </c-typography-paragraph>
</template>
```

:::

### 可展开 + 可收起（collapsible）

`expandable: 'collapsible'` 展开后切「收起」按钮，可来回切换。

:::demo

```vue
<template>
  <c-typography-paragraph :ellipsis="{ rows: 2, expandable: 'collapsible' }" style="max-width: 360px">
    可来回切换。Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum, debitis quasi quaerat
    quibusdam earum sed odio nemo quos repudiandae illo ratione quod sequi animi cumque expedita facere?
  </c-typography-paragraph>
</template>
```

:::

### 自定义展开 / 收起文字

`expand-text` 和 `collapse-text` slot 替换默认「展开」/「收起」。

:::demo

```vue
<template>
  <c-typography-paragraph :ellipsis="{ rows: 2, expandable: 'collapsible' }" style="max-width: 360px">
    自定义按钮文字。Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum, debitis quasi quaerat
    quibusdam earum sed odio nemo quos repudiandae illo ratione quod sequi animi cumque expedita facere?
    <template #expand-text>▼ 展开更多</template>
    <template #collapse-text>▲ 收起内容</template>
  </c-typography-paragraph>
</template>
```

:::

### tooltip 显示完整内容

`tooltip: true` 用原生 `title` 属性显示完整内容；hover 鼠标即可看；`tooltip: '自定义文字'` 替换为指定字符串。

:::demo

```vue
<template>
  <c-typography-paragraph :ellipsis="{ tooltip: true }" style="max-width: 300px">
    Hover 我看完整内容。Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.
  </c-typography-paragraph>
  <c-typography-paragraph :ellipsis="{ tooltip: '提示：这是脱敏后的预览' }" style="max-width: 300px">
    Hover 看自定义 tooltip 文案。Lorem ipsum dolor sit amet consectetur.
  </c-typography-paragraph>
</template>
```

:::

### 受控展开（expanded）

外部 ref 控制展开态，配合自定义按钮做更复杂的交互。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const expanded = ref(false)
</script>

<template>
  <c-typography-paragraph :ellipsis="{ rows: 2, expanded, onExpand: (v) => (expanded = v) }" style="max-width: 360px">
    受控展开。Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum, debitis quasi quaerat
    quibusdam earum sed odio nemo quos repudiandae illo ratione quod sequi animi cumque expedita facere?
  </c-typography-paragraph>
  <c-button @click="expanded = !expanded"> 外部按钮：{{ expanded ? '收起' : '展开' }} </c-button>
</template>
```

:::

### Title 也支持 ellipsis

`ellipsis` 在 Title 上同样生效（长标题截断常见）。

:::demo

```vue
<template>
  <c-typography-title :level="3" :ellipsis="{ rows: 1, tooltip: true }" style="max-width: 300px">
    超长标题示例 Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam.
  </c-typography-title>
</template>
```

:::

## 三大交互组合使用

`copyable` / `editable` / `ellipsis` 可同时启用——按 UI 顺序渲染「截断按钮 → 编辑按钮 → 复制按钮」。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const text = ref(
  '这是一段可以编辑、可以复制、还可以截断展开的多功能文本。Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam.',
)
</script>

<template>
  <c-typography-paragraph
    style="max-width: 360px"
    :copyable="{ text }"
    :editable="{ text, onChange: (v) => (text = v) }"
    :ellipsis="{ rows: 2, expandable: 'collapsible' }"
  >
    {{ text }}
  </c-typography-paragraph>
</template>
```

:::

### EllipsisConfig

| 字段       | 类型                          | 默认    | 说明                                                             |
| ---------- | ----------------------------- | ------- | ---------------------------------------------------------------- |
| rows       | number                        | `1`     | 截断行数（>1 走 `-webkit-line-clamp` 多行）                      |
| expandable | `boolean \| 'collapsible'`    | `false` | true 显示展开按钮；`'collapsible'` 同时支持展开 + 收起           |
| expanded   | boolean                       | —       | 受控展开态                                                       |
| tooltip    | `boolean \| string`           | `false` | true 显示 `title` 原生 tooltip（jsdom 友好）；字符串则用该字符串 |
| onExpand   | `(expanded: boolean) => void` | —       | 展开 / 收起回调                                                  |
| onEllipsis | `(clipped: boolean) => void`  | —       | 文本是否被截断的状态变化回调（v2.x 待接入实际 measure）          |

### slot

| 名称          | 作用域 | 说明                               |
| ------------- | ------ | ---------------------------------- |
| expand-text   | —      | 自定义「展开」按钮文字（替代默认） |
| collapse-text | —      | 自定义「收起」按钮文字（替代默认） |

## API

### Title Props

| 参数  | 类型                    | 默认值 | 说明     |
| ----- | ----------------------- | ------ | -------- |
| level | `1 \| 2 \| 3 \| 4 \| 5` | `1`    | 标题级别 |

### Link Props

| 参数   | 类型   | 默认值 | 说明        |
| ------ | ------ | ------ | ----------- |
| href   | string | —      | 链接地址    |
| target | string | —      | 链接 target |

### 通用 Props（Text / Paragraph / Title / Link）

| 参数      | 类型                                                | 默认值  | 说明     |
| --------- | --------------------------------------------------- | ------- | -------- |
| type      | `'secondary' \| 'success' \| 'warning' \| 'danger'` | —       | 文本类型 |
| disabled  | boolean                                             | `false` | 禁用     |
| mark      | boolean                                             | `false` | 高亮     |
| code      | boolean                                             | `false` | 代码样式 |
| keyboard  | boolean                                             | `false` | 键盘样式 |
| underline | boolean                                             | `false` | 下划线   |
| delete    | boolean                                             | `false` | 删除线   |
| strong    | boolean                                             | `false` | 加粗     |
| italic    | boolean                                             | `false` | 斜体     |
