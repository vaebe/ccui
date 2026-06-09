# Calendar 日历

按月展示日期，常用于"日程 / 任务 / 排班"场景。

## 何时使用

- 单选某一天作为业务输入。
- 自定义每天的 cell，叠加业务标记（如待办数量、状态徽标）。

## 基本使用

`v-model` 默认绑定 `YYYY-MM-DD` 字符串，点击单元格切换选中日。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const date = ref(new Date().toISOString().slice(0, 10))
</script>

<template>
  <c-calendar v-model="date" />
  <p style="margin-top: 8px; color: var(--ccui-color-text-secondary)">已选：{{ date }}</p>
</template>
```

:::

## 监听变化

`change` 事件返回新选中的日期，类型随 `valueFormat`（默认 `'string'`）。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const date = ref(new Date().toISOString().slice(0, 10))
const log = ref('（无）')

function onChange(val) {
  log.value = String(val)
}
</script>

<template>
  <c-calendar v-model="date" @change="onChange" />
  <p style="margin-top: 8px; color: var(--ccui-color-text-secondary)">最近 change：{{ log }}</p>
</template>
```

:::

## 只读模式

`read-only` 让用户无法点击切换，常用于"展示一份排期表"。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const date = ref(new Date().toISOString().slice(0, 10))
</script>

<template>
  <c-calendar v-model="date" read-only />
</template>
```

:::

## 自定义 header

`#header` 插槽接收作用域对象 `{ value, currentMonth, setDate, changeMonth }`，slot 内可直接调用月份切换 API，无需从外部维护状态。

| 字段         | 类型                                              | 说明                         |
| ------------ | ------------------------------------------------- | ---------------------------- |
| value        | `string`                                          | 当前选中日期（`YYYY-MM-DD`） |
| currentMonth | `string`                                          | 当前展示月份（`YYYY-MM`）    |
| setDate      | `(date: string) => void`                          | 跳转到任意 `YYYY-MM-DD`      |
| changeMonth  | `(direction: 'lastMonth' \| 'nextMonth') => void` | 上下月切换                   |

:::demo

```vue
<script setup>
import { ref } from 'vue'

const date = ref(new Date().toISOString().slice(0, 10))
</script>

<template>
  <c-calendar v-model="date">
    <template #header="{ value, currentMonth, setDate, changeMonth }">
      <div style="padding: 8px 12px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid var(--ccui-color-border-secondary)">
        <c-button size="small" @click="changeMonth('lastMonth')">‹ 上月</c-button>
        <c-button size="small" @click="changeMonth('nextMonth')">下月 ›</c-button>
        <c-button size="small" type="primary" @click="setDate(new Date().toISOString().slice(0, 10))">今天</c-button>
        <span style="margin-inline-start: auto; color: var(--ccui-color-text-secondary)">当前月：{{ currentMonth }}</span>
        <span style="color: var(--ccui-color-text-secondary)">选中：{{ value }}</span>
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

const date = ref(new Date().toISOString().slice(0, 10))

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
            color: isSelected ? 'var(--ccui-color-text-light-solid)' : 'var(--ccui-color-primary)',
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

const date = ref('2026-03-15')
</script>

<template>
  <c-calendar v-model="date">
    <template #dateCell="{ isSelected, day }">
      <c-icon v-if="isSelected" name="mdi:check" />
      <template v-else>{{ day }}</template>
    </template>
  </c-calendar>
</template>
```

:::

## valueFormat='string'（默认）

字符串协议，便于 JSON 序列化和路由参数透传。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const date = ref('2026-03-15')
</script>

<template>
  <c-calendar v-model="date" />
  <p>当前值（string）：{{ date }}</p>
</template>
```

:::

## valueFormat='date'

输出原生 `Date`，便于与既有日期 API 互操作。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const date = ref(new Date(2026, 2, 15))
</script>

<template>
  <c-calendar v-model="date" value-format="date" />
  <p>ISO：{{ date.toISOString() }}</p>
</template>
```

:::

## valueFormat='number' timestamp

毫秒级 timestamp，便于直接落库。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const ts = ref(Date.now())
</script>

<template>
  <c-calendar v-model="ts" value-format="number" />
  <p>timestamp：{{ ts }}</p>
  <p>反解：{{ new Date(ts).toLocaleDateString() }}</p>
</template>
```

:::

## 自定义 format

`format` 同时控制输入解析与字符串输出。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const date = ref('2026/03/15')
</script>

<template>
  <c-calendar v-model="date" format="YYYY/MM/DD" />
  <p>当前值：{{ date }}</p>
</template>
```

:::

## Dayjs 实例输入

直接传 `dayjs()` 实例做初始化，组件内部统一转 dayjs 处理。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

const date = ref(dayjs().add(7, 'day').format('YYYY-MM-DD'))
</script>

<template>
  <c-calendar v-model="date" />
  <p>七天后：{{ date }}</p>
</template>
```

:::

## 空值初始化

`null` 时回退到当天高亮。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const date = ref(null)
</script>

<template>
  <c-calendar v-model="date" />
  <p>当前值：{{ date ?? '（未选择）' }}</p>
</template>
```

:::

## 周末高亮

用 `dateCell` slot + dayjs 算出 `dayOfWeek`，给周六周日加视觉权重。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

const date = ref('2026-03-15')
function isWeekend(d) {
  const w = dayjs(d).day()
  return w === 0 || w === 6
}
</script>

<template>
  <c-calendar v-model="date">
    <template #dateCell="{ date: d, day }">
      <span :style="{ color: isWeekend(d) ? 'var(--c-color-error)' : 'inherit', fontWeight: isWeekend(d) ? 600 : 400 }">
        {{ day }}
      </span>
    </template>
  </c-calendar>
</template>
```

:::

## 双月对照

并列两个 Calendar 浏览跨月范围。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'

const left = ref(dayjs().format('YYYY-MM-DD'))
const right = ref(dayjs().add(1, 'month').format('YYYY-MM-DD'))
</script>

<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap;">
    <c-calendar v-model="left" style="flex: 1; min-width: 280px;" />
    <c-calendar v-model="right" style="flex: 1; min-width: 280px;" />
  </div>
</template>
```

:::

## API

### Props

| 参数        | 类型                                        | 默认值         | 说明                                                                           |
| ----------- | ------------------------------------------- | -------------- | ------------------------------------------------------------------------------ |
| modelValue  | `string \| number \| Date \| Dayjs \| null` | --             | 选中日期（v-model）；`null` 回退到今天                                         |
| format      | string                                      | `'YYYY-MM-DD'` | 字符串输入解析模板 + `valueFormat='string'` 时的输出模板（dayjs format token） |
| valueFormat | `'string' \| 'date' \| 'number'`            | `'string'`     | v-model 输出协议：字符串 / 原生 `Date` / 毫秒级 timestamp                      |
| readOnly    | boolean                                     | `false`        | 只读模式                                                                       |
| classNames  | `{ root?, header?, body?, cell? }`          | --             | 语义化 DOM className 注入                                                      |
| styles      | `{ root?, header?, body?, cell? }`          | --             | 语义化 DOM style 注入                                                          |

### Events

| 事件   | 回调签名                                    | 说明                               |
| ------ | ------------------------------------------- | ---------------------------------- |
| change | `(value: string \| Date \| number \| null)` | 选中日期变化；类型随 `valueFormat` |

### Slots

| 名称     | 说明                                                                                    |
| -------- | --------------------------------------------------------------------------------------- |
| header   | 自定义日历头部，作用域 `{ value, currentMonth, setDate, changeMonth }`（详见上方 demo） |
| dateCell | 自定义日期 cell，参数 `{ isSelected, date, day }`：是否选中 / 完整日期串 / 单元日号     |
