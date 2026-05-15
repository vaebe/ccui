# Spin 加载中

加载状态的占位指示器。

## 何时使用

- 异步加载需要 0.5 – 2 秒，给用户一个"正在处理"的反馈。
- 区块级 loading：在表格 / 卡片 / 表单上覆盖加载态。
- 全屏 loading：路由切换或重要异步任务。

## 基本使用

不带任何参数即可显示一个旋转指示。

:::demo

```vue
<template>
  <c-spin />
</template>
```

:::

## 不同尺寸

`size` 接受 `small` / `default` / `large`。

:::demo

```vue
<template>
  <div style="display: flex; gap: 24px; align-items: center">
    <c-spin size="small" />
    <c-spin />
    <c-spin size="large" />
  </div>
</template>
```

:::

## 加上提示文字

`tip` 在指示器下方加一行说明，让等待原因更明确。

:::demo

```vue
<template>
  <c-spin tip="加载中…" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <c-spin size="large" tip="正在打包，请稍候" />
</template>
```

:::

## 容器内嵌

包裹任意子元素后，`spinning=true` 时在子元素上方覆盖一层加载蒙板。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <c-spin :spinning="loading">
    <div style="padding: 30px; background: #f5f5f5; border-radius: 4px">
      <h4 style="margin-top: 0">面板标题</h4>
      <p style="margin: 0">这块内容会被遮罩盖住，加载结束后浮现。</p>
    </div>
  </c-spin>
  <c-button style="margin-top: 12px" @click="loading = !loading"> {{ loading ? '关闭' : '打开' }} loading </c-button>
</template>
```

:::

## 延迟显示

`delay` 让 loading 在异步任务很快完成时根本不闪一下，避免"闪屏"。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const loading = ref(false)

function fast() {
  loading.value = true
  setTimeout(() => (loading.value = false), 200)
}
function slow() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1500)
}
</script>

<template>
  <c-spin :spinning="loading" :delay="500">
    <div style="padding: 30px; background: #f5f5f5; border-radius: 4px">
      <p style="margin: 0">delay=500ms：仅当请求 ≥ 500ms 才出现 loading</p>
    </div>
  </c-spin>
  <c-button style="margin-top: 12px" @click="fast">短任务（200ms，不出 loading）</c-button>
  <c-button type="primary" style="margin-inline-start: 8px" @click="slow"> 长任务（1.5s，出 loading） </c-button>
</template>
```

:::

## 全屏模式

`fullscreen` 把 Spin 提到 body 顶层、覆盖整屏，常用于路由切换或重要异步操作。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const visible = ref(false)

function trigger() {
  visible.value = true
  setTimeout(() => (visible.value = false), 1500)
}
</script>

<template>
  <c-button type="primary" @click="trigger">触发 1.5 秒全屏 loading</c-button>
  <c-spin v-if="visible" fullscreen tip="处理中…" />
</template>
```

:::

## 自定义指示器

`#indicator` slot 完全接管旋转图形，可以用 emoji、纯文字、或任何带动画的 VNode。

:::demo

```vue
<template>
  <div style="display: flex; gap: 32px; align-items: center">
    <c-spin tip="加载中">
      <template #indicator>
        <span style="font-size: 28px; display: inline-block; animation: spin 1s linear infinite">⏳</span>
      </template>
    </c-spin>
    <c-spin tip="拼命计算">
      <template #indicator>
        <span style="font-size: 24px">🧠💭</span>
      </template>
    </c-spin>
  </div>
</template>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
```

:::

## 关闭后展示内容

`spinning=false` 时遮罩消失，内容完整可见；切换按钮观察过渡。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const loading = ref(false)
</script>

<template>
  <c-spin :spinning="loading">
    <div style="padding: 16px; background: #fff; border: 1px solid #f0f0f0; border-radius: 6px">
      <h4 style="margin: 0 0 8px">订单 #20260515-001</h4>
      <p style="margin: 0; color: #666">已发货 · 顺丰速运 · SF1234567890</p>
    </div>
  </c-spin>
  <c-button style="margin-top: 12px" type="primary" @click="loading = !loading">
    {{ loading ? '关闭' : '打开' }} loading
  </c-button>
</template>
```

:::

## 异步请求业务

实际请求里用 `try/finally` 把 loading 复位，保证异常路径也能解开。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const loading = ref(false)
const list = ref([
  { id: 1, name: '初始记录 A' },
  { id: 2, name: '初始记录 B' },
])

async function reload() {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    list.value = [
      { id: Date.now(), name: '远程数据 1' },
      { id: Date.now() + 1, name: '远程数据 2' },
      { id: Date.now() + 2, name: '远程数据 3' },
    ]
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <c-button type="primary" style="margin-bottom: 12px" @click="reload">重新加载</c-button>
  <c-spin :spinning="loading" tip="正在拉取最新数据…">
    <ul style="margin: 0; padding: 0 0 0 20px; background: #fff; border: 1px solid #f0f0f0; border-radius: 6px">
      <li v-for="item in list" :key="item.id" style="padding: 6px 0">{{ item.name }}</li>
    </ul>
  </c-spin>
</template>
```

:::

## 包裹表格

表格上方放 toolbar、外层套 Spin，是后台管理最常见的写法。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const loading = ref(true)
const rows = [
  { id: 1, name: '张三', dept: '设计' },
  { id: 2, name: '李四', dept: '研发' },
  { id: 3, name: '王五', dept: '产品' },
]
</script>

<template>
  <c-button style="margin-bottom: 12px" @click="loading = !loading">切换 loading</c-button>
  <c-spin :spinning="loading">
    <table style="width: 100%; border-collapse: collapse; background: #fff">
      <thead>
        <tr style="background: #fafafa">
          <th style="padding: 8px; border: 1px solid #f0f0f0; text-align: left">ID</th>
          <th style="padding: 8px; border: 1px solid #f0f0f0; text-align: left">姓名</th>
          <th style="padding: 8px; border: 1px solid #f0f0f0; text-align: left">部门</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td style="padding: 8px; border: 1px solid #f0f0f0">{{ row.id }}</td>
          <td style="padding: 8px; border: 1px solid #f0f0f0">{{ row.name }}</td>
          <td style="padding: 8px; border: 1px solid #f0f0f0">{{ row.dept }}</td>
        </tr>
      </tbody>
    </table>
  </c-spin>
</template>
```

:::

## 多 Spin 互不干扰

每个 Spin 都是独立挂载，可以在网格里分别控制——单独刷新某张卡片不会让相邻卡片闪一下。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const cards = ref([
  { id: 1, title: '日活跃用户', value: '12,345', loading: false },
  { id: 2, title: '本月订单', value: '¥ 28,900', loading: true },
  { id: 3, title: '客单价', value: '¥ 156', loading: false },
])

function refresh(card) {
  card.loading = true
  setTimeout(() => (card.loading = false), 1000)
}
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px">
    <c-spin v-for="card in cards" :key="card.id" :spinning="card.loading">
      <div
        style="background: #fff; border: 1px solid #f0f0f0; border-radius: 6px; padding: 16px; cursor: pointer"
        @click="refresh(card)"
      >
        <p style="margin: 0; color: #999; font-size: 12px">{{ card.title }}</p>
        <p style="margin: 6px 0 0; font-size: 20px; font-weight: 600">{{ card.value }}</p>
        <p style="margin: 6px 0 0; color: #1677ff; font-size: 12px">点击刷新</p>
      </div>
    </c-spin>
  </div>
</template>
```

:::

## API

### Props

| 参数       | 类型                              | 默认值      | 说明                             |
| ---------- | --------------------------------- | ----------- | -------------------------------- |
| spinning   | boolean                           | `true`      | 是否显示                         |
| size       | `'small' \| 'default' \| 'large'` | `'default'` | 尺寸                             |
| tip        | string                            | —           | 指示器下方的说明                 |
| delay      | number                            | `0`         | 延迟显示（毫秒），避免快任务闪屏 |
| fullscreen | boolean                           | `false`     | 全屏覆盖                         |

### Slots

| 名称      | 说明                                          |
| --------- | --------------------------------------------- |
| default   | 被包裹的内容（容器内嵌模式）                  |
| indicator | 自定义旋转图形（替代内置四点动画）            |
