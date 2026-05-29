# ColorPicker 颜色选择器

可视化挑选颜色，支持 HEX / RGB / HSB 三种格式显示，alpha 透明度，预设色板，和受控/非受控两种模式。基于浏览器 Pointer Events 实现 SV / hue / alpha 三段拖拽，零外部颜色库依赖。

## 基本用法

`v-model` 绑定 hex 字符串。alpha < 1 时输出 8 位 hex（如 `#1677ff80`），否则输出 6 位。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const color = ref('#1677ff')
</script>

<template>
  <c-color-picker v-model="color" show-text />
  <span style="margin-left: 12px">当前：{{ color }}</span>
</template>
```

:::

## 显示格式

`format` 切换 swatch 旁的文本显示格式（不影响 `v-model` 输出，输出始终是 hex）。

:::demo

```vue
<template>
  <c-color-picker default-value="#1677ff" show-text format="hex" />
  <c-color-picker default-value="#1677ff" show-text format="rgb" />
  <c-color-picker default-value="#1677ff" show-text format="hsb" />
</template>
```

:::

## 关闭 alpha

`disabled-alpha` 关掉透明度滑块，强制 alpha=1，输出始终是 6 位 hex。

:::demo

```vue
<template>
  <c-color-picker default-value="#36ad6a" show-text disabled-alpha />
</template>
```

:::

## 预设色板

`presets` 在面板上方显示预设色，点击直接套用。最简单形态是 hex 字符串列表。

:::demo

```vue
<script setup lang="ts">
const presets = ['#1677ff', '#36ad6a', '#f7b500', '#ff4d4f', '#722ed1', '#13c2c2', '#000000', '#ffffff']
</script>

<template>
  <c-color-picker default-value="#1677ff" :presets="presets" show-text />
</template>
```

:::

## 分组预设 / 带标签

`presets` 也接受 `{ label?, colors }[]` 分组形态。`colors` 内每一项可以是 hex 字符串，也可以是 `{ color, label? }` 对象（`label` 会写入按钮的 `aria-label` / `title`，便于无障碍）。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const color = ref('#1677ff')

const presets = [
  {
    label: '品牌色板',
    colors: [
      { color: '#1677ff', label: '主品牌蓝' },
      { color: '#36ad6a', label: '辅助绿' },
      { color: '#f7b500', label: '强调黄' },
    ],
  },
  {
    label: '中性灰阶',
    colors: ['#000000', '#595959', '#bfbfbf', '#f0f0f0', '#ffffff'],
  },
]
</script>

<template>
  <c-color-picker v-model="color" :presets="presets" show-text />
</template>
```

:::

## 自定义面板 panel slot

`panel` slot 完全接管面板内容，scope 提供 `{ color, components }`，其中 `components.picker` / `components.presets` / `components.footer` 是渲染函数 —— 可以按需调用、重新排版、外面套自己的说明区。下例把预设放到拾色器右侧，并在底部追加一段提示。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const color = ref('#1677ff')
const presets = [{ label: '主题色快选', colors: ['#1677ff', '#36ad6a', '#f7b500', '#ff4d4f', '#722ed1', '#13c2c2'] }]
</script>

<template>
  <c-color-picker v-model="color" :presets="presets" show-text>
    <template #panel="{ color: hex, components }">
      <div style="display: flex; gap: 12px; align-items: flex-start">
        <div style="flex: 1; min-width: 220px">
          <component :is="components.picker" />
        </div>
        <div style="width: 140px">
          <component :is="components.presets" />
        </div>
      </div>
      <div
        style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #f0f0f0; color: rgba(0,0,0,.65); font-size: 12px"
      >
        当前选中：{{ hex }} —— 上线前请走品牌色规范评审
      </div>
    </template>
  </c-color-picker>
</template>
```

:::

## 三种尺寸

:::demo

```vue
<template>
  <c-color-picker default-value="#1677ff" size="small" show-text />
  <c-color-picker default-value="#1677ff" show-text />
  <c-color-picker default-value="#1677ff" size="large" show-text />
</template>
```

:::

## 禁用

:::demo

```vue
<template>
  <c-color-picker default-value="#1677ff" disabled show-text />
</template>
```

:::

## 表单联动

放进 `c-form-item` 内时，`status` 会自动跟随 `FormItem` 的校验状态。

:::demo

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({ brand: '' })
const formRef = ref<{ validate: () => Promise<boolean> } | null>(null)
const rules = { brand: [{ required: true, message: '请选择品牌色', trigger: 'change' }] }
</script>

<template>
  <c-form ref="formRef" :model="form" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
    <c-form-item name="brand" label="品牌色" prop="brand">
      <c-color-picker v-model="form.brand" show-text />
    </c-form-item>
    <c-form-item :wrapper-col="{ span: 24 }">
      <c-button type="primary" @click="formRef?.validate()">校验</c-button>
    </c-form-item>
  </c-form>
</template>
```

:::

## 弹层容器

把面板挂到 `document.body` 或自定义容器，避开 overflow 滚动裁切。

:::demo

```vue
<template>
  <c-color-picker default-value="#1677ff" show-text popup-append-to-body />
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
  <c-color-picker v-model="value" :variant="variant" />
</template>

<script setup>
import { ref } from 'vue'
const variant = ref('outlined')
const value = ref('#1677ff')
</script>
```

:::

## API

### Props

| 参数              | 类型                                                       | 默认值                   | 说明                                                                              |
| ----------------- | ---------------------------------------------------------- | ------------------------ | --------------------------------------------------------------------------------- |
| modelValue        | string \| null                                             | --                       | 当前颜色（hex 字符串），支持 `v-model`                                            |
| defaultValue      | string                                                     | `#1677ff`                | 非受控初始 hex 值                                                                 |
| format            | `'hex' \| 'rgb' \| 'hsb'`                                  | `'hex'`                  | swatch 文本显示格式（不影响 v-model 输出）                                        |
| disabled          | boolean                                                    | `false`                  | 是否禁用                                                                          |
| size              | `'small' \| 'default' \| 'large'`                          | `'default'`              | trigger 尺寸                                                                      |
| status            | `'' \| 'error' \| 'warning' \| 'success' \| 'validating'`  | `''`                     | 校验状态；置于 `FormItem` 时自动继承                                              |
| showText          | boolean                                                    | `false`                  | 是否在 swatch 旁显示色值文本                                                      |
| disabledAlpha     | boolean                                                    | `false`                  | 关闭 alpha 滑块，强制 alpha=1，输出 6 位 hex                                      |
| presets           | `Array<string \| { color, label? } \| { label?, colors }>` | `[]`                     | 预设色板。可传扁平 hex 列表、单色对象列表，或 `{ label?, colors }` 分组列表       |
| placement         | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'` | `'bottomLeft'`           | 浮层方位                                                                          |
| popupClassName    | string                                                     | --                       | 浮层根元素自定义 class                                                            |
| popupAppendToBody | boolean                                                    | `false`                  | 是否把浮层 Teleport 到 `document.body`                                            |
| getPopupContainer | `(trigger: HTMLElement \| null) => HTMLElement \| null`    | --                       | 自定义浮层挂载点，优先级高于 `popupAppendToBody`                                  |
| transitionName    | string                                                     | `ccui-color-picker-fade` | 浮层过渡名                                                                        |
| allowClear        | boolean                                                    | `false`                  | 是否允许清空（显示 × 按钮，emit null）                                            |

### Slots

| 名称    | 作用域                                                                                                              | 说明                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| trigger | `{ color: string, open: boolean, disabled: boolean }`                                                               | 自定义触发器，替代默认 swatch 按钮                                                               |
| panel   | `{ color: string, components: { picker: () => VNode, presets: () => VNode \| null, footer: () => VNode \| null } }` | 自定义面板内容；`components.*` 为面板各子片段的渲染函数，可按需调用、重新排版                    |
| footer  | `{ color: string }`                                                                                                 | 面板底部追加区。默认面板：放在 picker 之后渲染；`panel` slot 内：通过 `components.footer()` 调用 |

### Events

| 事件名            | 回调签名                                      | 触发时机                                  |
| ----------------- | --------------------------------------------- | ----------------------------------------- |
| update:modelValue | `(hex: string)`                               | 颜色变化时（hex 字符串，alpha<1 时 8 位） |
| change            | `(hex: string, info: { rgb: RGB; hsv: HSV })` | 颜色变化时（同 update:modelValue）        |
| open-change       | `(open: boolean)`                             | 浮层打开 / 关闭时                         |

### 键盘导航

面板内 SV 区域、hue 滑块、alpha 滑块均支持 `tabindex=0` 聚焦和方向键微调：

| 区域  | 按键                     | 操作                       |
| ----- | ------------------------ | -------------------------- |
| SV    | Arrow Right/Left         | 饱和度 ±1（Shift ±10）     |
| SV    | Arrow Up/Down            | 明度 ±1（Shift ±10）       |
| Hue   | Arrow Right/Left/Up/Down | 色相 ±1（Shift ±10）       |
| Alpha | Arrow Right/Left/Up/Down | 透明度 ±0.01（Shift ±0.1） |
