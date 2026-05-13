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
  // 显式 isLeaf=false 把节点标为非叶子（即使无 children，配合 loadData）
  const isLeaf = opt.isLeaf === false ? false : !children || children.length === 0
  return {
    raw: opt,
    value: getOptionValue(opt, fn),
    label: getOptionLabel(opt, fn),
    disabled: isOptionDisabled(opt, fn),
    isLeaf,
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

    // 受控选中路径（单选模式）
    const selectedPath = computed<CascaderOption[]>(() => {
      if (props.multiple) return []
      const v = props.modelValue as CascaderValuePath | null | undefined
      if (!v || !Array.isArray(v) || v.length === 0 || Array.isArray(v[0])) return []
      return findOptionPath(props.options, v as CascaderValuePath, fn.value) ?? []
    })

    // 多选模式：modelValue 是 CascaderValuePath[]
    const selectedPaths = computed<CascaderOption[][]>(() => {
      if (!props.multiple) return []
      const v = props.modelValue as CascaderValuePath[] | null | undefined
      if (!v || !Array.isArray(v) || v.length === 0) return []
      // 必须是嵌套数组
      if (!Array.isArray(v[0])) return []
      const out: CascaderOption[][] = []
      for (const p of v) {
        const r = findOptionPath(props.options, p, fn.value)
        if (r) out.push(r)
      }
      return out
    })

    function pathKey(path: CascaderOption[]): string {
      return path.map((n) => String(getOptionValue(n, fn.value))).join('')
    }

    const checkedKeys = computed<Set<string>>(() => {
      const set = new Set<string>()
      for (const p of selectedPaths.value) set.add(pathKey(p))
      return set
    })

    // loadData 进行中的 option 集合
    const loadingSet = shallowRef<Set<CascaderOption>>(new Set())
    function setLoading(opt: CascaderOption, on: boolean) {
      const next = new Set(loadingSet.value)
      if (on) next.add(opt)
      else next.delete(opt)
      loadingSet.value = next
    }
    function maybeLoadData(item: CascaderColumnItem, pathUpTo: CascaderOption[]) {
      if (!props.loadData) return
      if (item.isLeaf) return
      if (item.children.length > 0) return
      if (loadingSet.value.has(item.raw)) return
      setLoading(item.raw, true)
      try {
        const ret = props.loadData([...pathUpTo, item.raw])
        Promise.resolve(ret).finally(() => setLoading(item.raw, false))
      } catch {
        setLoading(item.raw, false)
      }
    }

    // showSearch 状态
    const searchValue = ref('')
    const showSearchActive = computed(() => !!props.showSearch)
    const isSearching = computed(() => showSearchActive.value && searchValue.value.length > 0)

    // 默认过滤：path 上任一节点 label 包含 input（忽略大小写）
    function defaultSearchFilter(input: string, path: CascaderOption[]): boolean {
      const lower = input.toLowerCase()
      return path.some((n) => getOptionLabel(n, fn.value).toLowerCase().includes(lower))
    }

    const customSearchFilter = computed(() => {
      const ss = props.showSearch
      if (typeof ss === 'object' && ss && typeof ss.filter === 'function') return ss.filter
      return null
    })

    // 把 options 展平为所有叶子路径（含 changeOnSelect 时的中间路径）
    function flattenPaths(opts: CascaderOption[], parents: CascaderOption[] = []): CascaderOption[][] {
      const out: CascaderOption[][] = []
      for (const opt of opts) {
        const path = [...parents, opt]
        const children = getOptionChildren(opt, fn.value)
        const isLeaf = !children || children.length === 0
        if (isLeaf) {
          out.push(path)
        } else {
          if (props.changeOnSelect) out.push(path)
          out.push(...flattenPaths(children, path))
        }
      }
      return out
    }

    const searchResults = computed<CascaderOption[][]>(() => {
      if (!isSearching.value) return []
      const all = flattenPaths(props.options)
      const filter = customSearchFilter.value || defaultSearchFilter
      return all.filter((path) => filter(searchValue.value, path))
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
      searchValue.value = ''
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

    function emitChangeMultiple(paths: CascaderOption[][]) {
      const value: CascaderValuePath[] = paths.map((p) => p.map((n) => getOptionValue(n, fn.value)))
      emit('update:modelValue', value)
      emit('change', value, paths)
      formItem?.validate('change')
    }

    function togglePath(path: CascaderOption[]) {
      const key = pathKey(path)
      const current = selectedPaths.value
      const next = checkedKeys.value.has(key) ? current.filter((p) => pathKey(p) !== key) : [...current, path]
      emitChangeMultiple(next)
    }

    function pickOption(columnIndex: number, item: CascaderColumnItem) {
      if (item.disabled) return
      const nextActive = activePath.value.slice(0, columnIndex)
      nextActive.push(item.raw)
      activePath.value = nextActive

      if (props.multiple) {
        // 多选：叶子节点（或 changeOnSelect 的中间节点）触发 toggle，面板不关
        if (item.isLeaf || props.changeOnSelect) {
          togglePath(nextActive)
        } else {
          maybeLoadData(item, activePath.value.slice(0, columnIndex))
        }
        return
      }

      if (item.isLeaf) {
        emitChange(nextActive)
        closePopup()
        return
      }
      // 非叶子 + 空 children + loadData → 触发异步加载
      maybeLoadData(item, activePath.value.slice(0, columnIndex))
      if (props.changeOnSelect) {
        emitChange(nextActive)
        // changeOnSelect 不关闭面板，让用户继续展开下一级
      }
    }

    // hover trigger：仅展开 activePath，不 emit / 不关闭。叶子节点忽略（hover 不该选中）。
    function hoverOption(columnIndex: number, item: CascaderColumnItem) {
      if (props.expandTrigger !== 'hover') return
      if (item.disabled || item.isLeaf) return
      const nextActive = activePath.value.slice(0, columnIndex)
      nextActive.push(item.raw)
      activePath.value = nextActive
      maybeLoadData(item, activePath.value.slice(0, columnIndex))
    }

    function pickSearchResult(path: CascaderOption[]) {
      if (path.some((n) => isOptionDisabled(n, fn.value))) return
      activePath.value = path
      if (props.multiple) {
        togglePath(path)
        searchValue.value = ''
        return
      }
      emitChange(path)
      closePopup()
    }

    function onInputInput(e: Event) {
      if (!showSearchActive.value) return
      const v = (e.target as HTMLInputElement).value
      searchValue.value = v
      if (v && !open.value) openPopup()
    }

    function clear(e: MouseEvent) {
      e.stopPropagation()
      if (props.multiple) {
        if (selectedPaths.value.length === 0) return
        emit('update:modelValue', [])
        emit('change', [], [])
        formItem?.validate('change')
        return
      }
      if (selectedPath.value.length === 0) return
      emit('update:modelValue', null)
      emit('change', null, [])
      formItem?.validate('change')
    }

    function removeTag(e: MouseEvent, path: CascaderOption[]) {
      e.stopPropagation()
      togglePath(path)
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

    const showClear = computed(() => {
      if (props.disabled || !props.clearable) return false
      return props.multiple ? selectedPaths.value.length > 0 : selectedPath.value.length > 0
    })

    function isItemActive(columnIndex: number, item: CascaderColumnItem): boolean {
      const node = activePath.value[columnIndex]
      if (!node) return false
      return getOptionValue(node, fn.value) === item.value
    }

    // 多选模式下，item 的 checkbox：判定当前 path 是否已选
    function isItemChecked(columnIndex: number, item: CascaderColumnItem): boolean {
      const path = [...activePath.value.slice(0, columnIndex), item.raw]
      return checkedKeys.value.has(pathKey(path))
    }

    function renderItemCheckbox(columnIndex: number, item: CascaderColumnItem) {
      const checked = isItemChecked(columnIndex, item)
      return (
        <span
          class={[ns.e('item-checkbox'), checked && ns.em('item-checkbox', 'checked')]}
          role="checkbox"
          aria-checked={checked}
          aria-disabled={item.disabled}
        >
          {checked ? '✓' : ''}
        </span>
      )
    }

    function renderTags() {
      return (
        <div class={ns.e('tags')}>
          {selectedPaths.value.map((path) => {
            const labels = path.map((n) => getOptionLabel(n, fn.value))
            const tagText = props.displayRender ? props.displayRender(labels, path) : labels[labels.length - 1] || ''
            return (
              <span class={ns.e('tag')}>
                <span class={ns.e('tag-label')}>{tagText}</span>
                <span
                  class={ns.e('tag-close')}
                  role="button"
                  aria-label="移除"
                  onClick={(e: MouseEvent) => removeTag(e, path)}
                >
                  ×
                </span>
              </span>
            )
          })}
        </div>
      )
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
                class={[
                  ns.e('item'),
                  active && ns.em('item', 'active'),
                  item.disabled && ns.em('item', 'disabled'),
                  loadingSet.value.has(item.raw) && ns.em('item', 'loading'),
                ]}
                role="menuitem"
                aria-disabled={item.disabled}
                onClick={() => pickOption(columnIndex, item)}
                onMouseenter={() => hoverOption(columnIndex, item)}
              >
                {props.multiple && (item.isLeaf || props.changeOnSelect) && renderItemCheckbox(columnIndex, item)}
                <span class={ns.e('item-label')}>{item.label}</span>
                {loadingSet.value.has(item.raw) ? (
                  <span class={ns.e('expand-icon')} aria-label="loading">
                    ⟳
                  </span>
                ) : (
                  !item.isLeaf && <span class={ns.e('expand-icon')}>{props.expandIcon}</span>
                )}
              </li>
            )
          })}
        </ul>
      )
    }

    function renderSearchPanel() {
      const results = searchResults.value
      if (results.length === 0) {
        return (
          <ul class={[ns.e('column'), ns.em('column', 'search')]}>
            <li class={ns.e('empty')}>{notFoundLocal.value}</li>
          </ul>
        )
      }
      return (
        <ul class={[ns.e('column'), ns.em('column', 'search')]} role="menu">
          {results.map((path) => {
            const labels = path.map((n) => getOptionLabel(n, fn.value))
            const disabled = path.some((n) => isOptionDisabled(n, fn.value))
            return (
              <li
                class={[ns.e('search-item'), disabled && ns.em('search-item', 'disabled')]}
                role="menuitem"
                aria-disabled={disabled}
                onClick={() => pickSearchResult(path)}
              >
                {labels.join(props.separator)}
              </li>
            )
          })}
        </ul>
      )
    }

    function buildPopup() {
      const popupCls = [ns.e('panel'), isSearching.value && ns.em('panel', 'searching'), props.popupClassName].filter(
        Boolean,
      ) as string[]
      const body = isSearching.value ? (
        renderSearchPanel()
      ) : (
        <div class={ns.e('columns')}>{columns.value.map((col, i) => renderColumn(col, i))}</div>
      )
      return h('div', { ref: popupRef, class: popupCls, style: floatingStyles.value, role: 'dialog' }, [body])
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

    // showSearch 时 input 可写；面板打开 + 正在搜索时 input 显示 searchValue 而非已选 label
    const inputReadonly = computed(() => (showSearchActive.value ? false : props.inputReadOnly))
    const inputValueShown = computed(() =>
      showSearchActive.value && (open.value || isSearching.value) ? searchValue.value : inputDisplay.value,
    )

    // 多选时 placeholder 仅在没选任何 + 没搜索值时显示；input 自身的 value 显示 searchValue
    const inputPlaceholder = computed(() => {
      if (props.multiple) {
        return selectedPaths.value.length === 0 ? props.placeholder : ''
      }
      return props.placeholder
    })

    return () => (
      <div ref={rootRef} class={[...rootCls.value, props.multiple && ns.m('multiple')].filter(Boolean) as string[]}>
        <div class={ns.e('input-wrap')} onClick={togglePopup}>
          {props.multiple && renderTags()}
          <input
            ref={inputRef}
            class={ns.e('input')}
            type="text"
            readonly={inputReadonly.value}
            disabled={props.disabled}
            placeholder={inputPlaceholder.value}
            value={props.multiple ? searchValue.value : inputValueShown.value}
            aria-haspopup="menu"
            aria-expanded={open.value}
            onFocus={() => emit('focus')}
            onBlur={() => emit('blur')}
            onInput={onInputInput}
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
