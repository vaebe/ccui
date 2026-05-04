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
    expect(wrapper.findAll(`${ns.e('paragraph')} li`).length).toBe(5)
  })
})
