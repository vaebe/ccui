export const inBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

export function canUseDom(): boolean {
  return inBrowser
}

export function getOffset(el: HTMLElement): { top: number; left: number } {
  if (!inBrowser || !el) {
    return { top: 0, left: 0 }
  }
  const rect = el.getBoundingClientRect()
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
  }
}

export function isVisible(el: HTMLElement): boolean {
  if (!inBrowser || !el) {
    return false
  }
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
}

export function contains(parent: Node | null, target: Node | null): boolean {
  if (!parent || !target) {
    return false
  }
  return parent === target || parent.contains(target)
}
