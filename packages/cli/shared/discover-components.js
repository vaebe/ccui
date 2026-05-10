import path from 'node:path'
import { readdirSync, lstatSync } from 'node:fs'

// 扫描组件根目录，返回包含 index.ts 的子目录名列表。
// 取代 build.js / generate-dts.js / code-check.js 三处重复的 readdir+lstat+filter。
export function discoverComponents(rootDir, { indexFile = 'index.ts' } = {}) {
  return readdirSync(rootDir).filter((name) => {
    const componentDir = path.resolve(rootDir, name)
    if (!lstatSync(componentDir).isDirectory()) return false
    return readdirSync(componentDir).includes(indexFile)
  })
}
