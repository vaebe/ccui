import type { Ref } from 'vue'
import type { CalendarProps, dateItem } from './calendar-types'
import dayjs from 'dayjs'
import { computed, defineComponent, ref, watch } from 'vue'
import { useConfig } from '../../config-provider/src/config-provider'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { emitValue, toDayjs } from '../../shared/utils/date'
import { calendarProps } from './calendar-types'
import './calendar.scss'

const DEFAULT_WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export default defineComponent({
  name: 'CCalendar',
  props: calendarProps,
  emits: ['change', 'update:modelValue'],
  setup(props: CalendarProps, { emit, slots }) {
    const ns = useNamespace('calendar')
    const cfg = useConfig()

    const localeCalendar = computed(() => cfg.locale?.Calendar ?? {})
    const weekList = computed<string[]>(() => {
      const fromLocale = localeCalendar.value.weekdaysShort
      return fromLocale && fromLocale.length === 7 ? fromLocale : DEFAULT_WEEKDAYS
    })
    const monthFormat = computed(() => localeCalendar.value.monthFormat || 'YYYY-MM')
    const prevLabel = computed(() => localeCalendar.value.prevMonthLabel || '上个月')
    const nextLabel = computed(() => localeCalendar.value.nextMonthLabel || '下个月')
    const todayLabel = computed(() => localeCalendar.value.todayLabel || '今天')

    const parseValue = () => toDayjs(props.modelValue, props.format) ?? dayjs()

    // 当前天 选中天
    const currentDate = ref(parseValue().format('YYYY-MM-DD'))

    // 当前月
    const currentMonth = ref(parseValue().format('YYYY-MM'))

    // 当前展示的日期列表
    const curDateList: Ref<dateItem[]> = ref([])

    // 根据月份计算当前展示日期的数组
    const generatedDate = (month?: string) => {
      // 获取当月第一天是周几
      const whichDay = dayjs(month).startOf('month').day()
      // 计算开始开始日期 7 减去当月第一天是周几（获取到的周几是 0123456， 其中0代表周日）
      const startDate = dayjs(dayjs(month).subtract(7 - whichDay, 'day')).format('YYYY-MM-DD')

      // 整理数据
      // 生成长度42的数组，为什么是42呢？ 因为有的月份是28 或者30 31， 35 会导致某些月份展示不全。
      curDateList.value = Array.from({ length: 42 }, (_, index) => index).reduce(
        (acc: Array<dateItem>, index: number) => {
          // 获取展示的日期
          const date = dayjs(startDate)
            .add(index + 1, 'day')
            .format('YYYY-MM-DD')
          // 分割日期 用于获取是 几号 如 123456
          const dateList = date.split('-')
          // 获取周几
          const week = dayjs(date).day()

          // 将需要的数据 放进数组
          acc.push({
            index: index + 1,
            date,
            day: dateList[dateList.length - 1],
            week: weekList.value[week],
          })
          // 返回数组
          return acc
        },
        [],
      )
    }

    // 初始化
    generatedDate(currentMonth.value)

    // 设置当前天、选中天， 生成对应月份
    const setCurrentDate = (date: string) => {
      currentDate.value = dayjs(date).format('YYYY-MM-DD')
      // 月份不同 重新生成日历
      if (!date.includes(currentMonth.value)) {
        currentMonth.value = dayjs(date).format('YYYY-MM')
        generatedDate(currentMonth.value)
      }

      const out = emitValue(dayjs(currentDate.value), props.valueFormat, props.format)
      emit('update:modelValue', out)
      emit('change', out)
    }

    // 上一月 下一月 当前月
    const changeMonth = (type: string) => {
      let month = ''
      // 下个月
      if (type === 'nextMonth') {
        month = dayjs(currentMonth.value).add(1, 'month').format('YYYY-MM')
      }

      // 上个月
      if (type === 'lastMonth') {
        month = dayjs(currentMonth.value).subtract(1, 'month').format('YYYY-MM')
      }

      // 传入YYYY-MM 格式的月份 格式化后会获取到当月的第一天
      setCurrentDate(month)
    }

    // props.modelValue 改变刷新数据
    watch(
      () => props.modelValue,
      () => {
        currentDate.value = parseValue().format('YYYY-MM-DD')
        // 月份不同 重新生成日历
        if (!currentDate.value.includes(currentMonth.value)) {
          currentMonth.value = parseValue().format('YYYY-MM')
          generatedDate(currentMonth.value)
        }
      },
    )

    // 获取每天 设置样式及操作
    const dateItemList = computed(() => {
      return curDateList.value.map((item) => {
        // item.date 的类型可以是字符串或数组 详见obj的定义
        const isCurrentMonth = item.date.includes(currentMonth.value)

        const isSelected = currentDate.value === item.date
        // 计算 绑定的class
        const className = {
          'current-month': isCurrentMonth,
          'current-date': isSelected,
          [ns.em('day-box', 'day')]: true,
        }

        const dateCellOpts = {
          isSelected,
          date: item.date,
          day: Number.parseInt(item.day),
        }

        return (
          <div
            onClick={() => {
              setCurrentDate(dateCellOpts.date)
            }}
            class={[className, props.classNames?.cell]}
            style={props.styles?.cell}
          >
            {slots.dateCell ? slots.dateCell(dateCellOpts) : dateCellOpts.day}
          </div>
        )
      })
    })

    // header 周 列表
    const weekItemList = computed(() => weekList.value.map((item) => <div class={ns.em('week', 'item')}>{item}</div>))

    const monthLabel = computed(() => dayjs(currentMonth.value).format(monthFormat.value))

    const defaultHeader = () => {
      return (
        <div class={[ns.e('header'), props.classNames?.header]} style={props.styles?.header}>
          <div>{monthLabel.value}</div>
          <div>
            <c-button
              type="primary"
              plain={true}
              onClick={() => {
                changeMonth('lastMonth')
              }}
            >
              {prevLabel.value}
            </c-button>
            <c-button
              type="primary"
              plain={true}
              onClick={() => {
                setCurrentDate(dayjs().format('YYYY-MM-DD'))
              }}
            >
              {todayLabel.value}
            </c-button>
            <c-button
              type="primary"
              plain={true}
              onClick={() => {
                changeMonth('nextMonth')
              }}
            >
              {nextLabel.value}
            </c-button>
          </div>
        </div>
      )
    }

    // header slot 的富作用域。把 navigation 工具 + 当前态一起暴露给 slot，让用户自定义工具栏时不必从外部重写月份切换逻辑。
    // 同时保留旧 string 形式的 .value 字段（旧 demo 模板 `{{ d.value }}` 可继续工作；裸 `{{ d }}` 会显示 [object Object]，需迁移）。
    // 暴露 token：value / currentMonth / setDate / changeMonth。
    const headerScope = computed(() => ({
      value: currentDate.value,
      currentMonth: currentMonth.value,
      setDate: (date: string) => setCurrentDate(date),
      changeMonth: (direction: 'lastMonth' | 'nextMonth') => changeMonth(direction),
    }))

    return () => (
      <div class={[ns.b(), props.classNames?.root]} style={props.styles?.root}>
        {slots.header ? slots.header(headerScope.value) : defaultHeader()}
        <div class={ns.e('week')}>{weekItemList.value}</div>
        <div class={[ns.e('day-box'), props.classNames?.body]} style={props.styles?.body}>
          {dateItemList.value}
        </div>
      </div>
    )
  },
})
