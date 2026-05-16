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

## 函数式 rules

`rules` 接受工厂函数 `(model) => Rule | Rule[]`（对标 Ant Design v5+），每次校验时执行，可基于当前 form model 派生动态规则。常见场景：confirm 字段对比 password、互斥字段（A 填了 B 必填）、长度跟随类型变化。

:::demo

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const formRef = ref()
const model = reactive({
  password: '',
  confirm: '',
  phone: '',
  email: '',
})

const confirmRules = (m) => [
  { required: true, message: '请再次输入密码', trigger: 'blur' },
  {
    validator: (_r, v) => v === m.password || '两次密码不一致',
    trigger: 'change',
  },
]

const phoneRules = (m) => [
  {
    required: !m.email,
    message: '邮箱为空时手机必填',
    trigger: 'blur',
  },
]

async function submit() {
  try {
    await formRef.value.validate()
    alert('校验通过')
  } catch {}
}
</script>

<template>
  <c-form ref="formRef" :model="model" label-width="100px">
    <c-form-item label="密码" prop="password" required>
      <c-input v-model="model.password" type="password" />
    </c-form-item>
    <c-form-item label="确认密码" prop="confirm" :rules="confirmRules" :dependencies="['password']">
      <c-input v-model="model.confirm" type="password" />
    </c-form-item>
    <c-form-item label="邮箱" prop="email">
      <c-input v-model="model.email" placeholder="可选" />
    </c-form-item>
    <c-form-item label="手机" prop="phone" :rules="phoneRules" :dependencies="['email']">
      <c-input v-model="model.phone" placeholder="邮箱为空时必填" />
    </c-form-item>
    <c-form-item>
      <c-button type="primary" @click="submit">提交</c-button>
    </c-form-item>
  </c-form>
</template>
```

:::

## warningOnly 警告级规则

规则上加 `warningOnly: true`，校验失败时 FormItem 状态降级为 `warning`，**不阻塞** form-level submit。适合「弱密码提醒」「价格异常但允许通过」等需要提示却不强制拦截的场景。

:::demo

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const formRef = ref()
const log = ref('')
const model = reactive({
  password: '',
  price: 100,
})

const rules = {
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      validator: (_r, v) => v.length >= 8 || '建议至少 8 个字符（弱密码）',
      warningOnly: true,
      trigger: 'change',
    },
  ],
  price: [
    {
      validator: (_r, v) => Number(v) <= 1000 || `当前 ${v} 已超 1000，请确认是否合理`,
      warningOnly: true,
      trigger: 'change',
    },
  ],
}

async function submit() {
  const valid = await formRef.value.validate()
  log.value = valid ? '提交成功（warningOnly 不阻塞）' : '校验失败被阻塞'
}
</script>

<template>
  <c-form ref="formRef" :model="model" :rules="rules" label-width="80px">
    <c-form-item label="密码" prop="password">
      <c-input v-model="model.password" type="password" placeholder="试输入短于 8 字符" />
    </c-form-item>
    <c-form-item label="价格" prop="price">
      <c-input-number v-model="model.price" />
    </c-form-item>
    <c-form-item>
      <c-button type="primary" @click="submit">提交</c-button>
    </c-form-item>
    <p style="color:#666;margin:0">{{ log || '弱密码 / 价格 > 1000 会显示 warning 但不阻塞提交' }}</p>
  </c-form>
</template>
```

:::

## hasFeedback 校验状态图标

`hasFeedback=true` 在控件右侧显示对应状态图标（`✓` success / `✕` error / `!` warning / `◌` validating）；可在 Form 级开关后所有 FormItem 默认显示，单 FormItem 可显式覆盖。

:::demo

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({
  name: '',
  email: '',
  age: '',
  status: '',
})

const rules = {
  name: { required: true, message: '请输入姓名', trigger: 'blur' },
  email: { required: true, type: 'email', message: '邮箱格式不正确', trigger: 'change' },
}
</script>

<template>
  <c-form :model="model" :rules="rules" label-width="100px" has-feedback>
    <c-form-item label="姓名" prop="name">
      <c-input v-model="model.name" placeholder="必填，校验后显示 ✓ / ✕" />
    </c-form-item>
    <c-form-item label="邮箱" prop="email">
      <c-input v-model="model.email" placeholder="格式校验，change 触发" />
    </c-form-item>
    <c-form-item label="年龄（不显示）" prop="age" :has-feedback="false">
      <c-input v-model="model.age" placeholder="单字段关掉 feedback" />
    </c-form-item>
    <c-form-item label="状态（强制 warning）" prop="status" validate-status="warning" help="单独指定 warning 演示图标">
      <c-input v-model="model.status" />
    </c-form-item>
  </c-form>
</template>
```

:::

## 必填 / 可选标记

`requiredMark` 控制必填提示策略：`true`（默认，必填字段左侧加 `*`）/ `false`（不显示任何标记）/ `'optional'`（非必填字段右侧加 `(optional)`，移动端常用）。

:::demo

```vue
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const mark = ref('true')
const value = computed(() => (mark.value === 'true' ? true : mark.value === 'false' ? false : mark.value))
const model = reactive({ name: '', desc: '' })
</script>

<template>
  <div style="margin-bottom:12px">
    <c-segmented v-model="mark" :options="['true', 'false', 'optional']" />
  </div>
  <c-form :model="model" :required-mark="value" label-width="80px">
    <c-form-item label="姓名" prop="name" required>
      <c-input v-model="model.name" />
    </c-form-item>
    <c-form-item label="简介" prop="desc">
      <c-input v-model="model.desc" placeholder="非必填字段" />
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

## 不同布局

`layout` 切换 `horizontal`（默认）/ `vertical`（标签在上，输入在下，常用于移动端）/ `inline`（行内紧凑布局，filter / search 场景）。

:::demo

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const m1 = reactive({ name: '' })
const m2 = reactive({ name: '', email: '' })
const m3 = reactive({ keyword: '', status: '' })
</script>

<template>
  <p style="margin: 0 0 6px; color: #666">layout="horizontal"（默认）</p>
  <c-form :model="m1" label-width="80px">
    <c-form-item label="姓名" prop="name"><c-input v-model="m1.name" /></c-form-item>
  </c-form>

  <p style="margin: 16px 0 6px; color: #666">layout="vertical"</p>
  <c-form :model="m2" layout="vertical">
    <c-form-item label="姓名" prop="name"><c-input v-model="m2.name" /></c-form-item>
    <c-form-item label="邮箱" prop="email"><c-input v-model="m2.email" /></c-form-item>
  </c-form>

  <p style="margin: 16px 0 6px; color: #666">layout="inline"</p>
  <c-form :model="m3" layout="inline">
    <c-form-item label="关键词" prop="keyword"><c-input v-model="m3.keyword" /></c-form-item>
    <c-form-item label="状态" prop="status">
      <c-select
        v-model="m3.status"
        :options="[
          { label: '在售', value: 'on' },
          { label: '下架', value: 'off' },
        ]"
        style="width: 120px"
      />
    </c-form-item>
    <c-form-item><c-button type="primary">查询</c-button></c-form-item>
  </c-form>
</template>
```

:::

## 栅格 labelCol / wrapperCol

`labelCol` / `wrapperCol` 接收 24 栅格对象 `{ span?, offset?, flex? }`，按 `(span/24)*100%` 换算为宽度，比 `labelWidth` 的单一像素方案更适合响应式表单。Form 级配置作为默认；FormItem 显式同名 prop 优先覆盖。

:::demo

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({ name: '', email: '', desc: '' })
</script>

<template>
  <c-form :model="model" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
    <c-form-item label="姓名" prop="name">
      <c-input v-model="model.name" />
    </c-form-item>
    <c-form-item label="邮箱" prop="email">
      <c-input v-model="model.email" />
    </c-form-item>
    <c-form-item label="个人简介" prop="desc" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <c-input v-model="model.desc" placeholder="本行覆盖 form 级：label 4 / wrapper 20" />
    </c-form-item>
    <c-form-item :wrapper-col="{ offset: 6, span: 16 }">
      <c-button type="primary">保存</c-button>
    </c-form-item>
  </c-form>
</template>
```

:::

## 全表 disabled / 提交中态切换

`disabled` 在 Form 级开启会给整个 form 加上 disabled 样式标记，配合「保存中锁表」「待审核只读」业务非常常见。

:::demo

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const formRef = ref()
const submitting = ref(false)
const log = ref('')
const model = reactive({ name: '', email: '' })
const rules = {
  name: { required: true, message: '请输入姓名', trigger: 'blur' },
  email: { required: true, type: 'email', message: '邮箱格式不正确', trigger: 'change' },
}

async function submit() {
  const valid = await formRef.value.validate()
  if (!valid) return
  submitting.value = true
  log.value = '提交中...'
  setTimeout(() => {
    submitting.value = false
    log.value = '提交完成'
  }, 1500)
}
</script>

<template>
  <c-form ref="formRef" :model="model" :rules="rules" label-width="80px" :disabled="submitting">
    <c-form-item label="姓名" prop="name"><c-input v-model="model.name" /></c-form-item>
    <c-form-item label="邮箱" prop="email"><c-input v-model="model.email" /></c-form-item>
    <c-form-item>
      <c-button type="primary" :loading="submitting" @click="submit">{{ submitting ? '提交中' : '提交' }}</c-button>
    </c-form-item>
  </c-form>
  <p style="color:#666">{{ log || '提交后整个表单进入 disabled 状态，1.5s 后恢复' }}</p>
</template>
```

:::

## 实例方法

通过 `ref` 拿到 `FormInstance`，可调用 `validate` / `resetFields` / `clearValidate` / `scrollToField` 等方法。

:::demo

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const formRef = ref()
const model = reactive({ name: '', email: '' })
const rules = {
  name: { required: true, message: '请输入姓名', trigger: 'blur' },
  email: { required: true, type: 'email', message: '邮箱格式不正确', trigger: 'change' },
}
const log = ref('（未操作）')

async function validate() {
  try {
    await formRef.value.validate()
    log.value = '校验通过'
  } catch {
    log.value = '校验未通过'
  }
}
function reset() {
  formRef.value.resetFields()
  log.value = '已重置'
}
function clear() {
  formRef.value.clearValidate()
  log.value = '已清空校验状态'
}
</script>

<template>
  <c-form ref="formRef" :model="model" :rules="rules" label-width="80px">
    <c-form-item label="姓名" prop="name"><c-input v-model="model.name" /></c-form-item>
    <c-form-item label="邮箱" prop="email"><c-input v-model="model.email" /></c-form-item>
    <c-form-item>
      <c-button type="primary" @click="validate">校验</c-button>
      <c-button style="margin-inline-start: 8px" @click="reset">重置</c-button>
      <c-button style="margin-inline-start: 8px" @click="clear">清空校验</c-button>
    </c-form-item>
  </c-form>
  <p style="color: #666">{{ log }}</p>
</template>
```

:::

## 跨表单联动 Form.Provider

`<c-form-provider>` 包裹多个具名 `<c-form>`，在子表单提交成功后通过 `form-finish` 聚合 `forms` 注册表，常用于"同一页面里 A 表单提交后用 B 表单的当前值做联动"的场景。

`form-change` 在任意字段值变化时触发，回调签名同 `form-finish`。

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

| 参数                 | 类型                                                          | 默认值     | 说明                                                                   |
| -------------------- | ------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------- |
| model                | object                                                        | {}         | 表单数据对象                                                           |
| rules                | FormRules                                                     | {}         | 表单校验规则                                                           |
| initialValues        | object                                                        | {}         | 表单初始值                                                             |
| labelWidth           | string / number                                               | --         | 标签宽度（简单场景）；`labelCol` 优先级更高                            |
| labelCol             | `{ span?: number; offset?: number; flex?: string \| number }` | --         | 24 栅格布局的 label 列配置（Ant 风），按 `(span/24)*100%` 换算为 width |
| wrapperCol           | 同 labelCol                                                   | --         | 表单控件区列配置                                                       |
| labelPosition        | left / right / top                                            | right      | 标签位置                                                               |
| layout               | horizontal / vertical / inline                                | horizontal | 表单布局                                                               |
| disabled             | boolean                                                       | false      | 禁用态样式标记                                                         |
| colon                | boolean                                                       | true       | 是否显示标签冒号                                                       |
| requiredMark         | boolean / 'optional'                                          | true       | 必填/可选标记显示策略                                                  |
| hasFeedback          | boolean                                                       | false      | 校验状态图标（FormItem 显式优先；图标随 currentStatus 切）             |
| validateMessages     | FormValidateMessages                                          | {}         | 校验消息模板                                                           |
| validateOnRuleChange | boolean                                                       | true       | 规则变化时清理校验状态                                                 |
| scrollToFirstError   | boolean / ScrollIntoViewOptions                               | false      | 校验失败时滚动到首个错误字段                                           |
| name                 | string                                                        | --         | 表单名（接入 FormProvider）                                            |
| preserve             | boolean                                                       | true       | 字段卸载时是否保留 model 值                                            |

### FormItem

| 参数             | 类型                                                            | 默认值    | 说明                                                                             |
| ---------------- | --------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------- |
| name             | string / number / array                                         | --        | 字段路径，支持数组路径                                                           |
| prop             | string / number / array                                         | --        | 字段路径，兼容旧 API                                                             |
| label            | string                                                          | --        | 标签文本                                                                         |
| labelCol         | 同 Form 同名 prop                                               | --        | 当前项 label 列配置（显式优先于 Form 级）                                        |
| wrapperCol       | 同 Form 同名 prop                                               | --        | 当前项控件列配置                                                                 |
| initialValue     | any                                                             | --        | 字段初始值                                                                       |
| required         | boolean                                                         | false     | 是否必填                                                                         |
| rules            | `FormRule \| FormRule[] \| ((model) => FormRule \| FormRule[])` | --        | 字段校验规则（支持函数式动态生成）                                               |
| help             | string                                                          | --        | 帮助或外部错误文案                                                               |
| extra            | string                                                          | --        | 额外提示文案                                                                     |
| validateStatus   | success / error / warning / validating                          | --        | 外部校验状态（含 warning，配合 `warningOnly` rule）                              |
| hasFeedback      | boolean                                                         | 跟随 Form | 校验状态图标（图标 ✓ / ✕ / ! / ◌ 随 currentStatus 切，input padding-right 让位） |
| dependencies     | FormNamePath[]                                                  | []        | 依赖字段变化后重新校验当前项                                                     |
| validateDebounce | number                                                          | --        | 触发校验的 debounce ms                                                           |
| normalize        | `(value, prevValue, allValues) => any`                          | --        | 在校验/提交前 normalize 值                                                       |
| htmlFor          | string                                                          | --        | label 的 for 属性                                                                |
| colon            | boolean                                                         | 跟随 Form | 是否显示当前项冒号                                                               |
| hidden           | boolean                                                         | false     | 隐藏字段但保留注册                                                               |
| noStyle          | boolean                                                         | false     | 不显示标准表单项样式                                                             |
| preserve         | boolean                                                         | 跟随 Form | 字段卸载是否保留值，覆盖表单级配置                                               |

> **不做的 Ant API（Vue 已覆盖）**：`valuePropName` / `getValueFromEvent` / `getValueProps` —— Vue 的 `v-model` 已统一协议；`shouldUpdate` —— React 渲染优化原语，Vue 响应式自动处理。
>
> `FormRule.warningOnly: boolean`：失败时降级为 `warning`，不阻塞 form-level submit。

### FormRule

| 字段        | 类型                                                                   | 说明                                                      |
| ----------- | ---------------------------------------------------------------------- | --------------------------------------------------------- |
| required    | boolean                                                                | 是否必填                                                  |
| message     | string                                                                 | 校验失败提示文案（不传时走 validateMessages 模板）        |
| trigger     | 'change' / 'blur' / 'submit' 或其数组                                  | 触发时机                                                  |
| type        | 'string' / 'number' / 'boolean' / 'array' / 'object' / 'email' / 'url' | 类型校验                                                  |
| min / max   | number                                                                 | 长度（string / array）或数值上下限                        |
| len         | number                                                                 | 精确长度                                                  |
| pattern     | RegExp                                                                 | 正则校验                                                  |
| enum        | any[]                                                                  | 枚举校验                                                  |
| whitespace  | boolean                                                                | 是否拒绝纯空白字符串                                      |
| warningOnly | boolean                                                                | 失败时降级为 warning 状态，不阻塞 form-level submit       |
| validator   | `(rule, value, model) => boolean \| string \| Error \| Promise<...>`   | 自定义同步 / 异步校验函数（返回 false / string 视为失败） |

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
- `warningOnly` 规则降级、`hasFeedback` 状态图标、`labelCol` / `wrapperCol` 24 栅格。
- 函数式 `rules: (model) => Rule | Rule[]`。
- 基础 ARIA 错误状态和错误消息 `role="alert"`。

## 缺失功能

- `shouldUpdate`、render props 级别的复杂条件渲染。
- `validateDebounce`、`normalize`、`getValueProps` 等少量高级字段配置。
- 完整无障碍实现和与所有录入组件的深度状态联动。
- 更完整的滚动容器定位、复杂错误聚合展示和国际化包级别默认文案。
