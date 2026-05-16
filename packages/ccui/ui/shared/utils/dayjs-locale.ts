import dayjs from 'dayjs'

const loadingPromises = new Map<string, Promise<void>>()
const loaded = new Set<string>(['en']) // dayjs 内置 en

/**
 * 按需 lazy import dayjs locale 包并切到全局 dayjs 实例。
 *
 * - `name` 用 dayjs 本身的 locale 命名（小写 + 连字符），如 `'zh-cn'` / `'ja'` / `'ko'` / `'en'`。
 * - 重复调用同一 locale 走缓存；并发调用同一 locale 共享 promise。
 * - 加载失败时 console.warn 并保持当前 dayjs locale 不变。
 */
export async function setDayjsLocale(name: string): Promise<void> {
  const lower = name.toLowerCase()
  if (loaded.has(lower)) {
    dayjs.locale(lower)
    return
  }
  let pending = loadingPromises.get(lower)
  if (!pending) {
    pending = importLocale(lower)
    loadingPromises.set(lower, pending)
  }
  try {
    await pending
    loaded.add(lower)
    dayjs.locale(lower)
  } catch (err) {
    if (typeof console !== 'undefined') {
      console.warn(`[ccui] 无法加载 dayjs locale "${lower}"：`, err)
    }
  } finally {
    loadingPromises.delete(lower)
  }
}

async function importLocale(name: string): Promise<void> {
  // 通过显式 switch 让打包工具 (vite/webpack) 静态分析出可能的 chunk 集合，
  // 而不是 dynamic import('dayjs/locale/' + name) 那种全量打包的写法。
  switch (name) {
    case 'zh-cn':
      await import('dayjs/locale/zh-cn')
      break
    case 'en':
      // 已内置
      break
    case 'en-us':
      await import('dayjs/locale/en')
      break
    case 'ja':
    case 'ja-jp':
      await import('dayjs/locale/ja')
      break
    case 'ko':
    case 'ko-kr':
      await import('dayjs/locale/ko')
      break
    default:
      // 兜底：让上游决定要不要支持更多 locale，主仓库不强行打包
      throw new Error(`Unsupported dayjs locale: ${name}`)
  }
}

export function __resetDayjsLocaleCacheForTest(): void {
  loaded.clear()
  loaded.add('en')
  loadingPromises.clear()
}
