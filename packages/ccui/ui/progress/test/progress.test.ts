import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Progress } from '../index'

const ns = useNamespace('progress', true)

describe('progress', () => {
  it('renders line by default', () => {
    const wrapper = mount(Progress, { props: { percent: 30 } })
    expect(wrapper.find(ns.m('line')).exists()).toBe(true)
    expect(wrapper.text()).toContain('30%')
  })

  it('clamps percent between 0 and 100', () => {
    const wrapper = mount(Progress, {
      props: { percent: 150, format: (p: number) => `${p}%` },
    })
    expect(wrapper.text()).toContain('100%')
  })

  it('hides info when showInfo is false', () => {
    const wrapper = mount(Progress, { props: { percent: 50, showInfo: false } })
    expect(wrapper.find(ns.e('text')).exists()).toBe(false)
  })

  it('renders circle type', () => {
    const wrapper = mount(Progress, { props: { percent: 50, type: 'circle' } })
    expect(wrapper.find(ns.m('circle')).exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('exception status renders error class', () => {
    const wrapper = mount(Progress, { props: { percent: 50, status: 'exception' } })
    expect(wrapper.find(ns.m('status-exception')).exists()).toBe(true)
  })
})
