import type { Dayjs } from 'dayjs'
import type { Placement } from '@floating-ui/vue'
import type {
  DatePickerPlacement,
  DatePickerProps,
  DatePickerType,
  DisabledTimeReturn,
  PresetItem,
  TimeShowConfig,
} from './date-picker-types'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import dayjs from 'dayjs'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import {
  computed,
  defineComponent,
  Fragment,
  getCurrentInstance,
  h,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  Teleport,
  Transition,
  watch,
} from 'vue'
import { useConfig } from '../../config-provider/src/config-provider'
import { formItemInjectionKey } from '../../form/src/form-types'
import { renderIconWithFallback } from '../../shared/hooks/use-icon'
import { useNamespace } from '../../shared/hooks/use-namespace'
import {
  buildTimeColumnValues,
  emitValue,
  generateDecadeYearGrid,
  generateMonthGrid,
  generateQuarterGrid,
  generateYearMonthGrid,
  getWeekInfo,
  isSameDay,
  isSameMonth,
  toDayjs,
} from '../../shared/utils/date'
import { datePickerProps, DEFAULT_FORMAT_BY_PICKER, DEFAULT_TIME_FORMAT } from './date-picker-types'
import './date-picker.scss'

type PanelMode = 'date' | 'month' | 'year' | 'quarter'

const PLACEMENT_TO_FLOATING: Record<DatePickerPlacement, Placement> = {
  bottomLeft: 'bottom-start',
  bottomRight: 'bottom-end',
  topLeft: 'top-start',
  topRight: 'top-end',
}

const FALLBACK_WEEK_LABELS_SUN = ['日', '一', '二', '三', '四', '五', '六']
const FALLBACK_PANEL_LABEL_FORMAT = 'YYYY 年 M 月'
const FALLBACK_MONTH_NAMES = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const FALLBACK_QUARTER_NAMES = ['Q1', 'Q2', 'Q3', 'Q4']
const FALLBACK_WEEK_FORMAT = '{weekYear}-W{weekNumber}'

function defaultPanelMode(picker: DatePickerType): PanelMode {
  if (picker === 'month') return 'month'
  if (picker === 'year') return 'year'
  if (picker === 'quarter') return 'quarter'
  return 'date'
}

function startOfWeek(d: Dayjs, weekStart: 0 | 1): Dayjs {
  const dow = d.day() // Sun=0..Sat=6
  const offset = weekStart === 0 ? dow : (dow + 6) % 7
  return d.subtract(offset, 'day').startOf('day')
}

function isSameWeek(a: Dayjs | null, b: Dayjs | null, weekStart: 0 | 1): boolean {
  if (!a || !b) return a === b
  return startOfWeek(a, weekStart).isSame(startOfWeek(b, weekStart), 'day')
}

function isSameQuarter(a: Dayjs | null, b: Dayjs | null): boolean {
  if (!a || !b) return a === b
  return a.year() === b.year() && Math.floor(a.month() / 3) === Math.floor(b.month() / 3)
}

function formatWeekDisplay(template: string, info: { weekYear: number; weekNumber: number }): string {
  const wn = String(info.weekNumber).padStart(2, '0')
  return template.replace('{weekYear}', String(info.weekYear)).replace('{weekNumber}', wn)
}

function normalizeTimeConfig(raw: boolean | TimeShowConfig | undefined): TimeShowConfig {
  if (raw === true || raw === false || raw == null) return {}
  return raw
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

export default defineComponent({
  name: 'CDatePicker',
  props: datePickerProps,
  emits: ['update:modelValue', 'change', 'open-change', 'focus', 'blur', 'panel-change'],
  setup(props: DatePickerProps, { emit, slots }) {
    const ns = useNamespace('date-picker')
    const cfg = useConfig()
    const locale = computed(() => cfg.locale?.DatePicker ?? {})
    const uid = getCurrentInstance()?.uid ?? 0
    const popupId = `ccui-date-picker-popup-${uid}`
    const rootRef = ref<HTMLElement | null>(null)
    const popupRef = ref<HTMLElement | null>(null)
    const inputRef = ref<HTMLInputElement | null>(null)
    const open = shallowRef(false)
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)

    const showTimeActive = computed(() => !!props.showTime && props.picker === 'date')
    const timeCfg = computed<TimeShowConfig>(() => normalizeTimeConfig(props.showTime))

    // minDate / maxDate / disabledDate 合并：任意一条命中即 disabled。
    // 非 date 粒度（month/year/quarter）的 cell 仅在整个周期完全落在 [minDate, maxDate] 之外时才标 disabled，
    // 避免「minDate=2026-04-15 / picker='month'」把 4 月整月误判为禁选。
    const minDateDayjs = computed<Dayjs | null>(() => toDayjs(props.minDate))
    const maxDateDayjs = computed<Dayjs | null>(() => toDayjs(props.maxDate))
    function isOutOfRange(d: Dayjs, unit: 'day' | 'month' | 'year' | 'quarter' = 'day'): boolean {
      const min = minDateDayjs.value
      const max = maxDateDayjs.value
      if (unit === 'day') {
        if (min && d.isBefore(min, 'day')) return true
        if (max && d.isAfter(max, 'day')) return true
        return false
      }
      // month / year / quarter：cell 表示一个区间，区间与 [minDate, maxDate] 无交集 → disabled。
      const start = d.startOf(unit)
      const end = d.endOf(unit)
      if (min && end.isBefore(min, 'day')) return true
      if (max && start.isAfter(max, 'day')) return true
      return false
    }
    function isDateDisabled(d: Dayjs, unit: 'day' | 'month' | 'year' | 'quarter' = 'day'): boolean {
      if (isOutOfRange(d, unit)) return true
      return !!props.disabledDate?.(d)
    }
    const effectiveTimeFormat = computed(() =>
      showTimeActive.value ? timeCfg.value.format || DEFAULT_TIME_FORMAT : '',
    )
    const hasSeconds = computed(() => /s/.test(effectiveTimeFormat.value))
    const hasMinutes = computed(() => /m/.test(effectiveTimeFormat.value))

    const effectiveFormat = computed(() => {
      if (props.format) return props.format
      if (showTimeActive.value) {
        return `${DEFAULT_FORMAT_BY_PICKER.date} ${effectiveTimeFormat.value}`
      }
      return DEFAULT_FORMAT_BY_PICKER[props.picker]
    })

    const selectedDayjs = computed<Dayjs | null>(() => toDayjs(props.modelValue, effectiveFormat.value))
    const viewMonth = shallowRef<Dayjs>(selectedDayjs.value ?? toDayjs(undefined) ?? toDayjs(new Date())!)
    const panelMode = shallowRef<PanelMode>(defaultPanelMode(props.picker))
    // showTime 启用时的"确认前暂存值"。null 表示还没选过日期。
    const pendingValue = shallowRef<Dayjs | null>(null)
    // 本次 open 期间用户是否动过日期/时间格。用于 ok 按钮禁用判断（无 modelValue 且未动过时禁用）。
    const pendingDirty = shallowRef(false)
    // 键盘导航 focus 的 cell（仅 date 面板，单元为 day）。null 表示当前未走键盘导航。
    const focusedCellDate = shallowRef<Dayjs | null>(null)

    watch(selectedDayjs, (v) => {
      if (v && !isSameMonth(v, viewMonth.value)) {
        viewMonth.value = v
      }
    })

    watch(
      () => props.picker,
      (p) => {
        panelMode.value = defaultPanelMode(p)
      },
    )

    const placement = computed(() => PLACEMENT_TO_FLOATING[props.placement])
    const popupContainer = computed<HTMLElement | null>(() => {
      if (typeof document === 'undefined') return null
      if (props.getPopupContainer) return props.getPopupContainer(rootRef.value)
      if (props.popupAppendToBody) return document.body
      return null
    })
    const teleported = computed(() => popupContainer.value !== null)

    const { floatingStyles } = useFloating(rootRef, popupRef, {
      placement: placement as never,
      open,
      whileElementsMounted: autoUpdate,
      middleware: [offset(4), flip(), shift({ padding: 8 })],
      strategy: computed(() => (teleported.value ? 'fixed' : 'absolute')) as never,
    })

    const validationStatus = computed(() => formItem?.validateStatus.value ?? '')
    const mergedStatus = computed(() => props.status || validationStatus.value)

    const inputDisplay = computed(() => {
      if (!selectedDayjs.value) return ''
      if (props.picker === 'week') {
        const info = getWeekInfo(selectedDayjs.value, props.weekStart)
        return formatWeekDisplay(locale.value.weekFormat || FALLBACK_WEEK_FORMAT, info)
      }
      return selectedDayjs.value.format(effectiveFormat.value)
    })

    const placeholderText = computed(() => props.placeholder || locale.value.placeholder || '请选择日期')

    function setPanelMode(m: PanelMode) {
      if (panelMode.value === m) return
      panelMode.value = m
      emit('panel-change', m, viewMonth.value)
    }

    function initialPendingTime(): Dayjs {
      // 已选值 → 用已选时间；否则用 showTime.defaultValue 或 00:00:00
      if (selectedDayjs.value) return selectedDayjs.value
      const dv = toDayjs(timeCfg.value.defaultValue)
      if (dv) {
        const today = dayjs()
        return today.hour(dv.hour()).minute(dv.minute()).second(dv.second())
      }
      return dayjs().hour(0).minute(0).second(0).millisecond(0)
    }

    function openPopup() {
      if (props.disabled || open.value) return
      open.value = true
      emit('open-change', true)
      if (selectedDayjs.value) viewMonth.value = selectedDayjs.value
      panelMode.value = defaultPanelMode(props.picker)
      pendingValue.value = showTimeActive.value ? initialPendingTime() : null
      pendingDirty.value = false
    }

    function closePopup() {
      if (!open.value) return
      open.value = false
      focusedCellDate.value = null
      emit('open-change', false)
    }

    function togglePopup() {
      if (open.value) closePopup()
      else openPopup()
    }

    function emitChange(next: Dayjs | null) {
      const value = emitValue(next, props.valueFormat, effectiveFormat.value)
      emit('update:modelValue', value)
      emit('change', value, next ? next.format(effectiveFormat.value) : '')
      formItem?.validate('change')
    }

    // ===== 各面板的选择处理 =====

    function pickDate(cell: Dayjs) {
      if (isDateDisabled(cell)) return
      if (props.picker === 'week') {
        const wkStart = startOfWeek(cell, props.weekStart)
        if (selectedDayjs.value && isSameWeek(selectedDayjs.value, cell, props.weekStart)) {
          closePopup()
          return
        }
        emitChange(wkStart)
        closePopup()
        return
      }
      // showTime 启用：暂存选中日期 + 保留当前时分秒，不立即关闭
      if (showTimeActive.value) {
        const base = pendingValue.value ?? initialPendingTime()
        pendingValue.value = cell.hour(base.hour()).minute(base.minute()).second(base.second()).millisecond(0)
        pendingDirty.value = true
        return
      }
      if (selectedDayjs.value && isSameDay(selectedDayjs.value, cell)) {
        closePopup()
        return
      }
      emitChange(cell)
      closePopup()
    }

    function pickTime(unit: 'hour' | 'minute' | 'second', value: number) {
      const base = pendingValue.value ?? initialPendingTime()
      if (unit === 'hour') pendingValue.value = base.hour(value)
      else if (unit === 'minute') pendingValue.value = base.minute(value)
      else pendingValue.value = base.second(value)
      pendingDirty.value = true
    }

    function clickNow() {
      const now = dayjs()
      if (showTimeActive.value) {
        emitChange(now)
      } else {
        emitChange(now.startOf('day'))
      }
      closePopup()
    }

    function clickOk() {
      if (!pendingValue.value) {
        // 没选过日期，但 pendingValue 在 openPopup 时被初始化过 — 只有不在 showTime 模式时才会是 null
        closePopup()
        return
      }
      emitChange(pendingValue.value)
      closePopup()
    }

    function clickPreset(p: PresetItem) {
      const raw = typeof p.value === 'function' ? (p.value as () => unknown)() : p.value
      // 预设值用非严格解析：业务常用 '2026-05-09' / Date / Dayjs 等，不强求匹配 effectiveFormat
      const d = toDayjs(raw as never)
      if (!d) return
      if (showTimeActive.value) {
        pendingValue.value = d
        pendingDirty.value = true
        viewMonth.value = d
        return
      }
      // 非 showTime：立即提交（按 picker 模式语义对齐）
      if (props.picker === 'week') {
        emitChange(startOfWeek(d, props.weekStart))
      } else {
        emitChange(d)
      }
      closePopup()
    }

    function pickMonth(cell: Dayjs) {
      if (isDateDisabled(cell, 'month')) return
      if (props.picker === 'month') {
        emitChange(cell)
        closePopup()
        return
      }
      // date / week 模式：选中月后下钻回 date 视图
      viewMonth.value = cell
      setPanelMode('date')
    }

    function pickYear(cell: Dayjs) {
      if (isDateDisabled(cell, 'year')) return
      if (props.picker === 'year') {
        emitChange(cell)
        closePopup()
        return
      }
      viewMonth.value = cell
      if (props.picker === 'quarter') {
        setPanelMode('quarter')
      } else {
        // date / week / month
        setPanelMode('month')
      }
    }

    function pickQuarter(cell: Dayjs) {
      if (isDateDisabled(cell, 'quarter')) return
      emitChange(cell)
      closePopup()
    }

    // ===== 上一/下一与逐级展开 =====

    function navPrev() {
      if (panelMode.value === 'date') viewMonth.value = viewMonth.value.subtract(1, 'month')
      else if (panelMode.value === 'month' || panelMode.value === 'quarter')
        viewMonth.value = viewMonth.value.subtract(1, 'year')
      else if (panelMode.value === 'year') viewMonth.value = viewMonth.value.subtract(10, 'year')
    }
    function navNext() {
      if (panelMode.value === 'date') viewMonth.value = viewMonth.value.add(1, 'month')
      else if (panelMode.value === 'month' || panelMode.value === 'quarter')
        viewMonth.value = viewMonth.value.add(1, 'year')
      else if (panelMode.value === 'year') viewMonth.value = viewMonth.value.add(10, 'year')
    }
    function navSuperPrev() {
      if (panelMode.value === 'date') viewMonth.value = viewMonth.value.subtract(1, 'year')
      else if (panelMode.value === 'month' || panelMode.value === 'quarter')
        viewMonth.value = viewMonth.value.subtract(10, 'year')
      // year panel：无 super
    }
    function navSuperNext() {
      if (panelMode.value === 'date') viewMonth.value = viewMonth.value.add(1, 'year')
      else if (panelMode.value === 'month' || panelMode.value === 'quarter')
        viewMonth.value = viewMonth.value.add(10, 'year')
    }

    function onLabelClick() {
      if (panelMode.value === 'date') setPanelMode('month')
      else if (panelMode.value === 'month' || panelMode.value === 'quarter') setPanelMode('year')
      // year panel 不再上钻
    }

    function clear(e: MouseEvent) {
      e.stopPropagation()
      if (!selectedDayjs.value) return
      emitChange(null)
    }

    function onClickOutside(e: MouseEvent) {
      if (!open.value) return
      const target = e.target as Node | null
      if (!target) return
      if (rootRef.value?.contains(target)) return
      if (popupRef.value?.contains(target)) return
      closePopup()
    }

    onMounted(() => {
      document.addEventListener('mousedown', onClickOutside, true)
      if (props.autoFocus) {
        nextTick(() => inputRef.value?.focus())
      }
    })

    onUnmounted(() => {
      document.removeEventListener('mousedown', onClickOutside, true)
    })

    const showClear = computed(() => props.clearable && !props.disabled && !!selectedDayjs.value)

    // ===== 标签 / 月名 / 季度名 =====

    const panelLabel = computed(() => {
      if (panelMode.value === 'date') {
        return viewMonth.value.format(locale.value.panelLabelFormat || FALLBACK_PANEL_LABEL_FORMAT)
      }
      if (panelMode.value === 'month' || panelMode.value === 'quarter') {
        return String(viewMonth.value.year())
      }
      // year (decade)
      const decadeStart = Math.floor(viewMonth.value.year() / 10) * 10
      return `${decadeStart}-${decadeStart + 9}`
    })

    const monthNames = computed(() => locale.value.monthNamesShort ?? FALLBACK_MONTH_NAMES)
    const quarterNames = computed(() => locale.value.quarterNames ?? FALLBACK_QUARTER_NAMES)
    const weekLabels = computed(() => {
      const base = locale.value.weekdaysShort ?? FALLBACK_WEEK_LABELS_SUN
      return props.weekStart === 1 ? [...base.slice(1), base[0]] : base
    })
    const weekHeaderLabel = computed(() => locale.value.weekHeader || '周')

    // ===== 渲染 =====

    function renderPanelHeader() {
      const mode = panelMode.value
      const showSuper = mode !== 'year'
      const prevMod = mode === 'date' ? 'prev-month' : mode === 'year' ? 'prev-decade' : 'prev-year'
      const nextMod = mode === 'date' ? 'next-month' : mode === 'year' ? 'next-decade' : 'next-year'
      const superPrevMod = mode === 'date' ? 'prev-year' : 'prev-decade'
      const superNextMod = mode === 'date' ? 'next-year' : 'next-decade'
      const prevAria =
        mode === 'date'
          ? locale.value.prevMonthLabel || '上个月'
          : mode === 'year'
            ? '前十年'
            : locale.value.prevYearLabel || '前一年'
      const nextAria =
        mode === 'date'
          ? locale.value.nextMonthLabel || '下个月'
          : mode === 'year'
            ? '后十年'
            : locale.value.nextYearLabel || '后一年'
      const superPrevAria = mode === 'date' ? locale.value.prevYearLabel || '前一年' : '前十年'
      const superNextAria = mode === 'date' ? locale.value.nextYearLabel || '后一年' : '后十年'
      return (
        <div class={ns.e('panel-header')}>
          {showSuper && (
            <button
              type="button"
              class={[ns.e('arrow'), ns.em('arrow', superPrevMod)]}
              aria-label={superPrevAria}
              onClick={navSuperPrev}
            >
              «
            </button>
          )}
          <button
            type="button"
            class={[ns.e('arrow'), ns.em('arrow', prevMod)]}
            aria-label={prevAria}
            onClick={navPrev}
          >
            ‹
          </button>
          <span
            class={[ns.e('panel-label'), mode !== 'year' && ns.em('panel-label', 'clickable')]}
            role="button"
            onClick={onLabelClick}
          >
            {panelLabel.value}
          </span>
          <button
            type="button"
            class={[ns.e('arrow'), ns.em('arrow', nextMod)]}
            aria-label={nextAria}
            onClick={navNext}
          >
            ›
          </button>
          {showSuper && (
            <button
              type="button"
              class={[ns.e('arrow'), ns.em('arrow', superNextMod)]}
              aria-label={superNextAria}
              onClick={navSuperNext}
            >
              »
            </button>
          )}
        </div>
      )
    }

    // showTime 启用时高亮 pendingValue（用户尚未点 ok）；否则用 selectedDayjs。
    const panelSelected = computed<Dayjs | null>(() =>
      showTimeActive.value ? pendingValue.value : selectedDayjs.value,
    )

    // disabledTime + showTime.disabled* 合并：任意一条命中即 disabled。
    function mergedDisabledHours(): number[] {
      const fromTime = timeCfg.value.disabledHours?.() ?? []
      const fromDynamic = props.disabledTime?.(pendingValue.value)?.disabledHours?.() ?? []
      if (fromTime.length === 0) return fromDynamic
      if (fromDynamic.length === 0) return fromTime
      return Array.from(new Set([...fromTime, ...fromDynamic]))
    }
    function mergedDisabledMinutes(hour: number): number[] {
      const fromTime = timeCfg.value.disabledMinutes?.() ?? []
      const fromDynamic = props.disabledTime?.(pendingValue.value)?.disabledMinutes?.(hour) ?? []
      if (fromTime.length === 0) return fromDynamic
      if (fromDynamic.length === 0) return fromTime
      return Array.from(new Set([...fromTime, ...fromDynamic]))
    }
    function mergedDisabledSeconds(hour: number, minute: number): number[] {
      const fromTime = timeCfg.value.disabledSeconds?.() ?? []
      const fromDynamic = props.disabledTime?.(pendingValue.value)?.disabledSeconds?.(hour, minute) ?? []
      if (fromTime.length === 0) return fromDynamic
      if (fromDynamic.length === 0) return fromTime
      return Array.from(new Set([...fromTime, ...fromDynamic]))
    }

    function renderCellInner(current: Dayjs, type: 'date' | 'month' | 'year' | 'quarter', fallback: string | number) {
      if (slots.cell) {
        return slots.cell({ current, type, today: dayjs() })
      }
      return <span class={ns.e('cell-inner')}>{fallback}</span>
    }

    // ===== 键盘导航（仅 date 面板） =====
    function onInputKeydown(e: KeyboardEvent) {
      if (props.disabled) return
      const k = e.key
      if (!open.value) {
        if (k === 'Enter' || k === ' ' || k === 'ArrowDown') {
          e.preventDefault()
          openPopup()
        } else if (k === 'Escape' || k === 'Tab') {
          // 关闭中按 esc 不动作；tab 走原生行为
        }
        return
      }
      // 面板已打开
      if (k === 'Escape') {
        e.preventDefault()
        closePopup()
        return
      }
      if (k === 'Tab') {
        closePopup()
        return
      }
      // 仅 date 面板支持方向键移动 cell
      if (panelMode.value !== 'date') return
      const base = focusedCellDate.value ?? panelSelected.value ?? viewMonth.value
      let next: Dayjs | null = null
      if (k === 'ArrowLeft') next = base.subtract(1, 'day')
      else if (k === 'ArrowRight') next = base.add(1, 'day')
      else if (k === 'ArrowUp') next = base.subtract(7, 'day')
      else if (k === 'ArrowDown') next = base.add(7, 'day')
      else if (k === 'Enter') {
        e.preventDefault()
        if (focusedCellDate.value) pickDate(focusedCellDate.value)
        return
      }
      if (next) {
        e.preventDefault()
        focusedCellDate.value = next
        if (!isSameMonth(next, viewMonth.value)) viewMonth.value = next
      }
    }

    function renderDatePanel() {
      const grid = generateMonthGrid(viewMonth.value, props.weekStart)
      const rows: ReturnType<typeof generateMonthGrid>[] = []
      for (let i = 0; i < 6; i += 1) rows.push(grid.slice(i * 7, i * 7 + 7))
      const weekPicker = props.picker === 'week'
      const sel = panelSelected.value
      return (
        <Fragment>
          <div class={[ns.e('week-row'), weekPicker && ns.em('week-row', 'with-week')]}>
            {weekPicker && <div class={ns.e('week-cell')}>{weekHeaderLabel.value}</div>}
            {weekLabels.value.map((w) => (
              <div class={ns.e('week-cell')}>{w}</div>
            ))}
          </div>
          <div class={[ns.e('grid'), weekPicker && ns.em('grid', 'with-week')]}>
            {rows.map((row) => {
              const rowWeekInfo = weekPicker ? getWeekInfo(row[0].date, props.weekStart) : null
              const rowSelected = weekPicker && !!sel && row.some((c) => isSameWeek(sel, c.date, props.weekStart))
              return (
                <Fragment>
                  {rowWeekInfo && (
                    <div class={[ns.e('week-number'), rowSelected && ns.em('week-number', 'selected')]}>
                      {rowWeekInfo.weekNumber}
                    </div>
                  )}
                  {row.map((cell) => {
                    const disabled = isDateDisabled(cell.date)
                    const selected = weekPicker ? rowSelected : !!sel && isSameDay(sel, cell.date)
                    const isFocused = !!focusedCellDate.value && isSameDay(focusedCellDate.value, cell.date)
                    const cellCls = [
                      ns.e('cell'),
                      !cell.isCurrentMonth && ns.em('cell', 'outside'),
                      cell.isToday && ns.em('cell', 'today'),
                      selected && ns.em('cell', 'selected'),
                      weekPicker && rowSelected && ns.em('cell', 'in-week'),
                      disabled && ns.em('cell', 'disabled'),
                      isFocused && ns.em('cell', 'focused'),
                    ]
                    return (
                      <div
                        class={cellCls}
                        role="gridcell"
                        aria-selected={selected}
                        aria-disabled={disabled}
                        onClick={() => !disabled && pickDate(cell.date)}
                      >
                        {renderCellInner(cell.date, 'date', cell.day)}
                      </div>
                    )
                  })}
                </Fragment>
              )
            })}
          </div>
        </Fragment>
      )
    }

    function renderTimeColumn(unit: 'hour' | 'minute' | 'second') {
      const cfg = timeCfg.value
      const range = unit === 'hour' ? 24 : 60
      const step =
        unit === 'hour' ? (cfg.hourStep ?? 1) : unit === 'minute' ? (cfg.minuteStep ?? 1) : (cfg.secondStep ?? 1)
      const pendHour = pendingValue.value?.hour() ?? 0
      const pendMin = pendingValue.value?.minute() ?? 0
      const disabledVals =
        unit === 'hour'
          ? mergedDisabledHours()
          : unit === 'minute'
            ? mergedDisabledMinutes(pendHour)
            : mergedDisabledSeconds(pendHour, pendMin)
      let cells = buildTimeColumnValues(range, step, disabledVals)
      if (cfg.hideDisabledOptions) cells = cells.filter((c) => !c.disabled)
      const cur = pendingValue.value
      const curValue = !cur ? -1 : unit === 'hour' ? cur.hour() : unit === 'minute' ? cur.minute() : cur.second()
      return (
        <div class={[ns.e('time-column'), ns.em('time-column', unit)]} role="listbox">
          {cells.map((c) => {
            const isSel = c.value === curValue
            const cellCls = [
              ns.e('time-cell'),
              isSel && ns.em('time-cell', 'selected'),
              c.disabled && ns.em('time-cell', 'disabled'),
            ]
            return (
              <div
                class={cellCls}
                role="option"
                aria-selected={isSel}
                aria-disabled={c.disabled}
                onClick={() => !c.disabled && pickTime(unit, c.value)}
              >
                {pad2(c.value)}
              </div>
            )
          })}
        </div>
      )
    }

    function renderTimeColumns() {
      return (
        <div class={ns.e('time-columns')}>
          {renderTimeColumn('hour')}
          {hasMinutes.value && renderTimeColumn('minute')}
          {hasSeconds.value && renderTimeColumn('second')}
        </div>
      )
    }

    function renderPresets() {
      return (
        <ul class={ns.e('presets')}>
          {props.presets.map((p) => {
            const label = typeof p.label === 'function' ? (p.label as () => string)() : p.label
            return (
              <li class={ns.e('preset-item')} role="button" onClick={() => clickPreset(p)}>
                {label}
              </li>
            )
          })}
        </ul>
      )
    }

    function renderFooter() {
      // ok 禁用：showTime 启用且既无已有 modelValue 又未动过任何格
      const okDisabled = showTimeActive.value && !selectedDayjs.value && !pendingDirty.value
      const hasExtra = !!slots['extra-footer']
      const showActions = showTimeActive.value
      if (!hasExtra && !showActions) return null
      return (
        <div class={ns.e('footer')}>
          {hasExtra && <div class={ns.e('extra-footer')}>{slots['extra-footer']!()}</div>}
          {showActions && (
            <div class={ns.e('footer-actions')}>
              {props.showNow && (
                <button type="button" class={[ns.e('footer-btn'), ns.em('footer-btn', 'now')]} onClick={clickNow}>
                  {locale.value.now || '此刻'}
                </button>
              )}
              <button
                type="button"
                class={[ns.e('footer-btn'), ns.em('footer-btn', 'ok')]}
                disabled={okDisabled}
                onClick={clickOk}
              >
                {locale.value.ok || '确定'}
              </button>
            </div>
          )}
        </div>
      )
    }

    function renderMonthPanel() {
      const cells = generateYearMonthGrid(viewMonth.value)
      return (
        <div class={[ns.e('grid'), ns.em('grid', 'month')]}>
          {cells.map((c) => {
            const disabled = isDateDisabled(c.date, 'month')
            const selected = !!selectedDayjs.value && isSameMonth(selectedDayjs.value, c.date)
            const cellCls = [
              ns.e('cell'),
              ns.em('cell', 'month'),
              c.isToday && ns.em('cell', 'today'),
              selected && ns.em('cell', 'selected'),
              disabled && ns.em('cell', 'disabled'),
            ]
            return (
              <div
                class={cellCls}
                role="gridcell"
                aria-selected={selected}
                aria-disabled={disabled}
                onClick={() => !disabled && pickMonth(c.date)}
              >
                {renderCellInner(c.date, 'month', monthNames.value[c.month])}
              </div>
            )
          })}
        </div>
      )
    }

    function renderYearPanel() {
      const cells = generateDecadeYearGrid(viewMonth.value)
      return (
        <div class={[ns.e('grid'), ns.em('grid', 'year')]}>
          {cells.map((c) => {
            const disabled = isDateDisabled(c.date, 'year')
            const selected = !!selectedDayjs.value && selectedDayjs.value.year() === c.year
            const cellCls = [
              ns.e('cell'),
              ns.em('cell', 'year'),
              !c.isInDecade && ns.em('cell', 'outside'),
              c.isToday && ns.em('cell', 'today'),
              selected && ns.em('cell', 'selected'),
              disabled && ns.em('cell', 'disabled'),
            ]
            return (
              <div
                class={cellCls}
                role="gridcell"
                aria-selected={selected}
                aria-disabled={disabled}
                onClick={() => !disabled && pickYear(c.date)}
              >
                {renderCellInner(c.date, 'year', c.year)}
              </div>
            )
          })}
        </div>
      )
    }

    function renderQuarterPanel() {
      const cells = generateQuarterGrid(viewMonth.value)
      return (
        <div class={[ns.e('grid'), ns.em('grid', 'quarter')]}>
          {cells.map((c) => {
            const disabled = isDateDisabled(c.date, 'quarter')
            const selected = !!selectedDayjs.value && isSameQuarter(selectedDayjs.value, c.date)
            const cellCls = [
              ns.e('cell'),
              ns.em('cell', 'quarter'),
              c.isCurrentQuarter && ns.em('cell', 'today'),
              selected && ns.em('cell', 'selected'),
              disabled && ns.em('cell', 'disabled'),
            ]
            return (
              <div
                class={cellCls}
                role="gridcell"
                aria-selected={selected}
                aria-disabled={disabled}
                onClick={() => !disabled && pickQuarter(c.date)}
              >
                {renderCellInner(c.date, 'quarter', quarterNames.value[c.quarter - 1])}
              </div>
            )
          })}
        </div>
      )
    }

    function renderPanelBody() {
      if (panelMode.value === 'month') return renderMonthPanel()
      if (panelMode.value === 'year') return renderYearPanel()
      if (panelMode.value === 'quarter') return renderQuarterPanel()
      return renderDatePanel()
    }

    function buildPopup() {
      const hasPresets = props.presets.length > 0
      const popupCls = [
        ns.e('panel'),
        ns.em('panel', `picker-${props.picker}`),
        ns.em('panel', `mode-${panelMode.value}`),
        showTimeActive.value && ns.em('panel', 'with-time'),
        hasPresets && ns.em('panel', 'with-presets'),
        props.popupClassName,
      ].filter(Boolean) as string[]
      // showTime + date 模式：日期面板与时间列横排，footer 在下方
      const inner =
        showTimeActive.value && panelMode.value === 'date'
          ? h('div', { class: ns.e('body-row') }, [
              h('div', { class: ns.e('date-side') }, [renderPanelHeader(), renderPanelBody()]),
              renderTimeColumns(),
            ])
          : h(Fragment, null, [renderPanelHeader(), renderPanelBody()])
      // presets rail 在主体左侧
      const main = hasPresets
        ? h('div', { class: ns.e('main-row') }, [renderPresets(), h('div', { class: ns.e('main-body') }, [inner])])
        : inner
      const footer = renderFooter()
      const children = footer ? [main, footer] : [main]
      return h(
        'div',
        {
          ref: popupRef,
          id: popupId,
          class: [popupCls, props.classNames?.popup],
          style: [floatingStyles.value, props.styles?.popup] as any,
          role: 'dialog',
          'aria-label': locale.value.placeholder || '选择日期',
        },
        children,
      )
    }

    function renderPopup() {
      const popup = open.value ? buildPopup() : null
      const transitioned = h(
        Transition as never,
        { name: props.transitionName, appear: true },
        { default: () => popup },
      )
      if (teleported.value && popupContainer.value) {
        return h(Teleport, { to: popupContainer.value }, [transitioned])
      }
      return transitioned
    }

    const rootCls = computed(() => [
      ns.b(),
      ns.m(`picker-${props.picker}`),
      props.disabled && ns.is('disabled'),
      open.value && ns.is('open'),
      ns.m(props.size),
      mergedStatus.value && ns.m(`status-${mergedStatus.value}`),
      props.variant && ns.m(`variant-${props.variant}`),
    ])

    return () => (
      <div ref={rootRef} class={[rootCls.value, props.classNames?.root]} style={props.styles?.root}>
        <div class={ns.e('input-wrap')} onClick={togglePopup}>
          <input
            ref={inputRef}
            class={[ns.e('input'), props.classNames?.input]}
            style={props.styles?.input}
            type="text"
            readonly={props.inputReadOnly}
            disabled={props.disabled}
            placeholder={placeholderText.value}
            value={inputDisplay.value}
            aria-haspopup="dialog"
            aria-expanded={open.value}
            aria-controls={popupId}
            onFocus={() => emit('focus')}
            onBlur={() => {
              emit('blur')
              formItem?.validate('blur')
            }}
            onKeydown={onInputKeydown}
          />
          {showClear.value ? (
            <span class={ns.e('clear')} role="button" aria-label={locale.value.clearLabel || '清除'} onClick={clear}>
              {renderIconWithFallback(slots.clearIcon, props.clearIcon, 'mdi:close-circle')}
            </span>
          ) : (
            <span class={ns.e('suffix')} aria-hidden="true">
              {renderIconWithFallback(slots.suffixIcon, props.suffixIcon, 'mdi:calendar-outline')}
            </span>
          )}
        </div>
        {renderPopup()}
      </div>
    )
  },
})
