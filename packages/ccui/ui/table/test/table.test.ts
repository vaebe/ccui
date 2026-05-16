import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Table } from '../index'

const ns = useNamespace('table', true)

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name', sorter: true },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    filters: [
      { text: 'Admin', value: 'admin' },
      { text: 'User', value: 'user' },
    ],
    filterMultiple: false,
  },
  { title: 'Age', dataIndex: 'age', key: 'age', sorter: (a: any, b: any) => a.age - b.age },
]

const dataSource = [
  { key: '1', name: 'Tom', role: 'user', age: 28 },
  { key: '2', name: 'Alice', role: 'admin', age: 32 },
  { key: '3', name: 'Bob', role: 'user', age: 24 },
]

function rowTexts(wrapper: ReturnType<typeof mount>): string[] {
  return wrapper.findAll('tbody tr').map((row) => row.text())
}

function asInput(element: Element): HTMLInputElement {
  return element as HTMLInputElement
}

describe('table', () => {
  it('renders columns and rows', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource },
    })

    expect(wrapper.findAll('th')).toHaveLength(3)
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
    expect(wrapper.text()).toContain('Alice')
  })

  it('reads nested dataIndex paths', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          { title: 'City', dataIndex: 'profile.city', key: 'city' },
          { title: 'Zip', dataIndex: ['profile', 'zip'], key: 'zip' },
        ],
        dataSource: [{ key: '1', profile: { city: 'Shanghai', zip: '200000' } }],
      },
    })

    expect(wrapper.text()).toContain('Shanghai')
    expect(wrapper.text()).toContain('200000')
  })

  it('falls back to row index when rowKey value is missing', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name', key: 'name' }],
        dataSource: [{ name: 'No key' }],
        rowKey: 'id',
      },
    })

    expect(wrapper.find('tbody tr').attributes('data-v-app')).toBeUndefined()
    expect(rowTexts(wrapper)).toEqual(['No key'])
  })

  it('uses rowKey functions for stable row identity', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name', key: 'name' }],
        dataSource: [{ id: 'row-a', name: 'Alice' }],
        rowKey: (record: any) => record.id,
      },
    })

    expect(rowTexts(wrapper)).toEqual(['Alice'])
  })

  it('renders custom body cells', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource },
      slots: {
        bodyCell: ({ text, column }: any) => (column.key === 'name' ? `User: ${text}` : text),
      },
    })

    expect(wrapper.text()).toContain('User: Tom')
  })

  it('uses column customRender when bodyCell slot is not provided', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name', key: 'name', customRender: ({ text }: any) => `Name=${text}` }],
        dataSource,
      },
    })

    expect(wrapper.text()).toContain('Name=Tom')
  })

  it('lets bodyCell slot override column customRender', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name', key: 'name', customRender: ({ text }: any) => `Name=${text}` }],
        dataSource,
      },
      slots: {
        bodyCell: ({ text }: any) => `Slot=${text}`,
      },
    })

    expect(wrapper.text()).toContain('Slot=Tom')
    expect(wrapper.text()).not.toContain('Name=Tom')
  })

  it('renders custom header cells', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource },
      slots: {
        headerCell: ({ column }: any) => `Column: ${column.title}`,
      },
    })

    expect(wrapper.find('thead').text()).toContain('Column: Name')
  })

  it('does not emit sorting events for non-sortable headers', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource },
    })

    await wrapper.findAll('th')[1].trigger('click')

    expect(wrapper.emitted('update:sorter')).toBeUndefined()
    expect(rowTexts(wrapper)[0]).toContain('Tom')
  })

  it('does not trigger sorting when clicking a filter control inside a sortable header', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            sorter: true,
            filters: [
              { text: 'Admin', value: 'admin' },
              { text: 'User', value: 'user' },
            ],
          },
        ],
        dataSource,
      },
    })

    await wrapper.find('select').trigger('click')

    expect(wrapper.emitted('update:sorter')).toBeUndefined()
  })

  it('sorts rows by clicking sortable header', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource },
    })

    await wrapper.findAll('th')[0].trigger('click')
    expect(wrapper.findAll('tbody tr')[0].text()).toContain('Alice')
    expect(wrapper.emitted('update:sorter')?.[0][0]).toMatchObject({ columnKey: 'name', order: 'ascend' })

    await wrapper.findAll('th')[0].trigger('click')
    expect(wrapper.findAll('tbody tr')[0].text()).toContain('Tom')
    expect(wrapper.emitted('update:sorter')?.[1][0]).toMatchObject({ columnKey: 'name', order: 'descend' })
  })

  it('clears sorting on the third sortable header click', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource },
    })

    await wrapper.findAll('th')[0].trigger('click')
    await wrapper.findAll('th')[0].trigger('click')
    await wrapper.findAll('th')[0].trigger('click')

    expect(rowTexts(wrapper)[0]).toContain('Tom')
    expect(wrapper.emitted('update:sorter')?.[2][0]).toMatchObject({ columnKey: 'name', order: null })
  })

  it('sorts with a function sorter', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource },
    })

    await wrapper.findAll('th')[2].trigger('click')
    expect(rowTexts(wrapper)[0]).toContain('Bob')

    await wrapper.findAll('th')[2].trigger('click')
    expect(rowTexts(wrapper)[0]).toContain('Alice')
  })

  it('uses externally provided sortOrder from columns', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          { title: 'Name', dataIndex: 'name', key: 'name', sorter: true, sortOrder: 'descend' },
          { title: 'Role', dataIndex: 'role', key: 'role' },
        ],
        dataSource,
      },
    })

    expect(rowTexts(wrapper)[0]).toContain('Tom')
    expect(wrapper.find(ns.em('th', 'descend')).exists()).toBe(true)
  })

  it('responds to externally provided sortOrder prop changes', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name', key: 'name', sorter: true }],
        dataSource,
      },
    })

    await wrapper.setProps({
      columns: [{ title: 'Name', dataIndex: 'name', key: 'name', sorter: true, sortOrder: 'ascend' }],
    })

    expect(rowTexts(wrapper)[0]).toContain('Alice')
    expect(wrapper.find(ns.em('th', 'ascend')).exists()).toBe(true)
  })

  it('derives sorter columnKey from dataIndex when key is absent', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name', sorter: true }],
        dataSource,
      },
    })

    await wrapper.find('th').trigger('click')

    expect(wrapper.emitted('update:sorter')?.[0][0]).toMatchObject({ columnKey: 'name', order: 'ascend' })
  })

  it('derives sorter columnKey from column index when key and dataIndex are absent', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Virtual', sorter: true, customRender: ({ index }: any) => index }],
        dataSource,
      },
    })

    await wrapper.find('th').trigger('click')

    expect(wrapper.emitted('update:sorter')?.[0][0]).toMatchObject({ columnKey: '0', order: 'ascend' })
  })

  it('filters rows with column filters', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource },
    })
    const filter = wrapper.find('select')

    await filter.setValue('0')
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(rowTexts(wrapper)).toEqual(['Aliceadmin32'])
    expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({ role: ['admin'] })
  })

  it('clears single-select filters', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource },
    })
    const filter = wrapper.find('select')

    await filter.setValue('0')
    await filter.setValue('')

    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
    expect(wrapper.emitted('update:filters')?.[1][0]).toEqual({ role: [] })
  })

  it('supports multi-select filters', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            filters: [
              { text: 'Admin', value: 'admin' },
              { text: 'User', value: 'user' },
            ],
          },
        ],
        dataSource,
      },
    })

    await wrapper.find('select').setValue(['1'])
    expect(rowTexts(wrapper)).toHaveLength(2)
    expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({ role: ['user'] })
  })

  it('preserves number and boolean filter values', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          {
            title: 'Active',
            dataIndex: 'active',
            key: 'active',
            filterMultiple: false,
            filters: [
              { text: 'Active', value: true },
              { text: 'Inactive', value: false },
            ],
          },
          {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            filters: [
              { text: 'Level 1', value: 1 },
              { text: 'Level 2', value: 2 },
            ],
          },
        ],
        dataSource: [
          { key: '1', active: true, level: 1 },
          { key: '2', active: false, level: 2 },
        ],
      },
    })

    await wrapper.findAll('select')[0].setValue('0')
    expect(rowTexts(wrapper)).toEqual(['true1'])
    expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({ active: [true] })

    await wrapper.findAll('select')[1].setValue(['0'])
    expect(wrapper.emitted('update:filters')?.[1][0]).toEqual({ active: [true], level: [1] })
  })

  it('applies multiple column filters with AND semantics', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            filterMultiple: false,
            filters: [
              { text: 'Admin', value: 'admin' },
              { text: 'User', value: 'user' },
            ],
          },
          {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            filterMultiple: false,
            filters: [
              { text: '24', value: 24 },
              { text: '28', value: 28 },
            ],
          },
        ],
        dataSource,
      },
    })

    await wrapper.findAll('select')[0].setValue('1')
    await wrapper.findAll('select')[1].setValue('0')

    expect(rowTexts(wrapper)).toEqual(['user24'])
  })

  it('uses externally provided filteredValue from columns', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { ...columns[1], filteredValue: ['admin'] },
        ],
        dataSource,
      },
    })

    expect(rowTexts(wrapper)).toHaveLength(1)
    expect(wrapper.text()).toContain('Alice')
  })

  it('responds to externally provided filteredValue prop changes', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { ...columns[1], filteredValue: ['admin'] },
          { title: 'Age', dataIndex: 'age', key: 'age' },
        ],
        dataSource,
      },
    })

    await wrapper.setProps({
      columns: [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { ...columns[1], filteredValue: ['user'] },
        { title: 'Age', dataIndex: 'age', key: 'age' },
      ],
    })

    expect(rowTexts(wrapper)).toHaveLength(2)
    expect(rowTexts(wrapper)).toEqual(['Tomuser28', 'Bobuser24'])
  })

  it('emits change with filters, sorter, and current data on sort', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource },
    })

    await wrapper.findAll('th')[0].trigger('click')
    const payload = wrapper.emitted('change')?.[0]

    expect(payload?.[0]).toEqual({})
    expect(payload?.[1]).toMatchObject({ columnKey: 'name', order: 'ascend' })
    const sortedPayload = payload?.[2] as any[]
    expect(sortedPayload.map((item: any) => item.name)).toEqual(['Alice', 'Bob', 'Tom'])
  })

  it('emits change with filtered data after filtering', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource },
    })

    await wrapper.find('select').setValue('0')
    const payload = wrapper.emitted('change')?.[0]

    expect(payload?.[0]).toEqual({ role: ['admin'] })
    const filteredPayload = payload?.[2] as any[]
    expect(filteredPayload.map((item) => item.name)).toEqual(['Alice'])
    expect(rowTexts(wrapper)).toEqual(['Aliceadmin32'])
  })

  it('sorts filtered data without bringing filtered-out rows back', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource },
    })

    await wrapper.find('select').setValue('1')
    await wrapper.findAll('th')[2].trigger('click')

    expect(rowTexts(wrapper)).toEqual(['Bobuser24', 'Tomuser28'])
  })

  it('renders empty and loading states', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: [], loading: true },
    })

    expect(wrapper.find(ns.e('empty')).exists()).toBe(true)
    expect(wrapper.find(ns.e('loading')).exists()).toBe(true)
  })

  it('renders custom empty content', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: [] },
      slots: {
        empty: () => 'Nothing here',
      },
    })

    expect(wrapper.find(ns.e('empty')).text()).toBe('Nothing here')
  })

  it('uses a safe empty colspan when there are no columns', () => {
    const wrapper = mount(Table, {
      props: { columns: [], dataSource: [] },
    })

    expect(wrapper.find(ns.e('empty')).attributes('colspan')).toBe('1')
  })

  it('renders empty cells for missing data paths without throwing', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Missing', dataIndex: 'profile.name', key: 'missing' }],
        dataSource: [{ key: '1', name: 'Tom' }],
      },
    })

    expect(wrapper.find('tbody td').text()).toBe('')
  })

  it('applies bordered, size, alignment, and width classes/styles', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Age', dataIndex: 'age', key: 'age', align: 'right', width: 120 }],
        dataSource,
        bordered: true,
        size: 'small',
      },
    })

    expect(wrapper.classes()).toContain('ccui-table--bordered')
    expect(wrapper.classes()).toContain('ccui-table--small')
    expect(wrapper.find(ns.em('th', 'right')).exists()).toBe(true)
    expect(wrapper.find(ns.em('td', 'right')).exists()).toBe(true)
    expect(wrapper.find('th').attributes('style')).toContain('width: 120px')
  })

  it('applies middle size, center alignment, and string width styles', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name', key: 'name', align: 'center', width: '40%' }],
        dataSource,
        size: 'middle',
      },
    })

    expect(wrapper.classes()).toContain('ccui-table--middle')
    expect(wrapper.find(ns.em('th', 'center')).exists()).toBe(true)
    expect(wrapper.find(ns.em('td', 'center')).exists()).toBe(true)
    expect(wrapper.find('th').attributes('style')).toContain('width: 40%')
  })

  it('keeps loading overlay while still rendering current rows', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource, loading: true },
    })

    expect(wrapper.find(ns.e('loading')).exists()).toBe(true)
    expect(rowTexts(wrapper)).toHaveLength(3)
  })

  it('hides table header when showHeader is false', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource, showHeader: false },
    })

    expect(wrapper.find('thead').exists()).toBe(false)
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
  })

  it('renders row selection column and selects a checkbox row', async () => {
    const onChange = vi.fn()
    const onSelect = vi.fn()
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource,
        rowSelection: { onChange, onSelect },
      },
    })

    expect(wrapper.findAll('th')).toHaveLength(4)

    await wrapper.findAll('tbody input[type="checkbox"]')[1].setValue(true)

    expect(wrapper.emitted('update:selectedRowKeys')?.[0][0]).toEqual(['2'])
    expect(onChange).toHaveBeenCalledWith(['2'], [dataSource[1]])
    expect(onSelect).toHaveBeenCalledWith(dataSource[1], true, [dataSource[1]])
    expect(wrapper.findAll('tbody tr')[1].classes()).toContain('ccui-table__tr--selected')
  })

  it('supports externally provided selectedRowKeys and responds to prop changes', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource,
        rowSelection: { selectedRowKeys: ['1'] },
      },
    })

    expect(asInput(wrapper.findAll('tbody input[type="checkbox"]')[0].element).checked).toBe(true)

    await wrapper.setProps({ rowSelection: { selectedRowKeys: ['3'] } })

    expect(asInput(wrapper.findAll('tbody input[type="checkbox"]')[0].element).checked).toBe(false)
    expect(asInput(wrapper.findAll('tbody input[type="checkbox"]')[2].element).checked).toBe(true)
  })

  it('uses radio row selection as a single selected row', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource,
        rowSelection: { type: 'radio' },
      },
    })

    expect(wrapper.find('thead input').exists()).toBe(false)

    await wrapper.findAll('tbody input[type="radio"]')[0].setValue(true)
    await wrapper.findAll('tbody input[type="radio"]')[2].setValue(true)

    expect(wrapper.emitted('update:selectedRowKeys')?.[1][0]).toEqual(['3'])
    expect(asInput(wrapper.findAll('tbody input[type="radio"]')[0].element).checked).toBe(false)
    expect(asInput(wrapper.findAll('tbody input[type="radio"]')[2].element).checked).toBe(true)
  })

  it('selects all enabled display rows from the header checkbox', async () => {
    const onSelectAll = vi.fn()
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource,
        rowSelection: {
          onSelectAll,
          getCheckboxProps: (record: any) => ({ disabled: record.key === '2' }),
        },
      },
    })

    await wrapper.find('thead input[type="checkbox"]').setValue(true)

    expect(wrapper.emitted('update:selectedRowKeys')?.[0][0]).toEqual(['1', '3'])
    expect(onSelectAll).toHaveBeenCalledWith(true, [dataSource[0], dataSource[2]], [dataSource[0], dataSource[2]])
    expect(asInput(wrapper.findAll('tbody input[type="checkbox"]')[1].element).disabled).toBe(true)
  })

  it('clears selected display rows from the header checkbox', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource,
        rowSelection: { defaultSelectedRowKeys: ['1', '2', '3'] },
      },
    })

    await wrapper.find('thead input[type="checkbox"]').setValue(false)

    expect(wrapper.emitted('update:selectedRowKeys')?.[0][0]).toEqual([])
    expect(wrapper.findAll('tbody input[type="checkbox"]').every((input) => !asInput(input.element).checked)).toBe(true)
  })

  it('reorders columns so left-fixed appear first and right-fixed last', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          { title: 'Mid', dataIndex: 'mid', key: 'mid', width: 100 },
          { title: 'Left', dataIndex: 'left', key: 'left', width: 80, fixed: 'left' },
          { title: 'Right', dataIndex: 'right', key: 'right', width: 90, fixed: 'right' },
        ],
        dataSource: [{ key: '1', mid: 'M', left: 'L', right: 'R' }],
      },
    })

    const headers = wrapper.findAll('th')
    expect(headers.map((th) => th.text())).toEqual(['Left', 'Mid', 'Right'])
    expect(wrapper.classes()).toContain('ccui-table--has-fixed-left')
    expect(wrapper.classes()).toContain('ccui-table--has-fixed-right')
  })

  it('positions left-fixed columns with cumulative left offsets', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          { title: 'A', dataIndex: 'a', key: 'a', width: 80, fixed: 'left' },
          { title: 'B', dataIndex: 'b', key: 'b', width: 120, fixed: 'left' },
          { title: 'C', dataIndex: 'c', key: 'c', width: 100 },
        ],
        dataSource: [{ key: '1', a: 'A', b: 'B', c: 'C' }],
      },
    })

    const headers = wrapper.findAll('th')
    expect(headers[0].attributes('style')).toContain('left: 0px')
    expect(headers[1].attributes('style')).toContain('left: 80px')
    expect(headers[0].classes()).toContain('ccui-table__cell--fixed-left')
  })

  it('positions right-fixed columns with cumulative right offsets', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          { title: 'A', dataIndex: 'a', key: 'a', width: 100 },
          { title: 'B', dataIndex: 'b', key: 'b', width: 80, fixed: 'right' },
          { title: 'C', dataIndex: 'c', key: 'c', width: 120, fixed: 'right' },
        ],
        dataSource: [{ key: '1', a: 'A', b: 'B', c: 'C' }],
      },
    })

    const headers = wrapper.findAll('th')
    expect(headers[1].attributes('style')).toContain('right: 120px')
    expect(headers[2].attributes('style')).toContain('right: 0px')
    expect(headers[2].classes()).toContain('ccui-table__cell--fixed-right')
  })

  it('shifts the selection column to the left when any column is left-fixed', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          { title: 'Pin', dataIndex: 'name', key: 'name', width: 100, fixed: 'left' },
          { title: 'Role', dataIndex: 'role', key: 'role' },
        ],
        dataSource,
        rowSelection: { columnWidth: 60 },
      },
    })

    const selectionTh = wrapper.findAll('th')[0]
    expect(selectionTh.attributes('style')).toContain('left: 0px')
    const pinTh = wrapper.findAll('th')[1]
    expect(pinTh.attributes('style')).toContain('left: 60px')
  })

  it('renders an expanded row when expandedRowRender returns content', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name', key: 'name' }],
        dataSource: [
          { key: '1', name: 'Alice', detail: 'Profile A' },
          { key: '2', name: 'Bob', detail: 'Profile B' },
        ],
        expandable: {
          expandedRowRender: (record: any) => `Details: ${record.detail}`,
        },
      },
    })

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    await wrapper.findAll(`${ns.e('expand-icon')}`)[0].trigger('click')
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(3)
    expect(rows[1].classes()).toContain('ccui-table__expanded-row')
    expect(rows[1].text()).toContain('Profile A')
    expect(wrapper.emitted('update:expandedRowKeys')?.[0][0]).toEqual(['1'])
    expect(wrapper.emitted('expand')?.[0]).toEqual([true, expect.objectContaining({ key: '1' })])
  })

  it('honors controlled expandedRowKeys', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name', key: 'name' }],
        dataSource: [
          { key: '1', name: 'Alice', detail: 'Profile A' },
          { key: '2', name: 'Bob', detail: 'Profile B' },
        ],
        expandable: {
          expandedRowKeys: ['2'],
          expandedRowRender: (record: any) => record.detail,
        },
      },
    })

    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
    expect(wrapper.findAll('tbody tr')[2].text()).toContain('Profile B')

    await wrapper.setProps({
      expandable: {
        expandedRowKeys: ['1'],
        expandedRowRender: (record: any) => record.detail,
      },
    })
    expect(wrapper.findAll('tbody tr')[1].text()).toContain('Profile A')
  })

  it('expands all rows by default when defaultExpandAllRows is true', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name', key: 'name' }],
        dataSource: [
          { key: '1', name: 'Alice', detail: 'A' },
          { key: '2', name: 'Bob', detail: 'B' },
        ],
        expandable: {
          defaultExpandAllRows: true,
          expandedRowRender: (record: any) => record.detail,
        },
      },
    })

    expect(wrapper.findAll('tbody tr')).toHaveLength(4)
  })

  it('hides the expand icon when rowExpandable returns false', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name', key: 'name' }],
        dataSource: [
          { key: '1', name: 'Alice' },
          { key: '2', name: 'Bob' },
        ],
        expandable: {
          rowExpandable: (record: any) => record.key === '1',
          expandedRowRender: () => 'detail',
        },
      },
    })

    const icons = wrapper.findAll(ns.e('expand-icon'))
    expect(icons).toHaveLength(1)
  })

  it('toggles the row when expandRowByClick is enabled', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name', key: 'name' }],
        dataSource: [{ key: '1', name: 'Alice', detail: 'A' }],
        expandable: {
          expandRowByClick: true,
          expandedRowRender: (record: any) => record.detail,
        },
      },
    })

    await wrapper.find('tbody tr').trigger('click')
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.emitted('expand')?.[0]).toEqual([true, expect.objectContaining({ key: '1' })])
  })

  it('skips cells where onCell returns rowSpan or colSpan of 0', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          {
            title: 'Group',
            dataIndex: 'group',
            key: 'group',
            onCell: (_record: any, index: number) => (index === 0 ? { rowSpan: 2 } : { rowSpan: 0 }),
          },
          { title: 'Name', dataIndex: 'name', key: 'name' },
        ],
        dataSource: [
          { key: '1', group: 'Team A', name: 'Alice' },
          { key: '2', group: 'Team A', name: 'Bob' },
        ],
      },
    })

    const firstRowCells = wrapper.findAll('tbody tr')[0].findAll('td')
    const secondRowCells = wrapper.findAll('tbody tr')[1].findAll('td')

    expect(firstRowCells).toHaveLength(2)
    expect(firstRowCells[0].attributes('rowspan')).toBe('2')
    expect(secondRowCells).toHaveLength(1)
    expect(secondRowCells[0].text()).toBe('Bob')
  })

  it('honors colSpan from onCell', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          {
            title: 'A',
            dataIndex: 'a',
            key: 'a',
            onCell: () => ({ colSpan: 2 }),
          },
          {
            title: 'B',
            dataIndex: 'b',
            key: 'b',
            onCell: () => ({ colSpan: 0 }),
          },
        ],
        dataSource: [{ key: '1', a: 'merged', b: 'hidden' }],
      },
    })

    const cells = wrapper.findAll('tbody tr')[0].findAll('td')
    expect(cells).toHaveLength(1)
    expect(cells[0].attributes('colspan')).toBe('2')
    expect(cells[0].text()).toBe('merged')
  })

  it('applies onHeaderCell rowSpan/colSpan output', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          {
            title: 'A',
            dataIndex: 'a',
            key: 'a',
            onHeaderCell: () => ({ colSpan: 2, class: 'ccui-table__th--merged' }),
          },
          {
            title: 'B',
            dataIndex: 'b',
            key: 'b',
            onHeaderCell: () => ({ colSpan: 0 }),
          },
        ],
        dataSource: [{ key: '1', a: 'A', b: 'B' }],
      },
    })

    const headers = wrapper.findAll('th')
    expect(headers).toHaveLength(1)
    expect(headers[0].attributes('colspan')).toBe('2')
    expect(headers[0].classes()).toContain('ccui-table__th--merged')
  })
})

describe('table tree data', () => {
  const treeColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
  ]
  const treeData = [
    {
      key: 'p1',
      name: 'Parent 1',
      value: 10,
      children: [
        { key: 'c1', name: 'Child 1', value: 3 },
        { key: 'c2', name: 'Child 2', value: 7 },
      ],
    },
    { key: 'p2', name: 'Parent 2', value: 20 },
  ]

  it('renders tree expand icon for rows with children', () => {
    const wrapper = mount(Table, {
      props: { columns: treeColumns, dataSource: treeData },
    })
    // 有 children 的行显示展开图标
    const icons = wrapper.findAll(ns.e('tree-expand-icon'))
    expect(icons.length).toBe(1) // 只有 Parent 1 有 children
    expect(icons[0].text()).toBe('+')
  })

  it('does not show tree expand icon for leaf rows', () => {
    const wrapper = mount(Table, {
      props: { columns: treeColumns, dataSource: [{ key: '1', name: 'Leaf', value: 5 }] },
    })
    expect(wrapper.find(ns.e('tree-expand-icon')).exists()).toBe(false)
  })

  it('expands children on tree expand icon click', async () => {
    const wrapper = mount(Table, {
      props: { columns: treeColumns, dataSource: treeData },
    })
    // 初始只有 2 行
    expect(wrapper.findAll(ns.e('tr')).length).toBe(2)

    // 点击展开
    await wrapper.find(ns.e('tree-expand-icon')).trigger('click')
    // 展开后有 4 行（2 + 2 children）
    expect(wrapper.findAll(ns.e('tr')).length).toBe(4)
    // 再次点击收起
    await wrapper.find(ns.e('tree-expand-icon')).trigger('click')
    expect(wrapper.findAll(ns.e('tr')).length).toBe(2)
  })

  it('emits update:expandedRowKeys on tree expand', async () => {
    const wrapper = mount(Table, {
      props: { columns: treeColumns, dataSource: treeData },
    })
    await wrapper.find(ns.e('tree-expand-icon')).trigger('click')
    expect(wrapper.emitted('update:expandedRowKeys')).toBeDefined()
    expect(wrapper.emitted('update:expandedRowKeys')![0][0]).toContain('p1')
  })

  it('supports custom childrenColumnName', () => {
    const data = [{ key: 'a', name: 'A', value: 1, items: [{ key: 'a1', name: 'A1', value: 2 }] }]
    const wrapper = mount(Table, {
      props: { columns: treeColumns, dataSource: data, childrenColumnName: 'items' },
    })
    expect(wrapper.find(ns.e('tree-expand-icon')).exists()).toBe(true)
  })

  describe('M-A2 classNames / styles 钩子', () => {
    it('classNames.root 注入到根节点', () => {
      const wrapper = mount(Table, {
        props: { columns, dataSource, classNames: { root: 'my-root' } },
      })
      expect(wrapper.find('.ccui-table').classes()).toContain('my-root')
    })

    it('styles.root 注入到根节点 style', () => {
      const wrapper = mount(Table, {
        props: { columns, dataSource, styles: { root: { color: 'red' } } },
      })
      expect(wrapper.find('.ccui-table').attributes('style') || '').toContain('red')
    })
  })
})
