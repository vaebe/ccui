import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Descriptions, DescriptionsItem } from '../index'

const ns = useNamespace('descriptions', true)

describe('descriptions', () => {
  it('renders items via items prop', () => {
    const wrapper = mount(Descriptions, {
      props: {
        column: 3,
        items: [
          { label: 'Name', value: 'Alice' },
          { label: 'Age', value: 28 },
          { label: 'City', value: 'Beijing' },
        ],
      },
    })
    expect(wrapper.findAll(ns.e('label')).length).toBe(3)
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('Beijing')
  })

  it('renders title and extra', () => {
    const wrapper = mount(Descriptions, {
      props: {
        title: 'User Info',
        extra: 'Edit',
        items: [{ label: 'A', value: 'B' }],
      },
    })
    expect(wrapper.find(ns.e('title')).text()).toBe('User Info')
    expect(wrapper.find(ns.e('extra')).text()).toBe('Edit')
  })

  it('applies bordered modifier', () => {
    const wrapper = mount(Descriptions, {
      props: {
        bordered: true,
        items: [{ label: 'A', value: 'B' }],
      },
    })
    expect(wrapper.find(ns.m('bordered')).exists()).toBe(true)
  })

  it('respects column count', () => {
    const wrapper = mount(Descriptions, {
      props: {
        column: 2,
        items: [
          { label: 'A', value: '1' },
          { label: 'B', value: '2' },
          { label: 'C', value: '3' },
        ],
      },
    })
    expect(wrapper.findAll(ns.e('row')).length).toBe(2)
  })

  it('renders vertical layout with separate label and content rows', () => {
    const wrapper = mount(Descriptions, {
      props: {
        layout: 'vertical',
        column: 2,
        items: [
          { label: 'A', value: '1' },
          { label: 'B', value: '2' },
        ],
      },
    })
    // vertical adds class modifier
    expect(wrapper.find(ns.m('vertical')).exists()).toBe(true)
    // each "row" of items in vertical layout renders 2 <tr> (label+content)
    expect(wrapper.findAll(ns.e('row')).length).toBe(2)
  })

  it('honors item span (last item fills remaining columns)', () => {
    const wrapper = mount(Descriptions, {
      props: {
        column: 3,
        items: [
          { label: 'A', value: '1' },
          { label: 'B', value: '2' },
        ],
      },
    })
    const lastCell = wrapper.findAll(ns.e('cell'))[1].element as HTMLTableCellElement
    expect(Number(lastCell.getAttribute('colspan'))).toBeGreaterThanOrEqual(2)
  })

  it('collects items from DescriptionsItem child slots', () => {
    const wrapper = mount(Descriptions, {
      props: { column: 2 },
      slots: {
        default: () => [
          h(DescriptionsItem, { label: 'A' }, { default: () => '1' }),
          h(DescriptionsItem, { label: 'B' }, { default: () => '2' }),
        ],
      },
    })
    expect(wrapper.findAll(ns.e('label')).length).toBe(2)
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('2')
  })

  it('omits colon when colon=false', () => {
    const wrapper = mount(Descriptions, {
      props: {
        colon: false,
        items: [{ label: 'Name', value: 'Alice' }],
      },
    })
    expect(wrapper.find(ns.e('label')).text()).toBe('Name')
  })

  it('renders nothing in header when no title/extra/slots', () => {
    const wrapper = mount(Descriptions, {
      props: { items: [{ label: 'A', value: '1' }] },
    })
    expect(wrapper.find(ns.e('header')).exists()).toBe(false)
  })
})
