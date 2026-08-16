# TimeRangePicker 时间范围选择

时间区间选择控件，`v-model` 是 `[start, end]` 元组。两端各自独立的 TimePicker 面板，支持独立 `disabled` / `allowEmpty` / `placeholder`，可配 `order` 自动保序。

## 基本使用

`v-model` 直接绑定 `[start, end]` 数组。任一端为空时元组对应位置是 `null` 或空串（按 `value-format` 决定）。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<[string, string] | null>(null)
</script>

<template>
  <c-time-range-picker v-model="value" />
  <p>v-model：{{ value }}</p>
</template>
```

:::

## 自定义格式

`format` 决定输入与展示格式；`valueFormat` 决定 `v-model` 输出形态（string / date / number）。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<[string, string] | null>(['09:00', '18:00'])
</script>

<template>
  <c-time-range-picker v-model="value" format="HH:mm" />
</template>
```

:::

## 两端独立禁用 disabled

`disabled` 支持元组 `[boolean, boolean]`，分别锁两端输入。例如「开始可选 / 结束锁定」。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<[string, string] | null>(['09:00:00', '18:00:00'])
</script>

<template>
  <c-time-range-picker v-model="value" :disabled="[false, true]" />
</template>
```

:::

## 两端独立允许为空 allowEmpty

`allowEmpty` 接元组 `[boolean, boolean]`，分别配置「开始可空 / 结束可空」。业务侧常用「开始日期可空 / 结束日期必填」之类的不对称需求。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<[string, string] | null>(null)
</script>

<template>
  <c-time-range-picker v-model="value" :allow-empty="[true, false]" />
</template>
```

:::

## 自定义分隔符

`separator` 默认 `~`，可改成箭头 `→` 或文字 `至`。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<[string, string] | null>(null)
</script>

<template>
  <c-time-range-picker v-model="value" separator="→" />
  <c-time-range-picker v-model="value" separator="至" />
</template>
```

:::

## API

### Props

| 参数              | 类型                                                                  | 默认值       | 说明                                              |
| ----------------- | --------------------------------------------------------------------- | ------------ | ------------------------------------------------- |
| modelValue        | `[DateValue, DateValue] \| null`                                      | --           | 时间范围元组，支持 `v-model`                      |
| format            | string                                                                | `''`         | 时间格式（dayjs token）；空时按 `use12Hours` 兜底 |
| valueFormat       | `'string' \| 'date' \| 'number'`                                      | `'string'`   | `v-model` 输出形态                                |
| use12Hours        | boolean                                                               | `false`      | 12 小时制                                         |
| placeholder       | `string \| [string, string]`                                          | --           | 占位文案；元组分别给两端                          |
| disabled          | `boolean \| [boolean, boolean]`                                       | `false`      | 是否禁用；元组分别锁两端                          |
| allowEmpty        | `boolean \| [boolean, boolean]`                                       | `false`      | 是否允许该端为空；元组分别配置                    |
| order             | boolean                                                               | `true`       | start > end 时自动交换                            |
| separator         | string                                                                | `~`          | 中间分隔符                                        |
| size              | `'small' \| 'default' \| 'large'`                                     | `'default'`  | 输入框尺寸                                        |
| status            | `'' \| 'error' \| 'warning' \| 'success' \| 'validating'`             | `''`         | 校验状态                                          |
| placement         | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'`            | `bottomLeft` | 浮层方位                                          |
| clearable         | boolean                                                               | `true`       | 是否显示清除按钮                                  |
| clearIcon         | `string \| VNode`                                                     | --           | 自定义清除图标，也可使用 `clearIcon` 插槽         |
| suffixIcon        | `string \| VNode`                                                     | --           | 自定义后缀图标，也可使用 `suffixIcon` 插槽        |
| popupClassName    | string                                                                | `''`         | 浮层附加 class                                    |
| popupAppendToBody | boolean                                                               | `false`      | 是否将浮层 Teleport 到 body                       |
| autoFocus         | boolean                                                               | `false`      | 挂载后是否自动聚焦开始时间输入框                  |
| inputReadOnly     | boolean                                                               | `true`       | 是否将内部输入框设为只读                          |
| showHour          | boolean                                                               | `true`       | 是否显示小时列                                    |
| showMinute        | boolean                                                               | `true`       | 是否显示分钟列                                    |
| showSecond        | boolean                                                               | `true`       | 是否显示秒列                                      |
| hourStep          | number                                                                | `1`          | 小时步进                                          |
| minuteStep        | number                                                                | `1`          | 分钟步进                                          |
| secondStep        | number                                                                | `1`          | 秒步进                                            |
| disabledHours     | `(which: 'start' \| 'end') => number[]`                               | --           | 按 which 区分两端的小时禁用                       |
| disabledMinutes   | `(which: 'start' \| 'end', selectedHour: number) => number[]`         | --           | 按 which + 当前 hour 返回禁用分钟                 |
| disabledSeconds   | `(which: 'start' \| 'end', selectedHour, selectedMinute) => number[]` | --           | 按 which + 时分返回禁用秒                         |
| showNow           | boolean                                                               | `true`       | 是否显示“此刻”快捷操作                            |
| showOk            | boolean                                                               | `true`       | 是否显示确认按钮                                  |
| variant           | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'`              | `outlined`   | 输入框形态                                        |
| classNames        | `{ root?: string }`                                                   | --           | 根节点语义化 class                                |
| styles            | `{ root?: CSSProperties }`                                            | --           | 根节点语义化样式                                  |

### Events

| 事件名            | 回调签名                      | 触发时机                           |
| ----------------- | ----------------------------- | ---------------------------------- |
| update:modelValue | `(value: [...] \| null)`      | 任一端变更或清除                   |
| change            | `(value, [startStr, endStr])` | 选中或清除时（带格式化字符串元组） |
| open-change       | `(open: boolean)`             | 任一端面板打开 / 关闭              |
| focus             | --                            | 任一端输入框获得焦点               |
| blur              | --                            | 任一端输入框失去焦点               |

### Slots

| 插槽名     | 说明           |
| ---------- | -------------- |
| clearIcon  | 自定义清除图标 |
| suffixIcon | 自定义后缀图标 |
