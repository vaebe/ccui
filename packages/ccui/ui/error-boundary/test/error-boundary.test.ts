import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from '../index'

// 一个会在 setup 阶段抛错的子组件（通过 prop 控制是否抛错）
const Bomb = defineComponent({
  name: 'Bomb',
  props: { boom: { type: Boolean, default: false } },
  setup(props) {
    if (props.boom) throw new Error('boom!')
    return () => h('div', { class: 'bomb-ok' }, 'OK')
  },
})

describe('error-boundary', () => {
  it('正常情况下渲染 default slot', () => {
    const wrapper = mount(ErrorBoundary, {
      slots: { default: () => h(Bomb, { boom: false }) },
    })
    expect(wrapper.find('.bomb-ok').exists()).toBe(true)
    expect(wrapper.find('.ccui-error-boundary').exists()).toBe(false)
  })

  it('子组件抛错时渲染 Alert error fallback', async () => {
    const errSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(ErrorBoundary, {
      slots: { default: () => h(Bomb, { boom: true }) },
    })
    await nextTick()
    expect(wrapper.find('.bomb-ok').exists()).toBe(false)
    expect(wrapper.find('.ccui-error-boundary').exists()).toBe(true)
    expect(wrapper.find('.ccui-alert').exists()).toBe(true)
    errSpy.mockRestore()
  })

  it('message prop 渲染到 Alert 标题', async () => {
    const errSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(ErrorBoundary, {
      props: { message: '组件加载失败' },
      slots: { default: () => h(Bomb, { boom: true }) },
    })
    await nextTick()
    expect(wrapper.find('.ccui-alert').text()).toContain('组件加载失败')
    errSpy.mockRestore()
  })

  it('未传 message 时回退到 error.message', async () => {
    const errSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(ErrorBoundary, {
      slots: { default: () => h(Bomb, { boom: true }) },
    })
    await nextTick()
    expect(wrapper.find('.ccui-alert').text()).toContain('boom!')
    errSpy.mockRestore()
  })

  it('message slot 优先于 prop', async () => {
    const errSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(ErrorBoundary, {
      props: { message: 'fallback' },
      slots: {
        default: () => h(Bomb, { boom: true }),
        message: () => h('b', { class: 'my-msg' }, '自定义标题'),
      },
    })
    await nextTick()
    expect(wrapper.find('.my-msg').exists()).toBe(true)
    errSpy.mockRestore()
  })

  it('fallback slot 完全替代 Alert', async () => {
    const errSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: () => h(Bomb, { boom: true }),
        fallback: (scope: any) => h('div', { class: 'my-fallback' }, `捕获: ${scope.error.message}`),
      },
    })
    await nextTick()
    expect(wrapper.find('.my-fallback').exists()).toBe(true)
    expect(wrapper.find('.my-fallback').text()).toBe('捕获: boom!')
    expect(wrapper.find('.ccui-alert').exists()).toBe(false)
    errSpy.mockRestore()
  })

  it('@error 事件触发，payload 含 Error 实例', async () => {
    const errSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(ErrorBoundary, {
      slots: { default: () => h(Bomb, { boom: true }) },
    })
    await nextTick()
    expect(wrapper.emitted('error')).toBeTruthy()
    const payload = wrapper.emitted('error')![0]
    expect(payload[0]).toBeInstanceOf(Error)
    expect((payload[0] as Error).message).toBe('boom!')
    errSpy.mockRestore()
  })

  it('reset() 暴露方法可清除错误态（恢复 default slot）', async () => {
    const errSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const onReset = vi.fn()
    const boom = ref(true)
    const wrapper = mount({
      components: { ErrorBoundary, Bomb },
      template: `<ErrorBoundary ref="bound" @reset="onReset"><Bomb :boom="boom" /></ErrorBoundary>`,
      data: () => ({ boom }),
      methods: { onReset },
    })
    await nextTick()
    expect(wrapper.find('.ccui-error-boundary').exists()).toBe(true)
    // 修复错误源
    boom.value = false
    // 调用 reset
    ;(wrapper.vm.$refs.bound as any).reset()
    await nextTick()
    expect(wrapper.find('.bomb-ok').exists()).toBe(true)
    expect(wrapper.find('.ccui-error-boundary').exists()).toBe(false)
    expect(onReset).toHaveBeenCalledTimes(1)
    errSpy.mockRestore()
  })

  it('阻止错误向上冒泡（不调用上层 errorHandler）', async () => {
    const errSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const outerErr = vi.fn()
    const wrapper = mount(ErrorBoundary, {
      slots: { default: () => h(Bomb, { boom: true }) },
      global: {
        config: {
          errorHandler: outerErr,
        },
      },
    })
    await nextTick()
    // errorHandler 不会被调用（被 boundary 截住）
    expect(outerErr).not.toHaveBeenCalled()
    expect(wrapper.find('.ccui-alert').exists()).toBe(true)
    errSpy.mockRestore()
  })
})
