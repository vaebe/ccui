# DatePicker 日期选择框

输入或选择日期/周/月/年/季度的控件。支持 `picker` 切换 5 种粒度、面板逐级展开（date → month → year）、`weekStart` 周起始、ConfigProvider 注入 locale 与周文案。

## 基本用法

最简单的用法。`v-model` 默认输出按 `format` 渲染的字符串。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <c-date-picker v-model="value" />
</template>
```

:::

## 显示已选值

`modelValue` 可以是 `string` / `Date` / `Dayjs` / `number(ms)`，组件会自动按 `format` 解析与显示。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const today = ref('2026-05-09')
</script>

<template>
  <c-date-picker v-model="today" />
</template>
```

:::

## 自定义格式

`format` 控制输入框展示与字符串解析；`valueFormat` 决定 `v-model` 输出形态。

- `valueFormat="string"`（默认）：按 `format` 输出字符串。
- `valueFormat="date"`：输出原生 `Date` 实例。
- `valueFormat="number"`：输出毫秒时间戳。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const a = ref('')
const b = ref<Date | null>(null)
const c = ref<number | null>(null)
</script>

<template>
  <c-date-picker v-model="a" format="YYYY/MM/DD" />
  <c-date-picker v-model="b" value-format="date" />
  <c-date-picker v-model="c" value-format="number" />
</template>
```

:::

## 禁用日期

`disabledDate(current: Dayjs) => boolean` 用于禁用某些不可选日期。

:::demo

```vue
<script setup lang="ts">
import dayjs, { type Dayjs } from 'dayjs'
import { ref } from 'vue'

const value = ref('')

function disabledDate(current: Dayjs) {
  return current.isBefore(dayjs().startOf('day'))
}
</script>

<template>
  <c-date-picker v-model="value" :disabled-date="disabledDate" />
</template>
```

:::

## 三种尺寸

`size` 支持 `small` / `default` / `large`。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <c-date-picker v-model="value" size="small" placeholder="small" />
  <c-date-picker v-model="value" placeholder="default" />
  <c-date-picker v-model="value" size="large" placeholder="large" />
</template>
```

:::

## 禁用 / 不可清除

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('2026-05-09')
</script>

<template>
  <c-date-picker v-model="value" disabled />
  <c-date-picker v-model="value" :clearable="false" />
</template>
```

:::

## 表单联动

放进 `c-form-item` 内时，`status` 会自动跟随 `FormItem` 的校验状态。

:::demo

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({ birthday: '' })
const formRef = ref<{ validate: () => Promise<boolean> } | null>(null)
const rules = { birthday: [{ required: true, message: '请选择生日' }] }
</script>

<template>
  <c-form ref="formRef" :model="form" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
    <c-form-item name="birthday" label="生日" prop="birthday">
      <c-date-picker v-model="form.birthday" />
    </c-form-item>
    <c-form-item :wrapper-col="{ span: 24 }">
      <c-button type="primary" @click="formRef?.validate()"> 校验 </c-button>
    </c-form-item>
  </c-form>
</template>
```

:::

## 弹层容器

默认浮层挂载在组件根元素内，溢出滚动容器时可能被裁切。把 `popup-append-to-body` 设为 `true` 或自定义 `getPopupContainer` 把面板挂到指定容器。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <c-date-picker v-model="value" popup-append-to-body />
</template>
```

:::

## Picker 模式

通过 `picker` 切换选择粒度，未显式传入 `format` 时按粒度兜底。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const week = ref('')
</script>

<template>
  <c-date-picker v-model="week" picker="week" />
  <p>当前值：{{ week || '（未选择）' }}</p>
</template>
```

:::

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const month = ref('2026-05')
const monthDisabled = ref('2026-01')
</script>

<template>
  <c-date-picker v-model="month" picker="month" />
  <c-date-picker v-model="monthDisabled" picker="month" disabled />
</template>
```

:::

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const year = ref('')
const yearDefault = ref('2026')
</script>

<template>
  <c-date-picker v-model="year" picker="year" placeholder="请选择年份" />
  <c-date-picker v-model="yearDefault" picker="year" />
</template>
```

:::

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const quarter = ref('')
const quarterDefault = ref('2026-Q2')
</script>

<template>
  <c-date-picker v-model="quarter" picker="quarter" />
  <c-date-picker v-model="quarterDefault" picker="quarter" />
</template>
```

:::

## showTime 时间选择

仅 `picker="date"` 生效。开启后面板底部自动追加「此刻」+「确定」按钮，点击日期不会立即 emit，需点「确定」确认。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <c-date-picker v-model="value" show-time />
  <p>v-model 值: {{ value }}</p>
</template>
```

:::

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <c-date-picker v-model="value" :show-time="{ format: 'HH:mm' }" />
</template>
```

:::

:::demo

```vue
<script setup lang="ts">
import dayjs from 'dayjs'
import { ref } from 'vue'

const value = ref('')
const timeConfig = {
  hourStep: 2,
  defaultValue: dayjs('09:00:00', 'HH:mm:ss'),
}
</script>

<template>
  <c-date-picker v-model="value" :show-time="timeConfig" />
</template>
```

:::

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const timeConfig = {
  disabledHours: () => [0, 1, 2, 3, 4, 5, 6],
  disabledMinutes: () => [15, 30, 45],
}
</script>

<template>
  <c-date-picker v-model="value" :show-time="timeConfig" :show-now="false" />
</template>
```

:::

## presets 预设快捷项

`presets` 在面板左侧渲染一列快捷项，`label` / `value` 均支持函数形式延迟求值，便于「今天 / 昨天」这种相对时刻。

:::demo

```vue
<script setup lang="ts">
import dayjs from 'dayjs'
import { ref } from 'vue'

const value = ref('')
const presets = [
  { label: '昨天', value: () => dayjs().subtract(1, 'day').format('YYYY-MM-DD') },
  { label: '今天', value: () => dayjs().format('YYYY-MM-DD') },
  { label: '一周后', value: () => dayjs().add(1, 'week').format('YYYY-MM-DD') },
]
</script>

<template>
  <c-date-picker v-model="value" :presets="presets" />
</template>
```

:::

与 `picker="week"` 共存：value 解析后按所在周的起始日提交。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const week = ref('')
const presets = [
  { label: '本周', value: '2026-05-11' },
  { label: '上周', value: '2026-05-04' },
  { label: '下周', value: '2026-05-18' },
]
</script>

<template>
  <c-date-picker v-model="week" picker="week" :presets="presets" />
</template>
```

:::

与 `showTime` 共存：点击预设仅更新内部 pending，仍需点「确定」提交，可继续微调时间。

:::demo

```vue
<script setup lang="ts">
import dayjs from 'dayjs'
import { ref } from 'vue'

const value = ref('')
const presets = [{ label: '上次会议', value: () => dayjs('2026-05-09 14:30:00').toDate() }]
</script>

<template>
  <c-date-picker v-model="value" show-time :presets="presets" />
  <p>v-model 值: {{ value }}</p>
</template>
```

:::

## 周起始 weekStart

`weekStart` 控制面板内每周的起始日：`0` 周日开头（默认）/ `1` 周一开头。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const a = ref('')
const b = ref('')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 280px">
    <div>
      <p style="margin: 0 0 4px; color: #666">weekStart=0（默认，周日开头）</p>
      <c-date-picker v-model="a" :week-start="0" />
    </div>
    <div>
      <p style="margin: 0 0 4px; color: #666">weekStart=1（周一开头）</p>
      <c-date-picker v-model="b" :week-start="1" />
    </div>
  </div>
</template>
```

:::

## 校验状态 status

`status` 支持 `'error'` / `'warning'` / `'success'` / `'validating'`，置于 `<c-form-item>` 时自动继承。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 280px">
    <c-date-picker v-model="v1" status="error" placeholder="error" />
    <c-date-picker v-model="v2" status="warning" placeholder="warning" />
    <c-date-picker v-model="v3" status="success" placeholder="success" />
  </div>
</template>
```

:::

## change 事件双参追踪

`change(value, dateString)` 第二个参数是按 format 格式化后的字符串，常用于「无论 valueFormat 是 string / date / number 都能拿到一致的展示字符串」。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<Date | null>(null)
const lastChange = ref('（无）')

function onChange(v, dateString) {
  lastChange.value = `value 类型 = ${v === null ? 'null' : v?.constructor?.name} · dateString = "${dateString}"`
}
</script>

<template>
  <c-date-picker v-model="value" value-format="date" @change="onChange" />
  <p style="margin: 8px 0 0; color: #666">最近一次 change：</p>
  <p style="margin: 4px 0 0; color: #595959; font-size: 12px">{{ lastChange }}</p>
</template>
```

:::

## panel-change 事件追踪

`panel-change(mode, viewMonth)` 在面板模式切换（date ↔ month ↔ year）或视图月份变化时触发，可联动日历埋点 / 上报。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const lastPanel = ref('（无）')

function onPanelChange(mode, viewMonth) {
  lastPanel.value = `mode = ${mode} · 视图月份 = ${viewMonth?.format?.('YYYY-MM')}`
}
</script>

<template>
  <c-date-picker v-model="value" @panel-change="onPanelChange" />
  <p style="margin: 8px 0 0; color: #666">最近一次 panel-change：</p>
  <p style="margin: 4px 0 0; color: #595959; font-size: 12px">{{ lastPanel }}</p>
  <p style="margin: 8px 0 0; color: #999; font-size: 12px">提示：点击年份 / 月份头部进入上钻视图触发该事件</p>
</template>
```

:::

## API

### Props

| 参数              | 类型                                                       | 默认值                  | 说明                                                                                                                                                                                                                                                                                              |
| ----------------- | ---------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| modelValue        | string / Date / Dayjs / number / null                      | --                      | 当前选中日期，支持 `v-model`                                                                                                                                                                                                                                                                      |
| format            | string                                                     | `''`                    | 输入框显示与字符串解析格式（dayjs token）；为空时按 `picker` 兜底：date→`YYYY-MM-DD` / week→`YYYY-MM-DD` / month→`YYYY-MM` / year→`YYYY` / quarter→`YYYY-[Q]Q`                                                                                                                                    |
| valueFormat       | `'string' \| 'date' \| 'number'`                           | `'string'`              | `v-model` 输出形态：按 format 字符串 / Date 实例 / 毫秒时间戳                                                                                                                                                                                                                                     |
| placeholder       | string                                                     | `请选择日期`            | 占位文案                                                                                                                                                                                                                                                                                          |
| disabled          | boolean                                                    | `false`                 | 是否禁用                                                                                                                                                                                                                                                                                          |
| clearable         | boolean                                                    | `true`                  | 是否显示清除按钮                                                                                                                                                                                                                                                                                  |
| size              | `'small' \| 'default' \| 'large'`                          | `'default'`             | 输入框尺寸                                                                                                                                                                                                                                                                                        |
| status            | `'' \| 'error' \| 'warning' \| ...`                        | `''`                    | 校验状态；置于 `FormItem` 时自动继承                                                                                                                                                                                                                                                              |
| disabledDate      | `(current: Dayjs) => boolean`                              | --                      | 不可选日期回调，返回 `true` 表示禁用                                                                                                                                                                                                                                                              |
| placement         | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'` | `'bottomLeft'`          | 浮层方位，配合 `@floating-ui/vue` 自动 flip / shift                                                                                                                                                                                                                                               |
| popupClassName    | string                                                     | --                      | 浮层根元素自定义 class                                                                                                                                                                                                                                                                            |
| popupAppendToBody | boolean                                                    | `false`                 | 是否把浮层 Teleport 到 `document.body`                                                                                                                                                                                                                                                            |
| getPopupContainer | `(trigger: HTMLElement \| null) => HTMLElement \| null`    | --                      | 自定义浮层挂载点，优先级高于 `popupAppendToBody`                                                                                                                                                                                                                                                  |
| autoFocus         | boolean                                                    | `false`                 | 挂载后自动 focus 输入框                                                                                                                                                                                                                                                                           |
| inputReadOnly     | boolean                                                    | `true`                  | 输入框只读（不允许键盘输入日期，仅通过面板选择）                                                                                                                                                                                                                                                  |
| transitionName    | string                                                     | `ccui-date-picker-fade` | 浮层过渡名                                                                                                                                                                                                                                                                                        |
| picker            | `'date' \| 'week' \| 'month' \| 'year' \| 'quarter'`       | `'date'`                | 选择粒度；面板形态、`format` 兜底与 emit 值随之变化                                                                                                                                                                                                                                               |
| showTime          | `boolean \| TimeShowConfig`                                | `false`                 | 仅 `picker="date"` 生效；开启后面板追加时间选择列与「此刻 / 确定」footer。`TimeShowConfig` 支持 `format`（默认 `'HH:mm:ss'`，含 `m` 显示分列、含 `s` 显示秒列）、`defaultValue`、`hourStep / minuteStep / secondStep`、`disabledHours / disabledMinutes / disabledSeconds`、`hideDisabledOptions` |
| showNow           | boolean                                                    | `true`                  | 启用 `showTime` 时是否显示 footer 的「此刻」按钮                                                                                                                                                                                                                                                  |
| presets           | `PresetItem[]`                                             | `[]`                    | 面板左侧快捷项列表；`PresetItem = { label: string \| (() => string); value: DateValue \| (() => DateValue) }`，`label` / `value` 均支持函数形式延迟求值。空数组不渲染 rail；与 `showTime` 共存时点击仅填充 pending，需点「确定」提交                                                              |
| weekStart         | `0 \| 1`                                                   | `0`                     | 周起始：`0` 周日开头，`1` 周一开头                                                                                                                                                                                                                                                                |

### Events

| 事件名            | 回调签名                                                             | 触发时机                           |
| ----------------- | -------------------------------------------------------------------- | ---------------------------------- |
| update:modelValue | `(value: string \| Date \| number \| null)`                          | 选中日期或清除时                   |
| change            | `(value, dateString: string)`                                        | 选中日期或清除时（带格式化字符串） |
| open-change       | `(open: boolean)`                                                    | 浮层打开 / 关闭时                  |
| focus             | --                                                                   | 输入框聚焦                         |
| blur              | --                                                                   | 输入框失焦                         |
| panel-change      | `(mode: 'date' \| 'month' \| 'year' \| 'quarter', viewMonth: Dayjs)` | 面板模式切换时触发（含逐级上钻）   |

## 已知限制（未交付）

下列能力计入后续批次：

- range 区间选择（区间选择请使用独立的 `RangePicker` 组件）。
- `TimePicker` 组件、`format` 含时分秒时的面板分栏。
- `renderExtraFooter`、`showToday`。
- 键盘导航（Tab / 方向键 / Enter）。
