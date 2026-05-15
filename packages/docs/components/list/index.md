# List 列表

通用的列表展示。

## 何时使用

- 展示一组数据条目（消息 / 通知 / 评论 / 文章）。
- 需要头像、标题、描述、操作行等丰富的单项结构。

## 基本使用

`data-source` 提供数据数组，`#renderItem` 通过 scope `{ item, index }` 渲染单项。

:::demo

```vue
<template>
  <c-list bordered :data-source="['Racing car', 'Japanese printing', 'Lazy dog', 'Quick brown fox']">
    <template #renderItem="{ item }">{{ item }}</template>
  </c-list>
</template>
```

:::

## 带头尾

`#header` / `#footer` 添加列表头部 / 尾部说明区。

:::demo

```vue
<template>
  <c-list bordered :data-source="['项目一', '项目二', '项目三']">
    <template #header><b>标题</b></template>
    <template #renderItem="{ item }">{{ item }}</template>
    <template #footer><i>页脚</i></template>
  </c-list>
</template>
```

:::

## 加载状态

`loading` 在列表上方覆盖一层半透明加载层。

:::demo

```vue
<template>
  <c-list loading bordered :data-source="['加载中…']">
    <template #renderItem="{ item }">{{ item }}</template>
  </c-list>
</template>
```

:::

## 空状态

`data-source` 为空时默认显示「暂无数据」；用 `#empty` slot 可完全自定义。

:::demo

```vue
<template>
  <c-list bordered :data-source="[]">
    <template #empty>
      <c-empty description="还没有任何数据" :image-style="{ height: '48px' }">
        <c-button type="primary">+ 立即创建</c-button>
      </c-empty>
    </template>
  </c-list>
</template>
```

:::

## 富信息条目（c-list-item）

`<c-list-item>` 暴露 `avatar` / `title` / `description` / `default` / `actions` / `extra` 6 个 slot，常用于消息列表 / 评论列表。

:::demo

```vue
<script setup>
const items = [
  {
    id: 1,
    name: 'Alice',
    role: '产品经理',
    avatar: 'A',
    color: '#1677ff',
    desc: '负责需求评审与排期协调',
  },
  {
    id: 2,
    name: 'Bob',
    role: '前端工程师',
    avatar: 'B',
    color: '#52c41a',
    desc: '专注组件库与可视化',
  },
  {
    id: 3,
    name: 'Charlie',
    role: '后端工程师',
    avatar: 'C',
    color: '#fa8c16',
    desc: '负责微服务与数据接口',
  },
]
</script>

<template>
  <c-list bordered :data-source="items" row-key="id">
    <template #renderItem="{ item }">
      <c-list-item>
        <template #avatar>
          <div
            :style="{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: item.color,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }"
          >
            {{ item.avatar }}
          </div>
        </template>
        <template #title>{{ item.name }}</template>
        <template #description>{{ item.role }} · {{ item.desc }}</template>
        <template #actions>
          <c-button type="text">编辑</c-button>
          <c-button type="text" danger>移除</c-button>
        </template>
      </c-list-item>
    </template>
  </c-list>
</template>
```

:::

## 用 c-list-item-meta 模板写法

`<c-list-item-meta>` 把头像 + 标题 + 描述聚成一个声明式子组件，写起来更贴近 ant 的模板风格（与上面的 slot 模式效果相同，二选一）。

:::demo

```vue
<script setup>
const articles = [
  { id: 1, title: 'Vue 3 的响应式原理', summary: 'Proxy + effect 的最简实现' },
  { id: 2, title: 'CSS 容器查询入门', summary: '区分组件级和媒体级断点的本质区别' },
  { id: 3, title: 'Vite 的模块预编译', summary: '为什么本地启动如此之快' },
]
</script>

<template>
  <c-list bordered :data-source="articles" row-key="id">
    <template #renderItem="{ item }">
      <c-list-item>
        <c-list-item-meta :title="item.title" :description="item.summary" />
        <template #extra>
          <c-button size="small">阅读</c-button>
        </template>
      </c-list-item>
    </template>
  </c-list>
</template>
```

:::

## 加载更多（loadMore slot）

`#loadMore` 渲染列表底部的「加载更多」按钮 / 占位区。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const list = ref([1, 2, 3, 4, 5].map((i) => ({ id: i, text: `条目 ${i}` })))
const loading = ref(false)

function loadMore() {
  loading.value = true
  setTimeout(() => {
    const offset = list.value.length
    for (let i = 1; i <= 3; i++) {
      list.value.push({ id: offset + i, text: `条目 ${offset + i}` })
    }
    loading.value = false
  }, 800)
}
</script>

<template>
  <c-list bordered :data-source="list" row-key="id" :loading="loading">
    <template #renderItem="{ item }">
      <c-list-item><template #title>{{ item.text }}</template></c-list-item>
    </template>
    <template #loadMore>
      <div style="text-align: center; padding: 8px 0">
        <c-button :loading="loading" @click="loadMore">{{ loading ? '加载中…' : '加载更多' }}</c-button>
      </div>
    </template>
  </c-list>
</template>
```

:::

## 三种尺寸

`size`：`small` / `default`（默认）/ `large`，主要影响行内边距。

:::demo

```vue
<template>
  <p style="color: #666; margin: 0 0 4px">small</p>
  <c-list size="small" bordered :data-source="['A', 'B', 'C']">
    <template #renderItem="{ item }">{{ item }}</template>
  </c-list>

  <p style="color: #666; margin: 12px 0 4px">default</p>
  <c-list bordered :data-source="['A', 'B', 'C']">
    <template #renderItem="{ item }">{{ item }}</template>
  </c-list>

  <p style="color: #666; margin: 12px 0 4px">large</p>
  <c-list size="large" bordered :data-source="['A', 'B', 'C']">
    <template #renderItem="{ item }">{{ item }}</template>
  </c-list>
</template>
```

:::

## rowKey 与无分隔线

`row-key` 接受字段名字符串或函数 `(item, index) => string | number`，提升 v-for 复用稳定性。`split=false` 去掉条目间分隔线，常用于卡片风格列表。

:::demo

```vue
<script setup>
const items = [
  { uuid: 'a', label: '记录 A' },
  { uuid: 'b', label: '记录 B' },
  { uuid: 'c', label: '记录 C' },
]
</script>

<template>
  <c-list bordered :split="false" :data-source="items" :row-key="(it) => it.uuid">
    <template #renderItem="{ item }">{{ item.label }}（uuid={{ item.uuid }}）</template>
  </c-list>
</template>
```

:::

## API

### List Props

| 参数       | 类型                                                | 默认值         | 说明                                                  |
| ---------- | --------------------------------------------------- | -------------- | ----------------------------------------------------- |
| dataSource | `unknown[]`                                         | `[]`           | 列表数据源                                            |
| bordered   | boolean                                             | `false`        | 是否带外框                                            |
| split      | boolean                                             | `true`         | 是否显示条目间分隔线                                  |
| size       | `'large' \| 'default' \| 'small'`                   | `'default'`    | 尺寸                                                  |
| layout     | `'horizontal' \| 'vertical'`                        | `'horizontal'` | 列表外层布局                                          |
| loading    | boolean                                             | `false`        | 加载中（叠加半透明遮罩）                              |
| itemLayout | `'horizontal' \| 'vertical'`                        | `'horizontal'` | 单项内部布局                                          |
| rowKey     | `string \| (item, index) => string \| number`       | `undefined`    | v-for key，传字段名走 `item[key]`，传函数直接调用      |

### List Slots

| 名称       | scope            | 说明                                |
| ---------- | ---------------- | ----------------------------------- |
| header     | —                | 列表头部                            |
| footer     | —                | 列表尾部                            |
| renderItem | `{ item, index }` | 单项渲染（必填）                    |
| empty      | —                | 空数据占位（不传则显示「暂无数据」） |
| loadMore   | —                | 列表底部的加载更多区域              |

### ListItem Slots（`<c-list-item>`）

| 名称        | 说明                                  |
| ----------- | ------------------------------------- |
| avatar      | 左侧头像（与 `c-list-item-meta` 二选一）|
| title       | 标题                                  |
| description | 描述                                  |
| default     | 主内容区                              |
| actions     | 行内操作区                            |
| extra       | 右侧额外区域（按钮 / 链接）           |

### ListItemMeta Props（`<c-list-item-meta>`）

| 参数        | 类型   | 默认值 | 说明                                  |
| ----------- | ------ | ------ | ------------------------------------- |
| title       | string | `''`   | 标题（也可用 `#title` slot 覆盖）     |
| description | string | `''`   | 描述（也可用 `#description` slot 覆盖）|

`<c-list-item-meta>` 与 `<c-list-item>` 的 avatar / title / description slot 共享同一套 DOM 与样式，两种写法等价。
