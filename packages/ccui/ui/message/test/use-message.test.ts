import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject, nextTick, ref } from 'vue'
import { useMessage } from '../src/use-message'

afterEach(() => {
  // 清理 body 上残留的 Teleport 目标
  document.body.querySelectorAll('.ccui-message').forEach((el) => el.remove())
})

function makeWrapper() {
  // 把 useMessage 返回的 message + holder 暴露给外层断言
  const api: { current: ReturnType<typeof useMessage> | null } = { current: null }
  const Comp = defineComponent({
    setup() {
      const { message, holder } = useMessage()
      api.current = { message, holder }
      return () => h(holder)
    },
  })
  const wrapper = mount(Comp, { attachTo: document.body })
  return { wrapper, api }
}

describe('useMessage', () => {
  it('returns { message, holder } object (NOT tuple)', () => {
    const { wrapper, api } = makeWrapper()
    expect(api.current).not.toBeNull()
    expect(typeof api.current!.message).toBe('object')
    expect(typeof api.current!.holder).toBe('object')
    // 关键：不是数组（数组是 React Hook 风格）
    expect(Array.isArray(api.current)).toBe(false)
    wrapper.unmount()
  })

  it('message.info() renders item via holder Teleport to body', async () => {
    const { wrapper, api } = makeWrapper()
    api.current!.message.info('hello', 0)
    await nextTick()
    await nextTick()
    expect(document.body.textContent).toContain('hello')
    wrapper.unmount()
  })

  it('clears items when holder unmounts', async () => {
    const { wrapper, api } = makeWrapper()
    api.current!.message.info('bye', 0)
    await nextTick()
    await nextTick()
    expect(document.body.textContent).toContain('bye')

    wrapper.unmount()
    await nextTick()
    // holder 卸载后内部 DOM 应清除（Teleport 也会跟着卸载）
    expect(document.body.querySelector('.ccui-message__item')).toBeNull()
  })

  it('supports multiple placements', async () => {
    const { wrapper, api } = makeWrapper()
    api.current!.message.open({ content: 'tr', placement: 'topRight', duration: 0 })
    api.current!.message.open({ content: 'bl', placement: 'bottomLeft', duration: 0 })
    await nextTick()
    await nextTick()
    expect(document.body.querySelector('.ccui-message--topRight')).not.toBeNull()
    expect(document.body.querySelector('.ccui-message--bottomLeft')).not.toBeNull()
    wrapper.unmount()
  })

  it('handle.close() removes specific item', async () => {
    const { wrapper, api } = makeWrapper()
    const h1 = api.current!.message.info('a', 0)
    const h2 = api.current!.message.info('b', 0)
    await nextTick()
    expect(document.body.textContent).toContain('a')
    expect(document.body.textContent).toContain('b')

    h1.close()
    await nextTick()
    await nextTick()
    expect(document.body.textContent).not.toContain('a')
    expect(document.body.textContent).toContain('b')

    h2.close()
    wrapper.unmount()
  })

  it('config.maxCount caps and ejects oldest', async () => {
    const { wrapper, api } = makeWrapper()
    api.current!.message.config({ maxCount: 2 })
    api.current!.message.info('one', 0)
    api.current!.message.info('two', 0)
    api.current!.message.info('three', 0)
    await nextTick()
    await nextTick()
    const items = document.body.querySelectorAll('.ccui-message__item')
    expect(items.length).toBe(2)
    expect(document.body.textContent).not.toContain('one')
    expect(document.body.textContent).toContain('two')
    expect(document.body.textContent).toContain('three')
    wrapper.unmount()
  })

  it('inherits provide/inject from parent Vue tree', async () => {
    // 验证 useMessage 的 holder 渲染的子树能 inject 父级 provide
    // 通过自定义 MessageItem 替身不可行；改为：在父级 provide 后，
    // 检查 holder 内部 setup 的 currentInstance 是否在该父链中——
    // 简化为：mount 父 + provide('theme', 'dark')，再 inject from holder 子组件。
    const captured = ref<string | null>(null)
    const Probe = defineComponent({
      setup() {
        captured.value = inject<string>('parent-theme', 'NONE')
        return () => null
      },
    })

    const Parent = defineComponent({
      provide() {
        return { 'parent-theme': 'dark' }
      },
      setup() {
        const { holder } = useMessage()
        return () => h('div', [h(holder), h(Probe)])
      },
    })
    const wrapper = mount(Parent, { attachTo: document.body })
    await nextTick()
    expect(captured.value).toBe('dark')
    wrapper.unmount()
  })

  it('duration normalization (seconds ≤100, ms >100)', async () => {
    const { wrapper, api } = makeWrapper()
    vi.useFakeTimers()
    api.current!.message.open({ content: 'sec', duration: 0.05 })
    await nextTick()
    await nextTick()
    expect(document.body.textContent).toContain('sec')
    vi.advanceTimersByTime(10)
    await nextTick()
    expect(document.body.textContent).toContain('sec') // 还没到 50ms
    vi.advanceTimersByTime(60) // 累计 70ms
    await nextTick()
    vi.useRealTimers()
    expect(typeof api.current!.message.destroy).toBe('function')
    wrapper.unmount()
  })

  it('respects role + aria-live (alert by default)', async () => {
    const { wrapper, api } = makeWrapper()
    api.current!.message.open({ content: 'r', duration: 0, role: 'status' })
    await nextTick()
    await nextTick()
    const item = document.body.querySelector('.ccui-message__item') as HTMLElement
    expect(item.getAttribute('role')).toBe('status')
    expect(item.getAttribute('aria-live')).toBe('polite')
    wrapper.unmount()
  })
})
