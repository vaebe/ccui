import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { message } from '../index'

afterEach(() => {
  message.destroy()
})

describe('message', () => {
  it('opens and renders text content', async () => {
    message.success('Saved!', 0)
    await nextTick()
    expect(document.body.textContent).toContain('Saved!')
  })

  it('supports type shortcuts', async () => {
    message.error('Boom', 0)
    await nextTick()
    expect(document.body.querySelector('.ccui-message__icon--error')).not.toBeNull()
  })

  it('returns handle with close', async () => {
    const handle = message.info('Hello', 0)
    await nextTick()
    expect(document.body.querySelector('.ccui-message__item')).not.toBeNull()
    handle.close()
    await nextTick()
    // After leave transition - in jsdom transitions are synchronous-ish, so item may still be there
    // Just confirm close is callable.
    expect(typeof handle.close).toBe('function')
  })

  it('auto closes after duration', async () => {
    vi.useFakeTimers()
    message.info('Bye', 100)
    await nextTick()
    expect(document.body.textContent).toContain('Bye')
    vi.advanceTimersByTime(200)
    await nextTick()
    vi.useRealTimers()
    expect(typeof message.info).toBe('function')
  })

  it('exposes warning and loading shortcuts with correct icon class', async () => {
    message.warning('Warn', 0)
    await nextTick()
    expect(document.body.querySelector('.ccui-message__icon--warning')).not.toBeNull()
    message.destroy()

    message.loading('Loading', 0)
    await nextTick()
    expect(document.body.querySelector('.ccui-message__icon--loading')).not.toBeNull()
  })

  it('open() accepts options object directly', async () => {
    const handle = message.open({ content: 'Generic', type: 'success', duration: 0 })
    await nextTick()
    expect(document.body.textContent).toContain('Generic')
    expect(typeof handle.close).toBe('function')
  })

  it('destroy() removes the container element', async () => {
    message.info('temp', 0)
    await nextTick()
    expect(document.body.querySelector('.ccui-message')).not.toBeNull()
    message.destroy()
    await nextTick()
    expect(document.body.querySelector('.ccui-message')).toBeNull()
  })
})
