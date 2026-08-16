import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import { nextTick, reactive } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Anchor } from '../index'
import type { AnchorLink, AnchorProps } from '../index'

const ns = useNamespace('anchor', true)

/** 构造仅随 top 变化的测试矩形，便于模拟平滑滚动经过不同区段。 */
const rectAt = (top: number): DOMRect =>
  ({
    top,
    bottom: top + 20,
    left: 0,
    right: 100,
    width: 100,
    height: 20,
    x: 0,
    y: top,
    toJSON: () => ({}),
  }) as DOMRect

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
  document.body.innerHTML = ''
})

describe('anchor', () => {
  it('从组件入口导出公开类型', () => {
    expectTypeOf<AnchorLink>().toMatchTypeOf<{ href: string; children?: AnchorLink[] }>()
    expectTypeOf<AnchorProps['items']>().toEqualTypeOf<AnchorLink[]>()
  })

  it('renders top-level links', () => {
    const wrapper = mount(Anchor, {
      props: {
        items: [
          { href: '#one', title: 'One' },
          { href: '#two', title: 'Two' },
        ],
      },
    })
    expect(wrapper.findAll(ns.e('link-title')).length).toBe(2)
  })

  it('renders nested children', () => {
    const wrapper = mount(Anchor, {
      props: {
        items: [
          {
            href: '#a',
            title: 'A',
            children: [{ href: '#a-1', title: 'A-1' }],
          },
        ],
      },
    })
    expect(wrapper.findAll(ns.e('link-title')).length).toBe(2)
    expect(wrapper.find(ns.e('children')).exists()).toBe(true)
  })

  it('重复 href 保留所有链接，但仅首个声明实例持有 current 与 ink', async () => {
    const target = document.createElement('div')
    target.id = 'duplicate'
    document.body.append(target)
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 20,
      left: 0,
      right: 100,
      width: 100,
      height: 20,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    vi.spyOn(history, 'replaceState').mockImplementation(() => {})
    const wrapper = mount(Anchor, {
      props: {
        items: [
          { href: '#duplicate', title: 'First' },
          { href: '#duplicate', title: 'Second', children: [{ href: '#duplicate', title: 'Nested' }] },
        ],
      },
    })
    await nextTick()
    const links = wrapper.findAll('a')
    vi.spyOn(wrapper.element, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 100,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    vi.spyOn(links[0].element, 'getBoundingClientRect').mockReturnValue({
      top: 10,
      bottom: 30,
      left: 0,
      right: 100,
      width: 100,
      height: 20,
      x: 0,
      y: 10,
      toJSON: () => ({}),
    })
    Object.defineProperty(links[0].element, 'offsetHeight', { value: 20, configurable: true })

    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    await nextTick()

    expect(links).toHaveLength(3)
    expect(wrapper.findAll('[aria-current="location"]')).toHaveLength(1)
    expect(wrapper.find('[aria-current="location"]').text()).toBe('First')
    expect(wrapper.find(ns.e('ink-ball')).attributes('style')).toContain('top: 18px')
    expect(warn.mock.calls.flat().join(' ')).not.toContain('Duplicate keys')

    await links[1].trigger('click')
    expect(wrapper.findAll('[aria-current="location"]')).toHaveLength(1)
    expect(wrapper.find('[aria-current="location"]').text()).toBe('First')
  })

  it('emits click on link click', async () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    document.body.innerHTML = '<div id="x" style="height: 100px;"></div>'
    const wrapper = mount(Anchor, {
      props: { items: [{ href: '#x', title: 'X' }] },
    })
    await wrapper.find('a').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')?.[0]?.[1]).toMatchObject({ href: '#x' })
  })

  it('falls back to href when title is missing', () => {
    const wrapper = mount(Anchor, {
      props: { items: [{ href: '#raw' }] },
    })
    expect(wrapper.find(ns.e('link-title')).text()).toBe('#raw')
  })

  it('renders ink ball element', () => {
    const wrapper = mount(Anchor, {
      props: { items: [{ href: '#a', title: 'A' }] },
    })
    expect(wrapper.find(ns.e('ink-ball')).exists()).toBe(true)
    expect(wrapper.find(ns.e('ink')).exists()).toBe(true)
  })

  it('applies affix modifier class when affix=true', () => {
    const wrapper = mount(Anchor, {
      props: {
        affix: true,
        items: [{ href: '#a', title: 'A' }],
      },
    })
    expect(wrapper.find(ns.m('affix')).exists()).toBe(true)
  })

  it('affix 使用 offsetTop 真实固定，并可动态关闭', async () => {
    const wrapper = mount(Anchor, {
      props: {
        affix: true,
        offsetTop: 24,
        items: [{ href: '#a', title: 'A' }],
      },
    })
    expect(wrapper.element.tagName).toBe('NAV')
    expect(wrapper.attributes('style')).toContain('position: sticky')
    expect(wrapper.attributes('style')).toContain('top: 24px')
    expect(wrapper.attributes('style')).toContain('align-self: flex-start')

    await wrapper.setProps({ affix: false })
    expect(wrapper.attributes('style') ?? '').not.toContain('position: sticky')
  })

  it('uses default slot when items is empty', () => {
    const wrapper = mount(Anchor, {
      props: { items: [] },
      slots: { default: '<a class="custom-link">Custom</a>' },
    })
    expect(wrapper.find('.custom-link').exists()).toBe(true)
  })

  it('emits change event when scroll lands on a section', async () => {
    document.body.innerHTML = '<div id="sec-a" style="height:50px;"></div><div id="sec-b" style="height:50px;"></div>'
    const wrapper = mount(Anchor, {
      props: {
        items: [
          { href: '#sec-a', title: 'A' },
          { href: '#sec-b', title: 'B' },
        ],
      },
    })
    await nextTick()
    // initial onScroll runs in onMounted; should emit change at least once with the first matched href
    const events = wrapper.emitted('change') ?? []
    expect(events.length).toBeGreaterThan(0)
  })

  it('scrolls an element container using targetOffset and updates active link', async () => {
    const container = document.createElement('div')
    container.id = 'scroll-box'
    container.scrollTop = 20
    const target = document.createElement('div')
    target.id = 'inside'
    document.body.append(container)
    container.append(target)
    const scrollTo = vi.fn()
    Object.defineProperty(container, 'scrollTo', { value: scrollTo, configurable: true })
    Object.defineProperty(container, 'clientTop', { value: 4, configurable: true })
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      top: 10,
      bottom: 310,
      left: 0,
      right: 100,
      width: 100,
      height: 300,
      x: 0,
      y: 10,
      toJSON: () => ({}),
    })
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      top: 80,
      bottom: 100,
      left: 0,
      right: 100,
      width: 100,
      height: 20,
      x: 0,
      y: 80,
      toJSON: () => ({}),
    })

    const wrapper = mount(Anchor, {
      props: {
        scrollContainer: '#scroll-box',
        targetOffset: 12,
        items: [{ href: '#inside', title: 'Inside' }],
      },
    })
    await nextTick()

    await wrapper.find('a').trigger('click')

    expect(scrollTo).toHaveBeenCalledWith({ top: 74, behavior: 'smooth' })
    expect(wrapper.find(ns.em('link-title', 'active')).exists()).toBe(true)
  })

  it('点击新锚点时发送 change、更新 hash 与 aria-current', async () => {
    const target = document.createElement('div')
    target.id = 'click-target'
    document.body.append(target)
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 120,
      left: 0,
      right: 100,
      width: 100,
      height: 20,
      x: 0,
      y: 100,
      toJSON: () => ({}),
    })
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const replaceState = vi.spyOn(history, 'replaceState').mockImplementation(() => {})
    const wrapper = mount(Anchor, {
      props: { items: [{ href: '#click-target', title: 'Target' }] },
    })
    await nextTick()
    expect(wrapper.find('a').attributes('aria-current')).toBeUndefined()

    await wrapper.find('a').trigger('click')

    expect(wrapper.emitted('change')?.at(-1)?.[0]).toBe('#click-target')
    expect(wrapper.find('a').attributes('aria-current')).toBe('location')
    expect(wrapper.find(ns.e('ink')).attributes('aria-hidden')).toBe('true')
    expect(replaceState).toHaveBeenCalledWith(null, '', '#click-target')
  })

  it('平滑点击期间保持目标，抵达后恢复用户滚动计算', async () => {
    vi.useFakeTimers()
    const tops = { a: 0, b: 100, c: 200 }
    ;(['a', 'b', 'c'] as const).forEach((name) => {
      const section = document.createElement('div')
      section.id = name
      document.body.append(section)
      vi.spyOn(section, 'getBoundingClientRect').mockImplementation(() => rectAt(tops[name]))
    })
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    vi.spyOn(history, 'replaceState').mockImplementation(() => {})
    const wrapper = mount(Anchor, {
      props: {
        items: [
          { href: '#a', title: 'A' },
          { href: '#b', title: 'B' },
          { href: '#c', title: 'C' },
        ],
      },
    })
    await nextTick()

    await wrapper.findAll('a')[2].trigger('click')
    tops.a = -100
    tops.b = 0
    tops.c = 100
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(wrapper.find('[aria-current="location"]').text()).toBe('C')
    expect(vi.getTimerCount()).toBe(1)

    tops.a = -200
    tops.b = -100
    tops.c = 0
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect((wrapper.emitted('change') ?? []).map(([href]) => href)).toEqual(['#a', '#c'])
    expect(vi.getTimerCount()).toBe(0)

    tops.a = -100
    tops.b = 0
    tops.c = 100
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect((wrapper.emitted('change') ?? []).map(([href]) => href)).toEqual(['#a', '#c', '#b'])
    expect(wrapper.find('[aria-current="location"]').text()).toBe('B')
  })

  it('瞬时 scroll 可同步抵达并立即释放目标锁', async () => {
    vi.useFakeTimers()
    const tops = { a: 0, c: 100 }
    ;(['a', 'c'] as const).forEach((name) => {
      const section = document.createElement('div')
      section.id = `instant-${name}`
      document.body.append(section)
      vi.spyOn(section, 'getBoundingClientRect').mockImplementation(() => rectAt(tops[name]))
    })
    vi.spyOn(history, 'replaceState').mockImplementation(() => {})
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {
      tops.a = -100
      tops.c = 0
      window.dispatchEvent(new Event('scroll'))
    })
    const wrapper = mount(Anchor, {
      props: {
        items: [
          { href: '#instant-a', title: 'A' },
          { href: '#instant-c', title: 'C' },
        ],
      },
    })
    await nextTick()
    await wrapper.findAll('a')[1].trigger('click')
    expect(vi.getTimerCount()).toBe(0)

    tops.a = 0
    tops.c = 100
    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    expect((wrapper.emitted('change') ?? []).map(([href]) => href)).toEqual(['#instant-a', '#instant-c', '#instant-a'])
    expect(wrapper.find('[aria-current="location"]').text()).toBe('A')
  })

  it('scrollend 打断未抵达的平滑滚动时收敛到实际区段', async () => {
    vi.useFakeTimers()
    const tops = { a: 0, b: 100, c: 200 }
    ;(['a', 'b', 'c'] as const).forEach((name) => {
      const section = document.createElement('div')
      section.id = `interrupt-${name}`
      document.body.append(section)
      vi.spyOn(section, 'getBoundingClientRect').mockImplementation(() => rectAt(tops[name]))
    })
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    vi.spyOn(history, 'replaceState').mockImplementation(() => {})
    const wrapper = mount(Anchor, {
      props: {
        items: [
          { href: '#interrupt-a', title: 'A' },
          { href: '#interrupt-b', title: 'B' },
          { href: '#interrupt-c', title: 'C' },
        ],
      },
    })
    await nextTick()
    await wrapper.findAll('a')[2].trigger('click')

    tops.a = -100
    tops.b = 0
    tops.c = 100
    window.dispatchEvent(new Event('scroll'))
    expect(vi.getTimerCount()).toBe(1)
    window.dispatchEvent(new Event('scrollend'))
    await nextTick()
    expect(vi.getTimerCount()).toBe(0)

    expect((wrapper.emitted('change') ?? []).map(([href]) => href)).toEqual([
      '#interrupt-a',
      '#interrupt-c',
      '#interrupt-b',
    ])
    expect(wrapper.find('[aria-current="location"]').text()).toBe('B')
  })

  it('底部 clamp 且无 scrollend 时按停止几何收敛，后续用户滚动仍可更新', async () => {
    vi.useFakeTimers()
    const container = document.createElement('div')
    const tops = { a: 0, b: 100, c: 250 }
    ;(['a', 'b', 'c'] as const).forEach((name) => {
      const section = document.createElement('div')
      section.id = `clamp-${name}`
      container.append(section)
      vi.spyOn(section, 'getBoundingClientRect').mockImplementation(() => rectAt(tops[name]))
    })
    document.body.append(container)
    Object.defineProperties(container, {
      clientHeight: { value: 100, configurable: true },
      scrollHeight: { value: 300, configurable: true },
    })
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(rectAt(0))
    Object.defineProperty(container, 'scrollTo', {
      configurable: true,
      value: vi.fn(() => {
        container.scrollTop = 200
        tops.a = -200
        tops.b = -100
        tops.c = 50
        container.dispatchEvent(new Event('scroll'))
      }),
    })
    vi.spyOn(history, 'replaceState').mockImplementation(() => {})
    const wrapper = mount(Anchor, {
      props: {
        scrollContainer: container,
        items: [
          { href: '#clamp-a', title: 'A' },
          { href: '#clamp-b', title: 'B' },
          { href: '#clamp-c', title: 'C' },
        ],
      },
    })
    await nextTick()

    await wrapper.findAll('a')[2].trigger('click')
    expect(wrapper.find('[aria-current="location"]').text()).toBe('C')
    expect(vi.getTimerCount()).toBe(1)

    await vi.advanceTimersByTimeAsync(120)
    await nextTick()
    expect(vi.getTimerCount()).toBe(0)

    container.scrollTop = 100
    tops.a = -100
    tops.b = 0
    tops.c = 150
    container.dispatchEvent(new Event('scroll'))
    await nextTick()

    expect((wrapper.emitted('change') ?? []).map(([href]) => href)).toEqual(['#clamp-a', '#clamp-c', '#clamp-b'])
    expect(wrapper.find('[aria-current="location"]').text()).toBe('B')
  })

  it('连续点击以最新目标替换旧的平滑滚动锁', async () => {
    vi.useFakeTimers()
    const tops = { a: 0, b: 100, c: 200 }
    ;(['a', 'b', 'c'] as const).forEach((name) => {
      const section = document.createElement('div')
      section.id = `replace-${name}`
      document.body.append(section)
      vi.spyOn(section, 'getBoundingClientRect').mockImplementation(() => rectAt(tops[name]))
    })
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    vi.spyOn(history, 'replaceState').mockImplementation(() => {})
    const wrapper = mount(Anchor, {
      props: {
        items: [
          { href: '#replace-a', title: 'A' },
          { href: '#replace-b', title: 'B' },
          { href: '#replace-c', title: 'C' },
        ],
      },
    })
    await nextTick()
    await wrapper.findAll('a')[2].trigger('click')
    window.dispatchEvent(new Event('scroll'))
    expect(vi.getTimerCount()).toBe(1)
    await wrapper.findAll('a')[1].trigger('click')
    expect(vi.getTimerCount()).toBe(0)

    tops.a = -100
    tops.b = 0
    tops.c = 100
    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    expect((wrapper.emitted('change') ?? []).map(([href]) => href)).toEqual(['#replace-a', '#replace-c', '#replace-b'])
    expect(wrapper.find('[aria-current="location"]').text()).toBe('B')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('bounds 或 offsetTop 动态变化时重新计算当前锚点', async () => {
    const section = document.createElement('div')
    section.id = 'threshold-section'
    document.body.append(section)
    vi.spyOn(section, 'getBoundingClientRect').mockReturnValue({
      top: 30,
      bottom: 50,
      left: 0,
      right: 100,
      width: 100,
      height: 20,
      x: 0,
      y: 30,
      toJSON: () => ({}),
    })
    const wrapper = mount(Anchor, {
      props: { bounds: 5, items: [{ href: '#threshold-section', title: 'Threshold' }] },
    })
    await nextTick()
    expect(wrapper.find('a').attributes('aria-current')).toBeUndefined()

    await wrapper.setProps({ bounds: 40 })
    await nextTick()
    await nextTick()

    expect(wrapper.find('a').attributes('aria-current')).toBe('location')

    await wrapper.setProps({ bounds: 5 })
    await nextTick()
    await nextTick()
    expect(wrapper.find('a').attributes('aria-current')).toBeUndefined()

    await wrapper.setProps({ offsetTop: 30 })
    await nextTick()
    await nextTick()
    expect(wrapper.find('a').attributes('aria-current')).toBe('location')
  })

  it('元素滚动容器按内容视口而不是边框计算 bounds', async () => {
    const container = document.createElement('div')
    const section = document.createElement('div')
    section.id = 'bordered-section'
    container.append(section)
    document.body.append(container)
    Object.defineProperty(container, 'clientTop', { value: 4, configurable: true })
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      top: 10,
      bottom: 210,
      left: 0,
      right: 100,
      width: 100,
      height: 200,
      x: 0,
      y: 10,
      toJSON: () => ({}),
    })
    vi.spyOn(section, 'getBoundingClientRect').mockReturnValue({
      top: 19,
      bottom: 39,
      left: 0,
      right: 100,
      width: 100,
      height: 20,
      x: 0,
      y: 19,
      toJSON: () => ({}),
    })

    const wrapper = mount(Anchor, {
      props: {
        bounds: 5,
        scrollContainer: container,
        items: [{ href: '#bordered-section', title: 'Bordered' }],
      },
    })
    await nextTick()

    expect(wrapper.find('a').attributes('aria-current')).toBe('location')
  })

  it('items 原地增加链接时重新计算新目标', async () => {
    const section = document.createElement('div')
    section.id = 'pushed-section'
    document.body.append(section)
    vi.spyOn(section, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 20,
      left: 0,
      right: 100,
      width: 100,
      height: 20,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    const items = reactive<Array<{ href: string; title: string }>>([])
    const wrapper = mount(Anchor, { props: { items } })

    items.push({ href: '#pushed-section', title: 'Pushed' })
    await nextTick()
    await nextTick()
    await nextTick()

    expect(wrapper.find('a').attributes('aria-current')).toBe('location')
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toBe('#pushed-section')
  })

  it('scrollContainer 切换与卸载时迁移并清理 scroll listener', async () => {
    vi.useFakeTimers()
    const first = document.createElement('div')
    const second = document.createElement('div')
    const target = document.createElement('div')
    target.id = 'listener-cleanup'
    document.body.append(target)
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rectAt(100))
    Object.defineProperty(first, 'scrollTo', { value: vi.fn(), configurable: true })
    Object.defineProperty(second, 'scrollTo', { value: vi.fn(), configurable: true })
    const firstAdd = vi.spyOn(first, 'addEventListener')
    const firstRemove = vi.spyOn(first, 'removeEventListener')
    const secondAdd = vi.spyOn(second, 'addEventListener')
    const secondRemove = vi.spyOn(second, 'removeEventListener')
    const wrapper = mount(Anchor, {
      props: { scrollContainer: first, items: [{ href: '#listener-cleanup', title: 'Cleanup' }] },
    })
    const firstScrollHandler = firstAdd.mock.calls.find(([type]) => type === 'scroll')?.[1]
    const firstScrollEndHandler = firstAdd.mock.calls.find(([type]) => type === 'scrollend')?.[1]
    expect(firstScrollHandler).toBeTypeOf('function')
    expect(firstScrollEndHandler).toBeTypeOf('function')

    await wrapper.find('a').trigger('click')
    first.dispatchEvent(new Event('scroll'))
    expect(vi.getTimerCount()).toBe(1)
    await wrapper.setProps({ scrollContainer: second })
    expect(vi.getTimerCount()).toBe(0)
    expect(firstRemove).toHaveBeenCalledWith('scroll', firstScrollHandler)
    expect(firstRemove).toHaveBeenCalledWith('scrollend', firstScrollEndHandler)
    const secondScrollHandler = secondAdd.mock.calls.find(([type]) => type === 'scroll')?.[1]
    const secondScrollEndHandler = secondAdd.mock.calls.find(([type]) => type === 'scrollend')?.[1]
    expect(secondScrollHandler).toBeTypeOf('function')
    expect(secondScrollEndHandler).toBeTypeOf('function')

    await wrapper.find('a').trigger('click')
    second.dispatchEvent(new Event('scroll'))
    expect(vi.getTimerCount()).toBe(1)
    wrapper.unmount()
    expect(vi.getTimerCount()).toBe(0)
    expect(secondRemove).toHaveBeenCalledWith('scroll', secondScrollHandler)
    expect(secondRemove).toHaveBeenCalledWith('scrollend', secondScrollEndHandler)
  })

  it('updates active link when items prop changes', async () => {
    const section = document.createElement('div')
    section.id = 'new-section'
    document.body.append(section)
    vi.spyOn(section, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 20,
      left: 0,
      right: 100,
      width: 100,
      height: 20,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    const wrapper = mount(Anchor, {
      props: { items: [] },
    })

    await wrapper.setProps({ items: [{ href: '#new-section', title: 'New' }] })
    await nextTick()
    await nextTick()

    expect(wrapper.emitted('change')?.at(-1)?.[0]).toBe('#new-section')
  })
})
