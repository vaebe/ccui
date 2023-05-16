# CheckBox 多选框

+ 一组备选项中进行多选

## 何时使用

+ 在一组选项中进行多项选择；
+ 单独使用可以表示两种状态之间的切换，写在标签中的内容为 checkbox 按钮后的介绍。

## CheckBox基本用法

:::demo CheckBox示例

```vue

<template>
  <c-check-box v-model='checked'>{{ msg }}</c-check-box>
  <c-check-box v-model='checked2' :label='label'></c-check-box>
  <c-check-box v-model='checked3' :disabled='true'>禁用 check-box</c-check-box>
  <c-check-box v-model='checked4' color='RGB(255, 193, 7)'>改变 icon 的颜色</c-check-box>

  <c-check-box v-model='checked5' @change='checkBoxChange'>checkBoxChange 事件， 关联下方beforeChange的切换状态
  </c-check-box>
  <c-check-box v-model='checked6' :beforeChange='checkBoxBeforeChange'>
    beforeChange 返回 {{checked5}} {{checked5 ? '可以' : '不能'}} 切换状态
  </c-check-box>
</template>

<script>
import {defineComponent, ref} from 'vue'

export default defineComponent({
  setup() {
    const checked = ref(true)
    const checked2 = ref(false)
    const checked3 = ref(true)
    const checked4 = ref(true)

    const checked5 = ref(false)
    const checkBoxChange = (val) => {
      console.log(val)
    }

    const checked6 = ref(false)
    const checkBoxBeforeChange = (val) => {
      return checked5.value
    }

    return {
      msg: '这是默认的插槽',
      label: '这是使用 label 属性',
      checked,
      checked2,
      checked3,
      checked4,
      checked5,
      checkBoxChange,
      checked6,
      checkBoxBeforeChange,
    }
  }
})
</script>

<style>

</style>
```

:::

## CheckBoxGroup基本用法

:::demo CheckBoxGroup 示例

```vue

<template>
  <div>
    <div>
      <h4>基础示例</h4>
      <c-check-box-group v-model='checkedList'>
        <c-check-box label='beijing'>北京</c-check-box>
        <c-check-box label='shanghai'>上海</c-check-box>
        <c-check-box label='guangzhou'>广州</c-check-box>
      </c-check-box-group>
    </div>

    <div class="mt10">
      <h4>禁用</h4>
      <c-check-box-group v-model='checkedList' :disabled='true'>
        <c-check-box label='beijing'>北京</c-check-box>
        <c-check-box label='shanghai'>上海</c-check-box>
        <c-check-box label='guangzhou'>广州</c-check-box>
      </c-check-box-group>
    </div>

    <div class="mt10">
      <h4>横向排列</h4>
      <c-check-box-group v-model='checkedList' direction='row'>
        <c-check-box label='beijing'>北京</c-check-box>
        <c-check-box label='shanghai'>上海</c-check-box>
        <c-check-box label='guangzhou'>广州</c-check-box>
      </c-check-box-group>
    </div>

    <div class="mt10">
      <h4>checkBoxChange 和 color 颜色</h4>
      <c-check-box-group v-model='checkedList' color='RGB(255, 193, 7)' @change='checkBoxChange'>
        <c-check-box label='beijing'>北京</c-check-box>
        <c-check-box label='shanghai'>上海</c-check-box>
        <c-check-box label='guangzhou'>广州</c-check-box>
      </c-check-box-group>
    </div>

    <div class="mt10">
      <h4>beforeChange (选中上海可以切换) {{canChange ? '可以' : '不可以'}}切换</h4>
      <c-check-box-group v-model='checkedList' :beforeChange='checkBoxBeforeChange'>
        <c-check-box label='beijing'>北京</c-check-box>
        <c-check-box label='shanghai'>上海</c-check-box>
        <c-check-box label='guangzhou'>广州</c-check-box>
      </c-check-box-group>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref, computed} from 'vue'

export default defineComponent({
  setup() {
    const checkedList = ref(['shanghai'])

    const checkBoxChange = (val) => {
      console.log(val)
    }

    const canChange = computed(() => {
      return checkedList.value.includes('shanghai')
    })

    const checkBoxBeforeChange = (isChecked, value) => {
      return canChange.value
    }

    return {
      checkedList,
      checkBoxChange,
      canChange,
      checkBoxBeforeChange
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

## CheckBox参数

| 参数 | 类型                                    | 默认 | 说明 |
| ---- |---------------------------------------| ---- | ---- |
|  v-model | boolean                               | -- | 必选，选中项绑定值 |
| disabled | boolean                               | false | 可选，是否禁用 |
| label | [LabelType](#labeltype)               |  --    | 单独使用 check-box 且无默认插槽时当作info展示，存在插槽帮定制无效，结合 check-box-group使用时作为选中项的值。 | 
| color | string                                |  -- | 可选，复选框颜色 |
| beforeChange | [BeforeChangeType](#beforechangetype) | -- | 可选，checkbox 切换前的回调函数，返回 boolean 类型，返回 false 可以阻止 checkbox 切换 |

## CheckBox事件

| 事件 | 类型 | 说明 |
| ---- | ---- | ---- |
| change | Function |  复选框的值改变时发出的事件，值是当前状态 |

## CheckBox类型定义

### LabelType

```ts
export type LabelType = string | number | boolean;

```

### BeforeChangeType

```ts
export type BeforeChangeType = (
  isChecked: boolean,
  v: string
) => boolean | Promise<boolean>;
```

## CheckBox插槽

默认插槽

## CheckBoxGroup参数

| 参数 | 类型                                    | 默认       | 说明 |
| ---- |---------------------------------------|----------| ---- |
| v-model | Array                                 | []       | 必选，选中项绑定值 |
| disabled | boolean                               | false    | 可选，是否禁用 |
| color | string                                | --       | 可选，复选框颜色 |
| direction | [DirectionType](#directiontype)       | 'column' | 可选，设置横向或纵向排列 |
| beforeChange | [BeforeChangeType](#beforechangetype) | --       | 可选，checkbox 切换前的回调函数，返回 boolean 类型，返回 false 可以阻止 checkbox 切换 |

## CheckBoxGroup类型定义

### DirectionType

```ts
export type DirectionType = 'row' | 'column';
```

## CheckBoxGroup事件

| 事件 | 类型 | 说明 |
| ---- | ---- | ---- |
| change | Function |  复选框的值改变时发出的事件，值是当前状态 |

## CheckBoxGroup插槽

默认插槽


