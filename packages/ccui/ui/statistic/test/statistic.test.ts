import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Statistic, StatisticCountdown } from '../index'

const ns = useNamespace('statistic', true)

describe('statistic', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

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

  it('renders slots and custom value style', () => {
    const wrapper = mount(Statistic, {
      props: { value: 'not-a-number', valueStyle: { color: 'red' } },
      slots: {
        title: '<span class="title-slot">Users</span>',
        prefix: '<span class="prefix-slot">~</span>',
        suffix: '<span class="suffix-slot">total</span>',
      },
    })

    expect(wrapper.find('.title-slot').text()).toBe('Users')
    expect(wrapper.find(ns.e('value-int')).text()).toBe('not-a-number')
    expect(wrapper.find(ns.e('value')).attributes('style')).toContain('color: red')
    expect(wrapper.find('.prefix-slot').text()).toBe('~')
    expect(wrapper.find('.suffix-slot').text()).toBe('total')
  })
})

describe('statistic countdown', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('formats remaining time and emits change and finish', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))

    const wrapper = mount(StatisticCountdown, {
      props: {
        title: 'Remaining',
        value: Date.now() + 1000,
        format: 'ss SSS',
      },
    })

    expect(wrapper.find(ns.e('title')).text()).toBe('Remaining')
    expect(wrapper.find(ns.e('value')).text()).toBe('01 000')

    await vi.advanceTimersByTimeAsync(1100)
    await nextTick()

    expect(wrapper.emitted('change')?.length).toBeGreaterThan(0)
    expect(wrapper.emitted('finish')?.length).toBe(1)
    expect(wrapper.find(ns.e('value')).text()).toBe('00 000')
  })

  it('does not start timer when target is in the past', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    const setIntervalSpy = vi.spyOn(window, 'setInterval')

    const wrapper = mount(StatisticCountdown, {
      props: {
        value: Date.now() - 1000,
        format: 'D H m s',
      },
      slots: {
        prefix: '<span class="count-prefix">T-</span>',
        suffix: '<span class="count-suffix">done</span>',
      },
    })

    expect(setIntervalSpy).not.toHaveBeenCalled()
    expect(wrapper.find(ns.e('value')).text()).toBe('0 0 0 0')
    expect(wrapper.find('.count-prefix').text()).toBe('T-')
    expect(wrapper.find('.count-suffix').text()).toBe('done')
  })
})
