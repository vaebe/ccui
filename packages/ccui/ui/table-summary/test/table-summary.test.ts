import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { Table } from '../../table'
import { TableColumn } from '../../table-column'
import { TableSummary } from '../index'

const dataSource = [
  { key: '1', name: '苹果', qty: 10 },
  { key: '2', name: '香蕉', qty: 20 },
]

describe('table-summary', () => {
  it('渲染 tfoot 汇总行', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource },
            {
              default: () => [
                h(TableColumn, { title: '名称', dataIndex: 'name', columnKey: 'name' }),
                h(TableColumn, { title: '数量', dataIndex: 'qty', columnKey: 'qty' }),
                h(TableSummary, null, {
                  default: () => h('tr', { class: 'my-summary-row' }, [h('td', null, '合计'), h('td', null, '30')]),
                }),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.find('tfoot').exists()).toBe(true)
    expect(wrapper.find('tfoot .my-summary-row').exists()).toBe(true)
    expect(wrapper.find('tfoot').text()).toContain('合计')
    expect(wrapper.find('tfoot').text()).toContain('30')
  })

  it('未使用 TableSummary 时 tfoot 不渲染', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource },
            {
              default: () => [h(TableColumn, { title: '名称', dataIndex: 'name', columnKey: 'name' })],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.find('tfoot').exists()).toBe(false)
  })

  it('tfoot 与 tbody / thead 并列存在', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource },
            {
              default: () => [
                h(TableColumn, { title: '名称', dataIndex: 'name', columnKey: 'name' }),
                h(TableSummary, null, {
                  default: () => h('tr', null, [h('td', null, '汇总')]),
                }),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    const table = wrapper.find('table')
    expect(table.find('thead').exists()).toBe(true)
    expect(table.find('tbody').exists()).toBe(true)
    expect(table.find('tfoot').exists()).toBe(true)
  })

  it('卸载组件时移除 tfoot', async () => {
    const Host = defineComponent({
      data: () => ({ showSummary: true }),
      render() {
        const slots = [h(TableColumn, { title: '名称', dataIndex: 'name', columnKey: 'name' })]
        if (this.showSummary) {
          slots.push(
            h(TableSummary, null, {
              default: () => h('tr', null, [h('td', null, '汇总')]),
            }),
          )
        }
        return h(Table, { dataSource }, { default: () => slots })
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.find('tfoot').exists()).toBe(true)
    ;(wrapper.vm as any).showSummary = false
    await nextTick()
    await nextTick()
    expect(wrapper.find('tfoot').exists()).toBe(false)
  })

  it('脱离 Table 父级时不渲染 DOM 节点', () => {
    const wrapper = mount(TableSummary, {
      slots: { default: () => h('tr', null, 'x') },
    })
    expect(wrapper.element.tagName).toBeUndefined()
  })
})
