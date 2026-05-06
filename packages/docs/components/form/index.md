# Form 表单

用于收集、校验和提交一组输入项。

## 基本用法

:::demo

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  name: '',
  city: '',
})

const cityOptions = [
  { label: 'Beijing', value: 'beijing' },
  { label: 'Shanghai', value: 'shanghai' },
]
</script>

<template>
  <c-form :model="model" label-width="88px">
    <c-form-item label="Name" prop="name" required>
      <c-input v-model="model.name" placeholder="Enter name" />
    </c-form-item>
    <c-form-item label="City" prop="city">
      <c-select v-model="model.city" :options="cityOptions" placeholder="Select city" />
    </c-form-item>
  </c-form>
</template>
```

:::

## 表单校验

:::demo

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const formRef = ref()
const model = reactive({
  email: '',
})
const rules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { pattern: /@/, message: 'Email is invalid', trigger: 'change' },
  ],
}

function submit() {
  formRef.value?.validate()
}
</script>

<template>
  <c-form ref="formRef" :model="model" :rules="rules" label-width="88px">
    <c-form-item label="Email" prop="email">
      <c-input v-model="model.email" placeholder="name@example.com" />
    </c-form-item>
    <c-form-item>
      <c-button type="primary" @click="submit">Submit</c-button>
    </c-form-item>
  </c-form>
</template>
```

:::

## 参数

### Form

| 参数                 | 类型               | 默认值 | 说明               |
| -------------------- | ------------------ | ------ | ------------------ |
| model                | object             | {}     | 表单数据对象       |
| rules                | FormRules          | {}     | 表单校验规则       |
| labelWidth           | string / number    | --     | 标签宽度           |
| labelPosition        | left / right / top | right  | 标签位置           |
| disabled             | boolean            | false  | 禁用态样式标记     |
| validateOnRuleChange | boolean            | true   | 规则变化时清理校验 |

### FormItem

| 参数           | 类型                         | 默认值 | 说明           |
| -------------- | ---------------------------- | ------ | -------------- |
| label          | string                       | --     | 标签文本       |
| prop           | string                       | --     | model 字段路径 |
| required       | boolean                      | false  | 是否必填       |
| rules          | FormRule / array             | --     | 字段校验规则   |
| help           | string                       | --     | 帮助文本       |
| validateStatus | success / error / validating | --     | 外部校验状态   |

## 方法

| 方法          | 说明             |
| ------------- | ---------------- |
| validate      | 校验全部字段     |
| validateField | 校验指定字段     |
| resetFields   | 重置字段值和状态 |
| clearValidate | 清理校验状态     |

## 事件

| 事件            | 说明               |
| --------------- | ------------------ |
| submit          | 表单提交后触发     |
| validate        | 字段校验完成后触发 |
| validate-failed | 表单校验失败后触发 |

## 当前限制

当前为基础可用版本，已覆盖字段注册、规则校验、字段级方法、重置和提交。尚未完整对齐 Ant Design Form 的动态列表、依赖联动、滚动到错误字段、复杂 name path、状态图标和所有录入组件的校验状态联动。
