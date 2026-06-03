export function classNames(...args: Array<string | Record<string, boolean> | undefined | null | false>): string {
  const result: string[] = []
  for (const a of args) {
    if (!a) {
      continue
    }
    if (typeof a === 'string') {
      result.push(a)
    } else if (typeof a === 'object') {
      for (const k in a) {
        if (a[k]) {
          result.push(k)
        }
      }
    }
  }
  return result.join(' ')
}

export function isNil(v: unknown): v is null | undefined {
  return v === null || v === undefined
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val))
}
