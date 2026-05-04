export function debounce<T extends (...args: any[]) => any>(fn: T, wait = 200) {
  let timer: ReturnType<typeof setTimeout> | null = null
  function debounced(this: any, ...args: Parameters<T>): void {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, wait)
  }
  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }
  return debounced as T & { cancel: () => void }
}

export function throttle<T extends (...args: any[]) => any>(fn: T, wait = 200) {
  let last = 0
  let timer: ReturnType<typeof setTimeout> | null = null
  function throttled(this: any, ...args: Parameters<T>): void {
    const now = Date.now()
    const remaining = wait - (now - last)
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      last = now
      fn.apply(this, args)
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now()
        timer = null
        fn.apply(this, args)
      }, remaining)
    }
  }
  return throttled as T
}

export function noop(): void {}

export function isFunction(v: unknown): v is (...args: any[]) => any {
  return typeof v === 'function'
}

export function isObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}
