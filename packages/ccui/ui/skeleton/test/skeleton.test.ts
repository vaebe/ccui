import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Skeleton } from '../index'

const ns = useNamespace('skeleton', true)

describe('skeleton', () => {
  it('renders title and paragraph by default', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.find(ns.e('title')).exists()).toBe(true)
    expect(wrapper.find(ns.e('paragraph')).exists()).toBe(true)
  })

  it('renders avatar when enabled', () => {
    const wrapper = mount(Skeleton, { props: { avatar: true } })
    expect(wrapper.find(ns.e('avatar')).exists()).toBe(true)
  })

  it('shows children when loading is false', () => {
    const wrapper = mount(Skeleton, { props: { loading: false }, slots: { default: '<div class="real">x</div>' } })
    expect(wrapper.find('.real').exists()).toBe(true)
    expect(wrapper.find(ns.b()).exists()).toBe(false)
  })

  it('active modifier toggles animation class', () => {
    const wrapper = mount(Skeleton, { props: { active: true } })
    expect(wrapper.find(ns.m('active')).exists()).toBe(true)
  })

  it('respects paragraph rows config', () => {
    const wrapper = mount(Skeleton, { props: { paragraph: { rows: 5 } } })
    expect(wrapper.findAll(ns.e('paragraph-row')).length).toBe(5)
  })

  it('applies round and avatar shape styles', () => {
    const wrapper = mount(Skeleton, {
      props: {
        round: true,
        avatar: { shape: 'square', size: 'large' },
      },
    })

    expect(wrapper.find(ns.m('round')).exists()).toBe(true)
    expect(wrapper.find(ns.m('with-avatar')).exists()).toBe(true)
    expect(wrapper.find(ns.e('avatar')).attributes('style')).toContain('width: 40px')
    expect(wrapper.find(ns.e('avatar')).attributes('style')).toContain('border-radius: 4px')
  })

  it('supports numeric avatar size and title width', () => {
    const wrapper = mount(Skeleton, {
      props: {
        avatar: { size: 48 },
        title: { width: 120 },
      },
    })

    expect(wrapper.find(ns.e('avatar')).attributes('style')).toContain('width: 48px')
    expect(wrapper.find(ns.e('title')).attributes('style')).toContain('width: 120px')
  })

  it('supports paragraph width array and disabled paragraph', () => {
    const wrapper = mount(Skeleton, {
      props: {
        paragraph: { rows: 3, width: ['80%', 120] },
      },
    })

    const rows = wrapper.findAll(ns.e('paragraph-row'))
    expect(rows[0].attributes('style')).toContain('width: 80%')
    expect(rows[1].attributes('style')).toContain('width: 120px')
    expect(rows[2].attributes('style')).toBeUndefined()

    const noParagraph = mount(Skeleton, { props: { paragraph: false } })
    expect(noParagraph.find(ns.e('paragraph')).exists()).toBe(false)
  })

  it('supports paragraph last row width and hidden title', () => {
    const wrapper = mount(Skeleton, {
      props: {
        title: false,
        paragraph: { rows: 2, width: '50%' },
      },
    })

    const rows = wrapper.findAll(ns.e('paragraph-row'))
    expect(wrapper.find(ns.e('title')).exists()).toBe(false)
    expect(rows[0].attributes('style') ?? '').toBe('')
    expect(rows[1].attributes('style')).toContain('width: 50%')
  })
})
