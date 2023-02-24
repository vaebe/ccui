# Calendar 日历

+ 日历组件

## 何时使用

+ 显示日期

## 基本用法

:::demo Calendar 示例

```vue

<template>
  <c-calendar v-model="curDate" @change="curDateChange"></c-calendar>
</template>

<script>
import {defineComponent, ref} from 'vue'

export default defineComponent({
  setup() {
    const curDate = ref(new Date())

    const curDateChange = (val) => {
      console.log(val)
    }
    return {
      curDate,
      curDateChange
    }
  }
})
</script>

<style>

</style>
```

:::

## 自定义header

:::demo Calendar 示例

```vue

<template>
  <c-calendar v-model="curDate" @change="curDateChange">
    <template #header="date">
      <div class="customize-header">
        当前日期 {{date}}
        <c-button type="primary" plain @click="addADay">加一天</c-button>
      </div>
    </template>
  </c-calendar>
</template>

<script>
import {defineComponent, ref} from 'vue'

export default defineComponent({
  setup() {
    const curDateChange = (val) => {
      console.log(val)
    }

    const curDate = ref(new Date())

    const addADay = () => {
      const dateTime = new Date(curDate.value).getTime() + (1000 * 60 * 60 * 24)
      curDate.value = new Date(dateTime)
    }
    return {
      curDateChange,
      curDate,
      addADay
    }
  }
})
</script>

<style scoped>
.customize-header {
  padding: 10px;
}
</style>
```

:::

## 自定义日期内容

:::demo Calendar 示例

```vue

<template>
  <c-calendar @change="curDateChange">
    <template #dateCell="{isSelected, date, day}">
      {{isSelected ? '当前选中日期' : day}}
    </template>
  </c-calendar>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  setup() {
    const curDateChange = (val) => {
      console.log(val)
    }
    return {
      curDateChange
    }
  }
})
</script>

<style>

</style>
```

:::

## Calendar参数

| 参数 | 类型         | 默认 | 说明 |
| ---- |------------| ---- | ---- |
| v-model | `Date` | -- |  必选，组件绑定的值 |

## Calendar事件

| 事件 | 类型 | 说明 |
| ---- | ---- | ---- |
| change |  `string` |   日期改变后的值   |

## Calendar插槽

| 插槽名 | 说明 |
| ---- | -- |
| header | 自定义日历头部，参数`date`当前日期 |
| dateCell | 返回 `data: { isSelected, date, day }`;`isSelected` 是否选中、`date` 格式化后的日期、 `day` 单元格的日期 。 |
