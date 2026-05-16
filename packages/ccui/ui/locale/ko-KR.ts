import type { Locale } from '../config-provider/src/config-provider-types'

const koKR: Locale = {
  locale: 'ko-KR',
  Modal: {
    okText: '확인',
    cancelText: '취소',
    justOkText: '확인',
  },
  Popconfirm: {
    okText: '확인',
    cancelText: '취소',
  },
  Empty: {
    description: '데이터 없음',
  },
  AutoComplete: { notFoundContent: '데이터 없음' },
  Mentions: { notFoundContent: '데이터 없음' },
  Cascader: { notFoundContent: '데이터 없음' },
  TreeSelect: { notFoundContent: '데이터 없음', searchPlaceholder: '검색' },
  Select: { notFoundContent: '데이터 없음' },
  Pagination: {
    itemsPerPage: ' / 페이지',
    jumpTo: '이동',
    page: '페이지',
    prevPage: '이전 페이지',
    nextPage: '다음 페이지',
    total: '총 {total}개',
    pagination: '페이지네이션',
  },
  Image: {
    loading: '로딩 중',
    error: '로드 실패',
  },
  DatePicker: {
    placeholder: '날짜 선택',
    rangePlaceholder: ['시작일', '종료일'],
    timePlaceholder: '시간 선택',
    weekdaysShort: ['일', '월', '화', '수', '목', '금', '토'],
    panelLabelFormat: 'YYYY년 M월',
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    quarterNames: ['1분기', '2분기', '3분기', '4분기'],
    weekFormat: '{weekYear}년 {weekNumber}째 주',
    weekHeader: '주',
    now: '지금',
    ok: '확인',
    prevYearLabel: '작년',
    prevMonthLabel: '지난 달',
    nextYearLabel: '내년',
    nextMonthLabel: '다음 달',
    clearLabel: '지우기',
  },
  Calendar: {
    weekdaysShort: ['일', '월', '화', '수', '목', '금', '토'],
    prevMonthLabel: '지난 달',
    nextMonthLabel: '다음 달',
    todayLabel: '오늘',
    monthFormat: 'YYYY년 M월',
  },
}

export default koKR
