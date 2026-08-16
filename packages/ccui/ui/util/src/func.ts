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
  let trailingCall: (() => void) | null = null

  // 清除延迟调用，供组件卸载时释放尚未执行的回调。
  const cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    trailingCall = null
  }

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
    } else {
      // trailing 调用应反映节流窗口内最后一次输入，而非第一次输入。
      trailingCall = () => fn.apply(this, args)
      if (timer) return
      timer = setTimeout(() => {
        last = Date.now()
        timer = null
        trailingCall?.()
        trailingCall = null
      }, remaining)
    }
  }
  throttled.cancel = cancel
  return throttled as T & { cancel: () => void }
}

export function noop(): void {}

export function isFunction(v: unknown): v is (...args: any[]) => any {
  return typeof v === 'function'
}

export function isObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== 'object') return false
  // 仅接受普通对象和无原型对象，避免把 Date、Map 等实例当作配置对象。
  const prototype = Object.getPrototypeOf(v)
  return prototype === Object.prototype || prototype === null
}
