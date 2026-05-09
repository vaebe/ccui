# RangePicker 日期范围

选择一段连续的日期区间。双面板显示当前月与下一月，起 / 止两次点击完成选择，hover 期间高亮预览区间。复用 DatePicker 同款 dayjs 工具层与 `valueFormat` 三档。

## 基本用法

`v-model` 是 `[start, end]` 数组，类型与 `valueFormat` 对应。两次点击日期完成选择。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<[string, string] | null>(null)
</script>

<template>
  <c-range-picker v-model="value" />
</template>
```

:::

## 显示已选区间

`modelValue` 同时支持 `[string, string]`、`[Date, Date]`、`[number, number]`，按 `format` 自动解析。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<[string, string] | null>(['2026-05-01', '2026-05-15'])
</script>

<template>
  <c-range-picker v-model="value" />
</template>
```

:::

## 自定义格式

`format` 控制输入框显示，`valueFormat` 决定 `v-model` 输出形态。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const a = ref<[string, string] | null>(null)
const b = ref<[Date, Date] | null>(null)
const c = ref<[number, number] | null>(null)
</script>

<template>
  <c-range-picker v-model="a" format="YYYY/MM/DD" />
  <c-range-picker v-model="b" value-format="date" />
  <c-range-picker v-model="c" value-format="number" />
</template>
```

:::

## 自动调换

如果点击 end < start，组件会自动把两端调换，输出始终满足 `start <= end`。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<[string, string] | null>(null)
</script>

<template>
  <c-range-picker v-model="value" />
</template>
```

:::

## 禁用日期

`disabled-date(current: Dayjs) => boolean` 与 DatePicker 一致，对 start / end 都生效。

:::demo

```vue
<script setup lang="ts">
import dayjs, { type Dayjs } from 'dayjs'
import { ref } from 'vue'

const value = ref<[string, string] | null>(null)

function disabledDate(current: Dayjs) {
  return current.isBefore(dayjs().startOf('day'))
}
</script>

<template>
  <c-range-picker v-model="value" :disabled-date="disabledDate" />
</template>
```

:::

## 自定义分隔符与占位

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<[string, string] | null>(null)
</script>

<template>
  <c-range-picker v-model="value" :placeholder="['Check-in', 'Check-out']" separator="→" />
</template>
```

:::

## 三种尺寸

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<[string, string] | null>(null)
</script>

<template>
  <c-range-picker v-model="value" size="small" />
  <c-range-picker v-model="value" />
  <c-range-picker v-model="value" size="large" />
</template>
```

:::

## 表单联动

放进 `c-form-item` 内时，`status` 会自动跟随 `FormItem` 的校验状态。

:::demo

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive<{ vacation: [string, string] | null }>({ vacation: null })
const formRef = ref<{ validate: () => Promise<boolean> } | null>(null)
const rules = { vacation: [{ required: true, message: '请选择假期' }] }
</script>

<template>
  <c-form ref="formRef" :model="form" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
    <c-form-item name="vacation" label="假期" prop="vacation">
      <c-range-picker v-model="form.vacation" />
    </c-form-item>
    <c-form-item :wrapper-col="{ span: 24 }">
      <c-button type="primary" @click="formRef?.validate()"> 校验 </c-button>
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

const value = ref<[string, string] | null>(null)
</script>

<template>
  <c-range-picker v-model="value" popup-append-to-body />
</template>
```

:::

## API

### Props

| 参数              | 类型                                                       | 默认值                    | 说明                                                          |
| ----------------- | ---------------------------------------------------------- | ------------------------- | ------------------------------------------------------------- |
| modelValue        | `[DateValue, DateValue] \| null`                           | --                        | 起止区间，支持 `v-model`                                      |
| format            | string                                                     | `YYYY-MM-DD`              | 输入框显示与字符串解析格式                                    |
| valueFormat       | `'string' \| 'date' \| 'number'`                           | `'string'`                | `v-model` 输出形态：按 format 字符串 / Date 实例 / 毫秒时间戳 |
| placeholder       | `[string, string]`                                         | `['开始日期','结束日期']` | 起止两端占位文案                                              |
| separator         | string                                                     | `~`                       | 起止之间的分隔符                                              |
| disabled          | boolean                                                    | `false`                   | 是否禁用                                                      |
| clearable         | boolean                                                    | `true`                    | 是否显示清除按钮                                              |
| size              | `'small' \| 'default' \| 'large'`                          | `'default'`               | 输入框尺寸                                                    |
| status            | `'' \| 'error' \| 'warning' \| ...`                        | `''`                      | 校验状态；置于 `FormItem` 时自动继承                          |
| disabledDate      | `(current: Dayjs) => boolean`                              | --                        | 不可选日期回调                                                |
| placement         | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'` | `'bottomLeft'`            | 浮层方位                                                      |
| popupClassName    | string                                                     | --                        | 浮层根元素自定义 class                                        |
| popupAppendToBody | boolean                                                    | `false`                   | 是否把浮层 Teleport 到 `document.body`                        |
| getPopupContainer | `(trigger: HTMLElement \| null) => HTMLElement \| null`    | --                        | 自定义浮层挂载点                                              |
| autoFocus         | boolean                                                    | `false`                   | 挂载后自动 focus 起始输入框                                   |
| inputReadOnly     | boolean                                                    | `true`                    | 输入框只读                                                    |
| transitionName    | string                                                     | `ccui-range-picker-fade`  | 浮层过渡名                                                    |
| weekStart         | `0 \| 1`                                                   | `0`                       | 周起始：`0` 周日开头，`1` 周一开头                            |

### Events

| 事件名            | 回调签名                                  | 触发时机                           |
| ----------------- | ----------------------------------------- | ---------------------------------- |
| update:modelValue | `(value: [DateValue, DateValue] \| null)` | 区间提交或清除时                   |
| change            | `(value, dateStrings: [string, string])`  | 区间提交或清除时（带格式化字符串） |
| open-change       | `(open: boolean)`                         | 浮层打开 / 关闭时                  |
| focus             | --                                        | 输入框聚焦                         |
| blur              | --                                        | 输入框失焦                         |

## 已知限制（未交付）

- **preset 快捷预设**（最近 7 天 / 本月 / 本季度等）：留给下一切片做。
- **showTime 时间联动**：DatePicker / RangePicker 推到 95% 时一并接通。
- **start / end 独立 disabledDate**：当前 disabledDate 一份，对 start 与 end 都生效。
- **键盘导航**：方向键 / Enter 切换尚未实现。
- **响应式单面板**：移动端 PC 双面板会溢出，自动切单面板留给后续。
