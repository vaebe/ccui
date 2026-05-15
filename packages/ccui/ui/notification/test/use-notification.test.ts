import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject, nextTick, ref } from 'vue'
import { useNotification } from '../src/use-notification'

afterEach(() => {
  document.body.querySelectorAll('.ccui-notification').forEach((el) => el.remove())
})

function makeWrapper() {
  const api: { current: ReturnType<typeof useNotification> | null } = { current: null }
  const Comp = defineComponent({
    setup() {
      const { notification, holder } = useNotification()
      api.current = { notification, holder }
      return () => h(holder)
    },
  })
  const wrapper = mount(Comp, { attachTo: document.body })
  return { wrapper, api }
}

describe('useNotification', () => {
  it('returns { notification, holder } object (NOT tuple)', () => {
    const { wrapper, api } = makeWrapper()
    expect(api.current).not.toBeNull()
    expect(typeof api.current!.notification).toBe('object')
    expect(typeof api.current!.holder).toBe('object')
    expect(Array.isArray(api.current)).toBe(false)
    wrapper.unmount()
  })

  it('renders item via holder Teleport to body', async () => {
    const { wrapper, api } = makeWrapper()
    api.current!.notification.success({ title: 'hello', description: 'desc', duration: 0 })
    await nextTick()
    await nextTick()
    expect(document.body.textContent).toContain('hello')
    expect(document.body.textContent).toContain('desc')
    wrapper.unmount()
  })

  it('clears items when holder unmounts', async () => {
    const { wrapper, api } = makeWrapper()
    api.current!.notification.info({ title: 'bye', duration: 0 })
    await nextTick()
    await nextTick()
    expect(document.body.textContent).toContain('bye')

    wrapper.unmount()
    await nextTick()
    expect(document.body.querySelector('.ccui-notification__item')).toBeNull()
  })

  it('supports multiple placements including top/bottom (L-3.5 covered)', async () => {
    const { wrapper, api } = makeWrapper()
    api.current!.notification.open({ title: 't', placement: 'top', duration: 0 })
    api.current!.notification.open({ title: 'b', placement: 'bottom', duration: 0 })
    api.current!.notification.open({ title: 'tl', placement: 'topLeft', duration: 0 })
    await nextTick()
    await nextTick()
    expect(document.body.querySelector('.ccui-notification--top')).not.toBeNull()
    expect(document.body.querySelector('.ccui-notification--bottom')).not.toBeNull()
    expect(document.body.querySelector('.ccui-notification--topLeft')).not.toBeNull()
    wrapper.unmount()
  })

  it('handle.close() removes specific item', async () => {
    const { wrapper, api } = makeWrapper()
    const h1 = api.current!.notification.info({ title: 'a', duration: 0 })
    api.current!.notification.info({ title: 'b', duration: 0 })
    await nextTick()
    expect(document.body.textContent).toContain('a')
    expect(document.body.textContent).toContain('b')

    h1.close()
    await nextTick()
    await nextTick()
    expect(document.body.textContent).not.toContain('a')
    expect(document.body.textContent).toContain('b')

    wrapper.unmount()
  })

  it('config.maxCount caps and ejects oldest per placement', async () => {
    const { wrapper, api } = makeWrapper()
    api.current!.notification.config({ maxCount: 2 })
    api.current!.notification.open({ title: 'one', duration: 0 })
    api.current!.notification.open({ title: 'two', duration: 0 })
    api.current!.notification.open({ title: 'three', duration: 0 })
    await nextTick()
    await nextTick()
    const items = document.body.querySelectorAll('.ccui-notification__item')
    expect(items.length).toBe(2)
    expect(document.body.textContent).not.toContain('one')
    expect(document.body.textContent).toContain('two')
    expect(document.body.textContent).toContain('three')
    wrapper.unmount()
  })

  it('inherits provide/inject from parent Vue tree', async () => {
    const captured = ref<string | null>(null)
    const Probe = defineComponent({
      setup() {
        captured.value = inject<string>('parent-locale', 'NONE')
        return () => null
      },
    })
    const Parent = defineComponent({
      provide() {
        return { 'parent-locale': 'zh-CN' }
      },
      setup() {
        const { holder } = useNotification()
        return () => h('div', [h(holder), h(Probe)])
      },
    })
    const wrapper = mount(Parent, { attachTo: document.body })
    await nextTick()
    expect(captured.value).toBe('zh-CN')
    wrapper.unmount()
  })

  it('duration normalization (seconds ≤100, ms >100)', async () => {
    const { wrapper, api } = makeWrapper()
    vi.useFakeTimers()
    api.current!.notification.open({ title: 'sec', duration: 0.05 })
    await nextTick()
    await nextTick()
    expect(document.body.textContent).toContain('sec')
    vi.advanceTimersByTime(10)
    await nextTick()
    expect(document.body.textContent).toContain('sec')
    vi.advanceTimersByTime(60)
    await nextTick()
    vi.useRealTimers()
    expect(typeof api.current!.notification.destroy).toBe('function')
    wrapper.unmount()
  })

  it('respects role + aria-live', async () => {
    const { wrapper, api } = makeWrapper()
    api.current!.notification.open({ title: 'r', duration: 0, role: 'status' })
    await nextTick()
    await nextTick()
    const item = document.body.querySelector('.ccui-notification__item') as HTMLElement
    expect(item.getAttribute('role')).toBe('status')
    expect(item.getAttribute('aria-live')).toBe('polite')
    wrapper.unmount()
  })
})
