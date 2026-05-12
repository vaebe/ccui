import type { Placement } from '@floating-ui/vue'
import type { Dayjs } from 'dayjs'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { TimePickerPlacement, TimePickerProps } from './time-picker-types'
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
import { buildTimeColumnValues, emitValue, toDayjs } from '../../shared/utils/date'
import { timePickerProps } from './time-picker-types'
import './time-picker.scss'

const PLACEMENT_TO_FLOATING: Record<TimePickerPlacement, Placement> = {
  bottomLeft: 'bottom-start',
  bottomRight: 'bottom-end',
  topLeft: 'top-start',
  topRight: 'top-end',
}

type ColumnType = 'hour' | 'minute' | 'second'

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

export default defineComponent({
  name: 'CTimePicker',
  props: timePickerProps,
  emits: ['update:modelValue', 'change', 'open-change', 'focus', 'blur'],
  setup(props: TimePickerProps, { emit }) {
    const ns = useNamespace('time-picker')
    const cfg = useConfig()
    const locale = computed(() => cfg.locale?.DatePicker ?? {})
    const placeholderText = computed(() => props.placeholder || locale.value.timePlaceholder || '请选择时间')
    const nowText = computed(() => props.nowText || locale.value.now || '此刻')
    const okText = computed(() => props.okText || locale.value.ok || '确定')
    const rootRef = ref<HTMLElement | null>(null)
    const popupRef = ref<HTMLElement | null>(null)
    const inputRef = ref<HTMLInputElement | null>(null)
    const open = shallowRef(false)
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)

    const selectedDayjs = computed<Dayjs | null>(() => toDayjs(props.modelValue, props.format))

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

    const inputDisplay = computed(() => (selectedDayjs.value ? selectedDayjs.value.format(props.format) : ''))

    const hourValues = computed(() =>
      buildTimeColumnValues(24, props.hourStep, props.disabledHours ? props.disabledHours() : undefined),
    )
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
      const value = emitValue(next, props.valueFormat, props.format)
      emit('update:modelValue', value)
      emit('change', value, next ? next.format(props.format) : '')
      formItem?.validate('change')
    }

    function pickValue(type: ColumnType, value: number) {
      const next =
        type === 'hour'
          ? pendingDayjs.value.hour(value)
          : type === 'minute'
            ? pendingDayjs.value.minute(value)
            : pendingDayjs.value.second(value)
      pendingDayjs.value = next
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

    function renderColumn(type: ColumnType) {
      const values = type === 'hour' ? hourValues.value : type === 'minute' ? minuteValues.value : secondValues.value
      const selected =
        type === 'hour'
          ? pendingDayjs.value.hour()
          : type === 'minute'
            ? pendingDayjs.value.minute()
            : pendingDayjs.value.second()
      return (
        <ul class={[ns.e('column'), ns.em('column', type)]} role="listbox" aria-label={type}>
          {values.map((cell) => {
            const isSelected = cell.value === selected
            return (
              <li
                class={[
                  ns.e('cell'),
                  isSelected && ns.em('cell', 'selected'),
                  cell.disabled && ns.em('cell', 'disabled'),
                ]}
                role="option"
                aria-selected={isSelected}
                aria-disabled={cell.disabled}
                onClick={() => !cell.disabled && pickValue(type, cell.value)}
              >
                {pad2(cell.value)}
              </li>
            )
          })}
        </ul>
      )
    }

    function buildPopup() {
      const popupCls = [ns.e('panel'), props.popupClassName].filter(Boolean) as string[]
      const columns = []
      if (props.showHour) columns.push(renderColumn('hour'))
      if (props.showMinute) columns.push(renderColumn('minute'))
      if (props.showSecond) columns.push(renderColumn('second'))

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

      return h('div', { ref: popupRef, class: popupCls, style: floatingStyles.value, role: 'dialog' }, [
        <div class={ns.e('columns')}>{columns}</div>,
        showFooter ? <div class={ns.e('footer')}>{footerNodes}</div> : null,
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
              ⏱
            </span>
          )}
        </div>
        {renderPopup()}
      </div>
    )
  },
})
