# TimePicker 时间选择框

输入或选择时间的控件。三列（时 / 分 / 秒）滚动选择，可控制各列显示与步长，支持 `disabledHours` / `disabledMinutes` / `disabledSeconds` 屏蔽，支持 `showNow` 与 `showOk` 控制 footer 行为。

## 基本用法

最简单的用法，默认 `format: 'HH:mm:ss'`，`showOk: true`，需要点确定才提交。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <c-time-picker v-model="value" />
</template>
```

:::

## 选中即提交

把 `show-ok` 和 `show-now` 关闭后，点击单元格立即触发 `change` 并关闭面板。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <c-time-picker v-model="value" :show-ok="false" :show-now="false" />
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
  <c-time-picker v-model="a" format="HH:mm" :show-second="false" />
  <c-time-picker v-model="b" value-format="date" />
  <c-time-picker v-model="c" value-format="number" />
</template>
```

:::

## 步长

`hour-step` / `minute-step` / `second-step` 控制各列步长。常见用法：5 分钟一档、30 秒一档。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <c-time-picker v-model="value" :minute-step="5" :second-step="15" />
</template>
```

:::

## 屏蔽时间

`disabled-hours` / `disabled-minutes` / `disabled-seconds` 返回不可选值的数组。`disabled-minutes` 接收当前选中小时，`disabled-seconds` 接收当前小时与分钟，可以做联动屏蔽（比如 9:00 之前禁选）。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')

function disabledHours() {
  return Array.from({ length: 9 }, (_, i) => i)
}

function disabledMinutes(h: number) {
  if (h === 9) return [0, 1, 2, 3, 4]
  return []
}
</script>

<template>
  <c-time-picker v-model="value" :disabled-hours="disabledHours" :disabled-minutes="disabledMinutes" />
</template>
```

:::

## 隐藏某列

只选「时:分」或「时」，关掉对应列即可。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const onlyHourMinute = ref('')
const onlyHour = ref('')
</script>

<template>
  <c-time-picker v-model="onlyHourMinute" format="HH:mm" :show-second="false" />
  <c-time-picker v-model="onlyHour" format="HH" :show-minute="false" :show-second="false" />
</template>
```

:::

## 三种尺寸

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <c-time-picker v-model="value" size="small" placeholder="small" />
  <c-time-picker v-model="value" placeholder="default" />
  <c-time-picker v-model="value" size="large" placeholder="large" />
</template>
```

:::

## 表单联动

放进 `c-form-item` 内时，`status` 会自动跟随 `FormItem` 的校验状态。

:::demo

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({ meeting: '' })
const formRef = ref<{ validate: () => Promise<boolean> } | null>(null)
const rules = { meeting: [{ required: true, message: '请选择会议时间' }] }
</script>

<template>
  <c-form ref="formRef" :model="form" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
    <c-form-item name="meeting" label="会议时间" prop="meeting">
      <c-time-picker v-model="form.meeting" />
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

const value = ref('')
</script>

<template>
  <c-time-picker v-model="value" popup-append-to-body />
</template>
```

:::

## 12 小时制

打开 `use-12-hours` 后，小时列按 `[12, 1, 2, ..., 11]` 排列，并追加 AM / PM 列。未显式传 `format` 时，输入框默认按 `'h:mm:ss a'` 渲染。`disabled-hours` 仍按 24 小时数字配置，组件内部完成映射。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <c-time-picker v-model="value" use-12-hours />
  <p>v-model 值: {{ value }}</p>
</template>
```

:::

## 键盘导航

打开面板后 Tab 进入任意 cell（每个 cell 均为 `tabindex=0`），即可使用键盘切换：

- `ArrowUp` / `ArrowDown`：在当前列内上下移动（环绕到首 / 尾）。
- `Home` / `End`：跳到当前列首项 / 末项。
- `Enter`：相当于点击「确定」，或在 `show-ok=false` 时关闭面板。
- `Escape`：关闭面板。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <c-time-picker v-model="value" />
</template>
```

:::

## 自动滚动到选中

弹层打开时，每一列会基于 `offsetTop` / `clientHeight` 自动计算 `scrollTop`，将当前选中项滚动到列中央。下例预置 `14:30:45`，展开面板即可看到三列均已对齐到选中行。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('14:30:45')
</script>

<template>
  <c-time-picker v-model="value" />
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
  <c-time-picker v-model="value" :variant="variant" />
</template>

<script setup>
import { ref } from 'vue'
const variant = ref('outlined')
const value = ref('')
</script>
```

:::

## API

### Props

| 参数              | 类型                                                       | 默认值                  | 说明                                                                                                       |
| ----------------- | ---------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| modelValue        | string / Date / Dayjs / number / null                      | --                      | 当前选中时间，支持 `v-model`                                                                               |
| format            | string                                                     | `''`                    | 输入框显示与字符串解析格式（dayjs format token）；为空时按 `use12Hours` 兜底 `'h:mm:ss a'` 或 `'HH:mm:ss'` |
| use12Hours        | boolean                                                    | `false`                 | 12 小时制：小时列按 `[12, 1, ..., 11]` 排列并追加 AM / PM 列                                               |
| valueFormat       | `'string' \| 'date' \| 'number'`                           | `'string'`              | `v-model` 输出形态：按 format 字符串 / Date 实例 / 毫秒时间戳                                              |
| placeholder       | string                                                     | `请选择时间`            | 占位文案                                                                                                   |
| disabled          | boolean                                                    | `false`                 | 是否禁用                                                                                                   |
| clearable         | boolean                                                    | `true`                  | 是否显示清除按钮                                                                                           |
| size              | `'small' \| 'default' \| 'large'`                          | `'default'`             | 输入框尺寸                                                                                                 |
| status            | `'' \| 'error' \| 'warning' \| ...`                        | `''`                    | 校验状态；置于 `FormItem` 时自动继承                                                                       |
| placement         | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'` | `'bottomLeft'`          | 浮层方位                                                                                                   |
| popupClassName    | string                                                     | --                      | 浮层根元素自定义 class                                                                                     |
| popupAppendToBody | boolean                                                    | `false`                 | 是否把浮层 Teleport 到 `document.body`                                                                     |
| getPopupContainer | `(trigger: HTMLElement \| null) => HTMLElement \| null`    | --                      | 自定义浮层挂载点，优先级高于 `popupAppendToBody`                                                           |
| autoFocus         | boolean                                                    | `false`                 | 挂载后自动 focus 输入框                                                                                    |
| inputReadOnly     | boolean                                                    | `true`                  | 输入框只读                                                                                                 |
| transitionName    | string                                                     | `ccui-time-picker-fade` | 浮层过渡名                                                                                                 |
| showHour          | boolean                                                    | `true`                  | 是否显示小时列                                                                                             |
| showMinute        | boolean                                                    | `true`                  | 是否显示分钟列                                                                                             |
| showSecond        | boolean                                                    | `true`                  | 是否显示秒列                                                                                               |
| hourStep          | number                                                     | `1`                     | 小时步长                                                                                                   |
| minuteStep        | number                                                     | `1`                     | 分钟步长                                                                                                   |
| secondStep        | number                                                     | `1`                     | 秒步长                                                                                                     |
| disabledHours     | `() => number[]`                                           | --                      | 不可选小时数组                                                                                             |
| disabledMinutes   | `(hour: number) => number[]`                               | --                      | 不可选分钟（接收当前选中小时联动）                                                                         |
| disabledSeconds   | `(hour: number, minute: number) => number[]`               | --                      | 不可选秒（接收当前小时分钟联动）                                                                           |
| showNow           | boolean                                                    | `true`                  | 是否显示「此刻」按钮                                                                                       |
| showOk            | boolean                                                    | `true`                  | 是否显示「确定」按钮；`false` 时点击单元格立即提交并关闭                                                   |
| nowText           | string                                                     | `此刻`                  | 「此刻」按钮文案                                                                                           |
| okText            | string                                                     | `确定`                  | 「确定」按钮文案                                                                                           |

### Events

| 事件名            | 回调签名                                    | 触发时机                           |
| ----------------- | ------------------------------------------- | ---------------------------------- |
| update:modelValue | `(value: string \| Date \| number \| null)` | 提交时间或清除时                   |
| change            | `(value, timeString: string)`               | 提交时间或清除时（带格式化字符串） |
| open-change       | `(open: boolean)`                           | 浮层打开 / 关闭时                  |
| focus             | --                                          | 输入框聚焦                         |
| blur              | --                                          | 输入框失焦                         |

## 已知限制（未交付）

- **范围选择**：与 DatePicker range 一起作为一批做。
- **showTime 嵌入 DatePicker**：DatePicker 推到 90% 时一并接通。
- **滚轮 snap**：打开时已可自动滚动到选中项（见上文 "自动滚动到选中"），但鼠标滚轮 / 触控板的 snap-to-cell 吸附交互暂未实现，留给后续。
