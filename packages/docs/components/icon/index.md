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
import { registerIcon } from '@vaebe/ccui'

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

## 加载状态

`loading` 启用后图标内容被 spinner 替换，自动开 spin 动画并挂 `aria-busy="true"`，常用于异步操作中按钮的图标占位。

:::demo

```vue
<template>
  <div style="display: flex; gap: 16px; align-items: center;">
    <c-icon name="mdi:cloud-upload" loading :size="24" />
    <c-icon name="mdi:reload" loading :size="24" color="#1677ff" />
  </div>
</template>
```

:::

## 禁用状态

`disabled` 仅对 `clickable=true` 生效：自动阻止 click 和键盘激活，挂 `aria-disabled="true"` + `tabindex="-1"`，外观降透明 + `cursor: not-allowed`。

:::demo

```vue
<template>
  <div style="display: flex; gap: 16px; align-items: center;">
    <c-icon name="mdi:bell" :size="24" clickable aria-label="通知" />
    <c-icon name="mdi:bell" :size="24" clickable disabled aria-label="通知（禁用）" />
  </div>
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

**ccui 内部使用的 mdi 图标默认已离线**。`@vaebe/ccui-icons` 把项目源码运行时使用的 14 个 mdi 图标 SVG 数据 inline 进包（gzip ~1.8 KB），ccui 入口在加载时自动 `addCollection` 注册到 Iconify 本地数据源。内网 / 无网环境下，浮层、表单状态、Tree 展开、上传进度、回顶按钮等组件的内置图标无需任何配置即可渲染。

> 内置覆盖清单详见下方「项目内 mdi 图标一览」节。

**扩展非 ccui 内置的图标**（业务层引入新 mdi / 其他 Iconify 图标集）时，仍可通过透传出的 API 把图标数据预先注入：

```ts
import { addCollection, addIcon } from '@vaebe/ccui'
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

## 项目内 mdi 图标一览

ccui 全部组件、demo 与文档统一使用 Iconify 的 [`mdi`](https://icon-sets.iconify.design/mdi/) 图标集（Material Design Icons），下表覆盖项目目前使用的全部图标，**按所属组件分组**。点击卡片复制图标名。

<ClientOnly>
  <IconShowcase
    :groups="[
      {
        title: '反馈状态（Alert / Message / Notification / Modal.Confirm / Form / Steps / Upload / Result / Progress）',
        icons: [
          'mdi:check',
          'mdi:check-circle',
          'mdi:check-circle-outline',
          'mdi:close',
          'mdi:close-circle',
          'mdi:close-circle-outline',
          'mdi:alert',
          'mdi:alert-circle',
          'mdi:alert-circle-outline',
          'mdi:information',
          'mdi:information-outline',
          'mdi:help-circle',
          'mdi:help-circle-outline',
        ],
      },
      {
        title: '输入与选择（AutoComplete / Select / Cascader / Tree / TreeSelect / DatePicker / TimePicker / InputSearch）',
        icons: [
          'mdi:magnify',
          'mdi:close',
          'mdi:close-circle',
          'mdi:chevron-down',
          'mdi:chevron-up',
          'mdi:chevron-left',
          'mdi:chevron-right',
          'mdi:menu-right',
          'mdi:menu-down',
          'mdi:calendar-outline',
          'mdi:clock-outline',
        ],
      },
      {
        title: '导航 / 链接（BackTop / Carousel / Empty / Pagination / Anchor）',
        icons: [
          'mdi:arrow-up',
          'mdi:arrow-down',
          'mdi:arrow-left',
          'mdi:arrow-right',
          'mdi:open-in-new',
          'mdi:link-variant',
        ],
      },
      {
        title: '操作（Typography / Tabs / Drawer / Modal / Upload / FloatButton）',
        icons: [
          'mdi:content-copy',
          'mdi:pencil-outline',
          'mdi:delete-outline',
          'mdi:plus',
          'mdi:minus',
          'mdi:reload',
          'mdi:upload',
          'mdi:cloud-upload-outline',
          'mdi:download',
          'mdi:file-document-outline',
          'mdi:eye-outline',
          'mdi:eye-off-outline',
        ],
      },
      {
        title: '账号 / 通用（FloatButton demo / Layout / Menu）',
        icons: [
          'mdi:account-circle-outline',
          'mdi:bell-outline',
          'mdi:home-outline',
          'mdi:cog-outline',
          'mdi:menu',
          'mdi:email-outline',
          'mdi:message-text-outline',
          'mdi:star',
          'mdi:star-outline',
          'mdi:heart',
          'mdi:loading',
        ],
      },
    ]"
  />
</ClientOnly>

> 在 [icon-sets.iconify.design/mdi](https://icon-sets.iconify.design/mdi/) 可在线检索新图标，命名规则即 `mdi:<kebab-case-name>`。新增使用前先在此速览补登记。

## 内置图标包 `@vaebe/ccui-icons`

独立 workspace 包，两块职责：

- **mdi 离线 collection** — 详见 [离线 / 自带图标包](#离线-自带图标包) 节，ccui 入口已自动注入，**业务层无感**。需要在 ccui 之外的早期阶段强制注入时，可手动 `installCcuiMdiIcons()` 或副作用 `import '@vaebe/ccui-icons/install'`。
- **SVG 函数组件** — 少量需要静态打包、不走 Iconify 体系的图标以独立 ESM 命名导出，`sideEffects` 仅含 install 入口，未使用的导出全程 tree-shake。

| 导出                    | 说明                                                                 |
| ----------------------- | -------------------------------------------------------------------- |
| `installCcuiMdiIcons()` | 幂等注册 `ccuiMdiCollection` 到 Iconify，ccui 入口已自动调用         |
| `ccuiMdiCollection`     | 原始 `IconifyJSON` 数据对象，自定义 Iconify 集成时可复用             |
| `CaretRightOutlined`    | SVG 函数组件，可独立渲染，也可塞进 `<c-icon :component="..." />`     |
| `createIcon({ ... })`   | 自定义 SVG 函数组件构造器，与内置组件同 `size / color / rotate` 协议 |

:::demo

```vue
<script setup lang="ts">
import { CaretRightOutlined } from '@vaebe/ccui-icons'
</script>

<template>
  <div style="display: flex; gap: 16px; align-items: center;">
    <CaretRightOutlined :size="20" color="#1677ff" />
    <c-icon :component="CaretRightOutlined" :size="20" />
  </div>
</template>
```

:::

## Props

| 参数           | 类型                                                  | 默认值 | 说明                                                      |
| -------------- | ----------------------------------------------------- | ------ | --------------------------------------------------------- |
| name           | `string`                                              | --     | 图标名。含 `:` 时走 Iconify，否则查注册表，再退化到字体类 |
| component      | `Component`                                           | --     | 直接传图标组件，优先级最高                                |
| size           | `'small' \| 'default' \| 'large' \| number \| string` | --     | 尺寸，预设/数字 px/任意 CSS 长度                          |
| color          | `string`                                              | --     | 主色，作用于 `color` / `fill` / `stroke`                  |
| theme          | `'outlined' \| 'filled' \| 'two-tone'`                | --     | 主题类名挂载，便于样式钩子                                |
| twoToneColor   | `string`                                              | --     | 次色，配合 `theme="two-tone"`                             |
| rotate         | `number`                                              | 0      | 旋转角度（deg）                                           |
| spin           | `boolean`                                             | false  | 是否旋转动画                                              |
| spinDirection  | `'cw' \| 'ccw'`                                       | `'cw'` | 旋转方向，`ccw` 反向                                      |
| loading        | `boolean`                                             | false  | 加载态：替换为 spinner，自动 spin + `aria-busy`           |
| clickable      | `boolean`                                             | false  | 渲染为按钮：`role="button"` + `tabindex="0"` + 键盘激活   |
| disabled       | `boolean`                                             | false  | 仅对 `clickable` 有效：阻止 click/键盘 + `aria-disabled`  |
| themePrefixMap | `Partial<Record<IconTheme, string>>`                  | --     | 按 theme 自动映射 Iconify 前缀，比 `iconifyPrefix` 优先   |
| iconifyPrefix  | `string`                                              | --     | 当 `name` 不含 `:` 时自动拼成 `${prefix}:${name}`         |
| title          | `string`                                              | --     | 可访问标题（同时设置 `role="img"`）                       |
| ariaLabel      | `string`                                              | --     | 可访问标签                                                |
| prefixCls      | `string`                                              | --     | 字体类名前缀，默认读 ConfigProvider 的 `iconPrefixCls`    |

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

直接 `import` 自 `@vaebe/ccui`：

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
