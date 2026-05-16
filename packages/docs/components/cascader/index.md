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

## hover 触发

`expand-trigger="hover"` 时，鼠标移到非叶子节点即展开下一列；hover 不触发 emit。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref([])
const options = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      { value: 'hangzhou', label: '杭州', children: [{ value: 'xihu', label: '西湖' }] },
      { value: 'ningbo', label: '宁波', children: [{ value: 'haishu', label: '海曙' }] },
    ],
  },
]
</script>

<template>
  <c-cascader v-model="value" :options="options" expand-trigger="hover" />
</template>
```

:::

## showSearch 搜索

`show-search` 时 input 可输入，面板换成扁平匹配列表；默认按 label includes 匹配，传 `{ filter }` 可自定义。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref([])
const options = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      { value: 'hangzhou', label: '杭州', children: [{ value: 'xihu', label: '西湖' }] },
      { value: 'ningbo', label: '宁波', children: [{ value: 'haishu', label: '海曙' }] },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [{ value: 'nanjing', label: '南京', children: [{ value: 'gulou', label: '鼓楼' }] }],
  },
]
</script>

<template>
  <c-cascader v-model="value" :options="options" show-search />
</template>
```

:::

## loadData 异步加载

非叶子节点用 `isLeaf: false` 显式标记，配合 `loadData` 在展开时拉取 children；加载中显示 `⟳`。

:::demo

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const value = ref([])
const options = reactive([
  { value: 'a', label: '根 A', isLeaf: false },
  { value: 'b', label: '根 B', isLeaf: false },
])

function loadData(path) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      const target = path[path.length - 1]
      target.children = [
        { value: `${target.value}-1`, label: `${target.label} 子 1` },
        { value: `${target.value}-2`, label: `${target.label} 子 2` },
      ]
      target.isLeaf = undefined
      resolve()
    }, 800)
  })
}
</script>

<template>
  <c-cascader v-model="value" :options="options" :load-data="loadData" />
</template>
```

:::

## 空数据占位 notFoundContent

`options` 为空时显示自定义文案；不传则取 ConfigProvider locale（默认中文「暂无数据」）。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref([])
</script>

<template>
  <c-cascader v-model="value" :options="[]" not-found-content="🙈 当前角色无任何可分配的部门" />
</template>
```

:::

## 校验状态 status

`status` 支持 `'error'` / `'warning'` / `'success'` / `'validating'`，置于 `<c-form-item>` 时会自动继承。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const v1 = ref(null)
const v2 = ref(null)
const v3 = ref(null)
const options = [{ value: 'a', label: 'A', children: [{ value: 'a1', label: 'A1' }] }]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 300px">
    <c-cascader v-model="v1" :options="options" status="error" placeholder="error" />
    <c-cascader v-model="v2" :options="options" status="warning" placeholder="warning" />
    <c-cascader v-model="v3" :options="options" status="success" placeholder="success" />
  </div>
</template>
```

:::

## 不可清除 clearable=false

锁定已选路径，避免误清除。常用于「填了就不能撤」的关键字段（如归属部门）。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(['zhejiang', 'hangzhou'])
const options = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [{ value: 'hangzhou', label: '杭州' }],
  },
]
</script>

<template>
  <c-cascader v-model="value" :options="options" :clearable="false" />
</template>
```

:::

## 浮层方位 placement

`placement` 控制浮层四向起点，配合 `popup-append-to-body` 解决滚动容器内裁切。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const v1 = ref(null)
const v2 = ref(null)
const v3 = ref(null)
const v4 = ref(null)
const options = [{ value: 'a', label: 'A', children: [{ value: 'a1', label: 'A1' }] }]
</script>

<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap">
    <c-cascader v-model="v1" :options="options" placement="bottomLeft" placeholder="bottomLeft（默认）" />
    <c-cascader v-model="v2" :options="options" placement="bottomRight" placeholder="bottomRight" />
    <c-cascader v-model="v3" :options="options" placement="topLeft" placeholder="topLeft" />
    <c-cascader v-model="v4" :options="options" placement="topRight" placeholder="topRight" />
  </div>
</template>
```

:::

## 自定义展开图标 expandIcon + 自动聚焦

`expandIcon` 替换默认 `›`；`autoFocus` 让组件挂载后立即聚焦输入框，常用于「打开弹窗后第一个表单项」场景。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const v1 = ref(null)
const v2 = ref(null)
const options = [
  { value: 'a', label: 'A', children: [{ value: 'a1', label: 'A1' }] },
  { value: 'b', label: 'B', children: [{ value: 'b1', label: 'B1' }] },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 300px">
    <c-cascader v-model="v1" :options="options" expand-icon="→" placeholder="自定义箭头 →" />
    <c-cascader v-model="v2" :options="options" auto-focus placeholder="autoFocus 自动聚焦" />
  </div>
</template>
```

:::

## multiple 多选

`multiple` 时叶子节点渲染 checkbox，勾选聚合写入；input wrap 展示 tag，点 × 移除。`modelValue` 变 `CascaderValuePath[]`。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref([['zhejiang', 'hangzhou', 'xihu']])
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
      { value: 'ningbo', label: '宁波', children: [{ value: 'haishu', label: '海曙' }] },
    ],
  },
]
</script>

<template>
  <c-cascader v-model="value" :options="options" multiple placeholder="多选城市" />
  <p style="margin-top: 8px">v-model: {{ value }}</p>
</template>
```

:::

## Variants

录入组件统一 `variant` 形态。四档：`outlined`（默认）/ `filled` / `borderless` / `underlined`。

:::demo

```vue
<template>
  <div style="margin-bottom: 12px">
    <c-segmented v-model="variant" :options="['outlined', 'filled', 'borderless', 'underlined']" />
  </div>
  <c-cascader v-model="value" :variant="variant" :options="opts" placeholder="请选择" />
</template>

<script setup>
import { ref } from 'vue'
const variant = ref('outlined')
const value = ref([])
const opts = [
  {
    label: '浙江',
    value: 'zj',
    children: [
      { label: '杭州', value: 'hz' },
      { label: '宁波', value: 'nb' },
    ],
  },
  { label: '江苏', value: 'js', children: [{ label: '南京', value: 'nj' }] },
]
</script>
```

:::

## API

### Props

| 参数              | 类型                                                       | 默认值               | 说明                                                       |
| ----------------- | ---------------------------------------------------------- | -------------------- | ---------------------------------------------------------- |
| modelValue        | `(string \| number)[] \| (string \| number)[][] \| null`   | --                   | 单选：路径数组；多选：路径数组的数组                       |
| options           | `CascaderOption[]`                                         | `[]`                 | 数据源（递归 children）                                    |
| fieldNames        | `{ label?, value?, children?, disabled? }`                 | `{}`                 | 字段名映射                                                 |
| placeholder       | string                                                     | `请选择`             | 占位文案                                                   |
| separator         | string                                                     | `/`                  | 默认 displayRender 的拼接符                                |
| displayRender     | `(labels, selectedOptions) => string`                      | --                   | 自定义路径展示                                             |
| changeOnSelect    | boolean                                                    | `false`              | 中间节点也可选并提交                                       |
| disabled          | boolean                                                    | `false`              | 是否禁用                                                   |
| clearable         | boolean                                                    | `true`               | 是否显示清除按钮                                           |
| size              | `'small' \| 'default' \| 'large'`                          | `'default'`          | 输入框尺寸                                                 |
| status            | `'' \| 'error' \| 'warning' \| ...`                        | `''`                 | 校验状态；置于 `FormItem` 时自动继承                       |
| placement         | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'` | `'bottomLeft'`       | 浮层方位                                                   |
| popupClassName    | string                                                     | --                   | 浮层根元素自定义 class                                     |
| popupAppendToBody | boolean                                                    | `false`              | 是否把浮层 Teleport 到 `document.body`                     |
| getPopupContainer | `(trigger: HTMLElement \| null) => HTMLElement \| null`    | --                   | 自定义浮层挂载点                                           |
| autoFocus         | boolean                                                    | `false`              | 挂载后自动 focus 输入框                                    |
| inputReadOnly     | boolean                                                    | `true`               | 输入框只读                                                 |
| transitionName    | string                                                     | `ccui-cascader-fade` | 浮层过渡名                                                 |
| expandIcon        | string                                                     | `›`                  | 非叶子节点的展开图标                                       |
| notFoundContent   | string                                                     | `暂无数据`           | 空数据文案                                                 |
| expandTrigger     | `'click' \| 'hover'`                                       | `'click'`            | 列展开触发方式                                             |
| multiple          | boolean                                                    | `false`              | 多选模式，modelValue 类型变为路径数组的数组                |
| showSearch        | `boolean \| { filter?: (input, path) => boolean }`         | `false`              | 启用搜索，传 object 自定义 filter                          |
| loadData          | `(path: CascaderOption[]) => Promise<void> \| void`        | --                   | 异步加载非叶子 children；option 用 `isLeaf:false` 显式标记 |

### Events

| 事件名               | 回调签名                                     | 触发时机                           |
| -------------------- | -------------------------------------------- | ---------------------------------- |
| update:modelValue    | `(value: (string \| number)[] \| null)`      | 路径提交或清除时                   |
| change               | `(value, selectedOptions: CascaderOption[])` | 路径提交或清除时（带原始节点路径） |
| popup-visible-change | `(open: boolean)`                            | 浮层打开 / 关闭时                  |
| focus                | --                                           | 输入框聚焦                         |
| blur                 | --                                           | 输入框失焦                         |

## 顶层常量

`showCheckedStrategy` 的取值常量：**不挂命名空间**，从 `@vaebe/ccui` 顶层 export。

```ts
import { CASCADER_SHOW_CHILD, CASCADER_SHOW_PARENT } from '@vaebe/ccui'

// CASCADER_SHOW_CHILD === 'SHOW_CHILD'
// CASCADER_SHOW_PARENT === 'SHOW_PARENT'
```

| 常量                 | 说明                                                             |
| -------------------- | ---------------------------------------------------------------- |
| CASCADER_SHOW_CHILD  | `showCheckedStrategy` 取值：只输出最末级叶子节点（默认）         |
| CASCADER_SHOW_PARENT | `showCheckedStrategy` 取值：父节点全部子节点都选中时只输出父节点 |

> 当前 Cascader 尚未接入 `showCheckedStrategy` 这条 API；常量先 export 出去，方便外部代码提前引用，待后续接入实际逻辑时直接对接。

## 已知限制（未交付）

- **showCheckedStrategy**：multiple 模式下当前为「all」语义（每条勾选路径独立提交），未提供 `parent` / `child` 折叠策略。常量符号已顶层 export，未来接入实际逻辑后即可直接使用。
- **键盘导航**：方向键 / Enter 切换尚未实现。
