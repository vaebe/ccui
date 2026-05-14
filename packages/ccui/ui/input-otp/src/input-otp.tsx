import type { InputOtpProps } from './input-otp-types'
import { computed, defineComponent, h, nextTick, onMounted, ref, watch } from 'vue'
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

export default defineComponent({
  name: 'CInputOtp',
  props: inputOtpProps,
  emits: ['update:modelValue', 'change', 'focus', 'blur'],
  setup(props: InputOtpProps, { emit }) {
    const ns = useNamespace('input-otp')
    const cellRefs = ref<(HTMLInputElement | null)[]>([])

    const stringToCells = (str: string): string[] => {
      const cells: string[] = Array.from({ length: props.length }, () => '')
      const chars = Array.from(str ?? '')
      for (let i = 0; i < props.length; i++) {
        cells[i] = chars[i] ?? ''
      }
      return cells
    }

    const cellsToString = (cells: string[]): string => cells.join('')

    const initial = props.modelValue !== '' ? props.modelValue : (props.defaultValue ?? '')
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
    }

    const handleInput = (idx: number, e: Event) => {
      const target = e.target as HTMLInputElement
      const raw = target.value
      // 用户可能一次输入多个字符（IME / 粘贴 / 安卓键盘）。逐格填入并往后跳。
      const chars = Array.from(raw)
      if (chars.length === 0) {
        cells.value[idx] = ''
        commit(idx)
        return
      }
      let writeIdx = idx
      for (const ch of chars) {
        if (writeIdx >= props.length) break
        const formatted = formatChar(ch)
        if (!formatted) continue
        cells.value[writeIdx] = formatted
        writeIdx++
      }
      // 回写 input 元素，避免显示多字符
      target.value = cells.value[idx] ?? ''
      commit(idx)
      // 焦点：跳到下一个未填的 / 最后一个
      const nextIdx = Math.min(writeIdx, props.length - 1)
      if (nextIdx !== idx) {
        void nextTick(() => focusCell(nextIdx))
      }
    }

    const handleKeydown = (idx: number, e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        if (cells.value[idx]) {
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
      if (e.key === 'ArrowLeft' && idx > 0) {
        e.preventDefault()
        focusCell(idx - 1)
        return
      }
      if (e.key === 'ArrowRight' && idx < props.length - 1) {
        e.preventDefault()
        focusCell(idx + 1)
      }
    }

    const handlePaste = (idx: number, e: ClipboardEvent) => {
      const text = e.clipboardData?.getData('text') ?? ''
      if (!text) return
      e.preventDefault()
      const chars = Array.from(text)
      let writeIdx = idx
      for (const ch of chars) {
        if (writeIdx >= props.length) break
        const formatted = formatChar(ch)
        if (!formatted) continue
        cells.value[writeIdx] = formatted
        writeIdx++
      }
      commit(idx)
      const nextIdx = Math.min(writeIdx, props.length - 1)
      void nextTick(() => focusCell(nextIdx))
    }

    const handleFocus = (e: FocusEvent) => emit('focus', e)
    const handleBlur = (e: FocusEvent) => emit('blur', e)

    watch(
      () => props.modelValue,
      (newVal) => {
        const expected = cellsToString(cells.value)
        if (newVal !== expected) {
          cells.value = stringToCells(newVal)
        }
      },
    )

    watch(
      () => props.length,
      () => {
        cells.value = stringToCells(cellsToString(cells.value))
      },
    )

    onMounted(() => {
      if (props.autoFocus) focusCell(0)
    })

    const maskChar = computed(() => normalizeMask(props.mask))

    const wrapperCls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.size)]: !!props.size,
      [ns.m('disabled')]: props.disabled,
      [ns.m(`status-${props.status}`)]: !!props.status,
    }))

    return () =>
      h(
        'div',
        { class: wrapperCls.value, role: 'group', 'aria-label': 'OTP input' },
        cells.value.map((cellValue, idx) => {
          const displayValue = cellValue && maskChar.value ? maskChar.value : cellValue
          return h('input', {
            key: idx,
            ref: setCellRef(idx),
            class: ns.e('cell'),
            type: 'text',
            inputmode: 'numeric',
            maxlength: 1,
            autocomplete: idx === 0 ? 'one-time-code' : 'off',
            value: displayValue,
            disabled: props.disabled,
            'aria-label': `OTP cell ${idx + 1}`,
            onInput: (e: Event) => handleInput(idx, e),
            onKeydown: (e: KeyboardEvent) => handleKeydown(idx, e),
            onPaste: (e: ClipboardEvent) => handlePaste(idx, e),
            onFocus: handleFocus,
            onBlur: handleBlur,
          })
        }),
      )
  },
})
