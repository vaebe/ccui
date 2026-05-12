import type { Locale } from '../config-provider/src/config-provider-types'

const enUS: Locale = {
  locale: 'en-US',
  Modal: {
    okText: 'OK',
    cancelText: 'Cancel',
    justOkText: 'Got it',
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Cancel',
  },
  Empty: {
    description: 'No data',
  },
  AutoComplete: { notFoundContent: 'No data' },
  Mentions: { notFoundContent: 'No data' },
  Cascader: { notFoundContent: 'No data' },
  TreeSelect: { notFoundContent: 'No data' },
  Select: { notFoundContent: 'No data' },
  Pagination: {
    itemsPerPage: '/ page',
    jumpTo: 'Go to',
    page: '',
    prevPage: 'Previous Page',
    nextPage: 'Next Page',
    total: 'Total {total} items',
  },
  Image: {
    loading: 'Loading',
    error: 'Failed to load',
  },
  DatePicker: {
    placeholder: 'Select date',
    rangePlaceholder: ['Start date', 'End date'],
    timePlaceholder: 'Select time',
    weekdaysShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    panelLabelFormat: 'MMM YYYY',
    now: 'Now',
    ok: 'OK',
    prevYearLabel: 'Previous year',
    prevMonthLabel: 'Previous month',
    nextYearLabel: 'Next year',
    nextMonthLabel: 'Next month',
    clearLabel: 'Clear',
  },
}

export default enUS
