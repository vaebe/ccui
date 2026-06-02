# Bundle Size Baseline — v2.0

snapshot 时间：2026-06-02
git ref：`eafddf9`
build cmd：`pnpm build:lib`（实际跑 `vp run --filter ccui-cli build:lib` → `pnpm build:components` → `vite build`，详见 `packages/cli/commands/build.js`）
产物目录：`packages/ccui/build/`（一份全量 `vue-ccui.es|umd.js` + 82 个按组件目录的子 bundle）

## 总览（全量 all-in-one bundle）

| 项 | raw | gzip |
|---|---|---|
| `vue-ccui.es.js` | 515.57 KB | 132.51 KB |
| `vue-ccui.umd.js` | 418.43 KB | 118.41 KB |
| `style.css`（顶层合并 css） | 268.59 KB | 36.64 KB |

注：`external = ['vue', 'vue-router', '@vueuse/core', '@floating-ui/dom']`，gzip 体积已扣掉这些 peer。

## 前 10 大组件 chunk（按组件目录 `index.es.js`，按 gzip 排序）

| chunk | raw | gzip |
|---|---|---|
| tree-select | 79.77 KB | 24.06 KB |
| date-picker | 73.59 KB | 22.79 KB |
| range-picker | 67.18 KB | 21.37 KB |
| time-range-picker | 68.14 KB | 21.29 KB |
| time-picker | 62.64 KB | 20.37 KB |
| cascader | 60.39 KB | 19.06 KB |
| auto-complete | 51.86 KB | 17.00 KB |
| modal | 49.99 KB | 16.19 KB |
| select | 50.81 KB | 15.96 KB |
| tree | 52.30 KB | 15.77 KB |

## Locale 包

ccui 当前 4 个 locale 用静态 `export` 暴露（`ui/locale/index.ts`），全量 `vue-ccui.es.js` 会把 4 份字符串都打进去；并未单独 emit 为 `locale/zh-CN.js` chunk。源文件体量参考：

| locale 源文件 | source raw |
|---|---|
| zh-CN.ts | 1941 B |
| en-US.ts | 1732 B |
| ja-JP.ts | 1859 B |
| ko-KR.ts | 1883 B |

**结论**：i18n 字符串走 named export，用户侧 `import { enUS } from '@vaebe/ccui'` 走 tree-shaking 即可只带一份。全量 bundle 默认带全 4 份（合计 < 8 KB 源码、gzip 后量级更小），未做强行 split。

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
- 每组件 CSS 文件总和（78 个 `style.css`）= 1071.79 KB raw（按组件按需引入时存在内容重叠，与顶层 268 KB 合并 css 不可直接相加）。
- per-component 子 bundle 不含 locale 字符串（locale 不在 `discoverComponents` 名单内），仅全量 `vue-ccui.es.js` 包含。
