import type { CSSProperties, VNode } from 'vue'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { MentionMatch, MentionsProps, NormalizedOption } from './mentions-types'
import { computed, defineComponent, h, inject, nextTick, onMounted, onUnmounted, ref, shallowRef } from 'vue'
import { useConfig } from '../../config-provider/src/config-provider'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { findActiveMention, mentionsProps, normalizeMention } from './mentions-types'
import './mentions.scss'

export default defineComponent({
  name: 'CMentions',
  props: mentionsProps,
  emits: ['update:modelValue', 'change', 'select', 'search', 'focus', 'blur'],
  setup(props: MentionsProps, { emit, slots }) {
    const ns = useNamespace('mentions')
    const cfg = useConfig()
    const notFoundLocal = computed(() => props.notFoundContent || cfg.locale?.Mentions?.notFoundContent || '暂无数据')
    const rootRef = ref<HTMLElement | null>(null)
    const textareaRef = ref<HTMLTextAreaElement | null>(null)
    const open = shallowRef(false)
    const innerValue = shallowRef<string>(props.defaultValue ?? '')
    const activeIndex = shallowRef(0)
    const activeMatch = shallowRef<MentionMatch | null>(null)
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
      return Array.isArray(p) ? p : [p]
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

    let debounceTimer: ReturnType<typeof setTimeout> | null = null

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
      if (!ta) return
      const cursor = ta.selectionStart
      const match = findActiveMention(currentValue.value, cursor, prefixList.value)
      activeMatch.value = match
      if (match) {
        if (!open.value) {
          open.value = true
          activeIndex.value = 0
        }
        if (props.searchDebounce > 0) {
          if (debounceTimer) clearTimeout(debounceTimer)
          debounceTimer = setTimeout(() => emit('search', match.search, match.prefix), props.searchDebounce)
        } else {
          emit('search', match.search, match.prefix)
        }
      } else if (open.value) {
        open.value = false
      }
    }

    function onInput(e: Event): void {
      const next = (e.target as HTMLTextAreaElement).value
      setValue(next)
      nextTick(() => {
        refreshMatch()
        adjustHeight()
      })
    }

    function onKeyup(): void {
      // 方向键移动光标后也要刷新（不改 value，但改光标位置）
      refreshMatch()
    }

    function onClick(): void {
      refreshMatch()
    }

    function selectOption(opt: NormalizedOption) {
      const ta = textareaRef.value
      const match = activeMatch.value
      if (!ta || !match || opt.disabled) return
      const before = currentValue.value.slice(0, match.start)
      const after = currentValue.value.slice(ta.selectionStart)
      const inserted = `${match.prefix}${opt.value}${props.split}`
      const next = `${before}${inserted}${after}`
      setValue(next)
      emit('select', opt.raw, match.prefix)
      open.value = false
      activeMatch.value = null
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
      if (props.disabled) return
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
        open.value = false
        activeMatch.value = null
      }
    }

    function onFocus(e: FocusEvent): void {
      emit('focus', e)
    }
    function onBlur(e: FocusEvent): void {
      emit('blur', e)
      formItem?.validate('blur')
    }

    function onClickOutside(e: MouseEvent): void {
      if (!open.value) return
      const target = e.target as Node | null
      if (!target) return
      if (rootRef.value?.contains(target)) return
      open.value = false
    }

    onMounted(() => {
      document.addEventListener('mousedown', onClickOutside, true)
      adjustHeight()
    })
    onUnmounted(() => {
      document.removeEventListener('mousedown', onClickOutside, true)
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

    return () => (
      <div
        ref={rootRef}
        class={[
          ns.b(),
          props.disabled ? ns.is('disabled') : '',
          props.variant ? ns.m(`variant-${props.variant}`) : '',
          mergedStatus.value ? ns.m(`status-${mergedStatus.value}`) : '',
          props.classNames?.root,
        ]}
        style={props.styles?.root}
      >
        <textarea
          ref={textareaRef}
          class={[ns.e('textarea'), props.classNames?.textarea]}
          style={props.styles?.textarea}
          value={currentValue.value}
          rows={props.rows}
          placeholder={props.placeholder}
          disabled={props.disabled}
          spellcheck={false}
          onInput={onInput}
          onKeyup={onKeyup}
          onKeydown={onKeydown}
          onClick={onClick}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {renderPopup()}
      </div>
    )
  },
})
