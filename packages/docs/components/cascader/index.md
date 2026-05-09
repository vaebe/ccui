# Cascader 级联选择

多级联动选择控件。每一列展示一级选项，点击非叶子节点自动展开下一级。`v-model` 是路径数组 `[v1, v2, v3]`，输入框默认按 `separator` 拼接每级 label。

## 基本用法

`options` 是递归 `children` 的树结构，叶子节点点击后提交完整路径。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string[] | null>(null)
const options = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      {
        value: 'hangzhou',
        label: '杭州',
        children: [
          { value: 'xihu', label: '西湖' },
          { value: 'binjiang', label: '滨江' },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [
      {
        value: 'nanjing',
        label: '南京',
        children: [{ value: 'gulou', label: '鼓楼' }],
      },
    ],
  },
]
</script>

<template>
  <c-cascader v-model="value" :options="options" />
</template>
```

:::

## 中间节点也可选 (changeOnSelect)

`change-on-select` 让任何一级都能触发提交，面板继续保持打开直到点击叶子或点击外部关闭。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string[] | null>(null)
const options = [
  {
    value: 'a',
    label: 'A',
    children: [
      { value: 'a1', label: 'A1', children: [{ value: 'a11', label: 'A1-1' }] },
      { value: 'a2', label: 'A2' },
    ],
  },
]
</script>

<template>
  <c-cascader v-model="value" :options="options" change-on-select />
</template>
```

:::

## 自定义字段名 (fieldNames)

如果数据源字段不叫 `label / value / children / disabled`，用 `fieldNames` 映射。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string[] | null>(null)
const options = [
  {
    v: 'cn',
    l: '中国',
    kids: [
      {
        v: 'zj',
        l: '浙江',
        kids: [{ v: 'hz', l: '杭州' }],
      },
    ],
  },
]
const fieldNames = { label: 'l', value: 'v', children: 'kids' }
</script>

<template>
  <c-cascader v-model="value" :options="options" :field-names="fieldNames" />
</template>
```

:::

## 禁用某项

在选项上设 `disabled: true`，整个节点不可点击；其子树仍可通过其他路径到达。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string[] | null>(null)
const options = [
  {
    value: 'a',
    label: 'A',
    children: [
      { value: 'a1', label: 'A1（可选）' },
      { value: 'a2', label: 'A2（禁用）', disabled: true, children: [{ value: 'a21', label: 'A2-1' }] },
    ],
  },
]
</script>

<template>
  <c-cascader v-model="value" :options="options" />
</template>
```

:::

## 自定义路径展示

`display-render` 接收 `(labels: string[], selectedOptions: CascaderOption[])`，返回想要的展示文本。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string[] | null>(['zhejiang', 'hangzhou'])
const options = [{ value: 'zhejiang', label: '浙江', children: [{ value: 'hangzhou', label: '杭州' }] }]
const displayRender = (labels: string[]) => labels.map((l) => `「${l}」`).join('')
</script>

<template>
  <c-cascader v-model="value" :options="options" :display-render="displayRender" />
</template>
```

:::

## 三种尺寸

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string[] | null>(null)
const options = [{ value: 'a', label: 'A', children: [{ value: 'a1', label: 'A1' }] }]
</script>

<template>
  <c-cascader v-model="value" :options="options" size="small" />
  <c-cascader v-model="value" :options="options" />
  <c-cascader v-model="value" :options="options" size="large" />
</template>
```

:::

## 表单联动

放进 `c-form-item` 内时，`status` 会自动跟随 `FormItem` 的校验状态。

:::demo

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive<{ region: string[] | null }>({ region: null })
const formRef = ref<{ validate: () => Promise<boolean> } | null>(null)
const rules = { region: [{ required: true, message: '请选择地区' }] }
const options = [{ value: 'zhejiang', label: '浙江', children: [{ value: 'hangzhou', label: '杭州' }] }]
</script>

<template>
  <c-form ref="formRef" :model="form" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
    <c-form-item name="region" label="地区" prop="region">
      <c-cascader v-model="form.region" :options="options" />
    </c-form-item>
    <c-form-item :wrapper-col="{ span: 24 }">
      <c-button type="primary" @click="formRef?.validate()"> 校验 </c-button>
    </c-form-item>
  </c-form>
</template>
```

:::

## 弹层容器

把面板挂到 `document.body` 或自定义容器，避开 overflow 滚动裁切。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string[] | null>(null)
const options = [{ value: 'a', label: 'A', children: [{ value: 'a1', label: 'A1' }] }]
</script>

<template>
  <c-cascader v-model="value" :options="options" popup-append-to-body />
</template>
```

:::

## API

### Props

| 参数              | 类型                                                       | 默认值               | 说明                                   |
| ----------------- | ---------------------------------------------------------- | -------------------- | -------------------------------------- |
| modelValue        | `(string \| number)[] \| null`                             | --                   | 选中路径数组（每级 value）             |
| options           | `CascaderOption[]`                                         | `[]`                 | 数据源（递归 children）                |
| fieldNames        | `{ label?, value?, children?, disabled? }`                 | `{}`                 | 字段名映射                             |
| placeholder       | string                                                     | `请选择`             | 占位文案                               |
| separator         | string                                                     | `/`                  | 默认 displayRender 的拼接符            |
| displayRender     | `(labels, selectedOptions) => string`                      | --                   | 自定义路径展示                         |
| changeOnSelect    | boolean                                                    | `false`              | 中间节点也可选并提交                   |
| disabled          | boolean                                                    | `false`              | 是否禁用                               |
| clearable         | boolean                                                    | `true`               | 是否显示清除按钮                       |
| size              | `'small' \| 'default' \| 'large'`                          | `'default'`          | 输入框尺寸                             |
| status            | `'' \| 'error' \| 'warning' \| ...`                        | `''`                 | 校验状态；置于 `FormItem` 时自动继承   |
| placement         | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'` | `'bottomLeft'`       | 浮层方位                               |
| popupClassName    | string                                                     | --                   | 浮层根元素自定义 class                 |
| popupAppendToBody | boolean                                                    | `false`              | 是否把浮层 Teleport 到 `document.body` |
| getPopupContainer | `(trigger: HTMLElement \| null) => HTMLElement \| null`    | --                   | 自定义浮层挂载点                       |
| autoFocus         | boolean                                                    | `false`              | 挂载后自动 focus 输入框                |
| inputReadOnly     | boolean                                                    | `true`               | 输入框只读                             |
| transitionName    | string                                                     | `ccui-cascader-fade` | 浮层过渡名                             |
| expandIcon        | string                                                     | `›`                  | 非叶子节点的展开图标                   |
| notFoundContent   | string                                                     | `暂无数据`           | 空数据文案                             |

### Events

| 事件名               | 回调签名                                     | 触发时机                           |
| -------------------- | -------------------------------------------- | ---------------------------------- |
| update:modelValue    | `(value: (string \| number)[] \| null)`      | 路径提交或清除时                   |
| change               | `(value, selectedOptions: CascaderOption[])` | 路径提交或清除时（带原始节点路径） |
| popup-visible-change | `(open: boolean)`                            | 浮层打开 / 关闭时                  |
| focus                | --                                           | 输入框聚焦                         |
| blur                 | --                                           | 输入框失焦                         |

## 已知限制（未交付）

- **multiple 多选**：当前仅单选。多选会引入 checkable / showCheckedStrategy（all / parent / child）。
- **showSearch 搜索**：扁平化叶子路径并按关键字过滤，留下一切片。
- **loadData 异步加载**：当前仅支持同步 options。
- **expandTrigger='hover'**：当前固定 `'click'`。
- **键盘导航**：方向键 / Enter 切换尚未实现。
