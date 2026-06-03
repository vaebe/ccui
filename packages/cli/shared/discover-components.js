import path from 'node:path'
import { readdirSync, lstatSync } from 'node:fs'

// 默认排除的非组件子目录：有 index.ts 但不是真正的组件入口（没有 component-info：
// status / title / category），不应进入 build / release / dts 的搬运范围。
//   - locale       : 仅 `export { default as zhCN } from ...`，无组件壳
// 注：`shared` / `style-var` 不在这里——它们没有 index.ts，已经被默认过滤掉。
// `util` 虽然不是组件，但 `index.ts` 里带 `status: '100%'` 等 component-info 字段，
// 仍然作为一等公民进入 vue-ccui 主入口；保留其在 build/types 流程中的位置。
const DEFAULT_IGNORE_DIRS = ['locale']

// 扫描组件根目录，返回包含 index.ts 的子目录名列表。
// 取代 build.js / generate-dts.js / code-check.js 三处重复的 readdir+lstat+filter。
//
// @param rootDir 组件根目录（通常是 packages/ccui/ui）
// @param options.indexFile  入口文件名，默认 index.ts
// @param options.ignoreDirs 额外的目录黑名单（与默认黑名单合并）；
//   传 [] 仍保留默认黑名单——想完全关掉过滤请传 { useDefaultIgnore: false, ignoreDirs: [] }
// @param options.useDefaultIgnore 是否启用默认黑名单，默认 true
export function discoverComponents(rootDir, { indexFile = 'index.ts', ignoreDirs = [], useDefaultIgnore = true } = {}) {
  const ignore = new Set([...(useDefaultIgnore ? DEFAULT_IGNORE_DIRS : []), ...ignoreDirs])
  return readdirSync(rootDir).filter((name) => {
    if (ignore.has(name)) return false
    const componentDir = path.resolve(rootDir, name)
    if (!lstatSync(componentDir).isDirectory()) return false
    return readdirSync(componentDir).includes(indexFile)
  })
}
