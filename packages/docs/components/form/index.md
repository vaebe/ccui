# Form 表单

用于收集、校验和提交一组输入项。当前版本目标覆盖 Ant Design Form 约 80% 的高频能力，保留少量大型高级能力后续迭代。

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
    <c-form-item label="City" prop="city" extra="Choose the city used for delivery.">
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
    { type: 'email', message: 'Email is invalid', trigger: 'change' },
  ],
}

function submit() {
  formRef.value?.validate()
}
</script>

<template>
  <c-form ref="formRef" :model="model" :rules="rules" label-width="88px" scroll-to-first-error>
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

## 初始值和依赖校验

:::demo

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  user: { email: '' },
  password: '',
  confirm: '',
})

const initialValues = {
  user: { email: 'user@example.com' },
}

const confirmRule = {
  validator: (_rule, value) => value === model.password || 'Passwords differ',
}
</script>

<template>
  <c-form :model="model" :initial-values="initialValues" layout="vertical" required-mark="optional">
    <c-form-item label="Email" :name="['user', 'email']" :rules="{ type: 'email' }">
      <c-input v-model="model.user.email" />
    </c-form-item>
    <c-form-item label="Password" prop="password" required>
      <c-input v-model="model.password" type="password" />
    </c-form-item>
    <c-form-item label="Confirm" prop="confirm" :dependencies="['password']" :rules="confirmRule">
      <c-input v-model="model.confirm" type="password" />
    </c-form-item>
  </c-form>
</template>
```

:::

## 参数

### Form

| 参数                 | 类型                            | 默认值     | 说明                         |
| -------------------- | ------------------------------- | ---------- | ---------------------------- |
| model                | object                          | {}         | 表单数据对象                 |
| rules                | FormRules                       | {}         | 表单校验规则                 |
| initialValues        | object                          | {}         | 表单初始值                   |
| labelWidth           | string / number                 | --         | 标签宽度                     |
| labelPosition        | left / right / top              | right      | 标签位置                     |
| layout               | horizontal / vertical / inline  | horizontal | 表单布局                     |
| disabled             | boolean                         | false      | 禁用态样式标记               |
| colon                | boolean                         | true       | 是否显示标签冒号             |
| requiredMark         | boolean / optional              | true       | 必填/可选标记显示策略        |
| validateMessages     | FormValidateMessages            | {}         | 校验消息模板                 |
| validateOnRuleChange | boolean                         | true       | 规则变化时清理校验状态       |
| scrollToFirstError   | boolean / ScrollIntoViewOptions | false      | 校验失败时滚动到首个错误字段 |

### FormItem

| 参数           | 类型                         | 默认值    | 说明                         |
| -------------- | ---------------------------- | --------- | ---------------------------- |
| name           | string / number / array      | --        | 字段路径，支持数组路径       |
| prop           | string / number / array      | --        | 字段路径，兼容旧 API         |
| label          | string                       | --        | 标签文本                     |
| initialValue   | any                          | --        | 字段初始值                   |
| required       | boolean                      | false     | 是否必填                     |
| rules          | FormRule / array             | --        | 字段校验规则                 |
| help           | string                       | --        | 帮助或外部错误文案           |
| extra          | string                       | --        | 额外提示文案                 |
| validateStatus | success / error / validating | --        | 外部校验状态                 |
| dependencies   | FormNamePath[]               | []        | 依赖字段变化后重新校验当前项 |
| htmlFor        | string                       | --        | label 的 for 属性            |
| colon          | boolean                      | 跟随 Form | 是否显示当前项冒号           |
| hidden         | boolean                      | false     | 隐藏字段但保留注册           |
| noStyle        | boolean                      | false     | 不显示标准表单项样式         |

## 方法

| 方法          | 说明             |
| ------------- | ---------------- |
| validate      | 校验全部字段     |
| validateField | 校验指定字段     |
| resetFields   | 重置字段值和状态 |
| clearValidate | 清理校验状态     |
| scrollToField | 滚动到指定字段   |

## 事件

| 事件            | 说明               |
| --------------- | ------------------ |
| submit          | 表单提交后触发     |
| validate        | 字段校验完成后触发 |
| validate-failed | 表单校验失败后触发 |

## 已完成功能

- 表单数据、规则、初始值、校验消息模板和禁用态上下文。
- 字段注册/卸载、全量校验、字段校验、重置、清理校验和滚动到字段。
- submit 自动校验、校验成功/失败事件、字段级 validate 事件。
- `prop` 和 `name` 字段路径，支持字符串、数字、数组路径和 `a[0].b` 写法。
- required、type、email、url、enum、whitespace、min、max、len、pattern、自定义同步/异步 validator。
- blur/change/submit 触发器过滤。
- horizontal/vertical/inline 布局、label 宽度/位置、冒号、必填/可选标记。
- FormItem 的 help、extra、validateStatus、htmlFor、hidden、noStyle、dependencies。
- 基础 ARIA 错误状态和错误消息 `role="alert"`。

## 缺失功能

- `Form.List` 动态列表的完整字段增删、移动和错误聚合。
- `shouldUpdate`、render props 级别的复杂条件渲染。
- `preserve`、`validateDebounce`、`normalize`、`getValueProps` 等高级字段配置。
- `Form.Provider` 跨表单联动。
- 完整无障碍实现和与所有录入组件的深度状态联动。
- 更完整的滚动容器定位、复杂错误聚合展示和国际化包级别默认文案。
