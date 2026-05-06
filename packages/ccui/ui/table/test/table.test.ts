import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Table } from '../index'

const ns = useNamespace('table', true)
const paginationNs = useNamespace('pagination', true)

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

  it('uses controlled sortOrder from columns', () => {
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

  it('responds to controlled sortOrder prop changes', async () => {
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

  it('uses controlled filteredValue from columns', () => {
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

  it('responds to controlled filteredValue prop changes', async () => {
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

  it('emits change with pagination, filters, sorter, and current data', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource, pagination: { current: 1, pageSize: 2 } },
    })

    await wrapper.findAll('th')[0].trigger('click')
    const payload = wrapper.emitted('change')?.[0]

    expect(payload?.[0]).toMatchObject({ current: 1, pageSize: 2, total: 3 })
    expect(payload?.[1]).toEqual({})
    expect(payload?.[2]).toMatchObject({ columnKey: 'name', order: 'ascend' })
    const sortedPayload = payload?.[3] as any[]
    expect(sortedPayload.map((item: any) => item.name)).toEqual(['Alice', 'Bob', 'Tom'])
  })

  it('emits change with filtered data after filtering', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource, pagination: { current: 2, pageSize: 1 } },
    })

    await wrapper.find('select').setValue('0')
    const payload = wrapper.emitted('change')?.[0]

    expect(payload?.[0]).toMatchObject({ current: 1, pageSize: 1, total: 1 })
    expect(payload?.[1]).toEqual({ role: ['admin'] })
    const filteredPayload = payload?.[3] as any[]
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

  it('resets paginated view to first page after sorting', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource, pagination: { current: 2, pageSize: 1 } },
    })

    await wrapper.findAll('th')[0].trigger('click')

    expect(rowTexts(wrapper)).toEqual(['Aliceadmin32'])
    expect(wrapper.find(paginationNs.em('item', 'active')).text()).toBe('1')
  })

  it('paginates data and emits pagination updates', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource, pagination: { current: 1, pageSize: 2 } },
    })

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    await wrapper.find('.ccui-pagination__next').trigger('click')
    expect(wrapper.emitted('update:pagination')?.[0][0]).toMatchObject({ current: 2, pageSize: 2, total: 3 })
    expect(rowTexts(wrapper)).toHaveLength(1)
    expect(rowTexts(wrapper)[0]).toContain('Bob')
  })

  it('moves to the previous page from a later page', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource, pagination: { current: 2, pageSize: 1 } },
    })

    await wrapper.find(paginationNs.e('prev')).trigger('click')

    expect(wrapper.emitted('update:pagination')?.[0][0]).toMatchObject({ current: 1, pageSize: 1, total: 3 })
    expect(rowTexts(wrapper)).toEqual(['Tomuser28'])
  })

  it('marks pagination next as disabled on the last page', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource, pagination: { current: 3, pageSize: 1 } },
    })

    expect(wrapper.find(paginationNs.e('next')).classes()).toContain('is-disabled')
    expect(wrapper.find(paginationNs.em('item', 'active')).text()).toBe('3')
  })

  it('renders default pagination when pagination is true', () => {
    const rows = Array.from({ length: 12 }, (_, index) => ({
      key: index,
      name: `Row ${index}`,
      role: 'user',
      age: index,
    }))
    const wrapper = mount(Table, {
      props: { columns, dataSource: rows, pagination: true },
    })

    expect(rowTexts(wrapper)).toHaveLength(10)
    expect(wrapper.find(paginationNs.b()).exists()).toBe(true)
  })

  it('does not render pagination when pagination is false', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource, pagination: false },
    })

    expect(wrapper.find(paginationNs.b()).exists()).toBe(false)
  })

  it('prevents prev and next clicks at pagination boundaries', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource, pagination: { current: 1, pageSize: 10 } },
    })

    await wrapper.find(paginationNs.e('prev')).trigger('click')
    await wrapper.find(paginationNs.e('next')).trigger('click')

    expect(wrapper.emitted('update:pagination')).toBeUndefined()
  })

  it('uses pagination total from config for emitted pagination state', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource, pagination: { current: 1, pageSize: 2, total: 99 } },
    })

    await wrapper.find(paginationNs.e('next')).trigger('click')

    expect(wrapper.emitted('update:pagination')?.[0][0]).toMatchObject({ current: 2, pageSize: 2, total: 99 })
  })

  it('changes page size and resets current page', async () => {
    const rows = Array.from({ length: 8 }, (_, index) => ({
      key: index,
      name: `Row ${index}`,
      role: 'user',
      age: index,
    }))
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows,
        pagination: { current: 2, pageSize: 2, showSizeChanger: true, pageSizeOptions: [2, 4] },
      },
    })

    await wrapper.find(paginationNs.e('size-select')).setValue('4')

    expect(wrapper.emitted('update:pagination')?.[0][0]).toMatchObject({ current: 1, pageSize: 4, total: 8 })
  })

  it('responds to controlled pagination prop changes', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource, pagination: { current: 1, pageSize: 2 } },
    })

    await wrapper.setProps({ pagination: { current: 2, pageSize: 2 } })

    expect(rowTexts(wrapper)).toHaveLength(1)
    expect(rowTexts(wrapper)[0]).toContain('Bob')
  })

  it('responds to controlled pageSize prop changes', async () => {
    const rows = Array.from({ length: 6 }, (_, index) => ({
      key: index,
      name: `Row ${index}`,
      role: 'user',
      age: index,
    }))
    const wrapper = mount(Table, {
      props: { columns, dataSource: rows, pagination: { current: 1, pageSize: 2 } },
    })

    await wrapper.setProps({ pagination: { current: 1, pageSize: 4 } })

    expect(rowTexts(wrapper)).toHaveLength(4)
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

  it('supports controlled selectedRowKeys and responds to prop changes', async () => {
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

  it('keeps selected row keys outside the current page when selecting all visible rows', async () => {
    const rows = [
      { key: '1', name: 'Alice', role: 'admin', age: 32 },
      { key: '2', name: 'Tom', role: 'user', age: 28 },
      { key: '3', name: 'Bob', role: 'user', age: 24 },
    ]
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows,
        pagination: { current: 1, pageSize: 2 },
        rowSelection: { defaultSelectedRowKeys: ['3'] },
      },
    })

    await wrapper.find('thead input[type="checkbox"]').setValue(true)

    expect(wrapper.emitted('update:selectedRowKeys')?.[0][0]).toEqual(['3', '1', '2'])
  })
})
