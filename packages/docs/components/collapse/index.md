# Collapse 折叠面板

将复杂的内容折叠收起，按需展开。常用于"分组配置"、"问答列表"、"层级日志"。

## 基本使用

`v-model` 绑定数组，元素是当前展开的 `name`。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const value = ref(['1'])
</script>

<template>
  <c-collapse v-model="value">
    <c-collapse-item name="1" title="面板一">默认展开的内容。</c-collapse-item>
    <c-collapse-item name="2" title="面板二">点击标题展开。</c-collapse-item>
    <c-collapse-item name="3" title="面板三（禁用）" disabled> 面板被禁用，无法展开。 </c-collapse-item>
  </c-collapse>
</template>
```

:::

## 手风琴模式

`accordion` 让任意时刻最多只展开一项；此时 `v-model` 是单值。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const v = ref('a')
</script>

<template>
  <c-collapse v-model="v" accordion>
    <c-collapse-item name="a" title="A 面板">A 的详情内容</c-collapse-item>
    <c-collapse-item name="b" title="B 面板">B 的详情内容</c-collapse-item>
    <c-collapse-item name="c" title="C 面板">C 的详情内容</c-collapse-item>
  </c-collapse>
</template>
```

:::

## 无边框 / 幽灵风格

`bordered={false}` 去掉外圈描边；`ghost` 进一步去掉背景色，与页面融为一体。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const a = ref(['1'])
const b = ref(['1'])
</script>

<template>
  <p style="color: var(--ccui-color-text-secondary); margin-bottom: 4px">bordered=false</p>
  <c-collapse v-model="a" :bordered="false">
    <c-collapse-item name="1" title="无边框面板一">内容</c-collapse-item>
    <c-collapse-item name="2" title="无边框面板二">内容</c-collapse-item>
  </c-collapse>

  <p style="color: var(--ccui-color-text-secondary); margin-top: 16px; margin-bottom: 4px">ghost</p>
  <c-collapse v-model="b" ghost>
    <c-collapse-item name="1" title="幽灵面板一">内容</c-collapse-item>
    <c-collapse-item name="2" title="幽灵面板二">内容</c-collapse-item>
  </c-collapse>
</template>
```

:::

## 展开图标位置

`expand-icon-position` 把箭头放在 `start`（默认）或 `end`（标题右端）。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const v = ref(['1'])
</script>

<template>
  <c-collapse v-model="v" expand-icon-position="end">
    <c-collapse-item name="1" title="箭头放右边">内容靠右展开图标</c-collapse-item>
    <c-collapse-item name="2" title="另一面板">内容</c-collapse-item>
  </c-collapse>
</template>
```

:::

## 自定义标题

每个 item 都可用 `#title` slot 自定义标题，放图标 / 标签 / 副文案都可以。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const v = ref(['1'])
</script>

<template>
  <c-collapse v-model="v">
    <c-collapse-item name="1">
      <template #title>
        <span style="font-weight: 600">订单 #2025-001</span>
        <c-tag color="success" style="margin-inline-start: 8px">已发货</c-tag>
      </template>
      <p>订单详情内容…</p>
    </c-collapse-item>
    <c-collapse-item name="2" title="订单 #2025-002">
      <p>另一笔订单</p>
    </c-collapse-item>
  </c-collapse>
</template>
```

:::

## 监听变化

`change` 事件在展开 / 收起时触发，参数是当前激活的 name 数组（accordion 模式下是单值）。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const v = ref(['1'])
const log = ref('（无）')

function onChange(names) {
  log.value = JSON.stringify(names)
}
</script>

<template>
  <c-collapse v-model="v" @change="onChange">
    <c-collapse-item name="1" title="面板一">内容 1</c-collapse-item>
    <c-collapse-item name="2" title="面板二">内容 2</c-collapse-item>
    <c-collapse-item name="3" title="面板三">内容 3</c-collapse-item>
  </c-collapse>
  <p style="margin-top: 8px; color: var(--ccui-color-text-secondary)">最近一次激活：{{ log }}</p>
</template>
```

:::

## 单项 disabled 与隐藏箭头

可以对单个 item 设置 `disabled`（禁止展开 / 收起）或 `:show-arrow="false"`（隐藏箭头但仍可点击）。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const v = ref(['1'])
</script>

<template>
  <c-collapse v-model="v">
    <c-collapse-item name="1" title="正常面板">默认状态</c-collapse-item>
    <c-collapse-item name="2" title="禁用面板" disabled>无法展开</c-collapse-item>
    <c-collapse-item name="3" title="无箭头面板" :show-arrow="false">仍可点击展开 / 收起</c-collapse-item>
  </c-collapse>
</template>
```

:::

## 嵌套面板

Collapse 支持嵌套；外层 ghost / 内层带边框是常见组合，强调层级关系。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const outer = ref(['1'])
const inner = ref(['1-1'])
</script>

<template>
  <c-collapse v-model="outer" ghost>
    <c-collapse-item name="1" title="项目 Alpha">
      <c-collapse v-model="inner">
        <c-collapse-item name="1-1" title="开发任务">开发任务详情…</c-collapse-item>
        <c-collapse-item name="1-2" title="测试任务">测试任务详情…</c-collapse-item>
      </c-collapse>
    </c-collapse-item>
    <c-collapse-item name="2" title="项目 Beta">
      <p style="margin: 0">尚未拆分子任务</p>
    </c-collapse-item>
  </c-collapse>
</template>
```

:::

## FAQ 常见问答

最典型的业务场景：accordion 模式 + 自定义标题（带角标 / 副标题）+ 长描述。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const v = ref('1')

const faqs = [
  { name: '1', q: '如何重置密码？', a: '在登录页点击「忘记密码」，输入注册邮箱后按邮件指引重置。' },
  { name: '2', q: '账号被锁怎么办？', a: '连续 5 次错误密码会临时锁定 30 分钟，或联系客服立即解锁。' },
  { name: '3', q: '能否更换绑定手机？', a: '可以。进入「账号设置 → 安全中心」，验证旧手机后更换新号码。' },
]
</script>

<template>
  <c-collapse v-model="v" accordion>
    <c-collapse-item v-for="(faq, i) in faqs" :key="faq.name" :name="faq.name">
      <template #title>
        <span style="color: var(--ccui-color-primary); font-weight: 500; margin-inline-end: 6px">Q{{ i + 1 }}</span>
        <span>{{ faq.q }}</span>
      </template>
      <p style="margin: 0; color: var(--ccui-color-text-secondary); line-height: 1.6">{{ faq.a }}</p>
    </c-collapse-item>
  </c-collapse>
</template>
```

:::

## 外部按钮全展全收

`v-model` 受控时，外部按钮可以直接修改激活 name 列表，实现「全部展开 / 全部收起」操作。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const items = [
  { name: '1', title: '第 1 节' },
  { name: '2', title: '第 2 节' },
  { name: '3', title: '第 3 节' },
  { name: '4', title: '第 4 节' },
]

const v = ref(['1'])

function expandAll() {
  v.value = items.map((i) => i.name)
}
function collapseAll() {
  v.value = []
}
</script>

<template>
  <div style="display: flex; gap: 8px; margin-bottom: 12px">
    <c-button size="small" @click="expandAll">全部展开</c-button>
    <c-button size="small" @click="collapseAll">全部收起</c-button>
  </div>
  <c-collapse v-model="v">
    <c-collapse-item v-for="item in items" :key="item.name" :name="item.name" :title="item.title">
      {{ item.title }} 的详细内容
    </c-collapse-item>
  </c-collapse>
</template>
```

:::

## 表单分组

后台「字段太多怕一屏放不下」时常把表单按段落折叠：基础信息默认展开 + 进阶配置默认收起。

:::demo

```vue
<script setup>
import { reactive, ref } from 'vue'

const v = ref(['basic'])
const form = reactive({
  name: '',
  email: '',
  webhook: '',
  retryLimit: 3,
})
</script>

<template>
  <c-collapse v-model="v">
    <c-collapse-item name="basic" title="基础信息">
      <c-form :model="form" label-width="80px">
        <c-form-item label="名称" prop="name">
          <c-input v-model="form.name" placeholder="请输入" />
        </c-form-item>
        <c-form-item label="邮箱" prop="email">
          <c-input v-model="form.email" placeholder="example@x.com" />
        </c-form-item>
      </c-form>
    </c-collapse-item>
    <c-collapse-item name="advanced" title="高级配置（默认收起）">
      <c-form :model="form" label-width="80px">
        <c-form-item label="Webhook" prop="webhook">
          <c-input v-model="form.webhook" placeholder="https://..." />
        </c-form-item>
        <c-form-item label="重试次数" prop="retryLimit">
          <c-input-number v-model="form.retryLimit" :min="0" :max="10" />
        </c-form-item>
      </c-form>
    </c-collapse-item>
  </c-collapse>
</template>
```

:::

## API

### Collapse Props

| 参数               | 类型                                     | 默认值    | 说明                                |
| ------------------ | ---------------------------------------- | --------- | ----------------------------------- |
| modelValue         | `string \| number \| (string\|number)[]` | `[]`      | 展开的 name；accordion 模式下是单值 |
| accordion          | boolean                                  | `false`   | 手风琴模式（同时只展开一项）        |
| bordered           | boolean                                  | `true`    | 是否带外框                          |
| ghost              | boolean                                  | `false`   | 透明背景（无填充）                  |
| expandIconPosition | `'start' \| 'end'`                       | `'start'` | 展开图标位置                        |

### Collapse Events

| 事件名            | 回调签名                               | 触发时机           |
| ----------------- | -------------------------------------- | ------------------ |
| update:modelValue | `(names: string \| number \| (...)[])` | 激活项变化         |
| change            | 同上                                   | 同上（语义化别名） |

### CollapseItem Props

| 参数      | 类型               | 默认值  | 说明                         |
| --------- | ------------------ | ------- | ---------------------------- |
| name      | `string \| number` | —       | 必填，唯一标识               |
| title     | string             | `''`    | 标题（也可用 `#title` slot） |
| disabled  | boolean            | `false` | 禁用展开                     |
| showArrow | boolean            | `true`  | 是否显示展开箭头             |

### CollapseItem Slots

| 名称    | 说明       |
| ------- | ---------- |
| default | 面板内容   |
| title   | 自定义标题 |
