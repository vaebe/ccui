/**
 * 判断根 Changelog 是否已经为目标版本准备了二级标题。
 * 支持 `## [1.2.3]` 与 `## 1.2.3` 两种现有常见格式。
 */
export function changelogHasVersion(content, version) {
  const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`^##\\s+\\[?${escaped}\\]?(?:\\s|$)`, 'm').test(content)
}

/**
 * 从 `git status --porcelain` 原始输出提取仓库相对路径。
 * 首列空格是 Git 状态的一部分，调用方不得先 trim，否则第一条路径会被截断。
 */
export function parsePorcelainPaths(output) {
  if (!output) return []
  return output
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const path = line.slice(3)
      return path.includes(' -> ') ? path.split(' -> ').at(-1) : path
    })
}

/**
 * 为一次发布生成不会与公开 beta/latest 混用的临时 dist-tag。
 */
export function createStagingTag(version) {
  return `release-${version.toLowerCase().replace(/[^a-z0-9-]+/g, '-')}`
}

/**
 * 区分 npm view 的“版本存在”“明确 404”与网络、鉴权等未知错误。
 */
export function classifyRegistryLookup({ status, stderr = '' }) {
  if (status === 0) return 'exists'
  if (/E404|404\s+Not Found|is not in this registry/i.test(stderr)) return 'missing'
  return 'error'
}

/**
 * 正常发布要求 HEAD 与 origin/main 相同；续发只额外允许一个尚未推送的 release commit。
 */
export function isAllowedReleaseHead({ head, remoteHead, parentHead, resume }) {
  return head === remoteHead || (resume && parentHead === remoteHead)
}
