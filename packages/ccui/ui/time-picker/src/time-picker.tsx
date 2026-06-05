import type { Placement } from '@floating-ui/vue'
import type { Dayjs } from 'dayjs'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { TimePickerPlacement, TimePickerProps } from './time-picker-types'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import dayjs from 'dayjs'
import {
  computed,
  defineComponent,
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
import { buildTimeColumnValues, emitValue, toDayjs } from '../../shared/utils/date'
import { timePickerProps } from './time-picker-types'
import './time-picker.scss'

const PLACEMENT_TO_FLOATING: Record<TimePickerPlacement, Placement> = {
  bottomLeft: 'bottom-start',
  bottomRight: 'bottom-end',
  topLeft: 'top-start',
  topRight: 'top-end',
}

type ColumnType = 'hour' | 'minute' | 'second' | 'period'

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

// 24h → 12h 显示值（1..12）+ AM/PM
function to12h(h24: number): { display: number; isPM: boolean } {
  if (h24 === 0) return { display: 12, isPM: false }
  if (h24 === 12) return { display: 12, isPM: true }
  if (h24 < 12) return { display: h24, isPM: false }
  return { display: h24 - 12, isPM: true }
}

// 12h → 24h
function from12h(display: number, isPM: boolean): number {
  if (display === 12) return isPM ? 12 : 0
  return isPM ? display + 12 : display
}

export default defineComponent({
  name: 'CTimePicker',
  props: timePickerProps,
  emits: ['update:modelValue', 'change', 'open-change', 'focus', 'blur'],
  setup(props: TimePickerProps, { emit, slots }) {
    const ns = useNamespace('time-picker')
    const cfg = useConfig()
    const locale = computed(() => cfg.locale?.DatePicker ?? {})
    const placeholderText = computed(() => props.placeholder || locale.value.timePlaceholder || '请选择时间')
    const nowText = computed(() => props.nowText || locale.value.now || '此刻')
    const okText = computed(() => props.okText || locale.value.ok || '确定')
    const uid = getCurrentInstance()?.uid ?? 0
    const popupId = `ccui-time-picker-popup-${uid}`
    const rootRef = ref<HTMLElement | null>(null)
    const popupRef = ref<HTMLElement | null>(null)
    const inputRef = ref<HTMLInputElement | null>(null)
    const open = shallowRef(false)
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)

    const effectiveFormat = computed(() => props.format || (props.use12Hours ? 'h:mm:ss a' : 'HH:mm:ss'))

    const selectedDayjs = computed<Dayjs | null>(() => toDayjs(props.modelValue, effectiveFormat.value))

    // 在 showOk=true 时作为编辑暂存，showOk=false 时其实仍存中间态但选中即 emit
    const pendingDayjs = shallowRef<Dayjs>(selectedDayjs.value ?? dayjs().startOf('day'))

    function syncPendingFromSelected() {
      pendingDayjs.value = selectedDayjs.value ?? dayjs().startOf('day')
    }

    watch(selectedDayjs, () => {
      // 外部值改变 → 同步到 pending（避免 popup 打开期间外部 setState 导致面板停留在旧值）
      syncPendingFromSelected()
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

    const inputDisplay = computed(() => (selectedDayjs.value ? selectedDayjs.value.format(effectiveFormat.value) : ''))

    // 24 小时制下直接生成 0..23；12 小时制下生成 12,1..11 显示值（带禁用状态由当前 isPM 周期决定）
    const isPM = computed(() => pendingDayjs.value.hour() >= 12)
    const hourValues = computed(() => {
      const disabled24 = props.disabledHours ? props.disabledHours() : undefined
      if (!props.use12Hours) {
        return buildTimeColumnValues(24, props.hourStep, disabled24)
      }
      // 12 小时制：cell display order [12, 1, 2, ..., 11]，受 hourStep 抽稀
      const disabledSet24 = disabled24 ? new Set(disabled24) : null
      const step = Math.max(props.hourStep, 1)
      const order = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter((_, i) => i % step === 0)
      return order.map((display) => ({
        value: display,
        disabled: disabledSet24 ? disabledSet24.has(from12h(display, isPM.value)) : false,
      }))
    })
    const minuteValues = computed(() => {
      const disabled = props.disabledMinutes ? props.disabledMinutes(pendingDayjs.value.hour()) : undefined
      return buildTimeColumnValues(60, props.minuteStep, disabled)
    })
    const secondValues = computed(() => {
      const disabled = props.disabledSeconds
        ? props.disabledSeconds(pendingDayjs.value.hour(), pendingDayjs.value.minute())
        : undefined
      return buildTimeColumnValues(60, props.secondStep, disabled)
    })

    function openPopup() {
      if (props.disabled || open.value) return
      // 打开时重置 pending 到当前 selected（或 00:00:00），避免上次面板状态泄漏
      syncPendingFromSelected()
      open.value = true
      emit('open-change', true)
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
      const value = emitValue(next, props.valueFormat, effectiveFormat.value)
      emit('update:modelValue', value)
      emit('change', value, next ? next.format(effectiveFormat.value) : '')
      formItem?.validate('change')
    }

    // 仅预览：计算并写入 pendingDayjs，不 emit、不关闭面板（键盘方向键导航用）
    function previewValue(type: ColumnType, value: number) {
      let next: Dayjs
      if (type === 'hour') {
        if (props.use12Hours) {
          // value 是显示值 12 / 1..11；按当前 period 转 24h
          const h24 = from12h(value, isPM.value)
          next = pendingDayjs.value.hour(h24)
        } else {
          next = pendingDayjs.value.hour(value)
        }
      } else if (type === 'minute') {
        next = pendingDayjs.value.minute(value)
      } else if (type === 'second') {
        next = pendingDayjs.value.second(value)
      } else {
        // period: value === 0 = AM, 1 = PM
        const display = to12h(pendingDayjs.value.hour()).display
        next = pendingDayjs.value.hour(from12h(display, value === 1))
      }
      pendingDayjs.value = next
      return next
    }

    function pickValue(type: ColumnType, value: number) {
      const next = previewValue(type, value)
      if (!props.showOk) {
        emitChange(next)
        closePopup()
      }
    }

    function clickNow() {
      const now = dayjs()
      pendingDayjs.value = now
      if (!props.showOk) {
        emitChange(now)
        closePopup()
      }
    }

    function clickOk() {
      emitChange(pendingDayjs.value)
      closePopup()
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

    function valuesFor(type: ColumnType): { value: number; disabled: boolean }[] {
      if (type === 'hour') return hourValues.value
      if (type === 'minute') return minuteValues.value
      if (type === 'second') return secondValues.value
      // period
      return [
        { value: 0, disabled: false },
        { value: 1, disabled: false },
      ]
    }

    function selectedValue(type: ColumnType): number {
      if (type === 'hour') {
        return props.use12Hours ? to12h(pendingDayjs.value.hour()).display : pendingDayjs.value.hour()
      }
      if (type === 'minute') return pendingDayjs.value.minute()
      if (type === 'second') return pendingDayjs.value.second()
      return isPM.value ? 1 : 0
    }

    function cellLabel(type: ColumnType, value: number): string {
      if (type === 'period') return value === 0 ? 'AM' : 'PM'
      return pad2(value)
    }

    function onCellKeydown(e: KeyboardEvent, type: ColumnType, index: number) {
      const list = valuesFor(type)
      const total = list.length
      const focusCell = (newIndex: number) => {
        const col = popupRef.value?.querySelector<HTMLElement>(`[data-time-column="${type}"]`)
        const target = col?.children?.[newIndex] as HTMLElement | undefined
        target?.focus()
      }
      // 环绕查找下一个未禁用单元格；带步数上界，全禁用时返回 -1 避免死循环
      const findNext = (start: number, dir: 1 | -1) => {
        for (let step = 1; step <= total; step++) {
          const i = (((start + dir * step) % total) + total) % total
          if (!list[i].disabled) return i
        }
        return -1
      }
      // 从首/尾方向查找第一个未禁用单元格，全禁用时返回 -1
      const findEdge = (dir: 1 | -1) => {
        const start = dir === 1 ? 0 : total - 1
        for (let step = 0; step < total; step++) {
          const i = start + dir * step
          if (!list[i].disabled) return i
        }
        return -1
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = findNext(index, 1)
        if (next < 0) return
        previewValue(type, list[next].value)
        focusCell(next)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = findNext(index, -1)
        if (prev < 0) return
        previewValue(type, list[prev].value)
        focusCell(prev)
      } else if (e.key === 'Home') {
        e.preventDefault()
        const first = findEdge(1)
        if (first < 0) return
        previewValue(type, list[first].value)
        focusCell(first)
      } else if (e.key === 'End') {
        e.preventDefault()
        const last = findEdge(-1)
        if (last < 0) return
        previewValue(type, list[last].value)
        focusCell(last)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (props.showOk) clickOk()
        else closePopup()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        closePopup()
      }
    }

    function renderColumn(type: ColumnType) {
      const values = valuesFor(type)
      const selected = selectedValue(type)
      return (
        <ul class={[ns.e('column'), ns.em('column', type)]} role="listbox" aria-label={type} data-time-column={type}>
          {values.map((cell, i) => {
            const isSelected = cell.value === selected
            const label = cellLabel(type, cell.value)
            const inner = slots.cell
              ? slots.cell({ value: cell.value, type, label, selected: isSelected, disabled: cell.disabled })
              : label
            return (
              <li
                class={[
                  ns.e('cell'),
                  isSelected && ns.em('cell', 'selected'),
                  cell.disabled && ns.em('cell', 'disabled'),
                ]}
                role="option"
                tabindex={cell.disabled ? -1 : 0}
                aria-selected={isSelected}
                aria-disabled={cell.disabled}
                onClick={() => !cell.disabled && pickValue(type, cell.value)}
                onKeydown={(e: KeyboardEvent) => !cell.disabled && onCellKeydown(e, type, i)}
              >
                {inner}
              </li>
            )
          })}
        </ul>
      )
    }

    // popup 打开后把每列选中项滚到中央
    function scrollSelectedIntoCenter() {
      if (!popupRef.value) return
      const cols = popupRef.value.querySelectorAll<HTMLElement>(`[data-time-column]`)
      cols.forEach((col) => {
        const selected =
          col.querySelector<HTMLElement>(`.${ns.em('cell', 'selected')}`) ??
          col.querySelector<HTMLElement>(`li[aria-selected="true"]`)
        if (!selected) return
        const target = selected.offsetTop - col.clientHeight / 2 + selected.offsetHeight / 2
        col.scrollTop = Math.max(0, target)
      })
    }

    watch(open, (v) => {
      if (v) {
        nextTick().then(() => scrollSelectedIntoCenter())
      }
    })

    function buildPopup() {
      const popupCls = [ns.e('panel'), props.use12Hours && ns.em('panel', 'use12hours'), props.popupClassName].filter(
        Boolean,
      ) as string[]
      const columns = []
      if (props.showHour) columns.push(renderColumn('hour'))
      if (props.showMinute) columns.push(renderColumn('minute'))
      if (props.showSecond) columns.push(renderColumn('second'))
      if (props.use12Hours) columns.push(renderColumn('period'))

      const footerNodes = []
      if (props.showNow) {
        footerNodes.push(
          <button type="button" class={[ns.e('footer-btn'), ns.em('footer-btn', 'now')]} onClick={clickNow}>
            {nowText.value}
          </button>,
        )
      }
      if (props.showOk) {
        footerNodes.push(
          <button type="button" class={[ns.e('footer-btn'), ns.em('footer-btn', 'ok')]} onClick={clickOk}>
            {okText.value}
          </button>,
        )
      }
      const showFooter = footerNodes.length > 0

      return h(
        'div',
        {
          ref: popupRef,
          id: popupId,
          class: [popupCls, props.classNames?.popup],
          style: [floatingStyles.value, props.styles?.popup] as any,
          role: 'dialog',
          'aria-label': placeholderText.value || '选择时间',
        },
        [
          <div class={ns.e('columns')}>{columns}</div>,
          showFooter ? <div class={ns.e('footer')}>{footerNodes}</div> : null,
        ],
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
          />
          {showClear.value ? (
            <span class={ns.e('clear')} role="button" aria-label={locale.value.clearLabel || '清除'} onClick={clear}>
              {renderIconWithFallback(slots.clearIcon, props.clearIcon, 'mdi:close-circle')}
            </span>
          ) : props.showSuffix ? (
            <span class={ns.e('suffix')} aria-hidden="true">
              {renderIconWithFallback(slots.suffixIcon, props.suffixIcon, 'mdi:clock-outline')}
            </span>
          ) : null}
        </div>
        {renderPopup()}
      </div>
    )
  },
})
