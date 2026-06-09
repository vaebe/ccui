# Steps 步骤条

引导用户按顺序完成任务，把多步流程拆解成可见的进度。

## 基本使用

`current` 标识当前进行到第几步（从 0 开始），`items` 描述每步标题与子说明。

:::demo

```vue
<template>
  <c-steps
    :current="1"
    :items="[
      { title: '已完成', description: '提交订单' },
      { title: '进行中', description: '商家确认' },
      { title: '待处理', description: '物流派送' },
      { title: '待处理', description: '完成' },
    ]"
  />
</template>
```

:::

## 全局状态

`status` 控制当前步骤的状态语义：`process`（默认）/ `finish` / `wait` / `error`。

:::demo

```vue
<template>
  <p style="color: var(--ccui-color-text-secondary); margin: 0 0 6px">status="error"（当前步骤报错）</p>
  <c-steps
    :current="1"
    status="error"
    :items="[{ title: '已完成' }, { title: '出错了', description: '无法继续' }, { title: '待处理' }]"
  />
</template>
```

:::

## 单项状态

`StepItem.status` 可对单个步骤覆盖全局状态（用于"跳跃错误"等场景）。

:::demo

```vue
<template>
  <c-steps
    :current="2"
    :items="[
      { title: '步骤 1', status: 'finish' },
      { title: '步骤 2', status: 'error', description: '校验失败' },
      { title: '步骤 3', status: 'process' },
      { title: '步骤 4', status: 'wait' },
    ]"
  />
</template>
```

:::

## 垂直布局

`direction="vertical"` 把步骤竖排，适合配置向导或长流程。

:::demo

```vue
<template>
  <c-steps
    direction="vertical"
    :current="1"
    :items="[
      { title: '注册账号', description: '填写公司信息并提交' },
      { title: '上传资质', description: '营业执照、税务登记' },
      { title: '审核中', description: '一般 1-3 个工作日' },
      { title: '上线运营' },
    ]"
  />
</template>
```

:::

## 小尺寸

`size="small"` 让圆点 / 文字更紧凑，适合放在 toolbar 中。

:::demo

```vue
<template>
  <c-steps size="small" :current="1" :items="[{ title: '准备' }, { title: '执行' }, { title: '完成' }]" />
</template>
```

:::

## 点状步骤条

`progress-dot` 用圆点替代序号，常用于"轻量进度"展示。

:::demo

```vue
<template>
  <c-steps
    progress-dot
    :current="1"
    :items="[
      { title: '下单', description: '已创建订单' },
      { title: '支付', description: '等待付款' },
      { title: '发货', description: '商品出库' },
      { title: '签收' },
    ]"
  />
</template>
```

:::

## 受控切换

通过 `update:current` 事件接收用户的点击，配合按钮控制流程进度。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const cur = ref(0)
const items = [{ title: '第一步' }, { title: '第二步' }, { title: '第三步' }, { title: '第四步' }]
</script>

<template>
  <c-steps :current="cur" :items="items" @update:current="(i) => (cur = i)" />
  <div style="margin-top: 12px">
    <c-button :disabled="cur === 0" @click="cur -= 1">上一步</c-button>
    <c-button type="primary" style="margin-inline-start: 8px" :disabled="cur === items.length - 1" @click="cur += 1">
      下一步
    </c-button>
  </div>
</template>
```

:::

## API

### Props

| 参数           | 类型                         | 默认值         | 说明                                          |
| -------------- | ---------------------------- | -------------- | --------------------------------------------- |
| current        | number                       | `0`            | 当前步骤（从 0 开始），支持 `v-model:current` |
| items          | `StepItem[]`                 | `[]`           | 步骤数据                                      |
| direction      | `'horizontal' \| 'vertical'` | `'horizontal'` | 排列方向                                      |
| size           | `'default' \| 'small'`       | `'default'`    | 尺寸                                          |
| type           | `'default' \| 'navigation'`  | `'default'`    | 风格：默认 / 导航                             |
| status         | `StepStatus`                 | `'process'`    | 当前步骤的全局状态                            |
| labelPlacement | `'horizontal' \| 'vertical'` | `'horizontal'` | 描述与标题排布                                |
| progressDot    | boolean                      | `false`        | 点状步骤条                                    |

### StepItem

| 字段        | 类型         | 说明                 |
| ----------- | ------------ | -------------------- |
| title       | string       | 标题                 |
| description | string       | 子说明               |
| icon        | string       | 自定义 icon class    |
| status      | `StepStatus` | 单项状态（覆盖全局） |
| disabled    | boolean      | 禁用本步骤的点击     |
| subTitle    | string       | 标题右侧的辅助文案   |

### Events

| 事件名         | 回调签名          | 说明         |
| -------------- | ----------------- | ------------ |
| update:current | `(index: number)` | 当前步骤变化 |

### 类型定义

```ts
type StepStatus = 'wait' | 'process' | 'finish' | 'error'
```
