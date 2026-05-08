# Icon 图标

统一图标尺寸、颜色、旋转和无障碍属性的基础包装器，内置 [Iconify](https://iconify.design/) 适配，可直接通过 `name="<prefix>:<icon>"` 渲染来自 200+ 图标集的任意图标。

## 基本用法

通过 Iconify 命名（带冒号）直接渲染图标，无需注册：

:::demo

```vue
<template>
  <div style="display: flex; gap: 16px; align-items: center;">
    <c-icon name="mdi:home" />
    <c-icon name="mdi:home" size="20" color="#1677ff" />
    <c-icon name="mdi:reload" spin />
    <c-icon name="mdi:star" rotate="45" />
  </div>
</template>
```

:::

## 尺寸预设

支持 `small / default / large` 三档预设，也可以传 `number`（按 px 解析）或任意 CSS 长度字符串（例如 `1.5em`）。`default` 不设内联字号，由父级 `font-size` 级联决定。

:::demo

```vue
<template>
  <div style="display: flex; gap: 16px; align-items: center;">
    <c-icon name="mdi:heart" size="small" />
    <c-icon name="mdi:heart" size="default" />
    <c-icon name="mdi:heart" size="large" />
    <c-icon name="mdi:heart" :size="32" />
    <c-icon name="mdi:heart" size="2em" />
  </div>
</template>
```

:::

## 主题样式

通过 `theme` 属性挂上 `outlined / filled / two-tone` 类名，配合 Iconify 不同前缀或自定义 CSS 切换观感。`two-tone` 主题下 `twoToneColor` 控制次色（通过 `--ccui-icon-two-tone-color` 暴露）。

:::demo

```vue
<template>
  <div style="display: flex; gap: 16px; align-items: center;">
    <c-icon name="mdi:star-outline" theme="outlined" :size="24" />
    <c-icon name="mdi:star" theme="filled" :size="24" color="#faad14" />
    <c-icon name="mdi:star" theme="two-tone" two-tone-color="#1677ff" :size="24" />
  </div>
</template>
```

:::

## 自带注册表（项目内复用）

不依赖 Iconify、希望强类型按名取本地组件时，使用 `registerIcon` 把任意 Vue 组件注册到全局图标表。`name` 不含冒号才会走注册表，否则进 Iconify 通道。

:::demo

```vue
<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { registerIcon } from 'vue3-ccui'

const Logo = defineComponent({
  name: 'Logo',
  setup() {
    return () =>
      h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' }, [
        h('path', { d: 'M12 2 2 22h20L12 2z' }),
      ])
  },
})

registerIcon('app-logo', Logo)
</script>

<template>
  <div style="display: flex; gap: 16px; align-items: center;">
    <c-icon name="app-logo" :size="32" color="#52c41a" />
    <c-icon name="app-logo" spin />
  </div>
</template>
```

:::

## 可点击图标（按钮语义）

`clickable` 让图标变成无障碍按钮：自动挂 `role="button"` + `tabindex="0"`，支持 Enter / Space 键盘激活，hover 状态下自动降透明度。

:::demo

```vue
<script setup lang="ts">
function handleClick() {
  alert('clicked')
}
</script>

<template>
  <c-icon name="mdi:bell" :size="24" clickable aria-label="通知" @click="handleClick" />
</template>
```

:::

## 旋转方向

`spinDirection` 控制 spin 动画方向：`cw`（默认顺时针）或 `ccw`（逆时针）。

:::demo

```vue
<template>
  <div style="display: flex; gap: 16px;">
    <c-icon name="mdi:loading" spin :size="24" />
    <c-icon name="mdi:loading" spin spin-direction="ccw" :size="24" />
  </div>
</template>
```

:::

## Iconify 前缀简化

`iconifyPrefix` 让你少写一遍 `:`。常用一组图标时设置一次前缀，后续用裸名称：

:::demo

```vue
<template>
  <div style="display: flex; gap: 16px;">
    <c-icon iconify-prefix="mdi" name="home" :size="20" />
    <c-icon iconify-prefix="mdi" name="cog" :size="20" />
    <c-icon iconify-prefix="mdi" name="account" :size="20" />
    <!-- 已含冒号时 prefix 失效 -->
    <c-icon iconify-prefix="mdi" name="material-symbols:menu" :size="20" />
  </div>
</template>
```

:::

## 全局默认（ConfigProvider）

外层套 `<c-config-provider :component-size="..." :icon-prefix-cls="...">` 时，Icon 自动读取：

- `componentSize`：`small`/`middle`/`large` 映射为 14px / 默认级联 / 20px。`size` prop 显式覆盖。
- `iconPrefixCls`：作为字体图标兜底类名前缀（默认 `ccui-icon`）。`prefixCls` prop 显式覆盖。

```vue
<c-config-provider component-size="small" icon-prefix-cls="my-iconfont">
  <c-icon name="edit" />  <!-- 渲染 <i class="my-iconfont my-iconfont-edit"/>，14px -->
</c-config-provider>
```

## 离线 / 自带图标包

Iconify 默认按图标懒加载，需要离线场景时使用透传出的 API 把图标数据预先注入：

```ts
import { addCollection, addIcon } from 'vue3-ccui'
import mdiHome from '@iconify-icons/mdi/home'

// 单图标
addIcon('mdi:home', mdiHome)

// 整个图标集（@iconify-json/mdi）
import mdiSet from '@iconify-json/mdi/icons.json'
addCollection(mdiSet)
```

注入后即使无网络也能正常渲染对应 `<c-icon name="mdi:home" />`。

## 直接传入插槽 SVG

需要一次性渲染某个 SVG 时，直接放在默认插槽里——尺寸、颜色、旋转、spin 一样有效。

:::demo

```vue
<template>
  <c-icon :size="24" color="#722ed1">
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2 2 22h20L12 2z" />
    </svg>
  </c-icon>
</template>
```

:::

## 常用图标速览

下面是 ~40 个高频 Iconify 图标，按场景分组。完整图标集可在 [icon-sets.iconify.design](https://icon-sets.iconify.design/) 查询。

:::demo

```vue
<script setup lang="ts">
const groups: Array<{ title: string; icons: string[] }> = [
  {
    title: '通用',
    icons: [
      'mdi:home',
      'mdi:menu',
      'mdi:close',
      'mdi:cog',
      'mdi:bell',
      'mdi:help-circle',
      'mdi:magnify',
      'mdi:filter-variant',
    ],
  },
  {
    title: '账号',
    icons: ['mdi:account', 'mdi:account-group', 'mdi:login', 'mdi:logout', 'mdi:lock', 'mdi:key'],
  },
  {
    title: '操作',
    icons: [
      'mdi:plus',
      'mdi:minus',
      'mdi:check',
      'mdi:pencil',
      'mdi:delete',
      'mdi:content-copy',
      'mdi:content-paste',
      'mdi:reload',
    ],
  },
  {
    title: '导航',
    icons: [
      'mdi:chevron-left',
      'mdi:chevron-right',
      'mdi:chevron-up',
      'mdi:chevron-down',
      'mdi:arrow-left',
      'mdi:arrow-right',
    ],
  },
  {
    title: '反馈',
    icons: ['mdi:information', 'mdi:alert', 'mdi:check-circle', 'mdi:close-circle'],
  },
  {
    title: '文件 & 媒体',
    icons: ['mdi:file', 'mdi:folder', 'mdi:download', 'mdi:upload', 'mdi:cloud', 'mdi:image', 'mdi:video', 'mdi:music'],
  },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <section v-for="group in groups" :key="group.title">
      <h4 style="margin: 0 0 8px;">{{ group.title }}</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 12px;">
        <div
          v-for="name in group.icons"
          :key="name"
          style="display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 96px; padding: 8px; border: 1px solid #f0f0f0; border-radius: 4px;"
        >
          <c-icon :name="name" :size="24" />
          <code style="font-size: 12px; color: #666;">{{ name }}</code>
        </div>
      </div>
    </section>
  </div>
</template>
```

:::

## Props

| 参数          | 类型                                                  | 默认值 | 说明                                                      |
| ------------- | ----------------------------------------------------- | ------ | --------------------------------------------------------- |
| name          | `string`                                              | --     | 图标名。含 `:` 时走 Iconify，否则查注册表，再退化到字体类 |
| component     | `Component`                                           | --     | 直接传图标组件，优先级最高                                |
| size          | `'small' \| 'default' \| 'large' \| number \| string` | --     | 尺寸，预设/数字 px/任意 CSS 长度                          |
| color         | `string`                                              | --     | 主色，作用于 `color` / `fill` / `stroke`                  |
| theme         | `'outlined' \| 'filled' \| 'two-tone'`                | --     | 主题类名挂载，便于样式钩子                                |
| twoToneColor  | `string`                                              | --     | 次色，配合 `theme="two-tone"`                             |
| rotate        | `number`                                              | 0      | 旋转角度（deg）                                           |
| spin          | `boolean`                                             | false  | 是否旋转动画                                              |
| spinDirection | `'cw' \| 'ccw'`                                       | `'cw'` | 旋转方向，`ccw` 反向                                      |
| clickable     | `boolean`                                             | false  | 渲染为按钮：`role="button"` + `tabindex="0"` + 键盘激活   |
| iconifyPrefix | `string`                                              | --     | 当 `name` 不含 `:` 时自动拼成 `${prefix}:${name}`         |
| title         | `string`                                              | --     | 可访问标题（同时设置 `role="img"`）                       |
| ariaLabel     | `string`                                              | --     | 可访问标签                                                |
| prefixCls     | `string`                                              | --     | 字体类名前缀，默认读 ConfigProvider 的 `iconPrefixCls`    |

## 解析优先级

`component` > Iconify 命名（`name` 含 `:`） > 注册表命中 > 字体图标类名（`<i class="ccui-icon-{name}">`） > 默认插槽内容。

## Registry API

| 方法                            | 说明                                   |
| ------------------------------- | -------------------------------------- |
| `registerIcon(name, component)` | 注册一个命名图标，`name` 不要含 `:`    |
| `resolveIcon(name)`             | 读取已注册图标，未命中返回 `undefined` |
| `unregisterIcon(name)`          | 移除已注册图标                         |
| `clearIconRegistry()`           | 清空注册表，常用于测试 setup           |

## Iconify 透传 API

直接 `import` 自 `vue3-ccui`：

| 方法                             | 说明                                       |
| -------------------------------- | ------------------------------------------ |
| `addCollection(collection)`      | 注入整个图标集（如 `@iconify-json/mdi`）   |
| `addIcon(name, data)`            | 注入单个图标                               |
| `loadIcon(name)`                 | 显式预加载某个图标，返回 Promise           |
| `loadIcons(names)`               | 批量预加载                                 |
| `addAPIProvider(provider, host)` | 自定义 Iconify API 服务器（私有部署/镜像） |

## 事件

| 事件  | 回调签名              | 说明                                              |
| ----- | --------------------- | ------------------------------------------------- |
| click | `(event: MouseEvent)` | 点击事件，`clickable=true` 时也响应 Enter / Space |
