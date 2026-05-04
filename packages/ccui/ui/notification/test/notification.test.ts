import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { notification } from '../index'

afterEach(() => {
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
})
