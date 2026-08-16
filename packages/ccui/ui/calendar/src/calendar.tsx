import type { Ref } from 'vue'
import type { CalendarProps, dateItem } from './calendar-types'
import dayjs from 'dayjs'
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
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
    const rootRef = ref<HTMLElement | null>(null)

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
      // 当月第一天
      const first = dayjs(month).startOf('month')
      // 当月第一天是周几（0123456，其中 0 代表周日）
      const whichDay = first.day()
      // 起始日期回退到所在周的周日，使网格第 N 列恰好对应星期 N，与周日…周六表头对齐
      const startDate = first.subtract(whichDay, 'day').format('YYYY-MM-DD')

      // 整理数据
      // 生成长度42的数组，为什么是42呢？ 因为有的月份是28 或者30 31， 35 会导致某些月份展示不全。
      curDateList.value = Array.from({ length: 42 }, (_, index) => index).reduce(
        (acc: Array<dateItem>, index: number) => {
          // 获取展示的日期
          const date = dayjs(startDate).add(index, 'day').format('YYYY-MM-DD')
          // 分割日期 用于获取是 几号 如 123456
          const dateList = date.split('-')
          // 获取周几
          const week = dayjs(date).day()

          // 将需要的数据 放进数组
          acc.push({
            index,
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
      // 只读模式下禁止任何改值（日期格点击、月份切换、header slot 暴露的 setDate/changeMonth 均经此收口）
      if (props.readOnly) return
      const parsed = dayjs(date)
      if (!parsed.isValid() || props.disabledDate?.(parsed)) return
      currentDate.value = parsed.format('YYYY-MM-DD')
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
      if (props.readOnly) return
      let month = ''
      // 下个月
      if (type === 'nextMonth') {
        month = dayjs(currentMonth.value).add(1, 'month').format('YYYY-MM')
      }

      // 上个月
      if (type === 'lastMonth') {
        month = dayjs(currentMonth.value).subtract(1, 'month').format('YYYY-MM')
      }

      if (!month) return

      // 月份导航与日期选择是两个独立动作：月初被禁用时仍允许浏览该月。
      currentMonth.value = month
      generatedDate(month)

      const firstDay = dayjs(month).startOf('month')
      if (!props.disabledDate?.(firstDay)) setCurrentDate(firstDay.format('YYYY-MM-DD'))
    }

    // props.modelValue 改变刷新数据
    watch(
      () => [props.modelValue, props.format],
      () => {
        currentDate.value = parseValue().format('YYYY-MM-DD')
        // 月份不同 重新生成日历
        if (!currentDate.value.includes(currentMonth.value)) {
          currentMonth.value = parseValue().format('YYYY-MM')
          generatedDate(currentMonth.value)
        }
      },
    )

    const isDateDisabled = (date: string) => props.readOnly || !!props.disabledDate?.(dayjs(date))

    // roving tabindex 在受控值被禁用时仍保留一个可达入口，优先当月的第一个可用日期。
    const tabStopDate = computed(() => {
      if (props.readOnly) return null
      const selected = curDateList.value.find((item) => item.date === currentDate.value)
      if (selected && !isDateDisabled(selected.date)) return selected.date
      return (
        curDateList.value.find((item) => item.date.includes(currentMonth.value) && !isDateDisabled(item.date))?.date ??
        curDateList.value.find((item) => !isDateDisabled(item.date))?.date ??
        null
      )
    })

    // 获取每天 设置样式及操作
    const dateItemList = computed(() => {
      return curDateList.value.map((item) => {
        // item.date 的类型可以是字符串或数组 详见obj的定义
        const isCurrentMonth = item.date.includes(currentMonth.value)

        const isSelected = currentDate.value === item.date
        const itemDate = dayjs(item.date)
        const isDisabled = isDateDisabled(item.date)
        // 计算 绑定的class
        const className = {
          'current-month': isCurrentMonth,
          'current-date': isSelected,
          'is-disabled': isDisabled,
          [ns.em('day-box', 'day')]: true,
        }

        const dateCellOpts = {
          isSelected,
          date: item.date,
          day: Number.parseInt(item.day),
        }

        return (
          <div
            role="gridcell"
            tabindex={tabStopDate.value === item.date ? 0 : -1}
            aria-selected={dateCellOpts.isSelected}
            aria-disabled={isDisabled}
            aria-label={dateCellOpts.date}
            aria-current={itemDate.isSame(dayjs(), 'day') ? 'date' : undefined}
            onClick={() => {
              if (isDisabled) return
              setCurrentDate(dateCellOpts.date)
            }}
            onKeydown={(e: KeyboardEvent) => {
              if (isDisabled) return
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setCurrentDate(dateCellOpts.date)
                return
              }
              const offset = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key]
              if (offset === undefined) return
              e.preventDefault()
              const target = itemDate.add(offset, 'day')
              if (props.disabledDate?.(target)) return
              setCurrentDate(target.format('YYYY-MM-DD'))
              nextTick(() => {
                ;(rootRef.value?.querySelector('[role="gridcell"][tabindex="0"]') as HTMLElement | null)?.focus()
              })
            }}
            class={[className, props.classNames?.cell]}
            style={props.styles?.cell}
          >
            {slots.dateCell ? slots.dateCell(dateCellOpts) : dateCellOpts.day}
          </div>
        )
      })
    })

    const dateRows = computed(() =>
      Array.from({ length: 6 }, (_, rowIndex) => (
        <div role="row" class={ns.e('day-row')}>
          {dateItemList.value.slice(rowIndex * 7, rowIndex * 7 + 7)}
        </div>
      )),
    )

    // header 周 列表
    const weekItemList = computed(() =>
      weekList.value.map((item) => (
        <div role="columnheader" class={ns.em('week', 'item')}>
          {item}
        </div>
      )),
    )

    const monthLabel = computed(() => dayjs(currentMonth.value).format(monthFormat.value))

    const defaultHeader = () => {
      return (
        <div class={[ns.e('header'), props.classNames?.header]} style={props.styles?.header}>
          <div>{monthLabel.value}</div>
          <div>
            <c-button
              type="primary"
              plain={true}
              disabled={props.readOnly}
              onClick={() => {
                changeMonth('lastMonth')
              }}
            >
              {prevLabel.value}
            </c-button>
            <c-button
              type="primary"
              plain={true}
              disabled={props.readOnly || !!props.disabledDate?.(dayjs())}
              onClick={() => {
                setCurrentDate(dayjs().format('YYYY-MM-DD'))
              }}
            >
              {todayLabel.value}
            </c-button>
            <c-button
              type="primary"
              plain={true}
              disabled={props.readOnly}
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
      <div ref={rootRef} class={[ns.b(), props.classNames?.root]} style={props.styles?.root}>
        {slots.header ? slots.header(headerScope.value) : defaultHeader()}
        <div
          role="grid"
          aria-readonly={props.readOnly}
          aria-label={monthLabel.value}
          class={[ns.e('day-box'), props.classNames?.body]}
          style={props.styles?.body}
        >
          <div role="row" class={ns.e('week')}>
            {weekItemList.value}
          </div>
          {dateRows.value}
        </div>
      </div>
    )
  },
})
