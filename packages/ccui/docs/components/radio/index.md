# Radio 单选框

+ 单选框组件

## 何时使用

+ 用于在多个备选项中选中单个状态。

## Radio基本用法

:::demo Radio 示例

```vue

<template>
  <c-radio v-model='radioActive' label='1'>这是一个单选按钮</c-radio>
  <c-radio v-model='radioActive' label='2' disabled>禁用</c-radio>
  <c-radio v-model='radioActive' label='3' :before-change='beforeChange'>beforeChange禁止切换</c-radio>
  <c-radio v-model='radioActive' label='4'>这也是个单选按钮</c-radio>
</template>

<script>
import {defineComponent, ref} from 'vue'

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

## RadioGroup基本用法

+ 用于展示一组多个 radio 单选框

:::demo RadioGroup 示例

```vue

<template>
  <div>
    <div>
      <h4>基础示例</h4>
      <c-radio-group v-model='checkedRadio' :before-change='beforeChange'>
        <c-radio label='1'>上海</c-radio>
        <c-radio label='2'>北京</c-radio>
        <c-radio label='3'>禁止切换</c-radio>
        <c-radio label='4'>广州</c-radio>
      </c-radio-group>
    </div>

    <div class="mt10">
      <h4>全部禁用</h4>
      <c-radio-group v-model='checkedRadio1' :before-change='beforeChange' disabled>
        <c-radio label='1'>上海</c-radio>
        <c-radio label='2'>北京</c-radio>
      </c-radio-group>
    </div>

    <div class="mt10">
      <h4>column 排列</h4>
      <c-radio-group v-model='checkedRadio1' direction='column'>
        <c-radio label='1'>上海</c-radio>
        <c-radio label='2'>北京</c-radio>
        <c-radio label='4'>广州</c-radio>
      </c-radio-group>
    </div>

    <div class="mt10">
      <h4>row 排列</h4>
      <c-radio-group v-model='checkedRadio1' direction='row'>
        <c-radio label='1'>上海</c-radio>
        <c-radio label='2'>北京</c-radio>
        <c-radio label='4'>广州</c-radio>
      </c-radio-group>
    </div>

    <p>提示信息：{{info}}</p>
  </div>
</template>

<script>
import {defineComponent, ref} from 'vue'

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
<style scoped>
.mt10 {
  margin-top: 10px;
}
</style>
```

:::

## Radio参数

|           参数           | 类型                                    |   默认   |                           说明    | 
|----------------------|---------------------------------------|------|-------------------------------------------------------|
| v-model  | \'string' \'number'                   |   -    |                      必选 radio 的绑定值                      |
|         label          | \'string' \'number'                       |   -    |                         必选，单选项值                         |
|          name          | string                                |   -    |                       原生 name 属性                        |
|        disabled        | boolean                               | false  |                       可选，是否禁用该单选项                       |
|      before-change      | [BeforeChangeType](#beforechangetype) |   -    | 可选，radio 切换前的回调函数，返回 boolean 类型，返回 false 可以阻止 radio 切换  |

## Radio事件

| 事件 | 类型 | 说明 |
|-------|--|-----------------|
| change | `(value: string) => void` | 单选项值改变时触发，返回选中的值 |

## Radio类型定义

### BeforeChangeType

```ts
export type BeforeChangeType = (value: string) => boolean | Promise<boolean>;
```

## Radio插槽

默认插槽

## RadioGroup参数

| 参数 | 类型                                    | 默认  | 说明 |
| ---- |---------------------------------------|-----| ---- |
| model-value / v-model | string / number                       |   -  | 必选 radio 的绑定值 |
| disabled| boolean                               |   false  | 可选，是否禁用该单选项 |
| direction | [DirectionType](#directionType)       | 'column' | 可选，设置横向或纵向排列 |
| before-change | [BeforeChangeType](#beforeChangeType) | -   | 可选，radio 切换前的回调函数，返回 boolean 类型，返回 false 可以阻止 radio 切换 |

## RadioGroup类型定义

### DirectionType

```ts
export type DirectionType = 'row' | 'column';
```

## RadioGroup事件

| 事件 | 类型 | 说明 |
| ---- | ---- | ---- |
| change |      | 单选项值改变时触发，返回选中的值 |

## RadioGroup插槽

默认插槽
