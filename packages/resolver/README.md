# @vue3-ccui/unplugin-vue-components

`vue3-ccui` 组件按需自动导入解析器，搭配 [`unplugin-vue-components`](https://github.com/unplugin/unplugin-vue-components) 使用。

无需手写 `import`、无需在入口处全量引入样式 —— 直接在模板里写 `<c-button>` / `<c-form>` 等即可，组件代码与对应样式会被插件自动注入。

## 安装

```bash
# pnpm
pnpm add -D @vue3-ccui/unplugin-vue-components unplugin-vue-components
pnpm add vue3-ccui

# npm
npm i -D @vue3-ccui/unplugin-vue-components unplugin-vue-components
npm i vue3-ccui
```

## 使用

### Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { Vue3CCUIResolver } from '@vue3-ccui/unplugin-vue-components'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [Vue3CCUIResolver()],
    }),
  ],
})
```

### Webpack / Rspack / Rollup / esbuild

参考 [`unplugin-vue-components` 文档](https://github.com/unplugin/unplugin-vue-components#installation)，把
`Vue3CCUIResolver()` 注册到对应构建工具的 `Components` 插件 `resolvers` 数组里即可，配置方式与 Vite 完全一致。

### 模板里直接用

```vue
<template>
  <c-form :model="form">
    <c-form-item label="用户名">
      <c-input v-model="form.username" />
    </c-form-item>
    <c-form-item>
      <c-button type="primary" @click="submit">提交</c-button>
    </c-form-item>
  </c-form>
</template>
```

构建后产物中只会包含被实际使用的组件以及对应样式，未使用的组件会被打包工具 tree-shake 掉。

## Options

```ts
Vue3CCUIResolver({
  importStyle: 'css', // 'css' | 'scss' | false   默认 'css'
  prefix: 'C', //                         默认 'C'
  exclude: [/^CIcon/], // string | RegExp | (string | RegExp)[]
  importFrom: 'vue3-ccui',
  cssBundlePath: 'vue3-ccui/dist/vue3-ccui.css',
})
```

### `importStyle`

| 值              | 行为                                                            | 适用场景                                              |
| --------------- | --------------------------------------------------------------- | ----------------------------------------------------- |
| `'css'`（默认） | 注入一次 `vue3-ccui/dist/vue3-ccui.css`（被 unplugin 自动去重） | 大多数项目，无需 Sass 构建链                          |
| `'scss'`        | 每个组件按需注入 `vue3-ccui/ui/<dir>/src/<dir>.scss` 源文件     | 需要在自己工程里覆盖主题变量、且构建链已支持 Sass     |
| `false`         | 不注入任何样式                                                  | 你在入口手动 `import 'vue3-ccui/style.css'`，自己掌控 |

> 当前主包仅产出整体 CSS bundle（`dist/vue3-ccui.css`），尚未拆分为「每个组件一个 CSS 文件」。
> 这意味着 `'css'` 模式下任意一个组件被使用时，整体样式会被一次性引入；JavaScript 部分仍按需 tree-shake。
> 后续主包若产出 per-component CSS，本 resolver 的 API 不会变，只会让 `'css'` 也变成真正的「按组件粒度引入」。

### `prefix`

模板组件名前缀。`vue3-ccui` 所有组件在源码里注册为 `name: 'C<Name>'`，所以默认是 `'C'`。
仅在你用自定义 installer 把组件以另一个前缀注册时才需要改。

### `exclude`

跳过特定组件的解析，避免与其它组件库重名时被误识别。可传字符串、正则或它们组成的数组。

```ts
Vue3CCUIResolver({
  // 让 <c-icon> 不走本 resolver（例如让位给 unplugin-icons）
  exclude: ['CIcon'],
})
```

### `importFrom` / `cssBundlePath`

monorepo 内做了 re-export、或者你自定义了 CSS bundle 文件名时使用。一般不需要改。

## 与 Volar / `<script setup>` 配合

`unplugin-vue-components` 默认会生成 `components.d.ts`，把按需解析的组件类型暴露给 Volar / `vue-tsc`，这样模板里的 `<c-button>` 同样能享受类型推导和跳转。

如果你在新项目里第一次接入，记得让 `components.d.ts` 跟随 git 提交（或加进 `.gitignore` 也行，看团队偏好）。

## 支持的组件列表

88 个模板组件名（66 个顶层组件 + 22 个子组件；`message` / `notification` / `util` 为命令式或工具入口，不在此列）：

`Affix · Alert · Anchor · AutoComplete · Avatar · BackTop · Badge · Breadcrumb / Item · Button · Button3d · Calendar · Card · Carousel · Cascader · CheckBox · Col · Collapse / Item · ColorPicker · ConfigProvider · DatePicker · Descriptions / Item · Divider · Drawer · Dropdown · Empty · Flex · FloatButton · Form / Item / List / Provider · Icon · Image · Input · InputNumber · Layout / Header / Footer / Sider / Content · Masonry · Mentions · Menu · Modal · Pagination · Popconfirm · Popover · Progress · Radio / Group · RangePicker · Rate · Result · Row · Segmented · Select · Skeleton · Slider · Space · Spin · Splitter / Panel · Statistic / Countdown · Status · Steps · Switch · Tab · Table · Tabs · Tag · TimePicker · Timeline / Item · Tooltip · Transfer · Tree · TreeSelect · Typography / Link / Paragraph / Text / Title · Upload · Watermark`

不包含 `message` / `notification` —— 它们是命令式 API，不在模板里使用。直接 `import { message, notification } from 'vue3-ccui'` 即可，按需引入由 ESM tree-shaking 直接处理。

## License

[MIT](./LICENSE)
