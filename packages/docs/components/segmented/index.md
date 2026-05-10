# Segmented 分段控制器

在两个或多个互斥选项之间切换，比 Radio 更紧凑。

## 何时使用

- 视图切换（日 / 周 / 月）。
- 在多种相同类型的视图 / 数据集间切换。

## 基本使用

`options` 是字符串 / 数字数组，`v-model` 绑定当前选中值。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const v = ref('Daily')
</script>

<template>
  <c-segmented v-model="v" :options="['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']" />
  <p style="margin-top: 8px; color: #666">当前：{{ v }}</p>
</template>
```

:::

## 用对象选项

`options` 元素也可以是 `{ label, value, disabled, icon }`。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const v = ref('list')
</script>

<template>
  <c-segmented
    v-model="v"
    :options="[
      { label: '列表', value: 'list' },
      { label: '看板', value: 'kanban' },
      { label: '日历', value: 'calendar', disabled: true },
    ]"
  />
</template>
```

:::

## 不同尺寸

`size`：`small` / `middle`（默认）/ `large`。

:::demo

```vue
<template>
  <c-segmented size="small" :options="['Daily', 'Weekly', 'Monthly']" model-value="Daily" />
  <br /><br />
  <c-segmented :options="['Daily', 'Weekly', 'Monthly']" model-value="Daily" />
  <br /><br />
  <c-segmented size="large" :options="['Daily', 'Weekly', 'Monthly']" model-value="Daily" />
</template>
```

:::

## 块级宽度

`block` 让组件横向占满父容器。

:::demo

```vue
<template>
  <c-segmented block :options="['Map', 'Transit', 'Satellite']" model-value="Map" />
</template>
```

:::

## 禁用整组

`disabled` 让所有选项不可点。

:::demo

```vue
<template>
  <c-segmented disabled :options="['Map', 'Transit', 'Satellite']" model-value="Map" />
</template>
```

:::

## 监听变化

`change` 事件返回新值，可联动其他组件。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const v = ref('all')
const log = ref('（无）')

function onChange(val) {
  log.value = val
}
</script>

<template>
  <c-segmented v-model="v" :options="['all', 'todo', 'done']" @change="onChange" />
  <p style="margin-top: 8px; color: #666">最近 change：{{ log }}</p>
</template>
```

:::

## API

### Props

| 参数       | 类型                                       | 默认值     | 说明                                              |
| ---------- | ------------------------------------------ | ---------- | ------------------------------------------------- |
| modelValue | `string \| number`                         | `''`       | 选中值，支持 `v-model`                            |
| options    | `(SegmentedOption \| string \| number)[]`  | `[]`       | 选项列表                                          |
| block      | boolean                                    | `false`    | 撑满父容器                                        |
| disabled   | boolean                                    | `false`    | 整组禁用                                          |
| size       | `'small' \| 'middle' \| 'large'`           | `'middle'` | 尺寸                                              |

### SegmentedOption

| 字段     | 类型                | 说明              |
| -------- | ------------------- | ----------------- |
| label    | string              | 显示文字          |
| value    | `string \| number`  | 必填，选中值      |
| disabled | boolean             | 单项禁用          |
| icon     | string              | 自定义 icon class |

### Events

| 事件名 | 回调签名                       | 说明      |
| ------ | ------------------------------ | --------- |
| change | `(value: string \| number)`    | 切换时触发 |
