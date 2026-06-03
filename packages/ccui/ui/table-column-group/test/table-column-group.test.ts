import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { Table } from '../../table'
import { TableColumn } from '../../table-column'
import { TableColumnGroup } from '../index'

const dataSource = [
  { key: '1', firstName: '张', lastName: '三', age: 28 },
  { key: '2', firstName: '李', lastName: '四', age: 32 },
]

describe('table-column-group', () => {
  it('双行 thead：组标题 colspan = 子列数 + 子列另起一行', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource },
            {
              default: () => [
                h(
                  TableColumnGroup,
                  { title: '姓名' },
                  {
                    default: () => [
                      h(TableColumn, { title: '姓', dataIndex: 'firstName', columnKey: 'firstName' }),
                      h(TableColumn, { title: '名', dataIndex: 'lastName', columnKey: 'lastName' }),
                    ],
                  },
                ),
                h(TableColumn, { title: '年龄', dataIndex: 'age', columnKey: 'age' }),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    const headerRows = wrapper.findAll('thead tr')
    expect(headerRows).toHaveLength(2)
    // 顶层行：组 th（colspan=2）+ 年龄 th（rowspan=2）
    const topThs = headerRows[0].findAll('th')
    expect(topThs).toHaveLength(2)
    expect(topThs[0].text()).toContain('姓名')
    expect(topThs[0].attributes('colspan')).toBe('2')
    expect(topThs[1].text()).toContain('年龄')
    expect(topThs[1].attributes('rowspan')).toBe('2')
    // 底层行：两个子叶子列
    const bottomThs = headerRows[1].findAll('th')
    expect(bottomThs).toHaveLength(2)
    expect(bottomThs[0].text()).toContain('姓')
    expect(bottomThs[1].text()).toContain('名')
  })

  it('tbody 渲染叶子列单元格（不渲染组本身的列）', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource },
            {
              default: () => [
                h(
                  TableColumnGroup,
                  { title: '姓名' },
                  {
                    default: () => [
                      h(TableColumn, { title: '姓', dataIndex: 'firstName', columnKey: 'firstName' }),
                      h(TableColumn, { title: '名', dataIndex: 'lastName', columnKey: 'lastName' }),
                    ],
                  },
                ),
                h(TableColumn, { title: '年龄', dataIndex: 'age', columnKey: 'age' }),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    const firstRow = wrapper.findAll('tbody tr')[0]
    expect(firstRow.findAll('td')).toHaveLength(3)
    expect(firstRow.text()).toContain('张')
    expect(firstRow.text()).toContain('三')
    expect(firstRow.text()).toContain('28')
  })

  it('无分组时退化为单行 thead', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource },
            {
              default: () => [h(TableColumn, { title: '年龄', dataIndex: 'age', columnKey: 'age' })],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.findAll('thead tr')).toHaveLength(1)
  })

  it('group 标题 th 带 --group modifier class', async () => {
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource },
            {
              default: () => [
                h(
                  TableColumnGroup,
                  { title: '组' },
                  {
                    default: () => [h(TableColumn, { title: 'A', dataIndex: 'firstName', columnKey: 'a' })],
                  },
                ),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    const topTh = wrapper.findAll('thead tr')[0].find('th')
    expect(topTh.classes().some((c) => c.includes('group'))).toBe(true)
  })

  it('脱离 Table 父级时不抛错（warn 不验证）', () => {
    const wrapper = mount(TableColumnGroup, {
      props: { title: 'standalone' },
      slots: { default: () => [] },
    })
    expect(wrapper.html()).not.toContain('<table>')
  })
})
