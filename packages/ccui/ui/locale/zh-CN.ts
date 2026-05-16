import type { Locale } from '../config-provider/src/config-provider-types'

const zhCN: Locale = {
  locale: 'zh-CN',
  Modal: {
    okText: '确 定',
    cancelText: '取 消',
    justOkText: '知道了',
  },
  Popconfirm: {
    okText: '确 定',
    cancelText: '取 消',
  },
  Empty: {
    description: '暂无数据',
  },
  AutoComplete: { notFoundContent: '暂无数据' },
  Mentions: { notFoundContent: '暂无数据' },
  Cascader: { notFoundContent: '暂无数据' },
  TreeSelect: { notFoundContent: '暂无数据', searchPlaceholder: '搜索' },
  Select: { notFoundContent: '暂无数据' },
  Pagination: {
    itemsPerPage: '条/页',
    jumpTo: '跳至',
    page: '页',
    prevPage: '上一页',
    nextPage: '下一页',
    total: '共 {total} 条',
  },
  Image: {
    loading: '加载中',
    error: '加载失败',
  },
  DatePicker: {
    placeholder: '请选择日期',
    rangePlaceholder: ['开始日期', '结束日期'],
    timePlaceholder: '请选择时间',
    weekdaysShort: ['日', '一', '二', '三', '四', '五', '六'],
    panelLabelFormat: 'YYYY 年 M 月',
    monthNamesShort: [
      '1 月',
      '2 月',
      '3 月',
      '4 月',
      '5 月',
      '6 月',
      '7 月',
      '8 月',
      '9 月',
      '10 月',
      '11 月',
      '12 月',
    ],
    quarterNames: ['一季度', '二季度', '三季度', '四季度'],
    weekFormat: '{weekYear} 年第 {weekNumber} 周',
    weekHeader: '周',
    now: '此刻',
    ok: '确定',
    prevYearLabel: '前一年',
    prevMonthLabel: '上个月',
    nextYearLabel: '后一年',
    nextMonthLabel: '下个月',
    clearLabel: '清除',
  },
}

export default zhCN
