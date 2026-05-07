import { describe, expect, it, vi } from 'vitest'
import {
  canUseDom,
  clamp,
  classNames,
  contains,
  debounce,
  getOffset,
  inBrowser,
  isFunction,
  isNil,
  isObject,
  isVisible,
  noop,
  throttle,
} from '../index'

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

  it('getOffset combines rect with scroll position', () => {
    const el = document.createElement('div')
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      top: 10,
      left: 20,
      width: 100,
      height: 50,
      right: 120,
      bottom: 60,
      x: 20,
      y: 10,
      toJSON: () => ({}),
    })
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(5)
    vi.spyOn(window, 'scrollX', 'get').mockReturnValue(7)

    expect(getOffset(el)).toEqual({ top: 15, left: 27 })
  })

  it('isVisible checks dimensions and client rects', () => {
    const visible = document.createElement('div')
    Object.defineProperty(visible, 'offsetWidth', { value: 10 })

    const byRects = document.createElement('div')
    vi.spyOn(byRects, 'getClientRects').mockReturnValue([{ width: 1, height: 1 }] as any)

    const hidden = document.createElement('div')

    expect(isVisible(visible)).toBe(true)
    expect(isVisible(byRects)).toBe(true)
    expect(isVisible(hidden)).toBe(false)
  })

  it('contains handles missing and nested nodes', () => {
    const parent = document.createElement('div')
    const child = document.createElement('span')
    parent.appendChild(child)

    expect(contains(parent, child)).toBe(true)
    expect(contains(parent, parent)).toBe(true)
    expect(contains(parent, null)).toBe(false)
    expect(contains(null, child)).toBe(false)
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

  it('debounce can cancel pending calls', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const d = debounce(fn, 50)

    d()
    d.cancel()
    vi.advanceTimersByTime(60)
    expect(fn).not.toHaveBeenCalled()
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

  it('noop is callable', () => {
    expect(noop()).toBeUndefined()
  })
})
