import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Anchor } from '../index'

const ns = useNamespace('anchor', true)

afterEach(() => {
  document.body.innerHTML = ''
})

describe('anchor', () => {
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

  it('emits click on link click', async () => {
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
})
