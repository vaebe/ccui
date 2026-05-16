# Select 选择器

从一组选项中选择一个或多个值，支持分组（含嵌套）、字段名映射、自定义渲染、远程搜索、tags、popup 定位、Teleport 容器、虚拟列表、完整 ARIA、键盘导航、labelInValue、maxCount、命中高亮和 FormItem 校验联动。

## 基本用法

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('lucy')
const options = [
  { label: 'Jack', value: 'jack' },
  { label: 'Lucy', value: 'lucy' },
  { label: 'Disabled', value: 'disabled', disabled: true },
]
</script>

<template>
  <c-select v-model="value" :options="options" placeholder="请选择成员" />
</template>
```

:::

## 多选

`mode="multiple"`（或保留兼容的 `multiple`）。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(['jack'])
const options = [
  { label: 'Jack', value: 'jack' },
  { label: 'Lucy', value: 'lucy' },
  { label: 'Tom', value: 'tom' },
]
</script>

<template>
  <c-select v-model="value" mode="multiple" clearable :options="options" placeholder="请选择成员" />
</template>
```

:::

## Tags 模式（自由输入）

`mode="tags"` 允许用户在搜索框中按 Enter 创建未在列表中的新 tag。空白和重复值会被忽略。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string[]>(['vue'])
const options = [
  { label: 'vue', value: 'vue' },
  { label: 'react', value: 'react' },
  { label: 'svelte', value: 'svelte' },
]
</script>

<template>
  <c-select v-model="value" mode="tags" filterable clearable :options="options" placeholder="按 Enter 添加新 tag" />
</template>
```

:::

## 可搜索 / 远程搜索

`filterable` 默认开启**前端**模糊匹配。设置 `filterOption=false` 关掉前端过滤，监听 `search` 事件做远程数据加载，配合 `loading` 控制加载态。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
const options = ref<Array<{ label: string; value: string }>>([])
const loading = ref(false)

let timer: ReturnType<typeof setTimeout> | null = null
function onSearch(keyword: string) {
  if (timer) clearTimeout(timer)
  if (!keyword) {
    options.value = []
    return
  }
  loading.value = true
  timer = setTimeout(() => {
    options.value = ['Beijing', 'Shanghai', 'Shenzhen']
      .filter((city) => city.toLowerCase().includes(keyword.toLowerCase()))
      .map((label) => ({ label, value: label }))
    loading.value = false
  }, 300)
}
</script>

<template>
  <c-select
    v-model="value"
    filterable
    clearable
    :options="options"
    :filter-option="false"
    :loading="loading"
    placeholder="输入城市..."
    @search="onSearch"
  />
</template>
```

:::

也可以传函数自定义匹配逻辑：

```vue
<c-select
  v-model="value"
  filterable
  :options="options"
  :filter-option="(input, option) => option.label.startsWith(input)"
/>
```

## 选项分组

在 `options` 里写 group 节点（含 `options` 数组）即可。同样支持搜索时按 group 折叠空组。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
const options = [
  {
    label: '前端',
    options: [
      { label: 'Vue', value: 'vue' },
      { label: 'React', value: 'react' },
    ],
  },
  {
    label: '后端',
    options: [
      { label: 'Go', value: 'go' },
      { label: 'Rust', value: 'rust' },
    ],
  },
]
</script>

<template>
  <c-select v-model="value" :options="options" placeholder="选择技术栈" />
</template>
```

:::

## fieldNames 字段名映射

列表数据字段不叫 `label`/`value` 时用 `fieldNames` 映射：

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
const data = [
  {
    name: '水果',
    items: [
      { name: 'Apple', id: 1 },
      { name: 'Banana', id: 2 },
      { name: 'Cherry', id: 3, locked: true },
    ],
  },
]
</script>

<template>
  <c-select
    v-model="value"
    :options="data"
    :field-names="{ label: 'name', value: 'id', disabled: 'locked', options: 'items' }"
    placeholder="选择水果"
  />
</template>
```

:::

## 自定义渲染（option / tag / empty）

通过插槽自定义下拉项、已选 tag、空状态。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(['jack'])
const options = [
  { label: 'Jack', value: 'jack', avatar: '🦊' },
  { label: 'Lucy', value: 'lucy', avatar: '🐱' },
  { label: 'Tom', value: 'tom', avatar: '🐶' },
]
</script>

<template>
  <c-select v-model="value" mode="multiple" clearable :options="options">
    <template #option="{ option, selected }">
      <span>{{ option.raw.avatar }} {{ option.label }}</span>
      <span v-if="selected" style="margin-left: 8px;">✓</span>
    </template>
    <template #tag="{ option, onClose }">
      <span style="display: inline-flex; gap: 4px; padding: 0 8px; background: #e6f4ff; border-radius: 12px;">
        {{ option.raw.avatar }} {{ option.label }}
        <span style="cursor: pointer;" @click.stop="onClose">×</span>
      </span>
    </template>
    <template #empty>
      <div>没有匹配的人</div>
    </template>
  </c-select>
</template>
```

:::

## Popup 位置

`placement` 控制下拉位置（`bottom`/`top`/`auto`，基于 [@floating-ui](https://floating-ui.com/) 自动 flip）。`popupClassName` 给浮层挂自定义类。

```vue
<c-select v-model="value" :options="options" placement="top" popup-class-name="my-select-popup" />
```

## 虚拟列表（大数据量）

`virtualScroll` 启用后下拉框只渲染可视区域 + 缓冲区，能流畅承载几千上万条选项。`virtualItemHeight` 控制单项高度（默认 32px），`virtualMaxHeight` 控制下拉最大高度（默认 240px）。键盘 PageUp/PageDown/Home/End 自动滚到对应位置。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
const options = Array.from({ length: 5000 }, (_, i) => ({ label: `Option ${i}`, value: i }))
</script>

<template>
  <c-select
    v-model="value"
    filterable
    :options="options"
    virtual-scroll
    :virtual-item-height="32"
    :virtual-max-height="320"
  />
</template>
```

## 嵌套分组

`options` 数组里的 group 节点可以再嵌套 group：

```vue
<c-select
  :options="[
    {
      label: '前端',
      options: [
        {
          label: '框架',
          options: [
            { label: 'Vue', value: 'vue' },
            { label: 'React', value: 'react' },
          ],
        },
        {
          label: '工具链',
          options: [
            { label: 'Vite', value: 'vite' },
            { label: 'Webpack', value: 'webpack' },
          ],
        },
      ],
    },
  ]"
/>
```

## 命中高亮

`highlightMatch` 让 filterable 模式下命中的子串包在 `<mark class="ccui-select__highlight">` 里：

```vue
<c-select v-model="value" filterable highlight-match :options="options" />
```

## Teleport 浮层

默认浮层渲染在组件内部 DOM。需要把浮层挂到指定容器（避免被父级 `overflow:hidden` 截断）时：

```vue
<!-- 挂到 body -->
<c-select v-model="value" :options="options" popup-append-to-body />

<!-- 挂到自定义容器 -->
<c-select v-model="value" :options="options" :get-popup-container="() => myRef" />
```

## labelInValue 模式

默认 `modelValue` 只是 value。某些场景下需要同时拿到 label（比如展示已选项的额外字段、避免再去 options 里查找）。设置 `labelInValue` 后绑定值变成 `{ value, label }` 形态：

```vue
<script setup lang="ts">
import { ref } from 'vue'

// 单选：{ value: 'jack', label: 'Jack' }
const single = ref()
// 多选：[{ value: 'jack', label: 'Jack' }, ...]
const multi = ref([])
</script>

<template>
  <c-select v-model="single" label-in-value :options="options" />
  <c-select v-model="multi" mode="multiple" label-in-value :options="options" />
</template>
```

## 选择数量上限

`maxCount` 限制 multiple / tags 模式下最多可选数：

```vue
<c-select v-model="value" mode="multiple" :max-count="3" :options="options" />
```

到达上限后再点选项或按 Enter 创建 tag 都不会触发 update。

## ARIA 与键盘导航

放在 `<c-form-item>` 里时自动注入校验上下文，同时本组件内置：

| 按键        | 行为                             |
| ----------- | -------------------------------- |
| Enter       | 打开下拉 / 选中当前项 / 创建 tag |
| Esc         | 关闭下拉                         |
| ↑ / ↓       | 上一项 / 下一项（跳过 disabled） |
| Home / End  | 首项 / 末项                      |
| PageUp/Down | 翻页                             |
| Backspace   | 多选 + 搜索为空时删最后一个 tag  |

ARIA 已挂：`role="combobox"` + `aria-expanded` + `aria-controls` + `aria-haspopup="listbox"` + `aria-activedescendant`，每个选项有独立 `id` + `role="option"` + `aria-selected` + `aria-disabled`。

## optionLabelProp 已选展示字段

下拉里的 label 通常较长（带说明、详情）。`optionLabelProp` 让单选 / 多选已选展示用另一个字段，下拉项里仍按 `label` 渲染：

```vue
<script setup lang="ts">
const data = [
  { label: 'Apple - red, sweet', value: 'apple', short: 'Apple' },
  { label: 'Banana - yellow, soft', value: 'banana', short: 'Banana' },
]
</script>

<template>
  <c-select :options="data" option-label-prop="short" />
</template>
```

字段缺失时回退到 `label`。

## showSearch 别名

`showSearch` 等价于 `filterable`，与其他社区库 API 对齐：

```vue
<c-select :options="options" show-search :filter-option="false" @search="onSearch" />
```

## 自定义浮层动画

通过 `transitionName` 设置 Vue Transition 名（默认 `ccui-select-fade`，淡入 + 4px 上滑）。给浮层换一个动画只需提供匹配的 CSS：

```vue
<c-select :options="options" transition-name="my-zoom" />
<style>
.my-zoom-enter-active,
.my-zoom-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.my-zoom-enter-from,
.my-zoom-leave-to {
  opacity: 0;
  transform: scaleY(0.9);
}
</style>
```

## 拖拽排序已选 tag

`tagsDraggable` 启用后，多选 / tags 模式下用户可以拖拽 tag 调整顺序：

```vue
<c-select v-model="value" mode="multiple" tags-draggable :options="options" />
```

被拖中的 tag 会降透明，drop 目标会高亮边框，松开后 `update:modelValue` 直接给出新顺序。

## FormItem 联动

放在 `<c-form-item>` 里时自动注入校验上下文：

- `validateStatus` 改变会同步到 Select 的 error / warning 边框颜色
- `modelValue` 改变后自动 `validate('change')`
- 下拉关闭后自动 `validate('blur')`

也可以手动设置 `status="error" | "warning" | "success" | "validating"` 临时覆盖。

## Variants

录入组件统一 `variant` 形态。四档：`outlined`（默认）/ `filled` / `borderless` / `underlined`。

:::demo

```vue
<template>
  <div style="margin-bottom: 12px">
    <c-segmented v-model="variant" :options="['outlined', 'filled', 'borderless', 'underlined']" />
  </div>
  <c-select v-model="value" :variant="variant" :options="opts" placeholder="切换 variant 观察样式" />
</template>

<script setup>
import { ref } from 'vue'
const variant = ref('outlined')
const value = ref('')
const opts = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma' },
]
</script>
```

:::

## Props

| 参数                     | 类型                                                  | 默认值             | 说明                                            |
| ------------------------ | ----------------------------------------------------- | ------------------ | ----------------------------------------------- |
| modelValue               | `string / number / array`                             | --                 | 绑定值                                          |
| options                  | `Array<SelectOption \| SelectGroupOption>`            | `[]`               | 选项列表，含 `options` 数组的节点视为分组       |
| fieldNames               | `{ label?, value?, disabled?, options? }`             | --                 | 字段名映射                                      |
| mode                     | `'default' / 'multiple' / 'tags'`                     | `'default'`        | 模式；`tags` 允许 Enter 输入新值                |
| multiple                 | `boolean`                                             | `false`            | 兼容旧 prop，等价于 `mode="multiple"`           |
| filterable               | `boolean`                                             | `false`            | 显示搜索框                                      |
| filterOption             | `boolean / (input, option) => boolean`                | `true`             | 过滤策略；`false` 走远程搜索；函数自定义谓词    |
| placement                | `'bottom' / 'top' / 'auto'`                           | `'bottom'`         | 浮层位置（基于 floating-ui，自动 flip / shift） |
| popupClassName           | `string`                                              | `''`               | 浮层附加类                                      |
| placeholder              | `string`                                              | --                 | 占位文本                                        |
| disabled                 | `boolean`                                             | `false`            | 是否禁用                                        |
| clearable                | `boolean`                                             | `false`            | 是否可清空                                      |
| loading                  | `boolean`                                             | `false`            | 加载中                                          |
| size                     | `'large' / 'default' / 'small'`                       | `'default'`        | 尺寸                                            |
| noDataText               | `string`                                              | `No data`          | 空状态文本                                      |
| loadingText              | `string`                                              | `Loading`          | 加载文本                                        |
| maxTagCount              | `number`                                              | `3`                | 多选最多直接展示的标签数                        |
| status                   | `'' / 'error' / 'warning' / 'success' / 'validating'` | `''`               | 显式校验状态，覆盖 FormItem 注入                |
| labelInValue             | `boolean`                                             | `false`            | 启用后 modelValue 变成 `{ value, label }` 形态  |
| autoFocus                | `boolean`                                             | `false`            | 挂载后自动聚焦                                  |
| defaultActiveFirstOption | `boolean`                                             | `true`             | 打开下拉时是否预选第一个非禁用项                |
| highlightMatch           | `boolean`                                             | `false`            | 搜索命中子串包 `<mark>`                         |
| maxCount                 | `number`                                              | `0`                | 多选/tags 最大可选数，0 表示不限                |
| getPopupContainer        | `(triggerNode) => HTMLElement \| null`                | --                 | 自定义浮层挂载点（自动 Teleport 到该容器）      |
| popupAppendToBody        | `boolean`                                             | `false`            | 等价于 `getPopupContainer: () => document.body` |
| virtualScroll            | `boolean`                                             | `false`            | 启用虚拟列表                                    |
| virtualItemHeight        | `number`                                              | `32`               | 虚拟列表单项高度（px）                          |
| virtualMaxHeight         | `number`                                              | `240`              | 虚拟列表最大可视高度（px）                      |
| optionLabelProp          | `string`                                              | --                 | 已选展示字段（不影响下拉项渲染和过滤）          |
| showSearch               | `boolean`                                             | `false`            | `filterable` 别名                               |
| transitionName           | `string`                                              | `ccui-select-fade` | 浮层 Vue Transition 名称                        |
| tagsDraggable            | `boolean`                                             | `false`            | 多选 / tags 模式下允许拖拽 tag 重排             |

## 事件

| 事件              | 回调签名              | 说明                          |
| ----------------- | --------------------- | ----------------------------- |
| update:modelValue | `(value)`             | 选中值变化                    |
| change            | `(value)`             | 选中值变化（与 v-model 同步） |
| search            | `(input: string)`     | 搜索文本变化                  |
| visible-change    | `(visible: boolean)`  | 下拉显示状态变化              |
| clear             | `()`                  | 点击清除按钮                  |
| focus             | `(event: FocusEvent)` | 根元素获得焦点                |
| blur              | `(event: FocusEvent)` | 根元素失去焦点                |

## 插槽

| 插槽     | 参数                   | 说明                             |
| -------- | ---------------------- | -------------------------------- |
| option   | `{ option, selected }` | 自定义下拉项内容                 |
| tag      | `{ option, onClose }`  | 自定义已选 tag（多选/tags 模式） |
| selected | `{ option }`           | 自定义单选选中态展示             |
| empty    | --                     | 自定义空状态                     |
| prefix   | --                     | 选择器左侧 prefix                |
| suffix   | --                     | 选择器右侧 suffix                |

## 类型

```ts
interface SelectOption {
  label?: unknown
  value?: string | number
  disabled?: boolean
  [key: string]: unknown
}

interface SelectGroupOption {
  label?: unknown
  options: SelectOption[]
  [key: string]: unknown
}

interface SelectFieldNames {
  label?: string
  value?: string
  disabled?: string
  options?: string
}

interface ResolvedSelectOption {
  raw: SelectOption // 原始数据
  label: unknown
  value: string | number
  disabled: boolean
  groupLabel?: unknown
}

type SelectFilterOption = boolean | ((input: string, option: SelectOption) => boolean)
```

## 解析与匹配优先级

- `mode` 优先于 `multiple`；`mode='tags'` 时 `filterable` 应同时开启以露出输入框。
- `filterOption=false` 完全跳过前端过滤；函数返回 `true` 即视为命中。
- `fieldNames` 不影响 `modelValue`：传入和回传仍然是 `value` 字段（按映射后的字段）的原始值。
- 注入到 FormItem 时 `status` 优先级高于 `formItem.validateStatus`。
