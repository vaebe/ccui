import type { CSSProperties, VNodeChild } from 'vue'
import type {
  TableCellRenderProps,
  TableColumn,
  TableFilterValue,
  TableFilters,
  TablePaginationConfig,
  TableProps,
  TableSelectionKey,
  TableSorter,
  TableSortOrder,
} from './table-types'
import { computed, defineComponent, h, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { tableProps } from './table-types'
import '../../pagination/src/pagination.scss'
import './table.scss'

interface OrderedColumn {
  column: TableColumn
  originalIndex: number
}

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

function toPx(value: string | number | undefined): number {
  if (value === undefined) {
    return 0
  }
  if (typeof value === 'number') {
    return value
  }
  const match = String(value).match(/^([\d.]+)px$/)
  return match ? Number(match[1]) : 0
}

function widthStyle(value: string | number | undefined): string | undefined {
  if (value === undefined) {
    return undefined
  }
  return typeof value === 'number' ? `${value}px` : String(value)
}

export default defineComponent({
  name: 'CTable',
  props: tableProps,
  emits: [
    'change',
    'update:pagination',
    'update:filters',
    'update:sorter',
    'update:selectedRowKeys',
    'update:expandedRowKeys',
    'expand',
  ],
  setup(props: TableProps, { emit, slots }) {
    const ns = useNamespace('table')
    const innerCurrent = ref(1)
    const innerPageSize = ref(10)
    const innerFilters = ref<TableFilters>({})
    const innerSorter = ref<TableSorter>({ order: null })
    const innerSelectedRowKeys = ref<TableSelectionKey[]>([])
    const innerExpandedRowKeys = ref<TableSelectionKey[]>([])

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

    watch(
      () => props.rowSelection,
      (rowSelection) => {
        if (rowSelection?.selectedRowKeys) {
          innerSelectedRowKeys.value = [...rowSelection.selectedRowKeys]
          return
        }
        if (rowSelection?.defaultSelectedRowKeys) {
          innerSelectedRowKeys.value = [...rowSelection.defaultSelectedRowKeys]
        }
      },
      { immediate: true, deep: true },
    )

    watch(
      () => props.expandable,
      (expandable) => {
        if (expandable?.expandedRowKeys) {
          innerExpandedRowKeys.value = [...expandable.expandedRowKeys]
          return
        }
        if (expandable?.defaultExpandAllRows) {
          innerExpandedRowKeys.value = props.dataSource.map((record, index) => getRowKey(record, index, props.rowKey))
          return
        }
        if (expandable?.defaultExpandedRowKeys) {
          innerExpandedRowKeys.value = [...expandable.defaultExpandedRowKeys]
        }
      },
      { immediate: true, deep: true },
    )

    const orderedColumns = computed<OrderedColumn[]>(() => {
      const left: OrderedColumn[] = []
      const middle: OrderedColumn[] = []
      const right: OrderedColumn[] = []
      props.columns.forEach((column, originalIndex) => {
        if (column.fixed === 'left') {
          left.push({ column, originalIndex })
        } else if (column.fixed === 'right') {
          right.push({ column, originalIndex })
        } else {
          middle.push({ column, originalIndex })
        }
      })
      return [...left, ...middle, ...right]
    })

    const hasLeftFixed = computed(() => props.columns.some((column) => column.fixed === 'left'))
    const hasRightFixed = computed(() => props.columns.some((column) => column.fixed === 'right'))

    const isSelectionEnabled = computed(() => Boolean(props.rowSelection))
    const isExpandableEnabled = computed(() => Boolean(props.expandable?.expandedRowRender))

    const selectionFixed = computed(() => isSelectionEnabled.value && (props.rowSelection?.fixed || hasLeftFixed.value))

    const expandColumnFixed = computed(
      () => isExpandableEnabled.value && (props.expandable?.fixed || hasLeftFixed.value),
    )

    const selectionWidthPx = computed(() => {
      if (!isSelectionEnabled.value) {
        return 0
      }
      const w = props.rowSelection?.columnWidth
      return toPx(w === undefined ? 48 : w)
    })

    const expandWidthPx = computed(() => {
      if (!isExpandableEnabled.value) {
        return 0
      }
      const w = props.expandable?.columnWidth
      return toPx(w === undefined ? 48 : w)
    })

    const fixedLeftOffsets = computed<number[]>(() => {
      const offsets: number[] = []
      let acc = 0
      acc += selectionFixed.value ? selectionWidthPx.value : 0
      acc += expandColumnFixed.value ? expandWidthPx.value : 0
      orderedColumns.value.forEach(({ column }) => {
        if (column.fixed === 'left') {
          offsets.push(acc)
          acc += toPx(column.width)
        } else {
          offsets.push(0)
        }
      })
      return offsets
    })

    const fixedRightOffsets = computed<number[]>(() => {
      const offsets: number[] = orderedColumns.value.map(() => 0)
      let acc = 0
      for (let i = orderedColumns.value.length - 1; i >= 0; i--) {
        const { column } = orderedColumns.value[i]
        if (column.fixed === 'right') {
          offsets[i] = acc
          acc += toPx(column.width)
        }
      }
      return offsets
    })

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.size)]: props.size !== 'default',
      [ns.m('bordered')]: props.bordered,
      [ns.m('loading')]: props.loading,
      [ns.m('has-fixed-left')]: hasLeftFixed.value || selectionFixed.value || expandColumnFixed.value,
      [ns.m('has-fixed-right')]: hasRightFixed.value,
    }))

    const containerStyle = computed<CSSProperties>(() => {
      const style: CSSProperties = {}
      if (props.scroll?.x) {
        style.overflowX = 'auto'
      }
      if (props.scroll?.y) {
        style.maxHeight = widthStyle(props.scroll.y)
        style.overflowY = 'auto'
      }
      return style
    })

    const tableStyle = computed<CSSProperties>(() => {
      const style: CSSProperties = {}
      if (props.scroll?.x) {
        style.minWidth = widthStyle(props.scroll.x)
      }
      return style
    })

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

    const selectedRowKeySet = computed(() => new Set(props.rowSelection?.selectedRowKeys ?? innerSelectedRowKeys.value))

    const expandedRowKeySet = computed(() => new Set(props.expandable?.expandedRowKeys ?? innerExpandedRowKeys.value))

    const getSelectionRows = (selectedKeys: TableSelectionKey[]) => {
      const keySet = new Set(selectedKeys)
      return sortedData.value.filter((record, index) => keySet.has(getRowKey(record, index, props.rowKey)))
    }

    const getRowSelectionProps = (record: any) => props.rowSelection?.getCheckboxProps?.(record) ?? {}

    const isRowSelectionDisabled = (record: any) => Boolean(getRowSelectionProps(record).disabled)

    const selectableDisplayRows = computed(() =>
      displayData.value
        .map((record, index) => ({ record, index, key: getRowKey(record, index, props.rowKey) }))
        .filter(({ record }) => !isRowSelectionDisabled(record)),
    )

    const selectedDisplayRowKeys = computed(() =>
      selectableDisplayRows.value.map(({ key }) => key).filter((key) => selectedRowKeySet.value.has(key)),
    )

    const isAllDisplayRowsSelected = computed(
      () =>
        selectableDisplayRows.value.length > 0 &&
        selectedDisplayRowKeys.value.length === selectableDisplayRows.value.length,
    )

    const isSomeDisplayRowsSelected = computed(
      () => selectedDisplayRowKeys.value.length > 0 && !isAllDisplayRowsSelected.value,
    )

    const updateSelectedRowKeys = (nextKeys: TableSelectionKey[], selectedRows: any[], callback?: () => void) => {
      if (!props.rowSelection?.selectedRowKeys) {
        innerSelectedRowKeys.value = nextKeys
      }
      emit('update:selectedRowKeys', nextKeys)
      props.rowSelection?.onChange?.(nextKeys, selectedRows)
      callback?.()
    }

    const handleSelectRow = (record: any, rowIndex: number, checked: boolean) => {
      if (!props.rowSelection || isRowSelectionDisabled(record)) {
        return
      }
      const key = getRowKey(record, rowIndex, props.rowKey)
      const selectedKeys = selectedRowKeySet.value
      const nextKeys =
        props.rowSelection.type === 'radio'
          ? checked
            ? [key]
            : []
          : checked
            ? [...selectedKeys, key]
            : [...selectedKeys].filter((selectedKey) => selectedKey !== key)
      const selectedRows = getSelectionRows(nextKeys)
      updateSelectedRowKeys(nextKeys, selectedRows, () => {
        props.rowSelection?.onSelect?.(record, checked, selectedRows)
      })
    }

    const handleSelectAll = (checked: boolean) => {
      if (!props.rowSelection || props.rowSelection.type === 'radio') {
        return
      }
      const changeableKeys = selectableDisplayRows.value.map(({ key }) => key)
      const currentKeys = selectedRowKeySet.value
      const nextKeys = checked
        ? Array.from(new Set([...currentKeys, ...changeableKeys]))
        : [...currentKeys].filter((key) => !changeableKeys.includes(key))
      const selectedRows = getSelectionRows(nextKeys)
      updateSelectedRowKeys(nextKeys, selectedRows, () => {
        props.rowSelection?.onSelectAll?.(
          checked,
          selectedRows,
          selectableDisplayRows.value.map(({ record }) => record),
        )
      })
    }

    const setExpandedRowKeys = (nextKeys: TableSelectionKey[], record: any, expanded: boolean) => {
      if (!props.expandable?.expandedRowKeys) {
        innerExpandedRowKeys.value = nextKeys
      }
      emit('update:expandedRowKeys', nextKeys)
      emit('expand', expanded, record)
      props.expandable?.onChange?.(nextKeys)
      props.expandable?.onExpand?.(expanded, record)
    }

    const isRowExpandable = (record: any) =>
      props.expandable?.rowExpandable ? props.expandable.rowExpandable(record) : true

    const toggleExpand = (record: any, key: TableSelectionKey) => {
      if (!isExpandableEnabled.value || !isRowExpandable(record)) {
        return
      }
      const expanded = expandedRowKeySet.value.has(key)
      const nextKeys = expanded
        ? [...expandedRowKeySet.value].filter((k) => k !== key)
        : [...expandedRowKeySet.value, key]
      setExpandedRowKeys(nextKeys, record, !expanded)
    }

    const emitChange = () => {
      emit('change', paginationState.value, activeFilters.value, activeSorter.value, sortedData.value)
    }

    const handleSort = (column: TableColumn, originalIndex: number) => {
      if (!column.sorter) {
        return
      }
      const columnKey = getColumnKey(column, originalIndex)
      const current = activeSorter.value.columnKey === columnKey ? activeSorter.value.order : null
      const nextOrder: TableSortOrder = current === 'ascend' ? 'descend' : current === 'descend' ? null : 'ascend'
      const sorter = { column: nextOrder ? column : undefined, columnKey, order: nextOrder }
      innerSorter.value = sorter
      innerCurrent.value = 1
      emit('update:sorter', sorter)
      emitChange()
    }

    const handleFilter = (column: TableColumn, originalIndex: number, values: TableFilterValue[]) => {
      const key = getColumnKey(column, originalIndex)
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

    const fixedCellStyle = (orderedIndex: number, column: TableColumn, base?: CSSProperties): CSSProperties => {
      const style: CSSProperties = { ...base }
      if (column.width !== undefined) {
        style.width = widthStyle(column.width)
      }
      if (column.fixed === 'left') {
        style.position = 'sticky'
        style.left = `${fixedLeftOffsets.value[orderedIndex]}px`
        style.zIndex = 2
      } else if (column.fixed === 'right') {
        style.position = 'sticky'
        style.right = `${fixedRightOffsets.value[orderedIndex]}px`
        style.zIndex = 2
      }
      return style
    }

    const renderSelectionHeader = () => {
      if (!isSelectionEnabled.value) {
        return null
      }
      const { columnWidth, hideSelectAll, type } = props.rowSelection!
      const style: CSSProperties = { width: widthStyle(columnWidth) }
      if (selectionFixed.value) {
        style.position = 'sticky'
        style.left = '0px'
        style.zIndex = 3
      }
      return h(
        'th',
        {
          key: '__selection__',
          class: [ns.e('th'), ns.e('selection-cell'), selectionFixed.value && ns.em('cell', 'fixed-left')],
          style,
        },
        type === 'radio' || hideSelectAll
          ? undefined
          : h('input', {
              class: [ns.e('selection-input'), isSomeDisplayRowsSelected.value && ns.em('selection-input', 'mixed')],
              type: 'checkbox',
              checked: isAllDisplayRowsSelected.value,
              disabled: selectableDisplayRows.value.length === 0,
              'aria-label': 'Select all rows',
              onClick: (event: MouseEvent) => event.stopPropagation(),
              onChange: (event: Event) => handleSelectAll((event.target as HTMLInputElement).checked),
            }),
      )
    }

    const renderSelectionCell = (record: any, rowIndex: number) => {
      if (!isSelectionEnabled.value) {
        return null
      }
      const rowSelection = props.rowSelection!
      const key = getRowKey(record, rowIndex, props.rowKey)
      const checkboxProps = getRowSelectionProps(record)
      const style: CSSProperties = {}
      if (selectionFixed.value) {
        style.position = 'sticky'
        style.left = '0px'
        style.zIndex = 1
      }
      return h(
        'td',
        {
          key: '__selection__',
          class: [ns.e('td'), ns.e('selection-cell'), selectionFixed.value && ns.em('cell', 'fixed-left')],
          style,
        },
        h('input', {
          ...checkboxProps,
          class: ns.e('selection-input'),
          type: rowSelection.type === 'radio' ? 'radio' : 'checkbox',
          checked: selectedRowKeySet.value.has(key),
          disabled: checkboxProps.disabled,
          'aria-label': 'Select row',
          onClick: (event: MouseEvent) => event.stopPropagation(),
          onChange: (event: Event) => handleSelectRow(record, rowIndex, (event.target as HTMLInputElement).checked),
        }),
      )
    }

    const renderExpandHeader = () => {
      if (!isExpandableEnabled.value) {
        return null
      }
      const style: CSSProperties = { width: widthStyle(props.expandable?.columnWidth ?? 48) }
      if (expandColumnFixed.value) {
        style.position = 'sticky'
        style.left = `${selectionFixed.value ? selectionWidthPx.value : 0}px`
        style.zIndex = 3
      }
      return h(
        'th',
        {
          key: '__expand__',
          class: [ns.e('th'), ns.e('expand-cell'), expandColumnFixed.value && ns.em('cell', 'fixed-left')],
          style,
        },
        '',
      )
    }

    const renderExpandCell = (record: any, rowIndex: number, key: TableSelectionKey) => {
      if (!isExpandableEnabled.value) {
        return null
      }
      const expandable = isRowExpandable(record)
      const expanded = expandedRowKeySet.value.has(key)
      const style: CSSProperties = {}
      if (expandColumnFixed.value) {
        style.position = 'sticky'
        style.left = `${selectionFixed.value ? selectionWidthPx.value : 0}px`
        style.zIndex = 1
      }
      return h(
        'td',
        {
          key: '__expand__',
          class: [ns.e('td'), ns.e('expand-cell'), expandColumnFixed.value && ns.em('cell', 'fixed-left')],
          style,
          onClick: (event: MouseEvent) => event.stopPropagation(),
        },
        [
          expandable
            ? h(
                'button',
                {
                  type: 'button',
                  class: [ns.e('expand-icon'), expanded && ns.em('expand-icon', 'expanded')],
                  'aria-label': expanded ? 'Collapse row' : 'Expand row',
                  'aria-expanded': expanded,
                  onClick: (event: MouseEvent) => {
                    event.stopPropagation()
                    toggleExpand(record, key)
                  },
                },
                expanded ? '−' : '+',
              )
            : null,
        ],
      )
    }

    const renderFilter = (column: TableColumn, originalIndex: number) => {
      if (!column.filters?.length) {
        return null
      }
      const key = getColumnKey(column, originalIndex)
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
                  .filter((idx) => idx >= 0)
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
            handleFilter(column, originalIndex, values)
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
        h('tr', null, [
          renderSelectionHeader(),
          renderExpandHeader(),
          ...orderedColumns.value.map(({ column, originalIndex }, orderedIndex) => {
            const key = getColumnKey(column, originalIndex)
            const sortOrder = activeSorter.value.columnKey === key ? activeSorter.value.order : null
            const headerContent = slots.headerCell ? slots.headerCell({ column, index: originalIndex }) : column.title
            const headerCellProps: TableCellRenderProps = column.onHeaderCell ? column.onHeaderCell(column) : {}
            if (headerCellProps.colSpan === 0 || headerCellProps.rowSpan === 0) {
              return null
            }
            return h(
              'th',
              {
                key,
                class: [
                  ns.e('th'),
                  column.align && ns.em('th', column.align),
                  column.sorter && ns.em('th', 'sortable'),
                  sortOrder && ns.em('th', sortOrder),
                  column.fixed === 'left' && ns.em('cell', 'fixed-left'),
                  column.fixed === 'right' && ns.em('cell', 'fixed-right'),
                  headerCellProps.class,
                ],
                style: fixedCellStyle(orderedIndex, column, headerCellProps.style),
                rowspan: headerCellProps.rowSpan,
                colspan: headerCellProps.colSpan,
                onClick: () => handleSort(column, originalIndex),
              },
              [
                h('div', { class: ns.e('title') }, [
                  h('span', null, headerContent),
                  column.sorter ? h('span', { class: ns.e('sorter') }) : null,
                ]),
                renderFilter(column, originalIndex),
              ],
            )
          }),
        ]),
      )
    }

    const totalColumnCount = computed(
      () => orderedColumns.value.length + (isSelectionEnabled.value ? 1 : 0) + (isExpandableEnabled.value ? 1 : 0),
    )

    const renderEmpty = () =>
      h('tr', { class: ns.e('empty-row') }, [
        h(
          'td',
          {
            class: ns.e('empty'),
            colspan: Math.max(1, totalColumnCount.value),
          },
          slots.empty ? slots.empty() : 'No data',
        ),
      ])

    const renderExpandedRow = (record: any, rowIndex: number, key: TableSelectionKey): VNodeChild => {
      if (!isExpandableEnabled.value || !expandedRowKeySet.value.has(key)) {
        return null
      }
      return h(
        'tr',
        { key: `${key}__expanded`, class: ns.e('expanded-row') },
        h(
          'td',
          { class: [ns.e('td'), ns.e('expanded-cell')], colspan: totalColumnCount.value },
          props.expandable!.expandedRowRender!(record, rowIndex) as any,
        ),
      )
    }

    const renderRow = (record: any, rowIndex: number) => {
      const key = getRowKey(record, rowIndex, props.rowKey)
      const cells = orderedColumns.value
        .map(({ column, originalIndex }, orderedIndex) => {
          const cellProps: TableCellRenderProps = column.onCell ? column.onCell(record, rowIndex) : {}
          if (cellProps.rowSpan === 0 || cellProps.colSpan === 0) {
            return null
          }
          return h(
            'td',
            {
              key: getColumnKey(column, originalIndex),
              class: [
                ns.e('td'),
                column.align && ns.em('td', column.align),
                column.fixed === 'left' && ns.em('cell', 'fixed-left'),
                column.fixed === 'right' && ns.em('cell', 'fixed-right'),
                cellProps.class,
              ],
              style: fixedCellStyle(orderedIndex, column, cellProps.style),
              rowspan: cellProps.rowSpan,
              colspan: cellProps.colSpan,
            },
            renderCell(record, rowIndex, column) as any,
          )
        })
        .filter(Boolean)

      const trClickHandler = props.expandable?.expandRowByClick ? () => toggleExpand(record, key) : undefined

      return [
        h(
          'tr',
          {
            key,
            class: [ns.e('tr'), selectedRowKeySet.value.has(key) && ns.em('tr', 'selected')],
            onClick: trClickHandler,
          },
          [renderSelectionCell(record, rowIndex), renderExpandCell(record, rowIndex, key), ...cells],
        ),
        renderExpandedRow(record, rowIndex, key),
      ]
    }

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
        h('div', { class: ns.e('container'), style: containerStyle.value }, [
          h('table', { class: ns.e('table'), style: tableStyle.value }, [
            renderHeader(),
            h(
              'tbody',
              { class: ns.e('tbody') },
              displayData.value.length
                ? displayData.value.flatMap((record, rowIndex) => renderRow(record, rowIndex))
                : renderEmpty(),
            ),
          ]),
          props.loading ? h('div', { class: ns.e('loading') }, [h('span', { class: ns.e('loading-dot') })]) : null,
        ]),
        renderPagination(),
      ])
  },
})
