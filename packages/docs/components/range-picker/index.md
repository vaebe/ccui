# RangePicker 日期范围

选择一段连续的日期区间。双面板显示当前月与下一月，起 / 止两次点击完成选择，hover 期间高亮预览区间。复用 DatePicker 同款 dayjs 工具层与 `valueFormat` 三档。

## 基本使用

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

## 独立禁用起止侧

`disabledStartDate` / `disabledEndDate` 仅作用于对应侧（phase=start / phase=end），优先级高于通用 `disabledDate`；单侧未配置时回落到 `disabledDate`。先点起始切到 end 阶段后，结束侧的禁用样式才会出现。

:::demo

```vue
<script setup lang="ts">
import dayjs, { type Dayjs } from 'dayjs'
import { computed, ref } from 'vue'

const value = ref<[string, string] | null>(null)
const start = computed(() => value.value?.[0])

function disabledStartDate(current: Dayjs) {
  return current.isBefore(dayjs().startOf('day'))
}
function disabledEndDate(current: Dayjs) {
  if (!start.value) return false
  return current.isAfter(dayjs(start.value).add(14, 'day'))
}
</script>

<template>
  <c-range-picker v-model="value" :disabled-start-date="disabledStartDate" :disabled-end-date="disabledEndDate" />
</template>
```

:::

## 两端独立禁用 disabled

`disabled` 支持元组 `[boolean, boolean]`，分别锁两端 input。例如「开始日期可选 / 结束日期锁定」常见于编辑订单中的「下单时间不可改、退款时间待选」场景。锁定端：input 禁用、点击不打开面板。当两端都锁定时清除按钮自动隐藏。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<[string, string] | null>(['2026-05-09', '2026-05-15'])
</script>

<template>
  <c-range-picker v-model="value" :disabled="[true, false]" />
</template>
```

:::

## 两端独立允许为空 allowEmpty

`allowEmpty` 接 `[boolean, boolean]`，分别配置「开始日期可空 / 结束日期可空」。两端默认 `false`，需要全部选择后才能提交。设为 `[true, false]` 即可实现「开始日期可空 / 结束日期必填」之类的不对称需求。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<[string, string] | null>(null)
</script>

<template>
  <c-range-picker v-model="value" :allow-empty="[true, false]" />
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

## showTime 时间选择

`show-time` 为 `true` 或对象时启用时间选择，两侧面板各挂时分秒三列；点日期不立即提交，footer 出现「确定」按钮，起止齐全后可点。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<[string, string] | null>(null)
</script>

<template>
  <c-range-picker v-model="value" show-time />
  <p>当前值：{{ value }}</p>
</template>
```

:::

传对象可配置默认时刻与步进，未传 `defaultStartTime` / `defaultEndTime` 时默认 `00:00:00` / `23:59:59`。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<[string, string] | null>(null)
const showTime = {
  defaultStartTime: '2026-01-01 09:00:00',
  defaultEndTime: '2026-01-01 17:30:00',
  minuteStep: 15,
}
</script>

<template>
  <c-range-picker v-model="value" :show-time="showTime" />
</template>
```

:::

## presets 预设快捷项

`presets` 传入快捷项数组后，面板左侧出现 rail；空数组不渲染。每项 `value` 可为元组或返回元组的函数，非严格解析，`end < start` 时自动调换。

:::demo

```vue
<script setup lang="ts">
import dayjs from 'dayjs'
import { ref } from 'vue'

const value = ref<[string, string] | null>(null)
const presets = [
  { label: '今天', value: () => [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')] },
  { label: '最近 7 天', value: () => [dayjs().subtract(6, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')] },
  {
    label: '本周',
    value: () => [dayjs().startOf('week').format('YYYY-MM-DD'), dayjs().endOf('week').format('YYYY-MM-DD')],
  },
  {
    label: '本月',
    value: () => [dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD')],
  },
]
</script>

<template>
  <c-range-picker v-model="value" :presets="presets" />
</template>
```

:::

与 `show-time` 共存时，点击预设仅写入 pending，可继续微调时间，最后通过「确定」提交。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<[string, string] | null>(null)
const presets = [{ label: '上次会议', value: ['2026-05-08 14:00:00', '2026-05-08 15:30:00'] }]
</script>

<template>
  <c-range-picker v-model="value" show-time :presets="presets" />
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
  <c-range-picker v-model="value" :variant="variant" />
</template>

<script setup>
import { ref } from 'vue'
const variant = ref('outlined')
const value = ref([])
</script>
```

:::

## API

### Props

| 参数              | 类型                                                       | 默认值                    | 说明                                                                                                                                                                                                 |
| ----------------- | ---------------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| modelValue        | `[DateValue, DateValue] \| null`                           | --                        | 起止区间，支持 `v-model`                                                                                                                                                                             |
| format            | string                                                     | `YYYY-MM-DD`              | 输入框显示与字符串解析格式                                                                                                                                                                           |
| valueFormat       | `'string' \| 'date' \| 'number'`                           | `'string'`                | `v-model` 输出形态：按 format 字符串 / Date 实例 / 毫秒时间戳                                                                                                                                        |
| placeholder       | `[string, string]`                                         | `['开始日期','结束日期']` | 起止两端占位文案                                                                                                                                                                                     |
| separator         | string                                                     | `~`                       | 起止之间的分隔符                                                                                                                                                                                     |
| disabled          | `boolean \| [boolean, boolean]`                            | `false`                   | 是否禁用；元组形态分别锁两端 input。两端都锁定时 clear 自动隐藏                                                                                                                                      |
| allowEmpty        | `boolean \| [boolean, boolean]`                            | `false`                   | 是否允许该端为空；元组分别配置两端。两端都不允许时必须选完整范围才能 ok 提交                                                                                                                         |
| clearable         | boolean                                                    | `true`                    | 是否显示清除按钮                                                                                                                                                                                     |
| size              | `'small' \| 'default' \| 'large'`                          | `'default'`               | 输入框尺寸                                                                                                                                                                                           |
| status            | `'' \| 'error' \| 'warning' \| ...`                        | `''`                      | 校验状态；置于 `FormItem` 时自动继承                                                                                                                                                                 |
| disabledDate      | `(current: Dayjs) => boolean`                              | --                        | 不可选日期回调，对 start / end 都生效                                                                                                                                                                |
| disabledStartDate | `(current: Dayjs) => boolean`                              | --                        | 仅作用于起始侧（phase=start），优先级高于 `disabledDate`                                                                                                                                             |
| disabledEndDate   | `(current: Dayjs) => boolean`                              | --                        | 仅作用于结束侧（phase=end），优先级高于 `disabledDate`                                                                                                                                               |
| placement         | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'` | `'bottomLeft'`            | 浮层方位                                                                                                                                                                                             |
| popupClassName    | string                                                     | --                        | 浮层根元素自定义 class                                                                                                                                                                               |
| popupAppendToBody | boolean                                                    | `false`                   | 是否把浮层 Teleport 到 `document.body`                                                                                                                                                               |
| getPopupContainer | `(trigger: HTMLElement \| null) => HTMLElement \| null`    | --                        | 自定义浮层挂载点                                                                                                                                                                                     |
| autoFocus         | boolean                                                    | `false`                   | 挂载后自动 focus 起始输入框                                                                                                                                                                          |
| inputReadOnly     | boolean                                                    | `true`                    | 输入框只读                                                                                                                                                                                           |
| transitionName    | string                                                     | `ccui-range-picker-fade`  | 浮层过渡名                                                                                                                                                                                           |
| weekStart         | `0 \| 1`                                                   | `0`                       | 周起始：`0` 周日开头，`1` 周一开头                                                                                                                                                                   |
| presets           | `RangePresetItem[]`                                        | `[]`                      | 左侧快捷项；每项 `{ label, value }`，`value` 可为元组或返回元组的函数；空数组不渲染 rail                                                                                                             |
| showTime          | `boolean \| RangeTimeShowConfig`                           | `false`                   | 启用时间选择；对象支持 `format` / `defaultStartTime` / `defaultEndTime` / `hourStep` / `minuteStep` / `secondStep` / `disabledHours` / `disabledMinutes` / `disabledSeconds` / `hideDisabledOptions` |

### Events

| 事件名            | 回调签名                                  | 触发时机                           |
| ----------------- | ----------------------------------------- | ---------------------------------- |
| update:modelValue | `(value: [DateValue, DateValue] \| null)` | 区间提交或清除时                   |
| change            | `(value, dateStrings: [string, string])`  | 区间提交或清除时（带格式化字符串） |
| open-change       | `(open: boolean)`                         | 浮层打开 / 关闭时                  |
| focus             | --                                        | 输入框聚焦                         |
| blur              | --                                        | 输入框失焦                         |

## 已知限制（未交付）

- **键盘导航**：方向键 / Enter 切换尚未实现。
- **响应式单面板**：移动端 PC 双面板会溢出，自动切单面板留给后续。
