import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Statistic } from '../index'

const ns = useNamespace('statistic', true)

describe('statistic', () => {
  it('renders title and value', () => {
    const wrapper = mount(Statistic, {
      props: { title: 'Active', value: 1234 },
    })
    expect(wrapper.find(ns.e('title')).text()).toBe('Active')
    expect(wrapper.find(ns.e('value-int')).text()).toBe('1,234')
  })

  it('formats value with custom group separator', () => {
    const wrapper = mount(Statistic, {
      props: { value: 1234567, groupSeparator: ' ' },
    })
    expect(wrapper.find(ns.e('value-int')).text()).toBe('1 234 567')
  })

  it('renders precision', () => {
    const wrapper = mount(Statistic, {
      props: { value: 12.3456, precision: 2 },
    })
    expect(wrapper.find(ns.e('value-int')).text()).toBe('12')
    expect(wrapper.find(ns.e('value-decimal')).text()).toBe('.35')
  })

  it('renders prefix and suffix', () => {
    const wrapper = mount(Statistic, {
      props: { value: 100, prefix: '$', suffix: 'USD' },
    })
    expect(wrapper.find(ns.e('prefix')).text()).toBe('$')
    expect(wrapper.find(ns.e('suffix')).text()).toBe('USD')
  })

  it('renders loading placeholder', () => {
    const wrapper = mount(Statistic, {
      props: { value: 100, loading: true },
    })
    expect(wrapper.find(ns.e('loading')).exists()).toBe(true)
  })
})
