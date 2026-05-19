import type { Locale } from '../config-provider/src/config-provider-types'

const jaJP: Locale = {
  locale: 'ja-JP',
  Modal: {
    okText: 'OK',
    cancelText: 'キャンセル',
    justOkText: 'OK',
  },
  Popconfirm: {
    confirmText: 'OK',
    cancelText: 'キャンセル',
  },
  Empty: {
    description: 'データなし',
  },
  AutoComplete: { notFoundContent: 'データなし' },
  Mentions: { notFoundContent: 'データなし' },
  Cascader: { notFoundContent: 'データなし' },
  TreeSelect: { notFoundContent: 'データなし', searchPlaceholder: '検索' },
  Select: { notFoundContent: 'データなし' },
  Pagination: {
    itemsPerPage: ' / ページ',
    jumpTo: '移動',
    page: 'ページ',
    prevPage: '前のページ',
    nextPage: '次のページ',
    total: '全 {total} 件',
    pagination: 'ページネーション',
  },
  Image: {
    loading: '読み込み中',
    error: '読み込み失敗',
  },
  DatePicker: {
    placeholder: '日付を選択',
    rangePlaceholder: ['開始日', '終了日'],
    timePlaceholder: '時刻を選択',
    weekdaysShort: ['日', '月', '火', '水', '木', '金', '土'],
    panelLabelFormat: 'YYYY年M月',
    monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    quarterNames: ['Q1', 'Q2', 'Q3', 'Q4'],
    weekFormat: '{weekYear}年 第{weekNumber}週',
    weekHeader: '週',
    now: '現在',
    ok: 'OK',
    prevYearLabel: '前年',
    prevMonthLabel: '先月',
    nextYearLabel: '翌年',
    nextMonthLabel: '翌月',
    clearLabel: 'クリア',
  },
  Calendar: {
    weekdaysShort: ['日', '月', '火', '水', '木', '金', '土'],
    prevMonthLabel: '先月',
    nextMonthLabel: '翌月',
    todayLabel: '今日',
    monthFormat: 'YYYY年M月',
  },
}

export default jaJP
