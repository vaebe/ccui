import type { Placement } from '@floating-ui/vue'
import type { Dayjs } from 'dayjs'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import type {
  DateOutputFormat,
  RangePickerPlacement,
  RangePickerProps,
  RangePresetItem,
  RangeTimeShowConfig,
  RangeValue,
} from './range-picker-types'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import dayjs from 'dayjs'
import {
  computed,
  defineComponent,
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
import { useNamespace } from '../../shared/hooks/use-namespace'
import { buildTimeColumnValues, emitValue, generateMonthGrid, isSameDay, toDayjs } from '../../shared/utils/date'
import { RANGE_DEFAULT_TIME_FORMAT, rangePickerProps } from './range-picker-types'
import './range-picker.scss'

const PLACEMENT_TO_FLOATING: Record<RangePickerPlacement, Placement> = {
  bottomLeft: 'bottom-start',
  bottomRight: 'bottom-end',
  topLeft: 'top-start',
  topRight: 'top-end',
}

const FALLBACK_WEEK_LABELS_SUN = ['日', '一', '二', '三', '四', '五', '六']
const FALLBACK_PANEL_LABEL_FORMAT = 'YYYY 年 M 月'
const FALLBACK_RANGE_PLACEHOLDER: [string, string] = ['开始日期', '结束日期']

type Phase = 'start' | 'end'

function emitRangeValue(start: Dayjs | null, end: Dayjs | null, output: DateOutputFormat, format: string): RangeValue {
  if (!start && !end) return null
  return [emitValue(start, output, format), emitValue(end, output, format)] as RangeValue
}

function normalizeTimeConfig(raw: boolean | RangeTimeShowConfig | undefined): RangeTimeShowConfig {
  if (raw === true || raw === false || raw == null) return {}
  return raw
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function combineDayWithTime(day: Dayjs, time: Dayjs | null): Dayjs {
  if (!time) return day.hour(0).minute(0).second(0).millisecond(0)
  return day.hour(time.hour()).minute(time.minute()).second(time.second()).millisecond(0)
}

export default defineComponent({
  name: 'CRangePicker',
  props: rangePickerProps,
  emits: ['update:modelValue', 'change', 'open-change', 'focus', 'blur'],
  setup(props: RangePickerProps, { emit }) {
    const ns = useNamespace('range-picker')
    const cfg = useConfig()
    const locale = computed(() => cfg.locale?.DatePicker ?? {})
    const rootRef = ref<HTMLElement | null>(null)
    const popupRef = ref<HTMLElement | null>(null)
    const startInputRef = ref<HTMLInputElement | null>(null)
    const endInputRef = ref<HTMLInputElement | null>(null)
    const open = shallowRef(false)
    const phase = shallowRef<Phase>('start')
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)

    const showTimeActive = computed(() => !!props.showTime)
    const timeCfg = computed<RangeTimeShowConfig>(() => normalizeTimeConfig(props.showTime))
    const effectiveTimeFormat = computed(() =>
      showTimeActive.value ? timeCfg.value.format || RANGE_DEFAULT_TIME_FORMAT : '',
    )
    const hasMinutes = computed(() => /m/.test(effectiveTimeFormat.value))
    const hasSeconds = computed(() => /s/.test(effectiveTimeFormat.value))

    // showTime 启用且用户未显式给 format 加时间 token 时，自动追加；显式 format 优先
    const effectiveFormat = computed(() => {
      if (showTimeActive.value) {
        if (/[HhmsAa]/.test(props.format)) return props.format
        return `YYYY-MM-DD ${effectiveTimeFormat.value}`
      }
      return props.format
    })

    const selectedStart = computed<Dayjs | null>(() => {
      const v = props.modelValue
      if (!v || !Array.isArray(v)) return null
      return toDayjs(v[0], effectiveFormat.value)
    })
    const selectedEnd = computed<Dayjs | null>(() => {
      const v = props.modelValue
      if (!v || !Array.isArray(v)) return null
      return toDayjs(v[1], effectiveFormat.value)
    })

    const pendingStart = shallowRef<Dayjs | null>(selectedStart.value)
    const pendingEnd = shallowRef<Dayjs | null>(selectedEnd.value)
    const hoverDate = shallowRef<Dayjs | null>(null)

    function syncPendingFromSelected() {
      pendingStart.value = selectedStart.value
      pendingEnd.value = selectedEnd.value
    }

    watch([selectedStart, selectedEnd], () => {
      syncPendingFromSelected()
    })

    const viewMonth = shallowRef<Dayjs>(selectedStart.value ?? dayjs())

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

    const startInputDisplay = computed(() => {
      const d = open.value ? pendingStart.value : selectedStart.value
      return d ? d.format(effectiveFormat.value) : ''
    })
    const endInputDisplay = computed(() => {
      const d = open.value ? pendingEnd.value : selectedEnd.value
      return d ? d.format(effectiveFormat.value) : ''
    })

    const leftMonth = computed(() => viewMonth.value)
    const rightMonth = computed(() => viewMonth.value.add(1, 'month'))
    const leftGrid = computed(() => generateMonthGrid(leftMonth.value, props.weekStart))
    const rightGrid = computed(() => generateMonthGrid(rightMonth.value, props.weekStart))
    const weekLabels = computed(() => {
      const base = locale.value.weekdaysShort ?? FALLBACK_WEEK_LABELS_SUN
      return props.weekStart === 1 ? [...base.slice(1), base[0]] : base
    })
    const panelLabelFormat = computed(() => locale.value.panelLabelFormat || FALLBACK_PANEL_LABEL_FORMAT)
    const placeholderTexts = computed<[string, string]>(() => {
      const base = locale.value.rangePlaceholder ?? FALLBACK_RANGE_PLACEHOLDER
      return [props.placeholder[0] || base[0], props.placeholder[1] || base[1]]
    })

    function openPopup(focus: Phase = 'start') {
      if (props.disabled || open.value) return
      syncPendingFromSelected()
      hoverDate.value = null
      phase.value = focus
      // 把面板对齐到现有的 start（或当前月）
      if (selectedStart.value) viewMonth.value = selectedStart.value
      open.value = true
      emit('open-change', true)
    }

    function closePopup() {
      if (!open.value) return
      open.value = false
      hoverDate.value = null
      emit('open-change', false)
    }

    function emitRange(start: Dayjs | null, end: Dayjs | null) {
      const value = emitRangeValue(start, end, props.valueFormat, effectiveFormat.value)
      emit('update:modelValue', value)
      const dateStrings: [string, string] = [
        start ? start.format(effectiveFormat.value) : '',
        end ? end.format(effectiveFormat.value) : '',
      ]
      emit('change', value, dateStrings)
      formItem?.validate('change')
    }

    // 拿到当前 phase（start/end）的合并禁用判定：side-specific 优先于通用 disabledDate
    function isDisabledFor(cell: Dayjs, side: 'start' | 'end'): boolean {
      const sideFn = side === 'start' ? props.disabledStartDate : props.disabledEndDate
      if (sideFn) return sideFn(cell)
      return !!props.disabledDate?.(cell)
    }

    function getInitialStartTime(): Dayjs {
      const dv = toDayjs(timeCfg.value.defaultStartTime)
      if (dv) return dv
      return dayjs().hour(0).minute(0).second(0).millisecond(0)
    }
    function getInitialEndTime(): Dayjs {
      const dv = toDayjs(timeCfg.value.defaultEndTime)
      if (dv) return dv
      return dayjs().hour(23).minute(59).second(59).millisecond(0)
    }

    function selectDate(cell: Dayjs) {
      if (isDisabledFor(cell, phase.value)) return
      if (phase.value === 'start') {
        const merged = showTimeActive.value
          ? combineDayWithTime(cell, pendingStart.value ?? getInitialStartTime())
          : cell
        pendingStart.value = merged
        // showTime 启用时保留 pendingEnd 以便用户回头微调；常规模式清空 end 进入二次选择
        if (!showTimeActive.value) pendingEnd.value = null
        phase.value = 'end'
        return
      }
      // phase === 'end'
      const endMerged = showTimeActive.value ? combineDayWithTime(cell, pendingEnd.value ?? getInitialEndTime()) : cell
      let s = pendingStart.value
      let e = endMerged
      // 自动调换：end < start（按日级别比较，时间部分忽略）
      if (s && e.isBefore(s, 'day')) {
        ;[s, e] = [e, s]
      }
      pendingStart.value = s
      pendingEnd.value = e
      // showTime 启用时等待 ok 确认；常规模式立即提交
      if (showTimeActive.value) return
      emitRange(s, e)
      closePopup()
    }

    function onCellMouseEnter(cell: Dayjs) {
      if (phase.value === 'end' && pendingStart.value) {
        hoverDate.value = cell
      }
    }

    function onCellMouseLeave() {
      // 留到鼠标移到下一个 cell；不立即清空，避免抖动
    }

    function prevMonth() {
      viewMonth.value = viewMonth.value.subtract(1, 'month')
    }
    function nextMonth() {
      viewMonth.value = viewMonth.value.add(1, 'month')
    }
    function prevYear() {
      viewMonth.value = viewMonth.value.subtract(1, 'year')
    }
    function nextYear() {
      viewMonth.value = viewMonth.value.add(1, 'year')
    }

    function clear(e: MouseEvent) {
      e.stopPropagation()
      if (!selectedStart.value && !selectedEnd.value) return
      pendingStart.value = null
      pendingEnd.value = null
      emitRange(null, null)
    }

    function clickPreset(p: RangePresetItem) {
      const rawTuple = typeof p.value === 'function' ? (p.value as () => [unknown, unknown])() : p.value
      const [s, e] = rawTuple
      // 非严格解析（值常用 ISO 串 / Date / Dayjs / number）
      const ds = toDayjs(s as never)
      const de = toDayjs(e as never)
      if (!ds || !de) return
      const [normStart, normEnd] = ds.isAfter(de, 'day') ? [de, ds] : [ds, de]
      pendingStart.value = normStart
      pendingEnd.value = normEnd
      // showTime 共存：仅更新 pending，由 ok 提交；非 showTime 立即提交 + 关
      if (showTimeActive.value) return
      emitRange(normStart, normEnd)
      closePopup()
    }

    function pickTime(side: Phase, unit: 'hour' | 'minute' | 'second', value: number) {
      if (side === 'start') {
        const base = pendingStart.value ?? combineDayWithTime(dayjs(), getInitialStartTime())
        pendingStart.value =
          unit === 'hour' ? base.hour(value) : unit === 'minute' ? base.minute(value) : base.second(value)
      } else {
        const base = pendingEnd.value ?? combineDayWithTime(dayjs(), getInitialEndTime())
        pendingEnd.value =
          unit === 'hour' ? base.hour(value) : unit === 'minute' ? base.minute(value) : base.second(value)
      }
    }

    function clickOk() {
      if (!pendingStart.value || !pendingEnd.value) return
      let s = pendingStart.value
      let e = pendingEnd.value
      if (e.isBefore(s, 'minute')) {
        ;[s, e] = [e, s]
      }
      emitRange(s, e)
      closePopup()
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
        nextTick(() => startInputRef.value?.focus())
      }
    })

    onUnmounted(() => {
      document.removeEventListener('mousedown', onClickOutside, true)
    })

    const showClear = computed(
      () => props.clearable && !props.disabled && (!!selectedStart.value || !!selectedEnd.value),
    )

    function isCellInRange(date: Dayjs): boolean {
      // 已确认范围（pending start + end 都有，或受控值都有）
      if (pendingStart.value && pendingEnd.value) {
        return date.isAfter(pendingStart.value, 'day') && date.isBefore(pendingEnd.value, 'day')
      }
      return false
    }

    function isCellInHoverRange(date: Dayjs): boolean {
      if (phase.value !== 'end' || !pendingStart.value || !hoverDate.value) return false
      const start = pendingStart.value
      const hover = hoverDate.value
      const min = hover.isBefore(start, 'day') ? hover : start
      const max = hover.isBefore(start, 'day') ? start : hover
      return date.isAfter(min, 'day') && date.isBefore(max, 'day')
    }

    function isCellRangeStart(date: Dayjs): boolean {
      return !!pendingStart.value && isSameDay(date, pendingStart.value)
    }

    function isCellRangeEnd(date: Dayjs): boolean {
      return !!pendingEnd.value && isSameDay(date, pendingEnd.value)
    }

    function renderPanelHeader(side: 'left' | 'right') {
      const month = side === 'left' ? leftMonth.value : rightMonth.value
      const showLeftArrows = side === 'left'
      const showRightArrows = side === 'right'
      return (
        <div class={ns.e('panel-header')}>
          {showLeftArrows ? (
            <>
              <button
                type="button"
                class={[ns.e('arrow'), ns.em('arrow', 'prev-year')]}
                aria-label={locale.value.prevYearLabel || '前一年'}
                onClick={prevYear}
              >
                «
              </button>
              <button
                type="button"
                class={[ns.e('arrow'), ns.em('arrow', 'prev-month')]}
                aria-label={locale.value.prevMonthLabel || '上个月'}
                onClick={prevMonth}
              >
                ‹
              </button>
            </>
          ) : (
            <span class={ns.e('arrow-placeholder')} aria-hidden="true" />
          )}
          <span class={ns.e('panel-label')}>{month.format(panelLabelFormat.value)}</span>
          {showRightArrows ? (
            <>
              <button
                type="button"
                class={[ns.e('arrow'), ns.em('arrow', 'next-month')]}
                aria-label={locale.value.nextMonthLabel || '下个月'}
                onClick={nextMonth}
              >
                ›
              </button>
              <button
                type="button"
                class={[ns.e('arrow'), ns.em('arrow', 'next-year')]}
                aria-label={locale.value.nextYearLabel || '后一年'}
                onClick={nextYear}
              >
                »
              </button>
            </>
          ) : (
            <span class={ns.e('arrow-placeholder')} aria-hidden="true" />
          )}
        </div>
      )
    }

    function renderWeekRow() {
      return (
        <div class={ns.e('week-row')}>
          {weekLabels.value.map((w) => (
            <div class={ns.e('week-cell')}>{w}</div>
          ))}
        </div>
      )
    }

    function renderGrid(cells: ReturnType<typeof generateMonthGrid>) {
      return (
        <div class={ns.e('grid')}>
          {cells.map((cell) => {
            // 显示禁用以当前 phase 为准（用户先填 start 再填 end，对应该侧的限制）
            const disabled = isDisabledFor(cell.date, phase.value)
            const isStart = isCellRangeStart(cell.date)
            const isEnd = isCellRangeEnd(cell.date)
            const inRange = isCellInRange(cell.date)
            const inHover = isCellInHoverRange(cell.date)
            const cellCls = [
              ns.e('cell'),
              !cell.isCurrentMonth && ns.em('cell', 'outside'),
              cell.isToday && ns.em('cell', 'today'),
              isStart && ns.em('cell', 'range-start'),
              isEnd && ns.em('cell', 'range-end'),
              inRange && ns.em('cell', 'in-range'),
              inHover && ns.em('cell', 'in-hover-range'),
              disabled && ns.em('cell', 'disabled'),
            ]
            return (
              <div
                class={cellCls}
                role="gridcell"
                aria-disabled={disabled}
                onClick={() => !disabled && selectDate(cell.date)}
                onMouseenter={() => onCellMouseEnter(cell.date)}
                onMouseleave={onCellMouseLeave}
              >
                <span class={ns.e('cell-inner')}>{cell.day}</span>
              </div>
            )
          })}
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

    function renderTimeColumn(side: Phase, unit: 'hour' | 'minute' | 'second') {
      const cfg = timeCfg.value
      const range = unit === 'hour' ? 24 : 60
      const step =
        unit === 'hour' ? (cfg.hourStep ?? 1) : unit === 'minute' ? (cfg.minuteStep ?? 1) : (cfg.secondStep ?? 1)
      const disabled =
        unit === 'hour' ? cfg.disabledHours?.() : unit === 'minute' ? cfg.disabledMinutes?.() : cfg.disabledSeconds?.()
      let cells = buildTimeColumnValues(range, step, disabled)
      if (cfg.hideDisabledOptions) cells = cells.filter((c) => !c.disabled)
      const cur = side === 'start' ? pendingStart.value : pendingEnd.value
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
                onClick={() => !c.disabled && pickTime(side, unit, c.value)}
              >
                {pad2(c.value)}
              </div>
            )
          })}
        </div>
      )
    }

    function renderTimeColumns(side: Phase) {
      return (
        <div class={[ns.e('time-columns'), ns.em('time-columns', side)]}>
          {renderTimeColumn(side, 'hour')}
          {hasMinutes.value && renderTimeColumn(side, 'minute')}
          {hasSeconds.value && renderTimeColumn(side, 'second')}
        </div>
      )
    }

    function renderFooter() {
      const okDisabled = !pendingStart.value || !pendingEnd.value
      return (
        <div class={ns.e('footer')}>
          <button
            type="button"
            class={[ns.e('footer-btn'), ns.em('footer-btn', 'ok')]}
            disabled={okDisabled}
            onClick={clickOk}
          >
            {locale.value.ok || '确定'}
          </button>
        </div>
      )
    }

    function buildPopup() {
      const hasPresets = props.presets.length > 0
      const popupCls = [
        ns.e('panel'),
        hasPresets && ns.em('panel', 'with-presets'),
        showTimeActive.value && ns.em('panel', 'with-time'),
        props.popupClassName,
      ].filter(Boolean) as string[]
      const panels = (
        <div class={ns.e('panels')}>
          <div class={[ns.e('panel-side'), ns.em('panel-side', 'left')]}>
            {renderPanelHeader('left')}
            {renderWeekRow()}
            {renderGrid(leftGrid.value)}
            {showTimeActive.value && renderTimeColumns('start')}
          </div>
          <div class={[ns.e('panel-side'), ns.em('panel-side', 'right')]}>
            {renderPanelHeader('right')}
            {renderWeekRow()}
            {renderGrid(rightGrid.value)}
            {showTimeActive.value && renderTimeColumns('end')}
          </div>
        </div>
      )
      const body = hasPresets ? h('div', { class: ns.e('main-row') }, [renderPresets(), panels]) : panels
      const children = showTimeActive.value ? [body, renderFooter()] : [body]
      return h('div', { ref: popupRef, class: popupCls, style: floatingStyles.value, role: 'dialog' }, children)
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
      props.disabled && ns.is('disabled'),
      open.value && ns.is('open'),
      ns.m(props.size),
      mergedStatus.value && ns.m(`status-${mergedStatus.value}`),
      props.variant && ns.m(`variant-${props.variant}`),
    ])

    return () => (
      <div ref={rootRef} class={rootCls.value}>
        <div class={ns.e('input-wrap')}>
          <input
            ref={startInputRef}
            class={[ns.e('input'), ns.em('input', 'start')]}
            type="text"
            readonly={props.inputReadOnly}
            disabled={props.disabled}
            placeholder={placeholderTexts.value[0]}
            value={startInputDisplay.value}
            aria-haspopup="dialog"
            aria-expanded={open.value && phase.value === 'start'}
            onClick={() => openPopup('start')}
            onFocus={() => emit('focus')}
            onBlur={() => emit('blur')}
          />
          <span class={ns.e('separator')} aria-hidden="true">
            {props.separator}
          </span>
          <input
            ref={endInputRef}
            class={[ns.e('input'), ns.em('input', 'end')]}
            type="text"
            readonly={props.inputReadOnly}
            disabled={props.disabled}
            placeholder={placeholderTexts.value[1]}
            value={endInputDisplay.value}
            aria-haspopup="dialog"
            aria-expanded={open.value && phase.value === 'end'}
            onClick={() => openPopup('end')}
            onFocus={() => emit('focus')}
            onBlur={() => emit('blur')}
          />
          {showClear.value ? (
            <span class={ns.e('clear')} role="button" aria-label={locale.value.clearLabel || '清除'} onClick={clear}>
              ×
            </span>
          ) : (
            <span class={ns.e('suffix')} aria-hidden="true">
              📅
            </span>
          )}
        </div>
        {renderPopup()}
      </div>
    )
  },
})
