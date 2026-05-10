import type { Placement } from '@floating-ui/vue'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import type {
  CascaderColumnItem,
  CascaderFieldNames,
  CascaderOption,
  CascaderPlacement,
  CascaderProps,
  CascaderRawValue,
  CascaderValuePath,
} from './cascader-types'
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
import { cascaderProps } from './cascader-types'
import './cascader.scss'

const PLACEMENT_TO_FLOATING: Record<CascaderPlacement, Placement> = {
  bottomLeft: 'bottom-start',
  bottomRight: 'bottom-end',
  topLeft: 'top-start',
  topRight: 'top-end',
}

interface ResolvedFieldNames {
  label: string
  value: string
  children: string
  disabled: string
}

function resolveFieldNames(input: CascaderFieldNames | undefined): ResolvedFieldNames {
  return {
    label: input?.label ?? 'label',
    value: input?.value ?? 'value',
    children: input?.children ?? 'children',
    disabled: input?.disabled ?? 'disabled',
  }
}

function getOptionValue(opt: CascaderOption, fn: ResolvedFieldNames): CascaderRawValue {
  return opt[fn.value] as CascaderRawValue
}

function getOptionLabel(opt: CascaderOption, fn: ResolvedFieldNames): string {
  const v = opt[fn.label]
  if (v === null || v === undefined) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  return ''
}

function getOptionChildren(opt: CascaderOption, fn: ResolvedFieldNames): CascaderOption[] | undefined {
  const v = opt[fn.children]
  return Array.isArray(v) ? (v as CascaderOption[]) : undefined
}

function isOptionDisabled(opt: CascaderOption, fn: ResolvedFieldNames): boolean {
  return Boolean(opt[fn.disabled])
}

function findOptionPath(
  options: CascaderOption[],
  value: CascaderValuePath,
  fn: ResolvedFieldNames,
): CascaderOption[] | null {
  const path: CascaderOption[] = []
  let currentList: CascaderOption[] = options
  for (const v of value) {
    const found = currentList.find((opt) => getOptionValue(opt, fn) === v)
    if (!found) return null
    path.push(found)
    currentList = getOptionChildren(found, fn) ?? []
  }
  return path
}

function toColumnItem(opt: CascaderOption, fn: ResolvedFieldNames): CascaderColumnItem {
  const children = getOptionChildren(opt, fn)
  return {
    raw: opt,
    value: getOptionValue(opt, fn),
    label: getOptionLabel(opt, fn),
    disabled: isOptionDisabled(opt, fn),
    isLeaf: !children || children.length === 0,
    children: children ?? [],
  }
}

export default defineComponent({
  name: 'CCascader',
  props: cascaderProps,
  emits: ['update:modelValue', 'change', 'popup-visible-change', 'focus', 'blur'],
  setup(props: CascaderProps, { emit }) {
    const ns = useNamespace('cascader')
    const cfg = useConfig()
    const notFoundLocal = computed(() => props.notFoundContent || cfg.locale?.Cascader?.notFoundContent || '暂无数据')
    const rootRef = ref<HTMLElement | null>(null)
    const popupRef = ref<HTMLElement | null>(null)
    const inputRef = ref<HTMLInputElement | null>(null)
    const open = shallowRef(false)
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)

    const fn = computed(() => resolveFieldNames(props.fieldNames))

    // 受控选中路径（解析失败时为 []）
    const selectedPath = computed<CascaderOption[]>(() => {
      const v = props.modelValue
      if (!v || !Array.isArray(v) || v.length === 0) return []
      return findOptionPath(props.options, v, fn.value) ?? []
    })

    // 面板上 active 的路径，决定哪几列展开
    const activePath = shallowRef<CascaderOption[]>(selectedPath.value)

    watch(selectedPath, (next) => {
      activePath.value = next
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

    const inputDisplay = computed(() => {
      const path = selectedPath.value
      if (path.length === 0) return ''
      const labels = path.map((opt) => getOptionLabel(opt, fn.value))
      if (props.displayRender) {
        return props.displayRender(labels, path)
      }
      return labels.join(props.separator)
    })

    // 渲染列：第 0 列 = options；第 i 列 = activePath[i-1].children
    const columns = computed<CascaderColumnItem[][]>(() => {
      const cols: CascaderColumnItem[][] = []
      cols.push(props.options.map((o) => toColumnItem(o, fn.value)))
      for (let i = 0; i < activePath.value.length; i += 1) {
        const node = activePath.value[i]
        const children = getOptionChildren(node, fn.value)
        if (children && children.length > 0) {
          cols.push(children.map((o) => toColumnItem(o, fn.value)))
        }
      }
      return cols
    })

    function openPopup() {
      if (props.disabled || open.value) return
      activePath.value = selectedPath.value
      open.value = true
      emit('popup-visible-change', true)
    }

    function closePopup() {
      if (!open.value) return
      open.value = false
      emit('popup-visible-change', false)
    }

    function togglePopup() {
      if (open.value) {
        closePopup()
      } else {
        openPopup()
      }
    }

    function emitChange(path: CascaderOption[]) {
      const value: CascaderValuePath = path.map((opt) => getOptionValue(opt, fn.value))
      emit('update:modelValue', value)
      emit('change', value, path)
      formItem?.validate('change')
    }

    function pickOption(columnIndex: number, item: CascaderColumnItem) {
      if (item.disabled) return
      // 把 activePath 截断到 columnIndex 然后 push 当前 item.raw
      const nextActive = activePath.value.slice(0, columnIndex)
      nextActive.push(item.raw)
      activePath.value = nextActive

      if (item.isLeaf) {
        emitChange(nextActive)
        closePopup()
        return
      }
      if (props.changeOnSelect) {
        emitChange(nextActive)
        // changeOnSelect 不关闭面板，让用户继续展开下一级
      }
    }

    function clear(e: MouseEvent) {
      e.stopPropagation()
      if (selectedPath.value.length === 0) return
      emit('update:modelValue', null)
      emit('change', null, [])
      formItem?.validate('change')
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

    const showClear = computed(() => props.clearable && !props.disabled && selectedPath.value.length > 0)

    function isItemActive(columnIndex: number, item: CascaderColumnItem): boolean {
      const node = activePath.value[columnIndex]
      if (!node) return false
      return getOptionValue(node, fn.value) === item.value
    }

    function renderColumn(items: CascaderColumnItem[], columnIndex: number) {
      if (items.length === 0) {
        return (
          <ul class={[ns.e('column'), ns.em('column', 'empty')]}>
            <li class={ns.e('empty')}>{notFoundLocal.value}</li>
          </ul>
        )
      }
      return (
        <ul class={ns.e('column')} role="menu">
          {items.map((item) => {
            const active = isItemActive(columnIndex, item)
            return (
              <li
                class={[ns.e('item'), active && ns.em('item', 'active'), item.disabled && ns.em('item', 'disabled')]}
                role="menuitem"
                aria-disabled={item.disabled}
                onClick={() => pickOption(columnIndex, item)}
              >
                <span class={ns.e('item-label')}>{item.label}</span>
                {!item.isLeaf && <span class={ns.e('expand-icon')}>{props.expandIcon}</span>}
              </li>
            )
          })}
        </ul>
      )
    }

    function buildPopup() {
      const popupCls = [ns.e('panel'), props.popupClassName].filter(Boolean) as string[]
      return h('div', { ref: popupRef, class: popupCls, style: floatingStyles.value, role: 'dialog' }, [
        <div class={ns.e('columns')}>{columns.value.map((col, i) => renderColumn(col, i))}</div>,
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
            placeholder={props.placeholder}
            value={inputDisplay.value}
            aria-haspopup="menu"
            aria-expanded={open.value}
            onFocus={() => emit('focus')}
            onBlur={() => emit('blur')}
          />
          {showClear.value ? (
            <span class={ns.e('clear')} role="button" aria-label="清除" onClick={clear}>
              ×
            </span>
          ) : (
            <span class={ns.e('suffix')} aria-hidden="true">
              ▾
            </span>
          )}
        </div>
        {renderPopup()}
      </div>
    )
  },
})
