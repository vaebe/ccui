# DatePicker 日期选择框

输入或选择日期的控件。当前版本聚焦 `date` 单选，覆盖：受控 / 非受控 v-model、`format` / `valueFormat`、`disabledDate`、`clearable`、`size` / `status`、Teleport 与 `getPopupContainer`、Form 校验联动。

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

## API

### Props

| 参数              | 类型                                                       | 默认值                  | 说明                                                          |
| ----------------- | ---------------------------------------------------------- | ----------------------- | ------------------------------------------------------------- |
| modelValue        | string / Date / Dayjs / number / null                      | --                      | 当前选中日期，支持 `v-model`                                  |
| format            | string                                                     | `YYYY-MM-DD`            | 输入框显示与字符串解析格式（dayjs format token）              |
| valueFormat       | `'string' \| 'date' \| 'number'`                           | `'string'`              | `v-model` 输出形态：按 format 字符串 / Date 实例 / 毫秒时间戳 |
| placeholder       | string                                                     | `请选择日期`            | 占位文案                                                      |
| disabled          | boolean                                                    | `false`                 | 是否禁用                                                      |
| clearable         | boolean                                                    | `true`                  | 是否显示清除按钮                                              |
| size              | `'small' \| 'default' \| 'large'`                          | `'default'`             | 输入框尺寸                                                    |
| status            | `'' \| 'error' \| 'warning' \| ...`                        | `''`                    | 校验状态；置于 `FormItem` 时自动继承                          |
| disabledDate      | `(current: Dayjs) => boolean`                              | --                      | 不可选日期回调，返回 `true` 表示禁用                          |
| placement         | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'` | `'bottomLeft'`          | 浮层方位，配合 `@floating-ui/vue` 自动 flip / shift           |
| popupClassName    | string                                                     | --                      | 浮层根元素自定义 class                                        |
| popupAppendToBody | boolean                                                    | `false`                 | 是否把浮层 Teleport 到 `document.body`                        |
| getPopupContainer | `(trigger: HTMLElement \| null) => HTMLElement \| null`    | --                      | 自定义浮层挂载点，优先级高于 `popupAppendToBody`              |
| autoFocus         | boolean                                                    | `false`                 | 挂载后自动 focus 输入框                                       |
| inputReadOnly     | boolean                                                    | `true`                  | 输入框只读（不允许键盘输入日期，仅通过面板选择）              |
| transitionName    | string                                                     | `ccui-date-picker-fade` | 浮层过渡名                                                    |
| weekStart         | `0 \| 1`                                                   | `0`                     | 周起始：`0` 周日开头，`1` 周一开头                            |

### Events

| 事件名            | 回调签名                                    | 触发时机                           |
| ----------------- | ------------------------------------------- | ---------------------------------- |
| update:modelValue | `(value: string \| Date \| number \| null)` | 选中日期或清除时                   |
| change            | `(value, dateString: string)`               | 选中日期或清除时（带格式化字符串） |
| open-change       | `(open: boolean)`                           | 浮层打开 / 关闭时                  |
| focus             | --                                          | 输入框聚焦                         |
| blur              | --                                          | 输入框失焦                         |

## 已知限制（未交付）

当前版本聚焦 `date` 单选，下列能力计入后续批次：

- range 区间选择、`week` / `month` / `year` / `quarter` 模式。
- `showTime`、`TimePicker` 组件、`format` 含时分秒时的面板分栏。
- `presets` 预设、`renderExtraFooter`、`showToday` / `showNow`。
- `locale` 切换（当前文案与周标签固定为中文）。
- 键盘导航（Tab / 方向键 / Enter）。
