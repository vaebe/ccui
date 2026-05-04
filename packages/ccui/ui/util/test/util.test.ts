import { describe, expect, it, vi } from 'vitest'
import { canUseDom, clamp, classNames, debounce, inBrowser, isFunction, isNil, isObject, throttle } from '../index'

describe('util', () => {
  it('classNames merges strings and objects', () => {
    expect(classNames('a', { b: true, c: false }, undefined, 'd')).toBe('a b d')
  })

  it('clamp clamps within range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-1, 0, 10)).toBe(0)
    expect(clamp(20, 0, 10)).toBe(10)
  })

  it('isNil handles null and undefined', () => {
    expect(isNil(null)).toBe(true)
    expect(isNil(undefined)).toBe(true)
    expect(isNil(0)).toBe(false)
    expect(isNil('')).toBe(false)
  })

  it('isObject only returns true for plain objects', () => {
    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(false)
    expect(isObject(null)).toBe(false)
    expect(isObject(1)).toBe(false)
  })

  it('isFunction', () => {
    expect(isFunction(() => 0)).toBe(true)
    expect(isFunction({})).toBe(false)
  })

  it('inBrowser / canUseDom in jsdom env', () => {
    expect(inBrowser).toBe(true)
    expect(canUseDom()).toBe(true)
  })

  it('debounce delays calls', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const d = debounce(fn, 50)
    d()
    d()
    d()
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(60)
    expect(fn).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('throttle limits frequency', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const t = throttle(fn, 50)
    t()
    t()
    t()
    expect(fn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(60)
    expect(fn).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })
})
