import type { Dayjs } from 'dayjs'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { TimeRangePickerProps, TimeRangeValue } from './time-range-picker-types'
import { computed, defineComponent, h, inject, ref, shallowRef } from 'vue'
import { useConfig } from '../../config-provider/src/config-provider'
import { formItemInjectionKey } from '../../form/src/form-types'
import { renderIconNode } from '../../shared/hooks/use-icon'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { emitValue, toDayjs } from '../../shared/utils/date'
import TimePicker from '../../time-picker/src/time-picker'
import { timeRangePickerProps } from './time-range-picker-types'
import './time-range-picker.scss'

type TupleBool = [boolean, boolean]
type TuplePlaceholder = [string, string]

function asTuple<T>(v: T | [T, T], _fallback: [T, T]): [T, T] {
  if (Array.isArray(v) && v.length === 2) return v as [T, T]
  return [v as T, v as T]
}

function emitEach(value: Dayjs | null, valueFormat: TimeRangePickerProps['valueFormat'], format: string) {
  return emitValue(value, valueFormat, format)
}

export default defineComponent({
  name: 'CTimeRangePicker',
  props: timeRangePickerProps,
  emits: ['update:modelValue', 'change', 'open-change', 'focus', 'blur'],
  setup(props: TimeRangePickerProps, { emit, slots }) {
    const ns = useNamespace('time-range-picker')
    const cfg = useConfig()
    const locale = computed(() => cfg.locale?.DatePicker ?? {})
    const rootRef = ref<HTMLElement | null>(null)
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)

    const effectiveFormat = computed(() => props.format || (props.use12Hours ? 'h:mm:ss a' : 'HH:mm:ss'))

    const disabledTuple = computed<TupleBool>(() => asTuple(props.disabled, [false, false]))
    const allowEmptyTuple = computed<TupleBool>(() => asTuple(props.allowEmpty, [false, false]))
    const placeholderTuple = computed<TuplePlaceholder>(() => {
      const ph = props.placeholder
      if (Array.isArray(ph)) return ph as TuplePlaceholder
      const fallback = locale.value.timePlaceholder || '请选择时间'
      const def: TuplePlaceholder = [(ph as string) || fallback, (ph as string) || fallback]
      return def
    })

    const startValue = computed(() => (props.modelValue ? props.modelValue[0] : null))
    const endValue = computed(() => (props.modelValue ? props.modelValue[1] : null))

    const validationStatus = computed(() => formItem?.validateStatus.value ?? '')
    const mergedStatus = computed(() => props.status || validationStatus.value)

    const startOpen = shallowRef(false)
    const endOpen = shallowRef(false)

    function emitTuple(nextStart: Dayjs | null, nextEnd: Dayjs | null) {
      let s = nextStart
      let e = nextEnd
      if (props.order && s && e && s.isAfter(e)) {
        const tmp = s
        s = e
        e = tmp
      }
      const startOut = emitEach(s, props.valueFormat, effectiveFormat.value)
      const endOut = emitEach(e, props.valueFormat, effectiveFormat.value)
      const tuple: TimeRangeValue = !s && !e ? null : ([startOut, endOut] as TimeRangeValue)
      emit('update:modelValue', tuple)
      emit('change', tuple, [s ? s.format(effectiveFormat.value) : '', e ? e.format(effectiveFormat.value) : ''])
      formItem?.validate('change')
    }

    function onStartChange(v: unknown) {
      const dv = toDayjs(v as never, effectiveFormat.value)
      const otherDv = toDayjs(endValue.value as never, effectiveFormat.value)
      // 若 start 为空且不允许 → 不 emit
      if (!dv && !allowEmptyTuple.value[0]) return
      emitTuple(dv, otherDv)
    }

    function onEndChange(v: unknown) {
      const dv = toDayjs(v as never, effectiveFormat.value)
      const otherDv = toDayjs(startValue.value as never, effectiveFormat.value)
      if (!dv && !allowEmptyTuple.value[1]) return
      emitTuple(otherDv, dv)
    }

    function clear(e: MouseEvent) {
      e.stopPropagation()
      if (!props.modelValue) return
      emit('update:modelValue', null)
      emit('change', null, ['', ''])
      formItem?.validate('change')
    }

    const showClear = computed(
      () => props.clearable && !(disabledTuple.value[0] && disabledTuple.value[1]) && !!props.modelValue,
    )

    function buildEndPicker(which: 'start' | 'end') {
      return h(TimePicker, {
        modelValue: which === 'start' ? startValue.value : endValue.value,
        'onUpdate:modelValue': which === 'start' ? onStartChange : onEndChange,
        disabled: disabledTuple.value[which === 'start' ? 0 : 1],
        placeholder: placeholderTuple.value[which === 'start' ? 0 : 1],
        format: props.format,
        use12Hours: props.use12Hours,
        valueFormat: props.valueFormat,
        size: props.size,
        status: mergedStatus.value,
        placement: props.placement,
        popupClassName: props.popupClassName,
        popupAppendToBody: props.popupAppendToBody,
        autoFocus: which === 'start' && props.autoFocus,
        inputReadOnly: props.inputReadOnly,
        showHour: props.showHour,
        showMinute: props.showMinute,
        showSecond: props.showSecond,
        hourStep: props.hourStep,
        minuteStep: props.minuteStep,
        secondStep: props.secondStep,
        // disabledHours / Minutes / Seconds 透传时把 'which' 自动绑定
        disabledHours: props.disabledHours ? () => props.disabledHours!(which) : undefined,
        disabledMinutes: props.disabledMinutes
          ? (selectedHour: number) => props.disabledMinutes!(which, selectedHour)
          : undefined,
        disabledSeconds: props.disabledSeconds
          ? (selectedHour: number, selectedMinute: number) =>
              props.disabledSeconds!(which, selectedHour, selectedMinute)
          : undefined,
        showNow: props.showNow,
        showOk: props.showOk,
        clearable: false, // 范围共用一个清除按钮；单端不显示
        variant: 'borderless',
        // 转发 open-change 用于全局状态（暂只内部追踪）
        'onOpen-change': (open: boolean) => {
          if (which === 'start') startOpen.value = open
          else endOpen.value = open
        },
      })
    }

    const rootCls = computed(() => [
      ns.b(),
      (disabledTuple.value[0] || disabledTuple.value[1]) && ns.is('disabled'),
      (startOpen.value || endOpen.value) && ns.is('open'),
      ns.m(props.size),
      mergedStatus.value && ns.m(`status-${mergedStatus.value}`),
      props.variant && ns.m(`variant-${props.variant}`),
    ])

    return () => (
      <div ref={rootRef} class={[rootCls.value, props.classNames?.root]} style={props.styles?.root}>
        <div class={ns.e('start')}>{buildEndPicker('start')}</div>
        <span class={ns.e('separator')} aria-hidden="true">
          {props.separator}
        </span>
        <div class={ns.e('end')}>{buildEndPicker('end')}</div>
        {showClear.value ? (
          <span class={ns.e('clear')} role="button" aria-label={locale.value.clearLabel || '清除'} onClick={clear}>
            {slots.clearIcon ? slots.clearIcon() : (renderIconNode(props.clearIcon) ?? '×')}
          </span>
        ) : (
          <span class={ns.e('suffix')} aria-hidden="true">
            {slots.suffixIcon
              ? slots.suffixIcon()
              : (renderIconNode(props.suffixIcon) ?? renderIconNode('mdi:clock-outline'))}
          </span>
        )}
      </div>
    )
  },
})
