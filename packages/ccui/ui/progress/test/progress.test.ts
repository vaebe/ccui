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

  it('renders success icon automatically at 100 percent', () => {
    const wrapper = mount(Progress, { props: { percent: 100 } })
    expect(wrapper.find(ns.m('status-success')).exists()).toBe(true)
    expect(wrapper.find(ns.e('status-icon')).exists()).toBe(true)
  })

  it('clamps NaN and negative percent to zero', () => {
    const wrapper = mount(Progress, {
      props: { percent: Number.NaN, format: (p: number) => `value:${p}` },
    })
    expect(wrapper.text()).toContain('value:0')

    const negative = mount(Progress, {
      props: { percent: -10, format: (p: number) => `value:${p}` },
    })
    expect(negative.text()).toContain('value:0')
  })

  it('applies small size stroke colors and custom stroke width on line progress', () => {
    const wrapper = mount(Progress, {
      props: {
        percent: 40,
        size: 'small',
        strokeColor: 'red',
        trailColor: 'blue',
        strokeWidth: 12,
      },
    })
    const inner = wrapper.find(ns.e('inner'))
    const bg = wrapper.find(ns.e('bg'))

    expect(wrapper.find(ns.m('small')).exists()).toBe(true)
    expect(inner.attributes('style')).toContain('height: 12px')
    expect(inner.attributes('style')).toContain('background-color: blue')
    expect(bg.attributes('style')).toContain('width: 40%')
    expect(bg.attributes('style')).toContain('background-color: red')
    expect(bg.attributes('style')).toContain('height: 12px')
  })

  it('applies numeric thickness and tuple width/thickness without prop coercion', () => {
    const numeric = mount(Progress, { props: { percent: 60, size: 16 } })
    expect(numeric.find(ns.e('inner')).attributes('style')).toContain('height: 16px')
    expect(numeric.find(ns.e('bg')).attributes('style')).toContain('height: 16px')

    const tuple = mount(Progress, { props: { percent: 60, size: [240, 12] } })
    expect(tuple.attributes('style')).toContain('width: 240px')
    expect(tuple.find(ns.e('inner')).attributes('style')).toContain('height: 12px')
  })

  it('renders dashboard progress with custom width and slot formatter', () => {
    const wrapper = mount(Progress, {
      props: { type: 'dashboard', percent: 25, width: 80, strokeWidth: 10, trailColor: 'gray' },
      slots: {
        format: ({ percent }: { percent: number }) => `${percent} done`,
      },
    })

    expect(wrapper.find(ns.m('dashboard')).exists()).toBe(true)
    expect(wrapper.attributes('style')).toContain('width: 80px')
    expect(wrapper.find(ns.e('inner-text')).text()).toBe('25 done')
    expect(wrapper.findAll('circle')[0].attributes('stroke')).toBe('gray')
  })

  it('renders explicit active status without status icon', () => {
    const wrapper = mount(Progress, { props: { percent: 50, status: 'active' } })
    expect(wrapper.find(ns.m('status-active')).exists()).toBe(true)
    expect(wrapper.find(ns.e('status-icon')).exists()).toBe(false)
    expect(wrapper.text()).toContain('50%')
  })

  it('exposes progress semantics, attrs, and finite percent clamping', () => {
    const wrapper = mount(Progress, {
      attrs: { id: 'upload-progress', 'aria-label': 'Upload' },
      props: { percent: Number.POSITIVE_INFINITY },
    })
    const root = wrapper.element
    expect(root.getAttribute('role')).toBe('progressbar')
    expect(root.getAttribute('aria-valuenow')).toBe('0')
    expect(root.getAttribute('aria-label')).toBe('Upload')
    expect(root.id).toBe('upload-progress')
  })
})
