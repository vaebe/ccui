const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

interface OverlayEntry {
  container: HTMLElement
  closeOnEsc: boolean
  onEscape: () => void
}

const overlayStack: OverlayEntry[] = []
let originalBodyOverflow = ''
let scrollLockCount = 0

export function canUseDom(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export function lockBodyScroll(): () => void {
  if (!canUseDom()) return () => {}

  if (scrollLockCount === 0) {
    originalBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  scrollLockCount++
  document.body.dataset.ccuiOverlayCount = String(scrollLockCount)

  let released = false
  return () => {
    if (released || !canUseDom()) return
    released = true
    scrollLockCount = Math.max(0, scrollLockCount - 1)
    if (scrollLockCount === 0) {
      document.body.style.overflow = originalBodyOverflow
      delete document.body.dataset.ccuiOverlayCount
    } else {
      document.body.dataset.ccuiOverlayCount = String(scrollLockCount)
    }
  }
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true',
  )
}

function handleOverlayKeydown(event: KeyboardEvent): void {
  const activeOverlay = overlayStack.at(-1)
  if (!activeOverlay) return

  if (event.key === 'Escape' && activeOverlay.closeOnEsc) {
    event.preventDefault()
    activeOverlay.onEscape()
    return
  }
  if (event.key !== 'Tab') return

  const focusable = getFocusableElements(activeOverlay.container)
  if (focusable.length === 0) {
    event.preventDefault()
    activeOverlay.container.focus({ preventScroll: true })
    return
  }

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const current = document.activeElement
  if (event.shiftKey && (current === first || !activeOverlay.container.contains(current))) {
    event.preventDefault()
    last.focus({ preventScroll: true })
  } else if (!event.shiftKey && (current === last || !activeOverlay.container.contains(current))) {
    event.preventDefault()
    first.focus({ preventScroll: true })
  }
}

export function activateOverlay(entry: OverlayEntry): () => void {
  if (!canUseDom()) return () => {}

  overlayStack.push(entry)
  if (overlayStack.length === 1) document.addEventListener('keydown', handleOverlayKeydown)

  const firstFocusable = getFocusableElements(entry.container)[0]
  ;(firstFocusable ?? entry.container).focus({ preventScroll: true })

  let released = false
  return () => {
    if (released || !canUseDom()) return
    released = true
    const index = overlayStack.indexOf(entry)
    if (index >= 0) overlayStack.splice(index, 1)
    if (overlayStack.length === 0) document.removeEventListener('keydown', handleOverlayKeydown)
  }
}
