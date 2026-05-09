# Form 表单

用于收集、校验和提交一组输入项。当前版本目标覆盖 Ant Design Form 约 95% 的高频能力，仅保留 `shouldUpdate` / `validateDebounce` / `normalize` 等少量边角能力后续迭代。

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

## 动态字段 Form.List

通过 `<c-form-list>` 管理一组同构字段。默认作用域插槽提供 `(fields, { add, remove, move })`，每个 `field` 包含 `key`（稳定 key，移动后保持）和 `name`（当前下标，参与 name path 拼接）。

:::demo

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive<{ users: Array<{ name: string; email: string }> }>({
  users: [{ name: 'Alice', email: 'alice@example.com' }],
})
</script>

<template>
  <c-form :model="model" layout="vertical">
    <c-form-list name="users">
      <template #default="{ fields, add, remove, move }">
        <div v-for="field in fields" :key="field.key" style="display: flex; gap: 8px;">
          <c-form-item :name="[field.name, 'name']" :rules="{ required: true, message: 'Name required' }">
            <c-input v-model="model.users[field.name].name" placeholder="name" />
          </c-form-item>
          <c-form-item :name="[field.name, 'email']" :rules="{ type: 'email' }">
            <c-input v-model="model.users[field.name].email" placeholder="email" />
          </c-form-item>
          <c-button @click="move(field.name, Math.max(0, field.name - 1))">↑</c-button>
          <c-button @click="remove(field.name)">remove</c-button>
        </div>
        <c-button @click="add({ name: '', email: '' })">add user</c-button>
      </template>
    </c-form-list>
  </c-form>
</template>
```

:::

## 跨表单联动 Form.Provider

`<c-form-provider>` 包裹多个具名 `<c-form>`，在子表单提交成功后通过 `form-finish` 事件聚合 `forms` 注册表，常用于「同一页面里 A 表单提交后用 B 表单的当前值做联动」的场景。

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const profile = reactive({ name: '' })
const billing = reactive({ address: '' })

function onFinish(name: string, info: { values: any; forms: Record<string, any> }) {
  if (name === 'profile') {
    billing.address = info.forms.billing.getFieldsValue().address
  }
}
</script>

<template>
  <c-form-provider @form-finish="onFinish">
    <c-form name="profile" :model="profile">
      <c-form-item prop="name"><c-input v-model="profile.name" /></c-form-item>
      <c-button html-type="submit">Save</c-button>
    </c-form>
    <c-form name="billing" :model="billing">
      <c-form-item prop="address"><c-input v-model="billing.address" /></c-form-item>
    </c-form>
  </c-form-provider>
</template>
```

`form-change` 在任意字段值变化时触发，回调签名同 `form-finish`。

## 字段保留策略 preserve

Form 默认在字段卸载时保留 `model` 中的值（`preserve=true`）。把 `preserve=false` 配置在表单上则全表单字段卸载即清理，单个 `c-form-item` 上的 `preserve` 优先于表单级配置：

```vue
<c-form :model="model" :preserve="false">
  <c-form-item v-if="advanced" prop="apiKey" :preserve="true">
    <c-input v-model="model.apiKey" />
  </c-form-item>
</c-form>
```

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
| name                 | string                          | --         | 表单名（接入 FormProvider）  |
| preserve             | boolean                         | true       | 字段卸载时是否保留 model 值  |

### FormItem

| 参数           | 类型                         | 默认值    | 说明                               |
| -------------- | ---------------------------- | --------- | ---------------------------------- |
| name           | string / number / array      | --        | 字段路径，支持数组路径             |
| prop           | string / number / array      | --        | 字段路径，兼容旧 API               |
| label          | string                       | --        | 标签文本                           |
| initialValue   | any                          | --        | 字段初始值                         |
| required       | boolean                      | false     | 是否必填                           |
| rules          | FormRule / array             | --        | 字段校验规则                       |
| help           | string                       | --        | 帮助或外部错误文案                 |
| extra          | string                       | --        | 额外提示文案                       |
| validateStatus | success / error / validating | --        | 外部校验状态                       |
| dependencies   | FormNamePath[]               | []        | 依赖字段变化后重新校验当前项       |
| htmlFor        | string                       | --        | label 的 for 属性                  |
| colon          | boolean                      | 跟随 Form | 是否显示当前项冒号                 |
| hidden         | boolean                      | false     | 隐藏字段但保留注册                 |
| noStyle        | boolean                      | false     | 不显示标准表单项样式               |
| preserve       | boolean                      | 跟随 Form | 字段卸载是否保留值，覆盖表单级配置 |

### FormList

| 参数         | 类型                    | 默认值 | 说明                             |
| ------------ | ----------------------- | ------ | -------------------------------- |
| name         | string / number / array | --     | 列表字段路径                     |
| initialValue | any[]                   | --     | 列表初始值（model 中无值时使用） |

默认作用域插槽签名：`(fields: { key, name }[], { add, remove, move })`。`add(value?, insertIndex?)` / `remove(index | indices)` / `move(from, to)` 直接修改 `model[name]` 数组并维持稳定 key。

### FormProvider

无 props。事件：

| 事件        | 回调签名                         | 说明                       |
| ----------- | -------------------------------- | -------------------------- |
| form-change | (name, { changedFields, forms }) | 任意字段变化触发           |
| form-finish | (name, { values, forms })        | 子表单 submit 校验通过触发 |

`forms` 是 `Record<string, FormInstance>`，`FormInstance` 暴露 `validate / validateField / resetFields / clearValidate / scrollToField / getFieldsValue`。

## 方法

| 方法          | 说明             |
| ------------- | ---------------- |
| validate      | 校验全部字段     |
| validateField | 校验指定字段     |
| resetFields   | 重置字段值和状态 |
| clearValidate | 清理校验状态     |
| scrollToField | 滚动到指定字段   |

## 事件

| 事件            | 说明                                              |
| --------------- | ------------------------------------------------- |
| submit          | 表单提交后触发                                    |
| validate        | 字段校验完成后触发                                |
| validate-failed | 表单校验失败后触发                                |
| values-change   | 字段触发原生 change 时携带 `{ name, value }` 抛出 |

## 已完成功能

- 表单数据、规则、初始值、校验消息模板和禁用态上下文。
- 字段注册/卸载、全量校验、字段校验、重置、清理校验和滚动到字段。
- submit 自动校验、校验成功/失败事件、字段级 validate 事件。
- `prop` 和 `name` 字段路径，支持字符串、数字、数组路径和 `a[0].b` 写法。
- required、type、email、url、enum、whitespace、min、max、len、pattern、自定义同步/异步 validator。
- blur/change/submit 触发器过滤。
- horizontal/vertical/inline 布局、label 宽度/位置、冒号、必填/可选标记。
- FormItem 的 help、extra、validateStatus、htmlFor、hidden、noStyle、dependencies。
- `Form.List` 动态字段增删/移动、稳定 key、initialValue、与父级 name path 自动拼接。
- `Form.Provider` 跨表单注册表与 `form-change` / `form-finish` 聚合。
- form-level 与 item-level 双层 `preserve` 控制字段卸载值。
- 基础 ARIA 错误状态和错误消息 `role="alert"`。

## 缺失功能

- `shouldUpdate`、render props 级别的复杂条件渲染。
- `validateDebounce`、`normalize`、`getValueProps` 等少量高级字段配置。
- 完整无障碍实现和与所有录入组件的深度状态联动。
- 更完整的滚动容器定位、复杂错误聚合展示和国际化包级别默认文案。
