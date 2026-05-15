const warnedKeys = new Set<string>()

export function warnDeprecatedProp(component: string, oldKey: string, suggestion: string): void {
  const key = `${component}.${oldKey}`
  if (warnedKeys.has(key)) return
  warnedKeys.add(key)
  if (typeof console !== 'undefined') {
    console.warn(`[ccui][${component}] ${oldKey} 已 deprecated，请改用 ${suggestion}。`)
  }
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

export function __resetDeprecationWarningsForTest(): void {
  warnedKeys.clear()
}
