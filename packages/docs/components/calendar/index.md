# Calendar 日历

按月展示日期，常用于"日程 / 任务 / 排班"场景。

## 何时使用

- 单选某一天作为业务输入。
- 自定义每天的 cell，叠加业务标记（如待办数量、状态徽标）。

## 基本使用

`v-model` 绑定 Date 对象，点击单元格切换选中日。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const date = ref(new Date())
</script>

<template>
  <c-calendar v-model="date" />
  <p style="margin-top: 8px; color: #666">已选：{{ date.toISOString().slice(0, 10) }}</p>
</template>
```

:::

## 监听变化

`change` 事件返回新选中的 Date。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const date = ref(new Date())
const log = ref('（无）')

function onChange(val) {
  log.value = val.toISOString().slice(0, 10)
}
</script>

<template>
  <c-calendar v-model="date" @change="onChange" />
  <p style="margin-top: 8px; color: #666">最近 change：{{ log }}</p>
</template>
```

:::

## 只读模式

`read-only` 让用户无法点击切换，常用于"展示一份排期表"。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const date = ref(new Date())
</script>

<template>
  <c-calendar v-model="date" read-only />
</template>
```

:::

## 自定义 header

`#header` 插槽接收当前格式化日期，可换成业务自定义的工具栏（前后月切换、跳转今天等）。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const date = ref(new Date())

function shift(days) {
  const ts = date.value.getTime() + 86_400_000 * days
  date.value = new Date(ts)
}

function today() {
  date.value = new Date()
}
</script>

<template>
  <c-calendar v-model="date">
    <template #header="d">
      <div style="padding: 8px 12px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #f0f0f0">
        <c-button size="small" @click="shift(-1)">‹ 前一天</c-button>
        <c-button size="small" @click="shift(1)">后一天 ›</c-button>
        <c-button size="small" type="primary" @click="today">今天</c-button>
        <span style="margin-inline-start: auto; color: #666">当前：{{ d }}</span>
      </div>
    </template>
  </c-calendar>
</template>
```

:::

## 自定义日期 cell

`#dateCell` 插槽接收 `{ isSelected, date, day }`，可在每一天上叠加业务标记。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const date = ref(new Date())

const events = {
  5: '订货',
  12: '复盘',
  18: '上线',
  25: '排班',
}
</script>

<template>
  <c-calendar v-model="date">
    <template #dateCell="{ isSelected, day }">
      <div :style="{ position: 'relative', height: '100%' }">
        <span>{{ day }}</span>
        <span
          v-if="events[day]"
          :style="{
            position: 'absolute',
            inset: 'auto 0 0 0',
            fontSize: '11px',
            color: isSelected ? '#fff' : '#1677ff',
          }"
        >
          • {{ events[day] }}
        </span>
      </div>
    </template>
  </c-calendar>
</template>
```

:::

## 选中信息回显

把 `dateCell` 的 `isSelected` 拿来显示"已选 / 未选"提示。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const date = ref(new Date())
</script>

<template>
  <c-calendar v-model="date">
    <template #dateCell="{ isSelected, day }">
      {{ isSelected ? '✓' : day }}
    </template>
  </c-calendar>
</template>
```

:::

## API

### Props

| 参数       | 类型     | 默认值       | 说明                |
| ---------- | -------- | ------------ | ------------------- |
| modelValue | `Date`   | `new Date()` | 选中日期（v-model） |
| readOnly   | boolean  | `false`      | 只读模式            |

### Events

| 事件   | 回调签名         | 说明              |
| ------ | ---------------- | ----------------- |
| change | `(value: Date)`  | 选中日期变化时触发 |

### Slots

| 名称     | 说明                                                                                |
| -------- | ----------------------------------------------------------------------------------- |
| header   | 自定义日历头部，参数为格式化后的日期字符串                                          |
| dateCell | 自定义日期 cell，参数 `{ isSelected, date, day }`：是否选中 / 完整日期串 / 单元日号 |
