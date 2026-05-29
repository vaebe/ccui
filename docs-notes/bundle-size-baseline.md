# Bundle Size Baseline — v2.0.0

snapshot 时间：2026-05-17
git ref：`505b806`
build cmd：`pnpm build:lib`（实际跑 `vp run --filter ccui-cli build:lib` → `pnpm build:components` → `vite build`，详见 `packages/cli/commands/build.js`）
产物目录：`packages/ccui/build/`（一份全量 `vue-ccui.es|umd.js` + 57 个按组件目录的子 bundle）

## 总览（全量 all-in-one bundle）

| 项 | raw | gzip |
|---|---|---|
| `vue-ccui.es.js` | 519.66 KB | 133.49 KB |
| `vue-ccui.umd.js` | 422.07 KB | 119.15 KB |
| `ccui-cli.css`（顶层） | 268.56 KB | 36.43 KB |

注：`external = ['vue', 'vue-router', '@vueuse/core', '@floating-ui/dom']`，gzip 体积已扣掉这些 peer。

## 前 10 大组件 chunk（按组件目录 `index.es.js`）

| chunk | raw | gzip |
|---|---|---|
| date-picker | 70.36 KB | 21.75 KB |
| select | 47.55 KB | 14.93 KB |
| modal | 47.54 KB | 15.48 KB |
| drawer | 31.95 KB | 10.46 KB |
| input | 31.08 KB | 10.05 KB |
| slider | 30.65 KB | 8.76 KB |
| popconfirm | 30.49 KB | 9.85 KB |
| button | 29.46 KB | 9.70 KB |
| icon | 28.74 KB | 9.51 KB |
| calendar | 25.30 KB | 8.40 KB |

## Locale 包

ccui 当前 4 个 locale 用静态 `export` 暴露（`ui/locale/index.ts`），全量 `vue-ccui.es.js` 会把 4 份字符串都打进去；并未单独 emit 为 `locale/zh-CN.js` chunk。源文件体量参考：

| locale 源文件 | source raw |
|---|---|
| zh-CN.ts | 1936 B |
| en-US.ts | 1727 B |
| ja-JP.ts | 1854 B |
| ko-KR.ts | 1878 B |

**结论**：i18n 字符串走 named export，用户侧 `import { enUS } from 'vue-ccui'` 走 tree-shaking 即可只带一份。全量 bundle 默认带全 4 份（合计 < 8 KB 源码、gzip 后量级更小），未做强行 split。

## dayjs locale 分包

`packages/ccui/build/` 顶层除主 bundle 外另有以下 lazy chunk：

| chunk | raw | gzip |
|---|---|---|
| `en-BVwCvuzF.js` | 840 B | 536 B |
| `ja-B4U4rt8A.js` | 1763 B | 825 B |
| `ko-BG35I8uK.js` | 1791 B | 827 B |
| `zh-cn-C8nbfD5S.js` | 2017 B | 993 B |
| `chunk-Ndeg2fpE.js`（rolldown 共享 runtime） | 998 B | 560 B |

每个 chunk 头部都是 `import { t } from "./vue-ccui.es.js"` + `import('dayjs/locale/xxx')` 的产物，说明 `ui/shared/utils/dayjs-locale.ts` 里 `switch` 显式 `import('dayjs/locale/zh-cn')` 等被打包工具成功识别为按需 chunk。

**结论**：dayjs 4 个 locale 均独立分包，仅在 `setDayjsLocale()` 调用（ConfigProvider 切语言路径）时按需拉取，主 bundle 不内联 dayjs locale 数据。

## 备注

- size-limit / bundlewatch 暂未引入，本基线仅 snapshot；下次升级前手动重跑 `pnpm build:lib` 对比 `packages/ccui/build/vue-ccui.es.js` 与本表即可。
- 每组件 CSS 文件总和（57 个 `ccui-cli.css`）= 772 KB raw（按组件按需引入时存在内容重叠，与顶层 268 KB 合并 css 不可直接相加）。
- per-component 子 bundle 不含 locale 字符串（locale 不在 `discoverComponents` 名单内），仅全量 `vue-ccui.es.js` 包含。
