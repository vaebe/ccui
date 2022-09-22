# Radio 单选框

+ 单选框组件

## 何时使用

+ 用于在多个备选项中选中单个状态。

## Radio 基本用法

:::demo Radio 示例

```vue

<template>
  <k-radio v-model='radioActive' label='1'>这是一个单选按钮</k-radio>
  <k-radio v-model='radioActive' label='2' disabled>禁用</k-radio>
  <k-radio v-model='radioActive' label='3' :before-change='beforeChange'>beforeChange禁止切换</k-radio>
  <k-radio v-model='radioActive' label='4'>这也是个单选按钮</k-radio>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const radioActive = ref('1')
    const beforeChange = (val) => {
      console.log(val, 'radio 禁止切换')
      return false
    }

    return {
      radioActive,
      beforeChange
    }
  }
})
</script>
```

:::

## radio-group 基本用法

+ 用于展示一组多个 radio 单选框

:::demo radio-group 示例

```vue

<template>
  <div style='display: flex;justify-content: space-between'>
    <div>
      <p>基础示例</p>
      <k-radio-group v-model='checkedRadio' :before-change='beforeChange'>
        <k-radio label='1'>上海</k-radio>
        <k-radio label='2'>北京</k-radio>
        <k-radio label='3'>禁止切换</k-radio>
        <k-radio label='4'>广州</k-radio>
      </k-radio-group>
      <p>提示信息：{{info}}</p>
    </div>

    <div>
      <p>全部禁用</p>
      <k-radio-group v-model='checkedRadio1' :before-change='beforeChange' disabled>
        <k-radio label='1'>上海</k-radio>
        <k-radio label='2'>北京</k-radio>
      </k-radio-group>
    </div>

    <div>
      <p>column 排列</p>
      <k-radio-group v-model='checkedRadio1' direction='column'>
        <k-radio label='1'>上海</k-radio>
        <k-radio label='2'>北京</k-radio>
        <k-radio label='4'>广州</k-radio>
      </k-radio-group>
    </div>

    <div>
      <p>row 排列</p>
      <k-radio-group v-model='checkedRadio1' direction='row'>
        <k-radio label='1'>上海</k-radio>
        <k-radio label='2'>北京</k-radio>
        <k-radio label='4'>广州</k-radio>
      </k-radio-group>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const info = ref('')
    const checkedRadio = ref('3')
    const checkedRadio1 = ref('1')
    const beforeChange = (val) => {
      info.value = val === '3' ? `label ${val}  radio 禁止切换` : `label ${val}`
      return val !== '3'
    }

    return {
      info,
      checkedRadio,
      checkedRadio1,
      beforeChange
    }
  }
})
</script>
```

:::

## Radio 参数

|           参数           |        类型        |   默认   |                           说明    | 
|----------------------|----------------|------|-------------------------------------------------------|
| model-value / v-model  | string / number  |   -    |                      必选 radio 的绑定值                      |
|         label          | string / number  |   -    |                         必选，单选项值                         |
|          name          |      string      |   -    |                       原生 name 属性                        |
|        disabled        |     boolean      | false  |                       可选，是否禁用该单选项                       |
|      before-change      |     function     |   -    | 可选，radio 切换前的回调函数，返回 boolean 类型，返回 false 可以阻止 radio 切换  |

## Radio 事件

|   事件    |   类型   |        说明         |
|-------|------|-----------------|
| change  |        | 单选项值改变时触发，返回选中的值  |

## Radio 插槽

默认插槽

## Radio-group 参数

| 参数 | 类型              | 默认  | 说明 |
| ---- |-----------------|-----| ---- |
| model-value / v-model | string / number |   -  | 必选 radio 的绑定值 |
| disabled| boolean         |   false  | 可选，是否禁用该单选项 |
| direction | 'row'/'column'  | 'column' | 可选，设置横向或纵向排列 |
| before-change | function        | -   | 可选，radio 切换前的回调函数，返回 boolean 类型，返回 false 可以阻止 radio 切换 |

## Radio-group 事件

| 事件 | 类型 | 说明 |
| ---- | ---- | ---- |
| change |      | 单选项值改变时触发，返回选中的值 |

## Radio-group 插槽

默认插槽
