import { mount } from '@vue/test-utils'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Steps } from '../index'
import type { StepItem, StepsDirection, StepsProps, StepsSize, StepsType, StepStatus } from '../index'

const ns = useNamespace('steps', true)

describe('steps', () => {
  it('从入口导出文档公开的 Steps 类型', () => {
    expectTypeOf<StepItem>().toMatchTypeOf<{ disabled?: boolean; status?: StepStatus }>()
    expectTypeOf<StepsProps['items']>().toMatchTypeOf<StepItem[]>()
    expectTypeOf<StepsProps['direction']>().toEqualTypeOf<StepsDirection>()
    expectTypeOf<StepsProps['size']>().toEqualTypeOf<StepsSize>()
    expectTypeOf<StepsProps['type']>().toEqualTypeOf<StepsType>()
  })

  it('renders all items', () => {
    const wrapper = mount(Steps, {
      props: {
        current: 0,
        items: [{ title: 'A' }, { title: 'B' }, { title: 'C' }],
      },
    })
    expect(wrapper.findAll(ns.e('item')).length).toBe(3)
  })

  it('marks finished and process items correctly', () => {
    const wrapper = mount(Steps, {
      props: {
        current: 1,
        items: [{ title: 'A' }, { title: 'B' }, { title: 'C' }],
      },
    })
    expect(wrapper.findAll(ns.em('item', 'finish')).length).toBe(1)
    expect(wrapper.findAll(ns.em('item', 'process')).length).toBe(1)
    expect(wrapper.findAll(ns.em('item', 'wait')).length).toBe(1)
  })

  it('emits update:current on click', async () => {
    const wrapper = mount(Steps, {
      props: {
        current: 0,
        items: [{ title: 'A' }, { title: 'B' }],
      },
    })
    await wrapper.findAll(ns.e('item'))[1].trigger('click')
    expect(wrapper.emitted('update:current')?.[0]).toEqual([1])
    expect(wrapper.emitted('change')?.[0]).toEqual([1])
  })

  it('allows keyboard activation while keeping disabled steps out of the tab order', async () => {
    const wrapper = mount(Steps, {
      props: {
        current: 0,
        items: [{ title: 'A' }, { title: 'B', disabled: true }],
      },
    })
    const items = wrapper.findAll(ns.e('item'))

    expect(items[0].attributes('tabindex')).toBe('0')
    expect(items[1].attributes('tabindex')).toBe('-1')
    expect(items[1].attributes('aria-disabled')).toBe('true')

    await items[0].trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:current')).toEqual([[0]])
    expect(wrapper.emitted('change')).toEqual([[0]])
  })

  it('does not emit on disabled item', async () => {
    const wrapper = mount(Steps, {
      props: {
        current: 0,
        items: [{ title: 'A' }, { title: 'B', disabled: true }],
      },
    })
    await wrapper.findAll(ns.e('item'))[1].trigger('click')
    expect(wrapper.emitted('update:current')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('respects custom item status', () => {
    const wrapper = mount(Steps, {
      props: {
        current: 0,
        items: [{ title: 'A', status: 'error' }, { title: 'B' }],
      },
    })
    expect(wrapper.findAll(ns.em('item', 'error')).length).toBe(1)
  })

  it('marks the current step with aria-current and exposes per-step label', () => {
    const wrapper = mount(Steps, {
      props: {
        current: 1,
        items: [{ title: '登录' }, { title: '校验' }, { title: '完成' }],
      },
    })
    const items = wrapper.findAll(ns.e('item'))
    expect(items[0].attributes('aria-current')).toBeUndefined()
    expect(items[1].attributes('aria-current')).toBe('step')
    expect(items[1].attributes('aria-label')).toBe('步骤 2：校验')
    expect(items[2].attributes('aria-label')).toBe('步骤 3：完成')
  })
})
