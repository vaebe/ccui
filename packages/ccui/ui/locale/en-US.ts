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
  TreeSelect: { notFoundContent: 'No data', searchPlaceholder: 'Search' },
  Select: { notFoundContent: 'No data' },
  Pagination: {
    itemsPerPage: '/ page',
    jumpTo: 'Go to',
    page: '',
    prevPage: 'Previous Page',
    nextPage: 'Next Page',
    total: 'Total {total} items',
    pagination: 'Pagination',
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
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    quarterNames: ['Q1', 'Q2', 'Q3', 'Q4'],
    weekFormat: '{weekYear}-W{weekNumber}',
    weekHeader: 'Wk',
    now: 'Now',
    ok: 'OK',
    prevYearLabel: 'Previous year',
    prevMonthLabel: 'Previous month',
    nextYearLabel: 'Next year',
    nextMonthLabel: 'Next month',
    clearLabel: 'Clear',
  },
  Calendar: {
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    prevMonthLabel: 'Previous month',
    nextMonthLabel: 'Next month',
    todayLabel: 'Today',
    monthFormat: 'MMM YYYY',
  },
}

export default enUS
