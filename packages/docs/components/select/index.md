# Select 选择器

从一组选项中选择一个或多个值，支持分组、字段名映射、自定义渲染、远程搜索、tags、popup 定位和 FormItem 校验联动。

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

## FormItem 联动

放在 `<c-form-item>` 里时自动注入校验上下文：

- `validateStatus` 改变会同步到 Select 的 error / warning 边框颜色
- `modelValue` 改变后自动 `validate('change')`
- 下拉关闭后自动 `validate('blur')`

也可以手动设置 `status="error" | "warning" | "success" | "validating"` 临时覆盖。

## Props

| 参数           | 类型                                                  | 默认值      | 说明                                            |
| -------------- | ----------------------------------------------------- | ----------- | ----------------------------------------------- |
| modelValue     | `string / number / array`                             | --          | 绑定值                                          |
| options        | `Array<SelectOption \| SelectGroupOption>`            | `[]`        | 选项列表，含 `options` 数组的节点视为分组       |
| fieldNames     | `{ label?, value?, disabled?, options? }`             | --          | 字段名映射                                      |
| mode           | `'default' / 'multiple' / 'tags'`                     | `'default'` | 模式；`tags` 允许 Enter 输入新值                |
| multiple       | `boolean`                                             | `false`     | 兼容旧 prop，等价于 `mode="multiple"`           |
| filterable     | `boolean`                                             | `false`     | 显示搜索框                                      |
| filterOption   | `boolean / (input, option) => boolean`                | `true`      | 过滤策略；`false` 走远程搜索；函数自定义谓词    |
| placement      | `'bottom' / 'top' / 'auto'`                           | `'bottom'`  | 浮层位置（基于 floating-ui，自动 flip / shift） |
| popupClassName | `string`                                              | `''`        | 浮层附加类                                      |
| placeholder    | `string`                                              | --          | 占位文本                                        |
| disabled       | `boolean`                                             | `false`     | 是否禁用                                        |
| clearable      | `boolean`                                             | `false`     | 是否可清空                                      |
| loading        | `boolean`                                             | `false`     | 加载中                                          |
| size           | `'large' / 'default' / 'small'`                       | `'default'` | 尺寸                                            |
| noDataText     | `string`                                              | `No data`   | 空状态文本                                      |
| loadingText    | `string`                                              | `Loading`   | 加载文本                                        |
| maxTagCount    | `number`                                              | `3`         | 多选最多直接展示的标签数                        |
| status         | `'' / 'error' / 'warning' / 'success' / 'validating'` | `''`        | 显式校验状态，覆盖 FormItem 注入                |

## 事件

| 事件              | 回调签名             | 说明                          |
| ----------------- | -------------------- | ----------------------------- |
| update:modelValue | `(value)`            | 选中值变化                    |
| change            | `(value)`            | 选中值变化（与 v-model 同步） |
| search            | `(input: string)`    | 搜索文本变化                  |
| visible-change    | `(visible: boolean)` | 下拉显示状态变化              |
| clear             | `()`                 | 点击清除按钮                  |

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
