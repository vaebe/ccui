# Mentions 提及

带「@提及」语法的多行输入框。在 textarea 中输入特定 prefix（默认 `@`）后弹出候选浮层，选中后插入 `@username ` 到光标位置。常见于评论、IM、协作工具的 @ 队友、`#` 话题、`/` 命令场景。

## 基本用法

`v-model` 绑定输入值，`options` 提供候选项。输入 `@` 后浮层打开。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const users = ['anna', 'alice', 'bob', 'charlie', 'dora']
</script>

<template>
  <c-mentions v-model="value" :options="users" placeholder="输入 @ 提及别人" :rows="4" />
</template>
```

:::

## 自定义选项格式

提供 `{ value, label, disabled }` 形态可独立控制 value 与显示文本。`label` 用于浮层显示，`value` 是真正插入到 textarea 的字符串。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const team = [
  { value: 'alice', label: 'Alice (PM)' },
  { value: 'bob', label: 'Bob (Frontend)' },
  { value: 'charlie', label: 'Charlie (Backend)' },
  { value: 'guest', label: 'Guest', disabled: true },
]
</script>

<template>
  <c-mentions v-model="value" :options="team" :rows="3" />
</template>
```

:::

## 多触发字符

`prefix` 传数组支持同时识别多个触发字符。

:::demo

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const value = ref('')
const allOpts = ['anna', 'todo', 'bug', 'feature']
</script>

<template>
  <c-mentions
    v-model="value"
    :options="allOpts"
    :prefix="['@', '#']"
    placeholder="@ 提及人 / # 关联标签"
    :rows="3"
  />
</template>
```

:::

## 自定义分隔符

`split` 控制选中后追加的字符（默认空格）。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <c-mentions v-model="value" :options="['anna', 'bob']" split=", " :rows="2" />
</template>
```

:::

## 自定义过滤

`filter-option` 控制候选项过滤：`true`（默认 includes）/ `false`（不过滤）/ 函数 `(input, option) => boolean`。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const opts = ['Apple', 'apple', 'banana']

function startsWith(input: string, opt: { value: string }) {
  return opt.value.startsWith(input)
}
</script>

<template>
  <c-mentions v-model="value" :options="opts" :filter-option="startsWith" :rows="2" />
</template>
```

:::

## API

### Props

| 参数            | 类型                                              | 默认值       | 说明                                                          |
| --------------- | ------------------------------------------------- | ------------ | ------------------------------------------------------------- |
| modelValue      | string \| null                                    | --           | 当前输入值，支持 `v-model`                                    |
| defaultValue    | string                                            | `''`         | 非受控初始值                                                  |
| options         | `(string \| { value, label?, disabled? })[]`      | `[]`         | 候选项                                                        |
| prefix          | `string \| string[]`                              | `'@'`        | 触发字符；数组形态可同时识别多个                              |
| split           | string                                            | `' '`        | 选中后追加的分隔符                                            |
| placeholder     | string                                            | --           | 占位文案                                                      |
| disabled        | boolean                                           | `false`      | 是否禁用                                                      |
| rows            | number                                            | `3`          | textarea 行数                                                 |
| filterOption    | `boolean \| (input, option) => boolean`           | `true`       | 过滤逻辑                                                      |
| caseSensitive   | boolean                                           | `false`      | 默认过滤是否区分大小写                                        |
| notFoundContent | string                                            | `暂无数据`   | 空数据占位                                                    |
| placement       | `'top' \| 'bottom'`                               | `'bottom'`   | 浮层方位（基于 textarea）                                     |
| popupMaxHeight  | number                                            | `256`        | 浮层最大高度（px）                                            |
| autoSize        | `boolean \| { minRows?: number, maxRows?: number }` | `false`     | 自适应 textarea 高度；`true` 无限制，对象指定范围             |
| searchDebounce  | number                                            | `0`          | 搜索防抖延迟（毫秒），`0` 不防抖                              |

### Events

| 事件名            | 回调签名                                  | 触发时机                              |
| ----------------- | ----------------------------------------- | ------------------------------------- |
| update:modelValue | `(value: string)`                         | 输入或选中时                          |
| change            | `(value: string)`                         | 同 update:modelValue                  |
| select            | `(option: MentionOption, prefix: string)` | 选中候选项时                          |
| search            | `(text: string, prefix: string)`          | 浮层打开 / 搜索词变化时               |
| focus             | `(e: FocusEvent)`                         | textarea 聚焦                         |
| blur              | `(e: FocusEvent)`                         | textarea 失焦                         |

### Slots

| 名称   | 参数                                  | 说明              |
| ------ | ------------------------------------- | ----------------- |
| option | `{ option: MentionOption, index: number }` | 自定义单项渲染 |

## 已知限制（未交付）

- **光标精确定位**：浮层固定在 textarea 下方左侧，不会跟随光标位置精确浮动（需要 mirror div 测量字符宽度，工程量较大）。
- **彩色 token 渲染**：textarea 不支持富文本，`@user` 在编辑态保持纯文本。要彩色高亮需要切到 contenteditable，留到独立体验型组件 RichMentions。
- **trigger slot**：textarea 不支持替换为 input 或自定义触发器。
