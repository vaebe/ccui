const warnedKeys = new Set<string>()

function isDev(): boolean {
  const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env
  if (env?.NODE_ENV === 'production') return false
  return true
}

export function warnDeprecated(key: string, replacement?: string, scope?: string): void {
  if (!isDev()) return
  const fullKey = scope ? `${scope}.${key}` : key
  if (warnedKeys.has(fullKey)) return
  warnedKeys.add(fullKey)
  if (typeof console === 'undefined') return
  const tag = scope ? `[ccui][${scope}]` : '[ccui]'
  const tail = replacement ? `，请改用 ${replacement}` : ''
  console.warn(`${tag} ${key} 已 deprecated${tail}。`)
}

export function isPropExplicit(
  rawProps: Record<string, unknown> | null | undefined,
  camelKey: string,
  kebabKey: string,
): boolean {
  if (!rawProps) return false
  return (
    Object.prototype.hasOwnProperty.call(rawProps, camelKey) || Object.prototype.hasOwnProperty.call(rawProps, kebabKey)
  )
}

export function __resetDeprecatedWarningsForTest(): void {
  warnedKeys.clear()
}
