import type { Placement } from '@floating-ui/vue'
import type { CSSProperties, VNode } from 'vue'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { AutoCompletePlacement, AutoCompleteProps, NormalizedOption } from './auto-complete-types'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import {
  computed,
  defineComponent,
  inject,
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
import { autoCompleteProps, normalizeOption } from './auto-complete-types'
import './auto-complete.scss'

const PLACEMENT_TO_FLOATING: Record<AutoCompletePlacement, Placement> = {
  bottomLeft: 'bottom-start',
  bottomRight: 'bottom-end',
  topLeft: 'top-start',
  topRight: 'top-end',
}

export default defineComponent({
  name: 'CAutoComplete',
  props: autoCompleteProps,
  emits: ['update:modelValue', 'change', 'select', 'search', 'focus', 'blur', 'open-change'],
  setup(props: AutoCompleteProps, { emit, slots }) {
    const ns = useNamespace('auto-complete')
    const cfg = useConfig()
    const notFoundLocal = computed(
      () => props.notFoundContent || cfg.locale?.AutoComplete?.notFoundContent || '暂无数据',
    )
    const rootRef = ref<HTMLElement | null>(null)
    const popupRef = ref<HTMLElement | null>(null)
    const inputRef = ref<HTMLInputElement | null>(null)
    const open = shallowRef(false)
    const innerValue = shallowRef<string | number>(props.defaultValue ?? '')
    const activeIndex = shallowRef(-1)
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)

    const isControlled = computed(() => props.modelValue !== undefined)
    const currentValue = computed<string | number>(() => {
      const raw = isControlled.value ? props.modelValue : innerValue.value
      return raw ?? ''
    })
    const inputDisplay = computed(() => backfillDisplay.value ?? String(currentValue.value ?? ''))

    const normalized = computed<NormalizedOption[]>(() => (props.options || []).map((item) => normalizeOption(item)))

    const filteredOptions = computed<NormalizedOption[]>(() => {
      const filterOption = props.filterOption
      if (filterOption === false) return normalized.value
      const keyword = inputDisplay.value
      if (!keyword) return normalized.value
      if (typeof filterOption === 'function') {
        return normalized.value.filter((opt) => filterOption(keyword, opt.raw))
      }
      const needle = props.caseSensitive ? keyword : keyword.toLowerCase()
      return normalized.value.filter((opt) => {
        const hay = props.caseSensitive ? opt.label : opt.label.toLowerCase()
        return hay.includes(needle)
      })
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

    function findFirstEnabledIndex(): number {
      if (!props.defaultActiveFirstOption) return -1
      return filteredOptions.value.findIndex((o) => !o.disabled)
    }

    function openPopup() {
      if (props.disabled || open.value) return
      open.value = true
      activeIndex.value = findFirstEnabledIndex()
      emit('open-change', true)
    }
    function closePopup() {
      if (!open.value) return
      open.value = false
      backfillDisplay.value = null
      emit('open-change', false)
    }

    // backfill 临时显示值（不 emit，仅视觉）
    const backfillDisplay = shallowRef<string | null>(null)

    let debounceTimer: ReturnType<typeof setTimeout> | null = null

    function setValue(next: string | number) {
      backfillDisplay.value = null
      if (!isControlled.value) {
        innerValue.value = next
      }
      emit('update:modelValue', next)
      emit('change', next)

      if (props.searchDebounce > 0) {
        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
          emit('search', String(next))
        }, props.searchDebounce)
      } else {
        emit('search', String(next))
      }
      formItem?.validate('change')
    }

    function selectOption(opt: NormalizedOption) {
      if (opt.disabled) return
      setValue(opt.value)
      emit('select', opt.value, opt.raw)
      closePopup()
      // 选中后 input 仍保留焦点（mousedown.preventDefault 阻止 blur，键盘选中本就在 input 内），
      // 但不再调用 inputRef.focus()——会触发 onFocus 重新 openPopup。
    }

    function onInput(e: Event) {
      const target = e.target as HTMLInputElement
      setValue(target.value)
      if (!open.value) openPopup()
      activeIndex.value = -1
    }

    function onFocus(e: FocusEvent) {
      emit('focus', e)
      if (!props.disabled) openPopup()
    }

    function onBlur(e: FocusEvent) {
      emit('blur', e)
      formItem?.validate('blur')
    }

    function onKeydown(e: KeyboardEvent) {
      if (props.disabled) return
      const list = filteredOptions.value
      const enabled = list.filter((o) => !o.disabled)
      function applyBackfill(idx: number) {
        if (props.backfill && idx >= 0 && list[idx]) {
          backfillDisplay.value = list[idx].label
        }
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (!open.value) {
          openPopup()
          return
        }
        if (enabled.length === 0) return
        const enabledIdx = enabled.findIndex((o) => o === list[activeIndex.value])
        const nextEnabled = enabled[(enabledIdx + 1) % enabled.length]
        activeIndex.value = list.indexOf(nextEnabled)
        applyBackfill(activeIndex.value)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (!open.value) {
          openPopup()
          return
        }
        if (enabled.length === 0) return
        const enabledIdx = enabled.findIndex((o) => o === list[activeIndex.value])
        const prev = enabledIdx <= 0 ? enabled[enabled.length - 1] : enabled[enabledIdx - 1]
        activeIndex.value = list.indexOf(prev)
        applyBackfill(activeIndex.value)
      } else if (e.key === 'Enter') {
        if (open.value && activeIndex.value >= 0 && list[activeIndex.value]) {
          e.preventDefault()
          selectOption(list[activeIndex.value])
        }
      } else if (e.key === 'Escape') {
        if (open.value) {
          e.preventDefault()
          closePopup()
        }
      }
    }

    function onClickOutside(e: MouseEvent) {
      if (!open.value) return
      const target = e.target as Node | null
      if (!target) return
      if (rootRef.value?.contains(target)) return
      if (popupRef.value?.contains(target)) return
      closePopup()
    }

    function clear(e: MouseEvent) {
      e.stopPropagation()
      e.preventDefault()
      setValue('')
    }

    onMounted(() => {
      document.addEventListener('mousedown', onClickOutside, true)
    })
    onUnmounted(() => {
      document.removeEventListener('mousedown', onClickOutside, true)
    })

    // 当 options 变化或 keyword 变化时，如果当前 active index 越界，重置
    watch(filteredOptions, (list) => {
      if (activeIndex.value >= list.length) activeIndex.value = -1
    })

    const showClear = computed(() => props.allowClear && !props.disabled && inputDisplay.value !== '')

    function renderInput(): VNode {
      const wrapClass = [
        ns.e('wrap'),
        ns.em('size', props.size),
        props.disabled ? ns.is('disabled') : '',
        open.value ? ns.is('open') : '',
        mergedStatus.value ? ns.em('status', mergedStatus.value) : '',
      ]

      const inputNode = slots.trigger ? (
        slots.trigger({
          value: inputDisplay.value,
          onInput,
          onFocus,
          onBlur,
          onKeydown,
          placeholder: props.placeholder,
          disabled: props.disabled,
        })
      ) : (
        <input
          ref={inputRef}
          class={ns.e('input')}
          type="text"
          value={inputDisplay.value}
          placeholder={props.placeholder}
          disabled={props.disabled}
          autocomplete="off"
          spellcheck={false}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open.value}
          aria-controls={`${ns.b()}-popup`}
          onInput={onInput}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeydown={onKeydown}
        />
      )

      return (
        <div ref={rootRef} class={wrapClass}>
          {inputNode}
          {showClear.value && (
            <span class={ns.e('clear')} role="button" aria-label="clear" onMousedown={clear}>
              ✕
            </span>
          )}
        </div>
      )
    }

    function renderOption(opt: NormalizedOption, index: number): VNode {
      const cls = [
        ns.e('option'),
        index === activeIndex.value ? ns.is('active') : '',
        opt.disabled ? ns.is('disabled') : '',
      ]
      return (
        <li
          key={`${opt.value}-${index}`}
          class={cls}
          role="option"
          aria-selected={index === activeIndex.value}
          aria-disabled={opt.disabled}
          onMousedown={(e: MouseEvent) => {
            // 用 mousedown 阻止 input blur，避免 popup 在选中前关闭
            e.preventDefault()
            selectOption(opt)
          }}
          onMouseenter={() => {
            if (!opt.disabled) activeIndex.value = index
          }}
        >
          {slots.option ? slots.option({ option: opt.raw, index }) : opt.label}
        </li>
      )
    }

    function renderPopup(): VNode | null {
      if (!open.value) return null
      const list = filteredOptions.value
      const popupCls = [ns.e('panel'), props.popupClassName].filter(Boolean) as string[]
      const panelStyle: CSSProperties = {
        ...(floatingStyles.value as CSSProperties),
        maxHeight: `${props.popupMaxHeight}px`,
      }
      return (
        <Teleport to={popupContainer.value as HTMLElement | null} disabled={!teleported.value}>
          <Transition name={props.transitionName} appear>
            <div ref={popupRef} class={popupCls} style={panelStyle} id={`${ns.b()}-popup`} role="listbox">
              {list.length === 0 ? (
                <div class={ns.e('empty')}>{notFoundLocal.value}</div>
              ) : (
                <ul class={ns.e('options')}>{list.map((opt, i) => renderOption(opt, i))}</ul>
              )}
            </div>
          </Transition>
        </Teleport>
      )
    }

    return () => (
      <div class={[ns.b(), props.variant ? ns.m(`variant-${props.variant}`) : '']}>
        {renderInput()}
        {renderPopup()}
      </div>
    )
  },
})
