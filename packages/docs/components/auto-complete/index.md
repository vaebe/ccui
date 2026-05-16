# AutoComplete 自动完成

输入框 + 浮层下拉建议项。区别于 Select：值可以是任意字符串（不限于选项），适合做地址、邮箱、商品名、关键词等"补全"场景。

## 基本用法

`v-model` 绑定输入值，`options` 提供候选项。`options` 可以是 `string[]` 或 `{ value, label, disabled? }[]`。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const options = ['张三', '李四', '王五', '赵六']
</script>

<template>
  <c-auto-complete v-model="value" :options="options" placeholder="输入名字" />
  <div style="margin-top: 8px; color: rgba(0,0,0,.45)">value: {{ value }}</div>
</template>
```

:::

## 自定义选项格式

提供 `{ value, label, disabled }` 形态可以独立控制 value 和显示文本，并禁用某项。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const options = [
  { value: 'gmail.com', label: '@gmail.com' },
  { value: 'outlook.com', label: '@outlook.com' },
  { value: 'qq.com', label: '@qq.com' },
  { value: 'banned.com', label: '@banned.com', disabled: true },
]
</script>

<template>
  <c-auto-complete v-model="value" :options="options" placeholder="输入邮箱后缀" allow-clear />
</template>
```

:::

## 过滤逻辑

`filter-option` 控制候选项过滤：

- `true`（默认）：按 label 包含输入内容（不区分大小写）
- `false`：不过滤，全量展示
- `function`：自定义过滤函数 `(input, option) => boolean`

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
const fruits = ['Apple', 'Banana', 'Cherry', 'Durian']

function startsWith(input: string, option: { value: string }) {
  return String(option.value).toLowerCase().startsWith(input.toLowerCase())
}
</script>

<template>
  <c-auto-complete v-model="v1" :options="fruits" placeholder="默认 includes" />
  <c-auto-complete v-model="v2" :options="fruits" :filter-option="false" placeholder="不过滤" />
  <c-auto-complete v-model="v3" :options="fruits" :filter-option="startsWith" placeholder="startsWith 自定义" />
</template>
```

:::

## 大小写敏感

`case-sensitive=true` 让默认过滤区分大小写。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <c-auto-complete v-model="value" :options="['Apple', 'apple', 'APPLE']" case-sensitive placeholder="case-sensitive" />
</template>
```

:::

## 键盘导航

打开浮层后：

- `↑` `↓` 在候选项间移动焦点（自动跳过 disabled 项，到末尾循环回首项）
- `Enter` 选中当前焦点项
- `Esc` 关闭浮层
- 输入字符任意时刻打开浮层

## 三种尺寸

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const v = ref('')
const opts = ['Apple', 'Banana', 'Cherry']
</script>

<template>
  <c-auto-complete v-model="v" :options="opts" size="small" placeholder="small" />
  <c-auto-complete v-model="v" :options="opts" placeholder="default" />
  <c-auto-complete v-model="v" :options="opts" size="large" placeholder="large" />
</template>
```

:::

## 表单联动

放进 `c-form-item` 内时，`status` 会自动跟随 `FormItem` 的校验状态。

:::demo

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({ keyword: '' })
const formRef = ref<{ validate: () => Promise<boolean> } | null>(null)
const rules = { keyword: [{ required: true, message: '请输入关键词', trigger: 'change' }] }
</script>

<template>
  <c-form ref="formRef" :model="form" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
    <c-form-item name="keyword" label="关键词" prop="keyword">
      <c-auto-complete v-model="form.keyword" :options="['vue', 'react', 'svelte']" allow-clear />
    </c-form-item>
    <c-form-item :wrapper-col="{ span: 24 }">
      <c-button type="primary" @click="formRef?.validate()">校验</c-button>
    </c-form-item>
  </c-form>
</template>
```

:::

## 弹层容器

把面板挂到 `document.body` 或自定义容器，避开 overflow 滚动裁切。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const v = ref('')
</script>

<template>
  <c-auto-complete v-model="v" :options="['Apple', 'Banana', 'Cherry']" popup-append-to-body />
</template>
```

:::

## Variants

录入组件统一 `variant` 形态。四档：`outlined`（默认）/ `filled` / `borderless` / `underlined`。

:::demo

```vue
<template>
  <div style="margin-bottom: 12px">
    <c-segmented v-model="variant" :options="['outlined', 'filled', 'borderless', 'underlined']" />
  </div>
  <c-auto-complete v-model="value" :variant="variant" :options="opts" placeholder="输入查看补全" />
</template>

<script setup>
import { ref } from 'vue'
const variant = ref('outlined')
const value = ref('')
const opts = ['gmail.com', 'qq.com', '163.com']
</script>
```

:::

## API

### Props

| 参数                     | 类型                                                       | 默认值                    | 说明                                             |
| ------------------------ | ---------------------------------------------------------- | ------------------------- | ------------------------------------------------ |
| modelValue               | string \| number \| null                                   | --                        | 当前输入值，支持 `v-model`                       |
| defaultValue             | string \| number                                           | `''`                      | 非受控初始值                                     |
| options                  | `(string \| number \| { value, label?, disabled? })[]`     | `[]`                      | 候选项；string/number 形态的 label = value       |
| placeholder              | string                                                     | --                        | 占位文案                                         |
| disabled                 | boolean                                                    | `false`                   | 是否禁用                                         |
| allowClear               | boolean                                                    | `false`                   | 显示一键清空按钮                                 |
| size                     | `'small' \| 'default' \| 'large'`                          | `'default'`               | 输入框尺寸                                       |
| status                   | `'' \| 'error' \| 'warning' \| 'success' \| 'validating'`  | `''`                      | 校验状态；置于 `FormItem` 时自动继承             |
| filterOption             | `boolean \| (input, option) => boolean`                    | `true`                    | 过滤逻辑                                         |
| caseSensitive            | boolean                                                    | `false`                   | 是否区分大小写（仅默认 includes 过滤生效）       |
| notFoundContent          | string                                                     | `暂无数据`                | 空数据占位                                       |
| placement                | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'` | `'bottomLeft'`            | 浮层方位                                         |
| popupClassName           | string                                                     | --                        | 浮层根元素自定义 class                           |
| popupAppendToBody        | boolean                                                    | `false`                   | Teleport 到 `document.body`                      |
| getPopupContainer        | `(trigger: HTMLElement \| null) => HTMLElement \| null`    | --                        | 自定义浮层挂载点，优先级高于 `popupAppendToBody` |
| transitionName           | string                                                     | `ccui-auto-complete-fade` | 浮层过渡名                                       |
| popupMaxHeight           | number                                                     | `256`                     | 浮层最大高度（px）                               |
| defaultActiveFirstOption | boolean                                                    | `false`                   | 打开浮层时是否默认高亮第一项                     |
| backfill                 | boolean                                                    | `false`                   | 键盘导航时是否把高亮项 label 写回 input          |
| searchDebounce           | number                                                     | `0`                       | 搜索防抖延迟（毫秒），`0` 不防抖                 |

### Events

| 事件名            | 回调签名                                                | 触发时机                            |
| ----------------- | ------------------------------------------------------- | ----------------------------------- |
| update:modelValue | `(value: string \| number)`                             | 输入或选中时                        |
| change            | `(value: string \| number)`                             | 同 update:modelValue                |
| search            | `(keyword: string)`                                     | 同 update:modelValue（search 别名） |
| select            | `(value: string \| number, option: AutoCompleteOption)` | 选中候选项时                        |
| open-change       | `(open: boolean)`                                       | 浮层打开 / 关闭时                   |
| focus             | `(e: FocusEvent)`                                       | 输入框聚焦                          |
| blur              | `(e: FocusEvent)`                                       | 输入框失焦                          |

### Slots

| 名称    | 参数                                                                    | 说明                        |
| ------- | ----------------------------------------------------------------------- | --------------------------- |
| option  | `{ option: AutoCompleteOption, index: number }`                         | 自定义单项渲染              |
| trigger | `{ value, onInput, onFocus, onBlur, onKeydown, placeholder, disabled }` | 自定义输入框（如 textarea） |

## 已知限制（未交付）

- **virtual list（候选项虚拟滚动）**：选项 > 1000 时性能未优化，复用 Tree/Select 的 use-virtual-list 留后续。
