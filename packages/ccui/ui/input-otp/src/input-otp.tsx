import type { InputOtpProps } from './input-otp-types'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  inject,
  nextTick,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  ref,
  watch,
} from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { inputOtpProps } from './input-otp-types'
import './input-otp.scss'

function takeFirstChar(s: string): string {
  if (!s) return ''
  // 处理代理对 / emoji，避免拆半
  return Array.from(s)[0] ?? ''
}

function normalizeMask(mask: boolean | string): string | null {
  if (mask === true) return '•'
  if (typeof mask === 'string' && mask.length > 0) return takeFirstChar(mask)
  return null
}

const MAX_OTP_LENGTH = 64

export default defineComponent({
  name: 'CInputOtp',
  inheritAttrs: false,
  props: inputOtpProps,
  emits: ['update:modelValue', 'change', 'complete', 'focus', 'blur'],
  setup(props: InputOtpProps, { attrs, emit }) {
    const ns = useNamespace('input-otp')
    const groupRef = ref<HTMLElement | null>(null)
    const cellRefs = ref<(HTMLInputElement | null)[]>([])
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)
    const validationStatus = computed(() => formItem?.validateStatus.value ?? '')
    const mergedStatus = computed(() => props.status || validationStatus.value)
    const groupLabel = computed(() =>
      typeof attrs['aria-label'] === 'string' && attrs['aria-label'] ? attrs['aria-label'] : 'OTP input',
    )
    const effectiveLength = computed(() => {
      if (!Number.isFinite(props.length)) return 1
      return Math.min(MAX_OTP_LENGTH, Math.max(1, Math.floor(props.length)))
    })
    const describedBy = computed(() => {
      const attrIds = typeof attrs['aria-describedby'] === 'string' ? attrs['aria-describedby'].split(/\s+/) : []
      return (
        [...new Set([...attrIds, formItem?.messageId?.value].filter((id): id is string => !!id))].join(' ') || undefined
      )
    })
    const instance = getCurrentInstance()
    const hasModelValue = () => {
      const vnodeProps = instance?.vnode.props
      return !!vnodeProps && ('modelValue' in vnodeProps || 'model-value' in vnodeProps)
    }
    let modelValueWasProvided = hasModelValue()
    let isUnmounted = false
    let groupFocused = false
    let lastCompletedValue = ''
    const composingCells = new Set<number>()

    const stringToCells = (str: string): string[] => {
      const cells: string[] = Array.from({ length: effectiveLength.value }, () => '')
      const chars = Array.from(str ?? '')
      for (let i = 0; i < effectiveLength.value; i++) {
        cells[i] = chars[i] ?? ''
      }
      return cells
    }

    const cellsToString = (cells: string[]): string => cells.join('')

    const initial = modelValueWasProvided ? props.modelValue : (props.defaultValue ?? '')
    const cells = ref<string[]>(stringToCells(initial))

    const setCellRef = (idx: number) => (el: unknown) => {
      cellRefs.value[idx] = (el as HTMLInputElement | null) ?? null
    }

    const focusCell = (idx: number) => {
      const target = cellRefs.value[idx]
      if (target) {
        target.focus()
        target.select?.()
      }
    }

    const formatChar = (raw: string): string => {
      const first = takeFirstChar(raw)
      if (!first) return ''
      return props.formatter ? takeFirstChar(props.formatter(first)) : first
    }

    const commit = (changedIndex: number) => {
      const value = cellsToString(cells.value)
      emit('update:modelValue', value)
      emit('change', value, { index: changedIndex })
      void formItem?.validate('change')
      if (cells.value.length === effectiveLength.value && cells.value.every(Boolean)) {
        if (value !== lastCompletedValue) {
          lastCompletedValue = value
          emit('complete', value)
        }
      } else {
        lastCompletedValue = ''
      }
    }

    const handleInput = (idx: number, e: Event) => {
      const target = e.target as HTMLInputElement
      if (props.disabled || props.readOnly) {
        target.value = cells.value[idx] && maskChar.value ? maskChar.value : (cells.value[idx] ?? '')
        return
      }
      if (composingCells.has(idx) || (e as InputEvent).isComposing) return
      const raw = target.value
      if (maskChar.value && cells.value[idx] && raw === maskChar.value) return
      const previous = cellsToString(cells.value)
      // 用户可能一次输入多个字符（IME / 粘贴 / 安卓键盘）。逐格填入并往后跳。
      const chars = Array.from(raw)
      if (chars.length === 0) {
        if (!cells.value[idx]) return
        cells.value[idx] = ''
        commit(idx)
        return
      }
      let writeIdx = idx
      for (const ch of chars) {
        if (writeIdx >= effectiveLength.value) break
        const formatted = formatChar(ch)
        if (!formatted) continue
        cells.value[writeIdx] = formatted
        writeIdx++
      }
      // 回写 input 元素，避免显示多字符
      target.value = cells.value[idx] ?? ''
      if (cellsToString(cells.value) === previous) return
      commit(idx)
      // 焦点：跳到下一个未填的 / 最后一个
      const nextIdx = Math.min(writeIdx, effectiveLength.value - 1)
      if (nextIdx !== idx) {
        void nextTick(() => focusCell(nextIdx))
      }
    }

    const handleKeydown = (idx: number, e: KeyboardEvent) => {
      if (props.disabled) return
      if (e.key === 'Backspace') {
        if (props.readOnly) return
        if (cells.value[idx]) {
          e.preventDefault()
          cells.value[idx] = ''
          commit(idx)
        } else if (idx > 0) {
          // 当前格已空，回到上一格并清掉
          e.preventDefault()
          cells.value[idx - 1] = ''
          commit(idx - 1)
          void nextTick(() => focusCell(idx - 1))
        }
        return
      }
      if (e.key === 'Delete') {
        if (props.readOnly) return
        if (cells.value[idx]) {
          e.preventDefault()
          cells.value[idx] = ''
          commit(idx)
        }
        return
      }
      if (e.key === 'ArrowLeft' && idx > 0) {
        e.preventDefault()
        focusCell(idx - 1)
        return
      }
      if (e.key === 'ArrowRight' && idx < effectiveLength.value - 1) {
        e.preventDefault()
        focusCell(idx + 1)
      }
    }

    const handlePaste = (idx: number, e: ClipboardEvent) => {
      if (props.disabled || props.readOnly) return
      const text = e.clipboardData?.getData('text') ?? ''
      if (!text) return
      e.preventDefault()
      const previous = cellsToString(cells.value)
      const chars = Array.from(text)
      let writeIdx = idx
      for (const ch of chars) {
        if (writeIdx >= effectiveLength.value) break
        const formatted = formatChar(ch)
        if (!formatted) continue
        cells.value[writeIdx] = formatted
        writeIdx++
      }
      if (cellsToString(cells.value) === previous) return
      commit(idx)
      const nextIdx = Math.min(writeIdx, effectiveLength.value - 1)
      void nextTick(() => focusCell(nextIdx))
    }

    const handleFocus = (e: FocusEvent) => {
      if (groupFocused) return
      groupFocused = true
      emit('focus', e)
    }
    const handleBlur = (e: FocusEvent) => {
      void nextTick(() => {
        if (isUnmounted || groupRef.value?.contains(document.activeElement)) return
        if (!groupFocused) return
        groupFocused = false
        emit('blur', e)
        void formItem?.validate('blur')
      })
    }

    watch(
      () => props.modelValue,
      (newVal) => {
        const expected = cellsToString(cells.value)
        if (newVal !== expected) {
          cells.value = stringToCells(newVal)
          lastCompletedValue = cells.value.every(Boolean) ? cellsToString(cells.value) : ''
        }
      },
    )

    watch(
      () => effectiveLength.value,
      (newLength, oldLength) => {
        const previous = cellsToString(cells.value)
        cells.value = stringToCells(previous)
        lastCompletedValue = cells.value.every(Boolean) ? cellsToString(cells.value) : ''
        cellRefs.value.length = newLength
        if (newLength < oldLength) {
          const normalized = cellsToString(cells.value)
          if (normalized !== previous) emit('update:modelValue', normalized)
        }
      },
    )

    onBeforeUpdate(() => {
      const modelValueIsProvided = hasModelValue()
      if (modelValueIsProvided && !modelValueWasProvided) {
        cells.value = stringToCells(props.modelValue)
      }
      modelValueWasProvided = modelValueIsProvided
    })

    onMounted(() => {
      if (props.autoFocus) focusCell(0)
    })

    watch(
      () => props.disabled,
      (disabled) => {
        if (!disabled || typeof document === 'undefined') return
        const activeElement = document.activeElement
        if (activeElement instanceof HTMLInputElement && groupRef.value?.contains(activeElement)) {
          activeElement.blur()
        }
      },
    )

    onBeforeUnmount(() => {
      isUnmounted = true
      composingCells.clear()
    })

    const maskChar = computed(() => normalizeMask(props.mask))

    const wrapperCls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.size)]: !!props.size,
      [ns.m('disabled')]: props.disabled,
      [ns.m('readonly')]: props.readOnly,
      [ns.m(`status-${mergedStatus.value}`)]: !!mergedStatus.value,
    }))

    return () =>
      h(
        'div',
        {
          ...attrs,
          ref: groupRef,
          class: [attrs.class, wrapperCls.value],
          role: 'group',
          'aria-label': groupLabel.value,
          'aria-disabled': props.disabled ? true : undefined,
          'aria-readonly': props.readOnly ? true : undefined,
          'aria-invalid': mergedStatus.value === 'error' ? true : undefined,
          'aria-describedby': describedBy.value,
        },
        cells.value.map((cellValue, idx) => {
          const displayValue = cellValue && maskChar.value ? maskChar.value : cellValue
          return h('input', {
            key: idx,
            ref: setCellRef(idx),
            class: ns.e('cell'),
            type: 'text',
            inputmode: props.type === 'number' ? 'numeric' : 'text',
            maxlength: 1,
            autocomplete: idx === 0 ? 'one-time-code' : 'off',
            value: displayValue,
            disabled: props.disabled,
            readonly: props.readOnly,
            'aria-label': `${groupLabel.value}, cell ${idx + 1} of ${effectiveLength.value}`,
            'aria-disabled': props.disabled ? true : undefined,
            'aria-readonly': props.readOnly ? true : undefined,
            'aria-invalid': mergedStatus.value === 'error' ? true : undefined,
            'aria-describedby': describedBy.value,
            onInput: (e: Event) => handleInput(idx, e),
            onCompositionstart: () => composingCells.add(idx),
            onCompositionend: (e: CompositionEvent) => {
              composingCells.delete(idx)
              handleInput(idx, e)
            },
            onKeydown: (e: KeyboardEvent) => handleKeydown(idx, e),
            onPaste: (e: ClipboardEvent) => handlePaste(idx, e),
            onFocus: handleFocus,
            onBlur: handleBlur,
          })
        }),
      )
  },
})
