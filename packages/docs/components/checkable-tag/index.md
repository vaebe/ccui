# CheckableTag 可勾选标签

可勾选切换的标签，对标 Ant Design `Tag.CheckableTag`，作为独立顶层组件存在（不挂在 Tag 命名空间下）。配套 `CheckableTagGroup` 容器组件支持多选。

## 何时使用

- 需要标签形态的开关 / 多选筛选（如话题标签、兴趣分类）。
- 替代 Checkbox 的轻量场景。

## 单独使用

`v-model:checked` 受控；点击 / Space / Enter 切换。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const checked = ref(false)
    return { checked }
  },
})
</script>

<template>
  <c-checkable-tag v-model:checked="checked">前端</c-checkable-tag>
  <span style="margin-left: 16px">当前：{{ checked ? '已选' : '未选' }}</span>
</template>
```

:::

## 多选 group（options 模式）

`CheckableTagGroup` 配合 `options` 声明式渲染。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const selected = ref(['vue'])
    const options = [
      { label: 'Vue', value: 'vue' },
      { label: 'React', value: 'react' },
      { label: 'Svelte', value: 'svelte' },
      { label: 'Solid', value: 'solid', disabled: true },
    ]
    return { selected, options }
  },
})
</script>

<template>
  <c-checkable-tag-group v-model="selected" :options="options" />
  <div style="margin-top: 8px">已选：{{ selected.join(', ') || '空' }}</div>
</template>
```

:::

## 多选 group（默认 slot 模式）

也可以在默认 slot 里直接放 `<c-checkable-tag :value="...">`，由 group 自动接管勾选状态。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const selected = ref([])
    return { selected }
  },
})
</script>

<template>
  <c-checkable-tag-group v-model="selected">
    <c-checkable-tag value="cn">中国</c-checkable-tag>
    <c-checkable-tag value="us">美国</c-checkable-tag>
    <c-checkable-tag value="jp">日本</c-checkable-tag>
  </c-checkable-tag-group>
</template>
```

:::

## 最大勾选数

`maxCount` 达到上限后未勾选项的 click 被忽略；已勾选项仍可取消。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const selected = ref([])
    const options = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
      { label: 'C', value: 'c' },
      { label: 'D', value: 'd' },
    ]
    return { selected, options }
  },
})
</script>

<template>
  <c-checkable-tag-group v-model="selected" :options="options" :max-count="2" />
  <div style="margin-top: 8px">最多 2 个：{{ selected.join(', ') || '空' }}</div>
</template>
```

:::

## 禁用整个 group

:::demo

```vue
<template>
  <c-checkable-tag-group
    :model-value="['a']"
    :options="[
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ]"
    disabled
  />
</template>
```

:::

## 尺寸

:::demo

```vue
<template>
  <c-checkable-tag-group
    size="large"
    :options="[
      { label: '大', value: '1' },
      { label: '号', value: '2' },
    ]"
  />
  <c-checkable-tag-group
    :options="[
      { label: '默', value: '1' },
      { label: '认', value: '2' },
    ]"
    style="margin-top: 8px"
  />
  <c-checkable-tag-group
    size="small"
    :options="[
      { label: '小', value: '1' },
      { label: '号', value: '2' },
    ]"
    style="margin-top: 8px"
  />
</template>
```

:::

## CheckableTag 参数

| 参数     | 类型             | 默认  | 说明                                        |
| -------- | ---------------- | ----- | ------------------------------------------- |
| checked  | boolean          | --    | 受控勾选状态；group 模式下由 group 注入决定 |
| value    | string \| number | --    | group 模式下匹配 group 的 modelValue        |
| disabled | boolean          | false | 是否禁用                                    |

## CheckableTag 事件

| 事件名         | 参数    | 说明                                |
| -------------- | ------- | ----------------------------------- |
| update:checked | boolean | v-model:checked（仅独立使用时触发） |
| change         | boolean | 状态切换（仅独立使用时触发）        |

## CheckableTag 插槽

| 插槽名  | 说明         |
| ------- | ------------ |
| default | 标签文本内容 |

## CheckableTagGroup 参数

| 参数       | 类型                            | 默认    | 说明                                        |
| ---------- | ------------------------------- | ------- | ------------------------------------------- |
| modelValue | (string \| number)[]            | []      | 已勾选值列表（v-model）                     |
| options    | CheckableTagOption[]            | --      | 声明式选项 `{ label, value, disabled? }`    |
| disabled   | boolean                         | false   | 是否禁用整个 group                          |
| maxCount   | number                          | --      | 最大勾选数量；达上限后未勾选项 click 被忽略 |
| size       | 'large' \| 'default' \| 'small' | default | 子标签尺寸                                  |

## CheckableTagGroup 事件

| 事件名            | 参数                 | 说明     |
| ----------------- | -------------------- | -------- |
| update:modelValue | (string \| number)[] | v-model  |
| change            | (string \| number)[] | 选中变化 |

## CheckableTagGroup 插槽

| 插槽名  | 说明                                                        |
| ------- | ----------------------------------------------------------- |
| default | 内嵌 `<c-checkable-tag :value="...">` 子标签，由 group 接管 |
