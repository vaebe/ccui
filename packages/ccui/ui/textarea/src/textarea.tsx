import type { CSSProperties, VNode } from 'vue'
import type {
  TextareaAllowClearObject,
  TextareaAutoSizeObject,
  TextareaProps,
  TextareaShowCountObject,
} from './textarea-types'
import { Icon as IconifyIcon } from '@iconify/vue'
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { textareaProps } from './textarea-types'
import './textarea.scss'

function isIconifyName(name: string): boolean {
  return name.includes(':')
}

function isAutoSizeObject(value: unknown): value is TextareaAutoSizeObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isAllowClearObject(value: unknown): value is TextareaAllowClearObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isShowCountObject(value: unknown): value is TextareaShowCountObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * 量取 textarea 在给定 rows 下的高度（含 padding + border）。
 * 通过克隆隐藏元素 + 设置 rows + 读 scrollHeight 实现，比硬编码 line-height 更稳。
 */
function measureRowsHeight(el: HTMLTextAreaElement, rows: number): number {
  const style = window.getComputedStyle(el)
  const lineHeight = Number.parseFloat(style.lineHeight) || Number.parseFloat(style.fontSize) * 1.5
  const paddingTop = Number.parseFloat(style.paddingTop) || 0
  const paddingBottom = Number.parseFloat(style.paddingBottom) || 0
  const borderTop = Number.parseFloat(style.borderTopWidth) || 0
  const borderBottom = Number.parseFloat(style.borderBottomWidth) || 0
  return lineHeight * rows + paddingTop + paddingBottom + borderTop + borderBottom
}

export default defineComponent({
  name: 'CTextarea',
  props: textareaProps,
  emits: ['update:modelValue', 'input', 'change', 'focus', 'blur', 'clear', 'press-enter', 'resize'],
  setup(props: TextareaProps, { emit, slots }) {
    const ns = useNamespace('textarea')
    const textareaRef = ref<HTMLTextAreaElement | null>(null)

    // ── 受控 / 非受控值（defaultValue 仅在首次取） ─────────
    const initial = props.modelValue !== '' ? props.modelValue : (props.defaultValue ?? '')
    const innerValue = ref(initial)

    // ── allowClear 解析 ──────────────────────────────────
    const allowClearEnabled = computed(() => {
      const v = props.allowClear
      return typeof v === 'boolean' ? v : v !== undefined && v !== null
    })
    const customClearIcon = computed<VNode | string | undefined>(() =>
      isAllowClearObject(props.allowClear) ? props.allowClear.clearIcon : undefined,
    )

    // ── showCount 解析 ───────────────────────────────────
    const showCountEnabled = computed(() => {
      const v = props.showCount
      return typeof v === 'boolean' ? v : v !== undefined && v !== null
    })
    const showCountFormatter = computed<TextareaShowCountObject['formatter'] | undefined>(() =>
      isShowCountObject(props.showCount) ? props.showCount.formatter : undefined,
    )
    const countText = computed(() => {
      if (!showCountEnabled.value) return ''
      const value = innerValue.value ?? ''
      const count = value.length
      const maxLength = props.maxLength
      if (showCountFormatter.value) {
        return showCountFormatter.value({ value, count, maxLength })
      }
      return maxLength !== undefined ? `${count} / ${maxLength}` : `${count}`
    })

    // ── autoSize 解析 ────────────────────────────────────
    const autoSizeEnabled = computed(() => !!props.autoSize)
    const autoSizeBounds = computed<TextareaAutoSizeObject>(() =>
      isAutoSizeObject(props.autoSize) ? props.autoSize : {},
    )

    /**
     * 重算 textarea 高度。
     * 策略：先把 height 置 'auto' 让浏览器按内容算出 scrollHeight，
     * 再根据 minRows/maxRows 截断。
     */
    const resizeTextarea = () => {
      const el = textareaRef.value
      if (!el || !autoSizeEnabled.value) return

      // 清掉 inline height 让 scrollHeight 反映真实内容高度
      el.style.height = 'auto'
      let next = el.scrollHeight

      const { minRows, maxRows } = autoSizeBounds.value
      if (minRows !== undefined) {
        const minH = measureRowsHeight(el, minRows)
        if (next < minH) next = minH
      }
      if (maxRows !== undefined) {
        const maxH = measureRowsHeight(el, maxRows)
        if (next > maxH) {
          next = maxH
          el.style.overflowY = 'auto'
        } else {
          el.style.overflowY = 'hidden'
        }
      } else if (autoSizeEnabled.value) {
        // 无 maxRows：永远 hidden 不出现滚动条
        el.style.overflowY = 'hidden'
      }
      el.style.height = `${next}px`
      emit('resize', { height: next })
    }

    // ── style ────────────────────────────────────────────
    const textareaStyle = computed<CSSProperties>(() => ({
      resize: autoSizeEnabled.value ? 'none' : props.resize,
    }))

    const wrapperCls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.size)]: !!props.size,
      [ns.m('disabled')]: props.disabled,
      [ns.m('readonly')]: props.readonly,
      [ns.m(`status-${props.status}`)]: !!props.status,
      [ns.m(`variant-${props.variant}`)]: !!props.variant,
      [ns.m('show-count')]: showCountEnabled.value,
    }))

    // ── 事件 ─────────────────────────────────────────────
    const updateValue = (value: string) => {
      innerValue.value = value
      emit('update:modelValue', value)
      emit('input', value)
    }

    const handleInput = (e: Event) => {
      const target = e.target as HTMLTextAreaElement
      updateValue(target.value)
      if (autoSizeEnabled.value) {
        void nextTick(resizeTextarea)
      }
    }

    const handleChange = (e: Event) => {
      const target = e.target as HTMLTextAreaElement
      emit('change', target.value)
    }

    const handleFocus = (e: FocusEvent) => emit('focus', e)
    const handleBlur = (e: FocusEvent) => emit('blur', e)

    const handleKeydown = (e: KeyboardEvent) => {
      // Enter（不含 shift/ctrl/alt/meta）触发 press-enter
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        emit('press-enter', e)
      }
    }

    const clearValue = () => {
      updateValue('')
      emit('clear')
      if (autoSizeEnabled.value) {
        void nextTick(resizeTextarea)
      }
    }

    watch(
      () => props.modelValue,
      (newVal) => {
        if (newVal !== innerValue.value) {
          innerValue.value = newVal
          if (autoSizeEnabled.value) {
            void nextTick(resizeTextarea)
          }
        }
      },
    )

    watch(
      () => props.autoSize,
      () => {
        if (autoSizeEnabled.value) {
          void nextTick(resizeTextarea)
        } else {
          // 关闭 autoSize 时清掉 inline 高度让原生 rows 接管
          const el = textareaRef.value
          if (el) {
            el.style.height = ''
            el.style.overflowY = ''
          }
        }
      },
    )

    onMounted(() => {
      if (autoSizeEnabled.value) {
        resizeTextarea()
      }
    })

    // ── 渲染辅助 ──────────────────────────────────────────
    const renderClearIcon = () => {
      if (!allowClearEnabled.value || !innerValue.value || props.disabled || props.readonly) {
        return null
      }
      const custom = customClearIcon.value
      if (!custom) {
        return (
          <i class={ns.e('clear')} onClick={clearValue} aria-label="clear">
            ×
          </i>
        )
      }
      if (typeof custom === 'string') {
        return isIconifyName(custom) ? (
          <span class={ns.e('clear')} onClick={clearValue}>
            <IconifyIcon icon={custom} />
          </span>
        ) : (
          <i class={[ns.e('clear'), custom]} onClick={clearValue}></i>
        )
      }
      return (
        <span class={ns.e('clear')} onClick={clearValue}>
          {custom as VNode}
        </span>
      )
    }

    return () => (
      <div class={[wrapperCls.value, props.classNames?.root]} style={props.styles?.root}>
        <textarea
          ref={textareaRef}
          class={[ns.e('inner'), props.classNames?.textarea]}
          style={[textareaStyle.value, props.styles?.textarea] as any}
          placeholder={props.placeholder}
          disabled={props.disabled}
          readonly={props.readonly}
          maxlength={props.maxLength}
          rows={autoSizeEnabled.value ? undefined : props.rows}
          value={innerValue.value}
          aria-invalid={props.status === 'error' ? true : undefined}
          aria-disabled={props.disabled ? true : undefined}
          aria-readonly={props.readonly ? true : undefined}
          onInput={handleInput}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeydown={handleKeydown}
        />
        {renderClearIcon()}
        {showCountEnabled.value && (
          <span class={[ns.e('count'), props.classNames?.count]} style={props.styles?.count}>
            {countText.value}
          </span>
        )}
        {slots.suffix && <div class={ns.e('suffix')}>{slots.suffix()}</div>}
      </div>
    )
  },
})
