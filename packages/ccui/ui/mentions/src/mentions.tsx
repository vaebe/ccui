import type { CSSProperties, VNode } from 'vue'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { MentionMatch, MentionsProps, NormalizedOption } from './mentions-types'
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
  watch,
} from 'vue'
import { useConfig } from '../../config-provider/src/config-provider'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { findActiveMention, mentionsProps, normalizeMention } from './mentions-types'
import './mentions.scss'

export default defineComponent({
  name: 'CMentions',
  inheritAttrs: false,
  props: mentionsProps,
  emits: ['update:modelValue', 'change', 'select', 'search', 'focus', 'blur'],
  setup(props: MentionsProps, { attrs, emit, slots }) {
    const ns = useNamespace('mentions')
    const cfg = useConfig()
    const uid = getCurrentInstance()?.uid ?? 0
    const popupId = `ccui-mentions-popup-${uid}`
    const optionId = (index: number) => `ccui-mentions-option-${uid}-${index}`
    const notFoundLocal = computed(() => props.notFoundContent || cfg.locale?.Mentions?.notFoundContent || '暂无数据')
    const rootRef = ref<HTMLElement | null>(null)
    const textareaRef = ref<HTMLTextAreaElement | null>(null)
    const open = shallowRef(false)
    const innerValue = shallowRef<string>(props.defaultValue ?? '')
    const activeIndex = shallowRef(0)
    const activeMatch = shallowRef<MentionMatch | null>(null)
    const isComposing = shallowRef(false)
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)
    const validationStatus = computed(() => formItem?.validateStatus.value ?? '')
    const mergedStatus = computed(() => props.status || validationStatus.value)

    const isControlled = computed(() => props.modelValue !== undefined)
    const currentValue = computed<string>(() => {
      const raw = isControlled.value ? props.modelValue : innerValue.value
      return raw ?? ''
    })

    const prefixList = computed<string[]>(() => {
      const p = props.prefix
      return [...new Set((Array.isArray(p) ? p : [p]).filter((item) => item.length > 0))]
    })

    const normalized = computed<NormalizedOption[]>(() => (props.options || []).map((item) => normalizeMention(item)))

    const filteredOptions = computed<NormalizedOption[]>(() => {
      const filter = props.filterOption
      if (filter === false) return normalized.value
      const keyword = activeMatch.value?.search ?? ''
      if (!keyword) return normalized.value
      if (typeof filter === 'function') {
        return normalized.value.filter((opt) => filter(keyword, opt.raw))
      }
      const needle = props.caseSensitive ? keyword : keyword.toLowerCase()
      return normalized.value.filter((opt) => {
        const hay = props.caseSensitive ? opt.label : opt.label.toLowerCase()
        return hay.includes(needle)
      })
    })

    // 过滤列表收缩时，把 activeIndex 钳到首个可用项，避免越界导致无高亮且 Enter/Tab 选不中
    watch(filteredOptions, (list) => {
      if (!open.value) return
      if (activeIndex.value < 0 || activeIndex.value >= list.length || list[activeIndex.value]?.disabled) {
        const first = list.findIndex((o) => !o.disabled)
        activeIndex.value = first
      }
    })

    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    let compositionValueToIgnore: string | null = null
    let lastSearchSignature: string | null = null

    function cancelPendingSearch(): void {
      if (!debounceTimer) return
      clearTimeout(debounceTimer)
      debounceTimer = null
    }

    function closePopup(): void {
      open.value = false
      activeMatch.value = null
      activeIndex.value = -1
      lastSearchSignature = null
      cancelPendingSearch()
    }

    function setValue(next: string) {
      if (!isControlled.value) {
        innerValue.value = next
      }
      emit('update:modelValue', next)
      emit('change', next)
      formItem?.validate('change')
    }

    // autoSize 逻辑
    function adjustHeight(): void {
      const ta = textareaRef.value
      if (!ta || !props.autoSize) return
      ta.style.height = 'auto'
      const lineHeight = Number.parseInt(getComputedStyle(ta).lineHeight) || 20
      const config = typeof props.autoSize === 'object' ? props.autoSize : {}
      const minH = config.minRows ? config.minRows * lineHeight : 0
      const maxH = config.maxRows ? config.maxRows * lineHeight : Infinity
      const scrollH = ta.scrollHeight
      ta.style.height = `${Math.min(Math.max(scrollH, minH), maxH)}px`
      if (maxH < Infinity) ta.style.overflowY = scrollH > maxH ? 'auto' : 'hidden'
    }

    function refreshMatch(): void {
      const ta = textareaRef.value
      if (!ta || props.disabled || props.readonly || isComposing.value) {
        closePopup()
        return
      }
      const cursor = ta.selectionStart
      const match = findActiveMention(ta.value, cursor, prefixList.value)
      activeMatch.value = match
      if (match) {
        if (!open.value) {
          open.value = true
          activeIndex.value = filteredOptions.value.findIndex((o) => !o.disabled)
        }
        const searchSignature = `${match.prefix}\0${match.search}`
        if (lastSearchSignature === searchSignature) return
        lastSearchSignature = searchSignature
        cancelPendingSearch()
        if (props.searchDebounce > 0) {
          debounceTimer = setTimeout(() => {
            debounceTimer = null
            emit('search', match.search, match.prefix)
          }, props.searchDebounce)
        } else {
          emit('search', match.search, match.prefix)
        }
      } else if (open.value) {
        closePopup()
      } else {
        cancelPendingSearch()
      }
    }

    function onInput(e: Event): void {
      const target = e.target as HTMLTextAreaElement
      if (props.disabled || props.readonly) {
        target.value = currentValue.value
        return
      }
      if (isComposing.value || (e as InputEvent).isComposing) return
      if (compositionValueToIgnore === target.value) {
        compositionValueToIgnore = null
        return
      }
      const next = target.value
      setValue(next)
      nextTick(() => {
        refreshMatch()
        adjustHeight()
      })
    }

    function onKeyup(): void {
      // 仅光标导航键会在不产生 input 的情况下改变 selection；Escape 等键不可在 keyup 时重开浮层。
      refreshMatch()
    }

    function onClick(): void {
      refreshMatch()
    }

    function selectOption(opt: NormalizedOption) {
      const ta = textareaRef.value
      const match = activeMatch.value
      if (!ta || !match || opt.disabled) return
      const sourceValue = ta.value
      const before = sourceValue.slice(0, match.start)
      const after = sourceValue.slice(ta.selectionStart)
      const inserted = `${match.prefix}${opt.value}${props.split}`
      const next = `${before}${inserted}${after}`
      setValue(next)
      emit('select', opt.raw, match.prefix)
      open.value = false
      activeMatch.value = null
      activeIndex.value = -1
      // 把光标定位到 inserted 末尾
      const newCursor = before.length + inserted.length
      nextTick(() => {
        if (textareaRef.value) {
          textareaRef.value.focus()
          textareaRef.value.setSelectionRange(newCursor, newCursor)
        }
      })
    }

    function onKeydown(e: KeyboardEvent): void {
      if (props.disabled || props.readonly || isComposing.value || e.isComposing) return
      if (!open.value) return
      const list = filteredOptions.value
      const enabled = list.filter((o) => !o.disabled)
      if (enabled.length === 0 && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter')) {
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const idx = enabled.findIndex((o) => o === list[activeIndex.value])
        const nextEnabled = enabled[(idx + 1) % enabled.length]
        activeIndex.value = list.indexOf(nextEnabled)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const idx = enabled.findIndex((o) => o === list[activeIndex.value])
        const prev = idx <= 0 ? enabled[enabled.length - 1] : enabled[idx - 1]
        activeIndex.value = list.indexOf(prev)
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        if (list[activeIndex.value]) {
          e.preventDefault()
          selectOption(list[activeIndex.value])
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        closePopup()
      }
    }

    function onCompositionstart(): void {
      if (props.disabled || props.readonly) return
      isComposing.value = true
      compositionValueToIgnore = null
      closePopup()
    }

    function onCompositionend(e: CompositionEvent): void {
      if (!isComposing.value) return
      isComposing.value = false
      if (props.disabled || props.readonly) return
      const target = e.target as HTMLTextAreaElement
      compositionValueToIgnore = target.value
      setValue(target.value)
      nextTick(() => {
        refreshMatch()
        adjustHeight()
      })
    }

    function onFocus(e: FocusEvent): void {
      emit('focus', e)
    }
    function onBlur(e: FocusEvent): void {
      emit('blur', e)
      closePopup()
      formItem?.validate('blur')
    }

    function onClickOutside(e: MouseEvent): void {
      if (!open.value) return
      const target = e.target as Node | null
      if (!target) return
      if (rootRef.value?.contains(target)) return
      closePopup()
    }

    onMounted(() => {
      document.addEventListener('mousedown', onClickOutside, true)
      adjustHeight()
    })
    onUnmounted(() => {
      document.removeEventListener('mousedown', onClickOutside, true)
      // flush 搜索 debounce，避免卸载后仍触发一次 emit('search')
      if (debounceTimer) {
        cancelPendingSearch()
      }
    })

    watch(
      () => [props.disabled, props.readonly] as const,
      ([disabled, readonly]) => {
        if (disabled || readonly) {
          isComposing.value = false
          compositionValueToIgnore = null
          closePopup()
        }
      },
    )

    watch(
      () => props.prefix,
      () => {
        if (open.value) refreshMatch()
      },
      { deep: true },
    )

    watch(currentValue, () => {
      nextTick(() => {
        adjustHeight()
        if (open.value) refreshMatch()
      })
    })

    function renderOption(opt: NormalizedOption, index: number): VNode {
      const cls = [
        ns.e('option'),
        index === activeIndex.value ? ns.is('active') : '',
        opt.disabled ? ns.is('disabled') : '',
      ]
      return (
        <li
          key={`${opt.value}-${index}`}
          id={optionId(index)}
          class={cls}
          role="option"
          aria-selected={index === activeIndex.value}
          aria-disabled={opt.disabled}
          onMousedown={(e: MouseEvent) => {
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
      const popupStyle: CSSProperties = {
        maxHeight: `${props.popupMaxHeight}px`,
      }
      if (props.placement === 'top') {
        popupStyle.bottom = '100%'
        popupStyle.marginBottom = '4px'
      } else {
        popupStyle.top = '100%'
        popupStyle.marginTop = '4px'
      }
      return (
        <div
          id={popupId}
          class={[ns.e('panel'), props.classNames?.popup]}
          style={[popupStyle, props.styles?.popup] as any}
          role="listbox"
        >
          {list.length === 0 ? (
            <div class={ns.e('empty')}>{notFoundLocal.value}</div>
          ) : (
            <ul class={ns.e('options')}>{list.map((opt, i) => renderOption(opt, i))}</ul>
          )}
        </div>
      )
    }

    return () => {
      const { class: rootClass, style: rootStyle, 'aria-describedby': describedBy, ...nativeAttrs } = attrs
      const descriptionIds = [describedBy, formItem?.messageId?.value]
        .filter((value): value is string => typeof value === 'string' && value.length > 0)
        .flatMap((value) => value.split(/\s+/))
      const ariaDescribedBy = [...new Set(descriptionIds)].join(' ') || undefined

      return (
        <div
          ref={rootRef}
          class={[
            ns.b(),
            props.disabled ? ns.is('disabled') : '',
            props.readonly ? ns.is('readonly') : '',
            props.variant ? ns.m(`variant-${props.variant}`) : '',
            mergedStatus.value ? ns.m(`status-${mergedStatus.value}`) : '',
            props.classNames?.root,
            rootClass,
          ]}
          style={[props.styles?.root, rootStyle]}
        >
          <textarea
            {...nativeAttrs}
            ref={textareaRef}
            class={[ns.e('textarea'), props.classNames?.textarea]}
            style={props.styles?.textarea}
            value={currentValue.value}
            rows={props.rows}
            placeholder={props.placeholder}
            disabled={props.disabled}
            readonly={props.readonly}
            spellcheck={false}
            role="combobox"
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-expanded={open.value}
            aria-controls={popupId}
            aria-activedescendant={open.value && activeIndex.value >= 0 ? optionId(activeIndex.value) : undefined}
            aria-disabled={props.disabled || undefined}
            aria-readonly={props.readonly || undefined}
            aria-invalid={mergedStatus.value === 'error' || undefined}
            aria-describedby={ariaDescribedBy}
            onInput={onInput}
            onKeyup={(e: KeyboardEvent) => {
              if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) onKeyup()
            }}
            onKeydown={onKeydown}
            onClick={onClick}
            onFocus={onFocus}
            onBlur={onBlur}
            onCompositionstart={onCompositionstart}
            onCompositionend={onCompositionend}
          />
          {renderPopup()}
        </div>
      )
    }
  },
})
