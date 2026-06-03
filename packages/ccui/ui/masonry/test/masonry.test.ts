import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Fragment, h, nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Masonry } from '../index'

const ns = useNamespace('masonry', true)

describe('masonry', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('splits items into N columns', () => {
    const wrapper = mount(Masonry, {
      props: { columns: 3 },
      slots: {
        default: '<div>1</div><div>2</div><div>3</div><div>4</div><div>5</div>',
      },
    })
    expect(wrapper.findAll(ns.e('column')).length).toBe(3)
  })

  it('clamps columns to at least 1', () => {
    const wrapper = mount(Masonry, {
      props: { columns: 0 },
      slots: { default: '<div>1</div>' },
    })
    expect(wrapper.findAll(ns.e('column')).length).toBe(1)
  })

  it('applies gutter as inline style', () => {
    const wrapper = mount(Masonry, {
      props: { columns: 2, gutter: [8, 12] },
      slots: { default: '<div>1</div><div>2</div>' },
    })
    const item = wrapper.find(ns.e('item'))
    expect(item.attributes('style') ?? '').toContain('margin-bottom: 12px')
  })

  it('applies numeric gutter to horizontal and vertical spacing', () => {
    const wrapper = mount(Masonry, {
      props: { columns: 2, gutter: 10 },
      slots: { default: '<div>1</div><div>2</div>' },
    })

    const columns = wrapper.findAll(ns.e('column'))
    expect(columns[0].attributes('style')).toContain('margin-inline-end: 10px')
    expect(columns[1].attributes('style')).not.toContain('margin-inline-end: 10px')
    expect(wrapper.find(ns.e('item')).attributes('style')).toContain('margin-bottom: 10px')
  })

  it('resolves responsive columns and updates on resize', async () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800)
    const wrapper = mount(Masonry, {
      props: { columns: { xs: 1, md: 3, lg: 4 } },
      slots: { default: '<div>1</div><div>2</div><div>3</div><div>4</div>' },
    })
    await nextTick()

    expect(wrapper.findAll(ns.e('column')).length).toBe(3)

    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1100)
    window.dispatchEvent(new Event('resize'))
    await nextTick()

    expect(wrapper.findAll(ns.e('column')).length).toBe(4)
  })

  it('flattens fragment slot children before distributing items', () => {
    const wrapper = mount(Masonry, {
      props: { columns: 2 },
      slots: {
        default: () =>
          h(Fragment, null, [
            h('span', { class: 'item-a' }, 'A'),
            h('span', { class: 'item-b' }, 'B'),
            h('span', { class: 'item-c' }, 'C'),
          ]),
      },
    })

    expect(wrapper.findAll(ns.e('item')).length).toBe(3)
    expect(wrapper.find('.item-a').exists()).toBe(true)
    expect(wrapper.find('.item-c').exists()).toBe(true)
  })

  it('keeps sequential distribution stable', () => {
    const wrapper = mount(Masonry, {
      props: { columns: 2, sequential: true },
      slots: { default: '<span>A</span><span>B</span><span>C</span>' },
    })

    const columns = wrapper.findAll(ns.e('column'))
    expect(columns[0].text()).toBe('AC')
    expect(columns[1].text()).toBe('B')
  })
})
