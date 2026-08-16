import { mount } from '@vue/test-utils'
import { defineComponent, Fragment, h, nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { Table } from '../../table'
import { tableColumnsCollectorKey } from '../../table/src/table-types'
import { TableColumn } from '../../table-column'
import { TableColumnGroup } from '../index'

const dataSource = [
  { key: '1', firstName: '张', lastName: '三', age: 28 },
  { key: '2', firstName: '李', lastName: '四', age: 32 },
]

describe('table-column-group', () => {
  it('顶层 keyed Group 仅重排时保持与最新声明顺序一致', async () => {
    const groups = ref<Array<'firstName' | 'lastName'>>(['firstName', 'lastName'])
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource: [dataSource[0]] },
            {
              default: () =>
                groups.value.map((field) =>
                  h(
                    TableColumnGroup,
                    { key: field, title: field === 'firstName' ? '姓氏组' : '名字组' },
                    {
                      default: () => [h(TableColumn, { title: field, dataIndex: field, columnKey: field })],
                    },
                  ),
                ),
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()

    groups.value = ['lastName', 'firstName']
    await nextTick()
    await nextTick()

    expect(
      wrapper
        .findAll('thead tr')[0]
        .findAll('th')
        .map((cell) => cell.text()),
    ).toEqual(['名字组', '姓氏组'])
    expect(
      wrapper
        .findAll('tbody tr')[0]
        .findAll('td')
        .map((cell) => cell.text()),
    ).toEqual(['三', '张'])
  })

  it('顶层 Group 与普通列跨位置重排时保持同一声明顺序', async () => {
    const groupFirst = ref(true)
    const Host = defineComponent({
      setup() {
        return () => {
          const group = h(
            TableColumnGroup,
            { key: 'name-group', title: '姓名组' },
            {
              default: () => [h(TableColumn, { title: '姓', dataIndex: 'firstName', columnKey: 'firstName' })],
            },
          )
          const age = h(TableColumn, { key: 'age', title: '年龄', dataIndex: 'age', columnKey: 'age' })
          return h(
            Table,
            { dataSource: [dataSource[0]] },
            { default: () => (groupFirst.value ? [group, age] : [age, group]) },
          )
        }
      },
    })
    const wrapper = mount(Host)
    await nextTick()

    groupFirst.value = false
    await nextTick()
    await nextTick()

    expect(
      wrapper
        .findAll('thead tr')[0]
        .findAll('th')
        .map((cell) => cell.text()),
    ).toEqual(['年龄', '姓名组'])
    expect(
      wrapper
        .findAll('tbody tr')[0]
        .findAll('td')
        .map((cell) => cell.text()),
    ).toEqual(['28', '张'])
  })

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
    expect(topThs[0].attributes('scope')).toBe('colgroup')
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

  it('组内 keyed 子列仅重排时保持与最新声明顺序一致', async () => {
    const fields = ref<Array<'firstName' | 'lastName'>>(['firstName', 'lastName'])
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource: [dataSource[0]] },
            {
              default: () => [
                h(
                  TableColumnGroup,
                  { title: '姓名' },
                  {
                    default: () => [
                      h(Fragment, null, [
                        h('span', { class: 'ignored-group-slot-node' }, '不参与列收集'),
                        ...fields.value.map((field) =>
                          h(TableColumn, {
                            key: field,
                            title: field === 'firstName' ? '姓' : '名',
                            dataIndex: field,
                            columnKey: field,
                          }),
                        ),
                      ]),
                    ],
                  },
                ),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(
      wrapper
        .findAll('thead tr')[1]
        .findAll('th')
        .map((cell) => cell.text()),
    ).toEqual(['姓', '名'])

    fields.value = ['lastName', 'firstName']
    await nextTick()
    await nextTick()

    expect(
      wrapper
        .findAll('thead tr')[1]
        .findAll('th')
        .map((cell) => cell.text()),
    ).toEqual(['名', '姓'])
    expect(
      wrapper
        .findAll('tbody tr')[0]
        .findAll('td')
        .map((cell) => cell.text()),
    ).toEqual(['三', '张'])
  })

  it('最后一个子列移除时注销空 Group，重新添加时恢复注册', async () => {
    const showChild = ref(true)
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource: [dataSource[0]] },
            {
              default: () => [
                h(
                  TableColumnGroup,
                  { title: '姓名' },
                  {
                    default: () =>
                      showChild.value
                        ? [h(TableColumn, { title: '姓', dataIndex: 'firstName', columnKey: 'firstName' })]
                        : [],
                  },
                ),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.findAll('thead th').map((cell) => cell.text())).toEqual(['姓名', '姓'])

    showChild.value = false
    await nextTick()
    await nextTick()
    expect(wrapper.findAll('thead th')).toHaveLength(0)

    showChild.value = true
    await nextTick()
    await nextTick()
    expect(wrapper.findAll('thead th').map((cell) => cell.text())).toEqual(['姓名', '姓'])
    expect(wrapper.find('tbody td').text()).toBe('张')
  })

  it('动态 title、align、fixed 与 onHeaderCell 更新会传递到组表头', async () => {
    const emphasized = ref(false)
    const useHeaderCell = ref(true)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource: [dataSource[0]] },
            {
              default: () => [
                h(
                  TableColumnGroup,
                  {
                    title: emphasized.value ? '更新姓名' : '姓名',
                    align: emphasized.value ? 'right' : 'left',
                    fixed: emphasized.value ? 'left' : undefined,
                    // 捕获本次 render 的快照，避免旧 closure 读取共享 ref 后让断言误通过。
                    onHeaderCell: useHeaderCell.value
                      ? (() => {
                          const headerClass = emphasized.value ? 'updated-group-header' : 'initial-group-header'
                          return () => ({ class: headerClass })
                        })()
                      : undefined,
                  },
                  {
                    default: () => [h(TableColumn, { title: '姓', dataIndex: 'firstName', columnKey: 'firstName' })],
                  },
                ),
              ],
            },
          )
      },
    })
    try {
      const wrapper = mount(Host)
      await nextTick()

      emphasized.value = true
      await nextTick()
      await nextTick()

      let groupHeader = wrapper.findAll('thead tr')[0].find('th')
      expect(groupHeader.text()).toContain('更新姓名')
      expect(groupHeader.classes()).toContain('updated-group-header')
      expect(groupHeader.classes().some((name) => name.includes('right'))).toBe(true)
      expect(groupHeader.classes().some((name) => name.includes('fixed-left'))).toBe(true)

      useHeaderCell.value = false
      await nextTick()
      await nextTick()
      groupHeader = wrapper.findAll('thead tr')[0].find('th')
      expect(groupHeader.classes()).not.toContain('updated-group-header')

      useHeaderCell.value = true
      await nextTick()
      await nextTick()
      groupHeader = wrapper.findAll('thead tr')[0].find('th')
      expect(groupHeader.classes()).toContain('updated-group-header')
      expect(warn.mock.calls.flat().some((args) => String(args).includes('Maximum recursive updates'))).toBe(false)
    } finally {
      warn.mockRestore()
    }
  })

  it('稳定 onHeaderCell 函数从 fnA 切换为 fnB 时更新组表头', async () => {
    const useSecond = ref(false)
    const fnA = () => ({ class: 'header-a' })
    const fnB = () => ({ class: 'header-b' })
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            Table,
            { dataSource: [dataSource[0]] },
            {
              default: () => [
                h(
                  TableColumnGroup,
                  { title: '姓名', onHeaderCell: useSecond.value ? fnB : fnA },
                  {
                    default: () => [h(TableColumn, { title: '姓', dataIndex: 'firstName', columnKey: 'firstName' })],
                  },
                ),
              ],
            },
          )
      },
    })
    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.findAll('thead tr')[0].find('th').classes()).toContain('header-a')

    useSecond.value = true
    await nextTick()
    await nextTick()

    const groupHeader = wrapper.findAll('thead tr')[0].find('th')
    expect(groupHeader.classes()).toContain('header-b')
    expect(groupHeader.classes()).not.toContain('header-a')
  })

  it('卸载 Group 时对 outer collector 的同一 id 只注销一次', async () => {
    const register = vi.fn()
    const unregister = vi.fn()
    const outerCollector = {
      register,
      unregister,
      refresh: vi.fn(),
      updateOrder: vi.fn(),
    }
    const wrapper = mount(TableColumnGroup, {
      props: { title: '姓名' },
      slots: {
        default: () => [h(TableColumn, { title: '姓', dataIndex: 'firstName', columnKey: 'firstName' })],
      },
      global: {
        provide: {
          [tableColumnsCollectorKey as symbol]: outerCollector,
        },
      },
    })
    await nextTick()
    expect(register).toHaveBeenCalledTimes(1)
    const registeredId = register.mock.calls[0][0]

    wrapper.unmount()

    expect(unregister).toHaveBeenCalledTimes(1)
    expect(unregister).toHaveBeenCalledWith(registeredId)
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

  it('组内列 customRender slot 有无双向切换时刷新单元格且不递归更新', async () => {
    const showSlot = ref(true)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const Host = defineComponent({
      setup() {
        const propRender = ({ text }: any) => `prop-${text}`
        return () =>
          h(
            Table,
            { dataSource: [dataSource[0]] },
            {
              default: () => [
                h(
                  TableColumnGroup,
                  { title: '姓名' },
                  {
                    default: () => [
                      h(
                        TableColumn,
                        { title: '姓', dataIndex: 'firstName', columnKey: 'firstName', customRender: propRender },
                        showSlot.value ? { customRender: ({ text }: any) => `slot-${text}` } : undefined,
                      ),
                    ],
                  },
                ),
              ],
            },
          )
      },
    })

    try {
      const wrapper = mount(Host)
      await nextTick()
      expect(wrapper.find('tbody td').text()).toBe('slot-张')

      showSlot.value = false
      await nextTick()
      await nextTick()
      expect(wrapper.find('tbody td').text()).toBe('prop-张')

      showSlot.value = true
      await nextTick()
      await nextTick()
      expect(wrapper.find('tbody td').text()).toBe('slot-张')
      expect(warn.mock.calls.flat().some((args) => String(args).includes('Maximum recursive updates'))).toBe(false)
    } finally {
      warn.mockRestore()
    }
  })

  it('脱离 Table 父级时不抛错（warn 不验证）', () => {
    const wrapper = mount(TableColumnGroup, {
      props: { title: 'standalone' },
      slots: { default: () => [] },
    })
    expect(wrapper.html()).not.toContain('<table>')
  })
})
