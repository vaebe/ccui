import type {
  TableColumn,
  TableFilterValue,
  TableFilters,
  TablePaginationConfig,
  TableProps,
  TableSorter,
  TableSortOrder,
} from './table-types'
import { computed, defineComponent, h, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { tableProps } from './table-types'
import '../../pagination/src/pagination.scss'
import './table.scss'

function getColumnKey(column: TableColumn, index: number): string {
  if (column.key) {
    return column.key
  }
  if (Array.isArray(column.dataIndex)) {
    return column.dataIndex.join('.')
  }
  return column.dataIndex || String(index)
}

function getValueByPath(record: any, path?: string | Array<string | number>): any {
  if (!path) {
    return undefined
  }
  const keys = Array.isArray(path) ? path : path.split('.')
  return keys.reduce((value, key) => value?.[key], record)
}

function getRowKey(record: any, index: number, rowKey: TableProps['rowKey']): string | number {
  if (typeof rowKey === 'function') {
    return rowKey(record, index)
  }
  const value = getValueByPath(record, rowKey)
  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }
  return index
}

function compareValues(a: any, b: any): number {
  if (a === b) {
    return 0
  }
  if (a === undefined || a === null) {
    return -1
  }
  if (b === undefined || b === null) {
    return 1
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }
  return String(a).localeCompare(String(b))
}

function normalizePagination(pagination: TableProps['pagination']): TablePaginationConfig | null {
  if (!pagination) {
    return null
  }
  if (pagination === true) {
    return {}
  }
  return pagination
}

export default defineComponent({
  name: 'CTable',
  props: tableProps,
  emits: ['change', 'update:pagination', 'update:filters', 'update:sorter'],
  setup(props: TableProps, { emit, slots }) {
    const ns = useNamespace('table')
    const innerCurrent = ref(1)
    const innerPageSize = ref(10)
    const innerFilters = ref<TableFilters>({})
    const innerSorter = ref<TableSorter>({ order: null })

    watch(
      () => props.pagination,
      (pagination) => {
        const config = normalizePagination(pagination)
        if (config?.current) {
          innerCurrent.value = config.current
        }
        if (config?.pageSize) {
          innerPageSize.value = config.pageSize
        }
      },
      { immediate: true, deep: true },
    )

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.size)]: props.size !== 'default',
      [ns.m('bordered')]: props.bordered,
      [ns.m('loading')]: props.loading,
    }))

    const columnKeys = computed(() => props.columns.map((column, index) => getColumnKey(column, index)))

    const activeSorter = computed<TableSorter>(() => {
      const controlledIndex = props.columns.findIndex((column) => column.sortOrder !== undefined)
      if (controlledIndex >= 0) {
        const column = props.columns[controlledIndex]
        return {
          column,
          columnKey: getColumnKey(column, controlledIndex),
          order: column.sortOrder ?? null,
        }
      }
      return innerSorter.value
    })

    const activeFilters = computed<TableFilters>(() => {
      const filters: TableFilters = { ...innerFilters.value }
      props.columns.forEach((column, index) => {
        if (column.filteredValue !== undefined) {
          filters[getColumnKey(column, index)] = column.filteredValue
        }
      })
      return filters
    })

    const filteredData = computed(() => {
      return props.dataSource.filter((record) => {
        return props.columns.every((column, index) => {
          const values = activeFilters.value[getColumnKey(column, index)]
          if (!values?.length) {
            return true
          }
          return values.includes(getValueByPath(record, column.dataIndex))
        })
      })
    })

    const sortedData = computed(() => {
      const { column, order } = activeSorter.value
      if (!column || !order || !column.sorter) {
        return filteredData.value
      }
      const factor = order === 'ascend' ? 1 : -1
      return [...filteredData.value].sort((a, b) => {
        const result =
          typeof column.sorter === 'function'
            ? column.sorter(a, b)
            : compareValues(getValueByPath(a, column.dataIndex), getValueByPath(b, column.dataIndex))
        return result * factor
      })
    })

    const paginationConfig = computed(() => normalizePagination(props.pagination))
    const paginationState = computed(() => ({
      current: innerCurrent.value,
      pageSize: innerPageSize.value,
      total: paginationConfig.value?.total ?? sortedData.value.length,
      showSizeChanger: paginationConfig.value?.showSizeChanger ?? false,
      pageSizeOptions: paginationConfig.value?.pageSizeOptions ?? [10, 20, 50, 100],
    }))

    const displayData = computed(() => {
      if (!paginationConfig.value) {
        return sortedData.value
      }
      const { current, pageSize } = paginationState.value
      const start = (current - 1) * pageSize
      return sortedData.value.slice(start, start + pageSize)
    })

    const emitChange = () => {
      emit('change', paginationState.value, activeFilters.value, activeSorter.value, sortedData.value)
    }

    const handleSort = (column: TableColumn, index: number) => {
      if (!column.sorter) {
        return
      }
      const columnKey = getColumnKey(column, index)
      const current = activeSorter.value.columnKey === columnKey ? activeSorter.value.order : null
      const nextOrder: TableSortOrder = current === 'ascend' ? 'descend' : current === 'descend' ? null : 'ascend'
      const sorter = { column: nextOrder ? column : undefined, columnKey, order: nextOrder }
      innerSorter.value = sorter
      innerCurrent.value = 1
      emit('update:sorter', sorter)
      emitChange()
    }

    const handleFilter = (column: TableColumn, index: number, values: TableFilterValue[]) => {
      const key = getColumnKey(column, index)
      innerFilters.value = { ...innerFilters.value, [key]: values }
      innerCurrent.value = 1
      emit('update:filters', innerFilters.value)
      emitChange()
    }

    const handlePageChange = (current: number, pageSize: number) => {
      innerCurrent.value = current
      innerPageSize.value = pageSize
      const nextPagination = { ...paginationState.value, current, pageSize }
      emit('update:pagination', nextPagination)
      emitChange()
    }

    const handlePageSizeChange = (pageSize: number) => {
      innerCurrent.value = 1
      innerPageSize.value = pageSize
      const nextPagination = { ...paginationState.value, current: 1, pageSize }
      emit('update:pagination', nextPagination)
      emitChange()
    }

    const renderCell = (record: any, rowIndex: number, column: TableColumn) => {
      const text = getValueByPath(record, column.dataIndex)
      const scope = { text, record, index: rowIndex, column }
      if (slots.bodyCell) {
        return slots.bodyCell(scope)
      }
      if (column.customRender) {
        return column.customRender(scope)
      }
      return text
    }

    const renderFilter = (column: TableColumn, index: number) => {
      if (!column.filters?.length) {
        return null
      }
      const key = getColumnKey(column, index)
      const selected = activeFilters.value[key] ?? []
      const options = [
        ...(column.filterMultiple === false ? [h('option', { value: '' }, 'All')] : []),
        ...column.filters.map((item, filterIndex) =>
          h('option', { key: String(item.value), value: String(filterIndex) }, item.text),
        ),
      ]
      return h(
        'select',
        {
          class: ns.e('filter'),
          value:
            column.filterMultiple === false
              ? selected.length
                ? column.filters.findIndex((item) => item.value === selected[0]).toString()
                : ''
              : selected
                  .map((value) => column.filters!.findIndex((item) => item.value === value))
                  .filter((index) => index >= 0)
                  .map(String),
          multiple: column.filterMultiple !== false,
          onClick: (event: MouseEvent) => event.stopPropagation(),
          onChange: (event: Event) => {
            const target = event.target as HTMLSelectElement
            const values =
              column.filterMultiple === false
                ? target.value === ''
                  ? []
                  : [column.filters![Number(target.value)].value]
                : Array.from(target.selectedOptions).map((option) => column.filters![Number(option.value)].value)
            handleFilter(column, index, values)
          },
        },
        options,
      )
    }

    const renderHeader = () => {
      if (!props.showHeader) {
        return null
      }
      return h(
        'thead',
        { class: ns.e('thead') },
        h(
          'tr',
          null,
          props.columns.map((column, index) => {
            const key = columnKeys.value[index]
            const sortOrder = activeSorter.value.columnKey === key ? activeSorter.value.order : null
            const headerContent = slots.headerCell ? slots.headerCell({ column, index }) : column.title
            return h(
              'th',
              {
                key,
                class: [
                  ns.e('th'),
                  column.align && ns.em('th', column.align),
                  column.sorter && ns.em('th', 'sortable'),
                  sortOrder && ns.em('th', sortOrder),
                ],
                style: { width: typeof column.width === 'number' ? `${column.width}px` : column.width },
                onClick: () => handleSort(column, index),
              },
              [
                h('div', { class: ns.e('title') }, [
                  h('span', null, headerContent),
                  column.sorter ? h('span', { class: ns.e('sorter') }) : null,
                ]),
                renderFilter(column, index),
              ],
            )
          }),
        ),
      )
    }

    const renderEmpty = () =>
      h('tr', { class: ns.e('empty-row') }, [
        h(
          'td',
          {
            class: ns.e('empty'),
            colspan: Math.max(1, props.columns.length),
          },
          slots.empty ? slots.empty() : 'No data',
        ),
      ])

    const renderPagination = () => {
      if (!paginationConfig.value) {
        return null
      }
      const paginationNs = useNamespace('pagination')
      const { current, pageSize, total, showSizeChanger, pageSizeOptions } = paginationState.value
      const totalPages = Math.max(1, Math.ceil(total / pageSize))
      const prevDisabled = current <= 1
      const nextDisabled = current >= totalPages
      return h(
        'div',
        { class: ns.e('pagination') },
        h('ul', { class: paginationNs.b() }, [
          h(
            'li',
            {
              class: [paginationNs.e('prev'), prevDisabled && paginationNs.is('disabled')],
              'aria-disabled': prevDisabled,
              onClick: () => {
                if (!prevDisabled) {
                  handlePageChange(current - 1, pageSize)
                }
              },
            },
            h('span', { class: paginationNs.e('arrow') }, '<'),
          ),
          h('li', { class: [paginationNs.e('item'), paginationNs.em('item', 'active')] }, current),
          h(
            'li',
            {
              class: [paginationNs.e('next'), nextDisabled && paginationNs.is('disabled')],
              'aria-disabled': nextDisabled,
              onClick: () => {
                if (!nextDisabled) {
                  handlePageChange(current + 1, pageSize)
                }
              },
            },
            h('span', { class: paginationNs.e('arrow') }, '>'),
          ),
          showSizeChanger
            ? h(
                'li',
                { class: paginationNs.e('size-changer') },
                h(
                  'select',
                  {
                    class: paginationNs.e('size-select'),
                    value: pageSize,
                    onChange: (event: Event) => {
                      handlePageSizeChange(Number((event.target as HTMLSelectElement).value))
                    },
                  },
                  pageSizeOptions.map((option) => h('option', { key: option, value: option }, `${option} / page`)),
                ),
              )
            : null,
        ]),
      )
    }

    return () =>
      h('div', { class: cls.value }, [
        h('div', { class: ns.e('container') }, [
          h('table', { class: ns.e('table') }, [
            renderHeader(),
            h(
              'tbody',
              { class: ns.e('tbody') },
              displayData.value.length
                ? displayData.value.map((record, rowIndex) =>
                    h(
                      'tr',
                      { key: getRowKey(record, rowIndex, props.rowKey), class: ns.e('tr') },
                      props.columns.map((column, columnIndex) =>
                        h(
                          'td',
                          {
                            key: columnKeys.value[columnIndex],
                            class: [ns.e('td'), column.align && ns.em('td', column.align)],
                          },
                          renderCell(record, rowIndex, column),
                        ),
                      ),
                    ),
                  )
                : renderEmpty(),
            ),
          ]),
          props.loading ? h('div', { class: ns.e('loading') }, [h('span', { class: ns.e('loading-dot') })]) : null,
        ]),
        renderPagination(),
      ])
  },
})
