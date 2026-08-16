import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Panel, Splitter } from '../index'

const sNs = useNamespace('splitter', true)
const pNs = useNamespace('splitter-panel', true)

function createPointerEvent(type: string, position: { clientX?: number; clientY?: number }) {
  const event = new Event(type) as PointerEvent
  Object.defineProperty(event, 'clientX', { value: position.clientX ?? 0 })
  Object.defineProperty(event, 'clientY', { value: position.clientY ?? 0 })
  return event
}

describe('splitter', () => {
  it('renders horizontal layout by default', () => {
    const wrapper = mount({
      components: { Splitter, Panel },
      template: `<Splitter><Panel :default-size="200">A</Panel><Panel>B</Panel></Splitter>`,
    })
    expect(wrapper.find(sNs.b()).exists()).toBe(true)
    expect(wrapper.find(sNs.m('horizontal')).exists()).toBe(true)
    expect(wrapper.findAll(pNs.b()).length).toBe(2)
  })

  it('renders resizer between panels', () => {
    const wrapper = mount({
      components: { Splitter, Panel },
      template: `<Splitter><Panel :default-size="100">A</Panel><Panel>B</Panel></Splitter>`,
    })
    expect(wrapper.findAll(pNs.e('resizer')).length).toBe(2)
  })

  it('exposes separator semantics and supports keyboard resizing', async () => {
    const wrapper = mount({
      components: { Splitter, Panel },
      template: `<Splitter><Panel :default-size="200" :min="100" :max="300">A</Panel><Panel :default-size="200">B</Panel></Splitter>`,
    })
    const container = wrapper.find(sNs.b()).element as HTMLElement
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      width: 400,
      height: 200,
      top: 0,
      right: 400,
      bottom: 200,
      left: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    const separator = wrapper.find(pNs.e('resizer'))

    expect(separator.attributes('role')).toBe('separator')
    expect(separator.attributes('tabindex')).toBe('0')
    expect(separator.attributes('aria-orientation')).toBe('vertical')
    expect(separator.attributes('aria-valuenow')).toBe('200')
    await separator.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(wrapper.findAll(pNs.b())[0].attributes('style')).toContain('width: 210px')
    expect(separator.attributes('aria-valuenow')).toBe('210')
  })

  it('vertical layout adds modifier', () => {
    const wrapper = mount({
      components: { Splitter, Panel },
      template: `<Splitter layout="vertical"><Panel>A</Panel><Panel>B</Panel></Splitter>`,
    })
    expect(wrapper.find(sNs.m('vertical')).exists()).toBe(true)
  })

  it('non-resizable panel hides resizer', () => {
    const wrapper = mount({
      components: { Splitter, Panel },
      template: `<Splitter><Panel :resizable="false">A</Panel><Panel>B</Panel></Splitter>`,
    })
    expect(wrapper.findAll(pNs.e('resizer')).length).toBe(1)
  })

  it('resizes adjacent horizontal panels while dragging', async () => {
    const wrapper = mount({
      components: { Splitter, Panel },
      template: `<Splitter @resize="onResize" @resize-start="onResizeStart" @resize-end="onResizeEnd">
        <Panel :default-size="200" :min="100" :max="300">A</Panel>
        <Panel :default-size="200" :min="100">B</Panel>
      </Splitter>`,
      methods: {
        onResize: vi.fn(),
        onResizeStart: vi.fn(),
        onResizeEnd: vi.fn(),
      },
    })
    const container = wrapper.find(sNs.b()).element as HTMLElement
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      width: 400,
      height: 200,
      top: 0,
      right: 400,
      bottom: 200,
      left: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })

    wrapper.find(pNs.e('resizer')).element.dispatchEvent(createPointerEvent('pointerdown', { clientX: 200 }))
    await nextTick()
    window.dispatchEvent(createPointerEvent('pointermove', { clientX: 260 }))
    await nextTick()
    window.dispatchEvent(createPointerEvent('pointerup', {}))

    const panels = wrapper.findAll(pNs.b())
    expect(panels[0].attributes('style')).toContain('width: 260px')
    expect(panels[1].attributes('style')).toContain('width: 140px')
    expect(wrapper.vm.$options.methods?.onResize).toHaveBeenCalledWith([260, 140])
    expect(wrapper.vm.$options.methods?.onResizeStart).toHaveBeenCalledWith([200, 200])
    expect(wrapper.vm.$options.methods?.onResizeEnd).toHaveBeenCalledWith([260, 140])
  })

  it('restores host body styles when a pointer drag ends or is cancelled', async () => {
    const originalCursor = document.body.style.cursor
    const originalUserSelect = document.body.style.userSelect
    document.body.style.cursor = 'wait'
    document.body.style.userSelect = 'text'

    try {
      const wrapper = mount({
        components: { Splitter, Panel },
        template: `<Splitter><Panel :default-size="200">A</Panel><Panel :default-size="200">B</Panel></Splitter>`,
      })
      const container = wrapper.find(sNs.b()).element as HTMLElement
      vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
        width: 400,
        height: 200,
        top: 0,
        right: 400,
        bottom: 200,
        left: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      })

      wrapper.find(pNs.e('resizer')).element.dispatchEvent(createPointerEvent('pointerdown', { clientX: 200 }))
      await nextTick()
      expect(document.body.style.cursor).toBe('col-resize')
      expect(document.body.style.userSelect).toBe('none')

      window.dispatchEvent(createPointerEvent('pointercancel', {}))
      expect(document.body.style.cursor).toBe('wait')
      expect(document.body.style.userSelect).toBe('text')
      wrapper.unmount()
    } finally {
      document.body.style.cursor = originalCursor
      document.body.style.userSelect = originalUserSelect
    }
  })

  it('restores host body styles when unmounted during a pointer drag', async () => {
    const originalCursor = document.body.style.cursor
    const originalUserSelect = document.body.style.userSelect
    document.body.style.cursor = 'crosshair'
    document.body.style.userSelect = 'all'

    try {
      const wrapper = mount({
        components: { Splitter, Panel },
        template: `<Splitter><Panel :default-size="200">A</Panel><Panel :default-size="200">B</Panel></Splitter>`,
      })
      const container = wrapper.find(sNs.b()).element as HTMLElement
      vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
        width: 400,
        height: 200,
        top: 0,
        right: 400,
        bottom: 200,
        left: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      })

      wrapper.find(pNs.e('resizer')).element.dispatchEvent(createPointerEvent('pointerdown', { clientX: 200 }))
      await nextTick()
      wrapper.unmount()

      expect(document.body.style.cursor).toBe('crosshair')
      expect(document.body.style.userSelect).toBe('all')
    } finally {
      document.body.style.cursor = originalCursor
      document.body.style.userSelect = originalUserSelect
    }
  })

  it('uses percentage size and vertical axis during resize', async () => {
    const wrapper = mount({
      components: { Splitter, Panel },
      template: `<Splitter layout="vertical"><Panel size="25%">A</Panel><Panel>B</Panel></Splitter>`,
    })
    const container = wrapper.find(sNs.b()).element as HTMLElement
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      width: 400,
      height: 800,
      top: 0,
      right: 400,
      bottom: 800,
      left: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })

    wrapper.find(pNs.e('resizer')).element.dispatchEvent(createPointerEvent('pointerdown', { clientY: 200 }))
    await nextTick()
    window.dispatchEvent(createPointerEvent('pointermove', { clientY: 300 }))
    await nextTick()

    expect(wrapper.findAll(pNs.b())[0].attributes('style')).toContain('height: 300px')
    window.dispatchEvent(createPointerEvent('pointerup', {}))
  })

  // L-2.23
  it('orientation 别名生效（vertical），等价 layout', () => {
    const wrapper = mount({
      components: { Splitter, Panel },
      template: `<Splitter orientation="vertical"><Panel>A</Panel><Panel>B</Panel></Splitter>`,
    })
    expect(wrapper.find(sNs.m('vertical')).exists()).toBe(true)
  })

  it('layout 显式优先于 orientation 别名', () => {
    const wrapper = mount({
      components: { Splitter, Panel },
      template: `<Splitter layout="horizontal" orientation="vertical"><Panel>A</Panel><Panel>B</Panel></Splitter>`,
    })
    expect(wrapper.find(sNs.m('horizontal')).exists()).toBe(true)
    expect(wrapper.find(sNs.m('vertical')).exists()).toBe(false)
  })

  it('showCollapsibleIcon=true + collapsible=true 时渲染折叠按钮', () => {
    const wrapper = mount({
      components: { Splitter, Panel },
      template: `<Splitter>
        <Panel :default-size="200" :collapsible="true" :show-collapsible-icon="true">A</Panel>
        <Panel>B</Panel>
      </Splitter>`,
    })
    expect(wrapper.find(pNs.e('collapse-btn')).exists()).toBe(true)
  })

  it('未设 collapsible 时即使 showCollapsibleIcon=true 也不渲染按钮', () => {
    const wrapper = mount({
      components: { Splitter, Panel },
      template: `<Splitter>
        <Panel :default-size="200" :show-collapsible-icon="true">A</Panel>
        <Panel>B</Panel>
      </Splitter>`,
    })
    expect(wrapper.find(pNs.e('collapse-btn')).exists()).toBe(false)
  })

  it('未设 showCollapsibleIcon 时不渲染按钮', () => {
    const wrapper = mount({
      components: { Splitter, Panel },
      template: `<Splitter>
        <Panel :default-size="200" :collapsible="true">A</Panel>
        <Panel>B</Panel>
      </Splitter>`,
    })
    expect(wrapper.find(pNs.e('collapse-btn')).exists()).toBe(false)
  })

  it('点击折叠按钮：panel 切折叠态（flex: 0 0 0），再点恢复', async () => {
    const wrapper = mount({
      components: { Splitter, Panel },
      template: `<Splitter>
        <Panel :default-size="200" :collapsible="true" :show-collapsible-icon="true">A</Panel>
        <Panel>B</Panel>
      </Splitter>`,
    })
    const btn = wrapper.find(pNs.e('collapse-btn'))
    await btn.trigger('click')
    await nextTick()
    expect(wrapper.findAll(pNs.b())[0].attributes('style')).toContain('flex: 0 0 0')
    // 折叠后箭头朝 end（horizontal → ▶）
    expect(btn.text()).toBe('▶')
    // 再点击恢复
    await btn.trigger('click')
    await nextTick()
    expect(wrapper.findAll(pNs.b())[0].attributes('style')).not.toContain('flex: 0 0 0')
  })

  it('collapsible 对象形态 { start: true } 也能触发图标渲染', () => {
    const wrapper = mount({
      components: { Splitter, Panel },
      template: `<Splitter>
        <Panel :default-size="200" :collapsible="{ start: true }" :show-collapsible-icon="true">A</Panel>
        <Panel>B</Panel>
      </Splitter>`,
    })
    expect(wrapper.find(pNs.e('collapse-btn')).exists()).toBe(true)
  })
})
