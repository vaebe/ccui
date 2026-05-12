import type { Dayjs } from 'dayjs'
import type { Placement } from '@floating-ui/vue'
import type { DatePickerPlacement, DatePickerProps } from './date-picker-types'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
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
import { emitValue, generateMonthGrid, isSameDay, isSameMonth, toDayjs } from '../../shared/utils/date'
import { datePickerProps } from './date-picker-types'
import './date-picker.scss'

const PLACEMENT_TO_FLOATING: Record<DatePickerPlacement, Placement> = {
  bottomLeft: 'bottom-start',
  bottomRight: 'bottom-end',
  topLeft: 'top-start',
  topRight: 'top-end',
}

const FALLBACK_WEEK_LABELS_SUN = ['日', '一', '二', '三', '四', '五', '六']
const FALLBACK_PANEL_LABEL_FORMAT = 'YYYY 年 M 月'

export default defineComponent({
  name: 'CDatePicker',
  props: datePickerProps,
  emits: ['update:modelValue', 'change', 'open-change', 'focus', 'blur'],
  setup(props: DatePickerProps, { emit }) {
    const ns = useNamespace('date-picker')
    const cfg = useConfig()
    const locale = computed(() => cfg.locale?.DatePicker ?? {})
    const rootRef = ref<HTMLElement | null>(null)
    const popupRef = ref<HTMLElement | null>(null)
    const inputRef = ref<HTMLInputElement | null>(null)
    const open = shallowRef(false)
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)

    const selectedDayjs = computed<Dayjs | null>(() => toDayjs(props.modelValue, props.format))
    // 面板当前查看的月份（仅看到的月份，不一定是选中月）
    const viewMonth = shallowRef<Dayjs>(selectedDayjs.value ?? toDayjs(undefined) ?? toDayjs(new Date())!)

    watch(selectedDayjs, (v) => {
      if (v && !isSameMonth(v, viewMonth.value)) {
        viewMonth.value = v
      }
    })

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

    const inputDisplay = computed(() => (selectedDayjs.value ? selectedDayjs.value.format(props.format) : ''))

    const grid = computed(() => generateMonthGrid(viewMonth.value, props.weekStart))
    /**
     * weekdaysShort 在 locale 里以"周日开头"自然顺序存储；weekStart=1 时把首项前置到末尾再渲染。
     */
    const weekLabels = computed(() => {
      const base = locale.value.weekdaysShort ?? FALLBACK_WEEK_LABELS_SUN
      return props.weekStart === 1 ? [...base.slice(1), base[0]] : base
    })
    const panelLabel = computed(() =>
      viewMonth.value.format(locale.value.panelLabelFormat || FALLBACK_PANEL_LABEL_FORMAT),
    )
    const placeholderText = computed(() => props.placeholder || locale.value.placeholder || '请选择日期')

    function openPopup() {
      if (props.disabled || open.value) return
      open.value = true
      emit('open-change', true)
      // 打开时把面板对齐到选中月（如果有）
      if (selectedDayjs.value) viewMonth.value = selectedDayjs.value
    }

    function closePopup() {
      if (!open.value) return
      open.value = false
      emit('open-change', false)
    }

    function togglePopup() {
      if (open.value) {
        closePopup()
      } else {
        openPopup()
      }
    }

    function emitChange(next: Dayjs | null) {
      const value = emitValue(next, props.valueFormat, props.format)
      emit('update:modelValue', value)
      emit('change', value, next ? next.format(props.format) : '')
      formItem?.validate('change')
    }

    function selectDate(cell: Dayjs) {
      if (props.disabledDate?.(cell)) return
      // 同一天再点不重发，仅关闭
      if (selectedDayjs.value && isSameDay(selectedDayjs.value, cell)) {
        closePopup()
        return
      }
      emitChange(cell)
      closePopup()
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

    function renderPanelHeader() {
      return (
        <div class={ns.e('panel-header')}>
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
          <span class={ns.e('panel-label')}>{panelLabel.value}</span>
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

    function renderGrid() {
      return (
        <div class={ns.e('grid')}>
          {grid.value.map((cell) => {
            const disabled = !!props.disabledDate?.(cell.date)
            const selected = !!selectedDayjs.value && isSameDay(selectedDayjs.value, cell.date)
            const cellCls = [
              ns.e('cell'),
              !cell.isCurrentMonth && ns.em('cell', 'outside'),
              cell.isToday && ns.em('cell', 'today'),
              selected && ns.em('cell', 'selected'),
              disabled && ns.em('cell', 'disabled'),
            ]
            return (
              <div
                class={cellCls}
                role="gridcell"
                aria-selected={selected}
                aria-disabled={disabled}
                onClick={() => !disabled && selectDate(cell.date)}
              >
                <span class={ns.e('cell-inner')}>{cell.day}</span>
              </div>
            )
          })}
        </div>
      )
    }

    function buildPopup() {
      const popupCls = [ns.e('panel'), props.popupClassName].filter(Boolean) as string[]
      return h('div', { ref: popupRef, class: popupCls, style: floatingStyles.value, role: 'dialog' }, [
        renderPanelHeader(),
        renderWeekRow(),
        renderGrid(),
      ])
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
    ])

    return () => (
      <div ref={rootRef} class={rootCls.value}>
        <div class={ns.e('input-wrap')} onClick={togglePopup}>
          <input
            ref={inputRef}
            class={ns.e('input')}
            type="text"
            readonly={props.inputReadOnly}
            disabled={props.disabled}
            placeholder={placeholderText.value}
            value={inputDisplay.value}
            aria-haspopup="dialog"
            aria-expanded={open.value}
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
