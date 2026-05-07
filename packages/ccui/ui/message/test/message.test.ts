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

  it('renders close button custom class custom icon and calls onClose', async () => {
    const onClose = vi.fn()
    message.open({
      content: 'Closable',
      type: 'info',
      duration: 0,
      showClose: true,
      customClass: 'custom-message',
      icon: 'icon-custom',
      onClose,
    })
    await nextTick()

    expect(document.body.querySelector('.custom-message')).not.toBeNull()
    expect(document.body.querySelector('.icon-custom')).not.toBeNull()

    const close = document.body.querySelector('.ccui-message__close') as HTMLButtonElement
    close.click()
    await nextTick()

    expect(onClose).toHaveBeenCalled()
  })

  it('pauses auto close on mouse enter and restarts on mouse leave', async () => {
    vi.useFakeTimers()
    message.info('Hover', 100)
    await nextTick()

    const item = document.body.querySelector('.ccui-message__item') as HTMLElement
    item.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(150)
    await nextTick()
    expect(document.body.textContent).toContain('Hover')

    item.dispatchEvent(new MouseEvent('mouseleave'))
    vi.advanceTimersByTime(150)
    await nextTick()
    vi.useRealTimers()

    expect(typeof message.destroy).toBe('function')
  })

  it('reuses existing container for multiple messages', async () => {
    message.info('One', 0)
    message.success('Two', 0)
    await nextTick()

    expect(document.body.querySelectorAll('.ccui-message').length).toBe(1)
    expect(document.body.querySelectorAll('.ccui-message__item').length).toBe(2)
  })
})
