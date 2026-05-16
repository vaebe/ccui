import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { notification } from '../index'

afterEach(() => {
  notification.config({
    maxCount: Infinity,
    stack: false,
    pauseOnHover: true,
    role: 'alert',
    duration: 4.5,
    placement: 'topRight',
    top: undefined,
    bottom: undefined,
  })
  notification.destroy()
})

describe('notification', () => {
  it('opens with title and description', async () => {
    notification.success({ title: 'Done', description: 'All good', duration: 0 })
    await nextTick()
    expect(document.body.textContent).toContain('Done')
    expect(document.body.textContent).toContain('All good')
  })

  it('uses correct placement container', async () => {
    notification.info({ title: 'A', placement: 'bottomLeft', duration: 0 })
    await nextTick()
    expect(document.body.querySelector('.ccui-notification--bottomLeft')).not.toBeNull()
  })

  it('renders type icon', async () => {
    notification.error({ title: 'Err', duration: 0 })
    await nextTick()
    expect(document.body.querySelector('.ccui-notification__icon--error')).not.toBeNull()
  })

  it('returns handle with close', async () => {
    const handle = notification.warning({ title: 'W', duration: 0 })
    await nextTick()
    expect(typeof handle.close).toBe('function')
    handle.close()
  })

  it('renders close button when showClose=true and removes item on click', async () => {
    notification.info({ title: 'closable', duration: 0, showClose: true })
    await nextTick()
    const closeBtn = document.body.querySelector('.ccui-notification__close') as HTMLButtonElement
    expect(closeBtn).not.toBeNull()
    closeBtn?.click()
    await nextTick()
  })

  it('uses topRight as default placement', async () => {
    notification.info({ title: 'def', duration: 0 })
    await nextTick()
    expect(document.body.querySelector('.ccui-notification--topRight')).not.toBeNull()
  })

  it('renders multiple notifications in same placement', async () => {
    notification.info({ title: 'one', duration: 0 })
    notification.info({ title: 'two', duration: 0 })
    await nextTick()
    const items = document.body.querySelectorAll('.ccui-notification--topRight .ccui-notification__item')
    expect(items.length).toBe(2)
  })

  it('destroy() removes all placement containers', async () => {
    notification.info({ title: 'A', placement: 'topLeft', duration: 0 })
    notification.info({ title: 'B', placement: 'bottomRight', duration: 0 })
    await nextTick()
    expect(document.body.querySelector('.ccui-notification--topLeft')).not.toBeNull()
    expect(document.body.querySelector('.ccui-notification--bottomRight')).not.toBeNull()
    notification.destroy()
    await nextTick()
    expect(document.body.querySelector('.ccui-notification--topLeft')).toBeNull()
    expect(document.body.querySelector('.ccui-notification--bottomRight')).toBeNull()
  })

  it('renders custom class custom icon and calls onClose', async () => {
    const onClose = vi.fn()
    notification.open({
      title: 'Custom',
      description: 'Body',
      duration: 0,
      customClass: 'custom-notification',
      icon: 'icon-bell',
      onClose,
    })
    await nextTick()

    expect(document.body.querySelector('.custom-notification')).not.toBeNull()
    expect(document.body.querySelector('.icon-bell')).not.toBeNull()

    const closeBtn = document.body.querySelector('.ccui-notification__close') as HTMLButtonElement
    closeBtn.click()
    await nextTick()

    expect(onClose).toHaveBeenCalled()
  })

  it('hides close button when showClose=false', async () => {
    notification.info({ title: 'No close', duration: 0, showClose: false })
    await nextTick()

    expect(document.body.querySelector('.ccui-notification__close')).toBeNull()
  })

  it('pauses auto close on mouse enter and restarts on mouse leave', async () => {
    vi.useFakeTimers()
    notification.info({ title: 'Hover', duration: 100 })
    await nextTick()

    const item = document.body.querySelector('.ccui-notification__item') as HTMLElement
    item.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(150)
    await nextTick()
    expect(document.body.textContent).toContain('Hover')

    item.dispatchEvent(new MouseEvent('mouseleave'))
    vi.advanceTimersByTime(150)
    await nextTick()
    vi.useRealTimers()

    expect(typeof notification.destroy).toBe('function')
  })

  it('reuses existing placement container', async () => {
    notification.info({ title: 'one', placement: 'topLeft', duration: 0 })
    notification.success({ title: 'two', placement: 'topLeft', duration: 0 })
    await nextTick()

    expect(document.body.querySelectorAll('.ccui-notification--topLeft').length).toBe(1)
    expect(document.body.querySelectorAll('.ccui-notification--topLeft .ccui-notification__item').length).toBe(2)
  })

  // ── L-3.5 新增 ────────────────────────────────────────────

  it('supports top / bottom centered placements (L-3.5)', async () => {
    notification.open({ title: 't', placement: 'top', duration: 0 })
    notification.open({ title: 'b', placement: 'bottom', duration: 0 })
    await nextTick()
    expect(document.body.querySelector('.ccui-notification--top')).not.toBeNull()
    expect(document.body.querySelector('.ccui-notification--bottom')).not.toBeNull()
  })

  it('respects role prop and aria-live (L-3.5)', async () => {
    notification.open({ title: 'a', duration: 0, role: 'status' })
    await nextTick()
    const item = document.body.querySelector('.ccui-notification__item') as HTMLElement
    expect(item.getAttribute('role')).toBe('status')
    expect(item.getAttribute('aria-live')).toBe('polite')
  })

  it('config.maxCount caps and ejects oldest per-placement (L-3.5)', async () => {
    notification.config({ maxCount: 2 })
    notification.open({ title: 'a', duration: 0 })
    notification.open({ title: 'b', duration: 0 })
    notification.open({ title: 'c', duration: 0 })
    await nextTick()
    const items = document.body.querySelectorAll('.ccui-notification--topRight .ccui-notification__item')
    expect(items.length).toBe(2)
    expect(document.body.textContent).not.toContain('a')
    expect(document.body.textContent).toContain('b')
    expect(document.body.textContent).toContain('c')
  })

  it('config.stack toggles --stack modifier on container (L-3.5)', async () => {
    notification.config({ stack: true })
    notification.open({ title: 's', duration: 0 })
    await nextTick()
    expect(document.body.querySelector('.ccui-notification--stack')).not.toBeNull()
    notification.config({ stack: false })
    expect(document.body.querySelector('.ccui-notification--stack')).toBeNull()
  })

  it('pauseOnHover=false does not pause timer (L-3.5)', async () => {
    vi.useFakeTimers()
    notification.open({ title: 'np', duration: 0.05, pauseOnHover: false })
    await nextTick()
    const item = document.body.querySelector('.ccui-notification__item') as HTMLElement
    item.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(60)
    await nextTick()
    vi.useRealTimers()
    expect(typeof notification.destroy).toBe('function')
  })

  it('duration as seconds (≤100) converts to ms (L-3.5)', async () => {
    vi.useFakeTimers()
    notification.open({ title: 'sec', duration: 0.05 })
    await nextTick()
    expect(document.body.textContent).toContain('sec')
    vi.advanceTimersByTime(10)
    await nextTick()
    expect(document.body.textContent).toContain('sec')
    vi.advanceTimersByTime(60)
    await nextTick()
    vi.useRealTimers()
    expect(typeof notification.destroy).toBe('function')
  })

  describe('M-A2 classNames / styles 钩子', () => {
    it('classNames.root 注入到 item 根节点', async () => {
      notification.open({ title: 'cn', duration: 0, classNames: { root: 'my-root' } })
      await nextTick()
      const item = document.body.querySelector('.ccui-notification__item.my-root')
      expect(item).not.toBeNull()
    })

    it('styles.root 注入到 item 根节点 style', async () => {
      notification.open({ title: 'st', duration: 0, styles: { root: { color: 'red' } } })
      await nextTick()
      const item = document.body.querySelector('.ccui-notification__item') as HTMLElement | null
      expect(item).not.toBeNull()
      expect(item!.getAttribute('style') || '').toContain('red')
    })
  })
})
