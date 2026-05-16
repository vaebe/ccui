import type { Placement } from '@floating-ui/vue'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { TreeFieldNames, TreeFilterPredicate, TreeNodeData, TreeNodeKey } from '../../tree/src/tree-types'
import type {
  TreeSelectFieldNames,
  TreeSelectPlacement,
  TreeSelectProps,
  TreeSelectShowSearchConfig,
} from './tree-select-types'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
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
  Teleport,
  Transition,
} from 'vue'
import { useConfig } from '../../config-provider/src/config-provider'
import { formItemInjectionKey } from '../../form/src/form-types'
import { renderIconNode } from '../../shared/hooks/use-icon'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Tree } from '../../tree'
import { treeSelectProps } from './tree-select-types'
import './tree-select.scss'

const PLACEMENT_TO_FLOATING: Record<TreeSelectPlacement, Placement> = {
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

function resolveFieldNames(input: TreeSelectFieldNames | undefined): ResolvedFieldNames {
  return {
    label: input?.label ?? 'label',
    value: input?.value ?? 'value',
    children: input?.children ?? 'children',
    disabled: input?.disabled ?? 'disabled',
  }
}

// 把 TreeSelect 的 fieldNames（label/value/children/disabled）映射到 c-tree 的（title/key/children/disabled）。
function toTreeFieldNames(fn: ResolvedFieldNames): TreeFieldNames {
  return {
    title: fn.label,
    key: fn.value,
    children: fn.children,
    disabled: fn.disabled,
  }
}

function asLabel(v: unknown): string {
  if (v === null || v === undefined) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  return ''
}

interface NodeIndexEntry {
  key: TreeNodeKey
  label: string
  disabled: boolean
}

function buildNodeIndex(data: TreeNodeData[] | undefined, fn: ResolvedFieldNames): Map<TreeNodeKey, NodeIndexEntry> {
  const map = new Map<TreeNodeKey, NodeIndexEntry>()
  function walk(list: TreeNodeData[] | undefined) {
    if (!list) return
    for (const node of list) {
      const key = node[fn.value] as TreeNodeKey | undefined
      if (key !== undefined && key !== null) {
        map.set(key, {
          key,
          label: asLabel(node[fn.label]),
          disabled: Boolean(node[fn.disabled]),
        })
      }
      const children = node[fn.children] as TreeNodeData[] | undefined
      if (Array.isArray(children)) walk(children)
    }
  }
  walk(data)
  return map
}

function normalizeMultipleValue(v: unknown): TreeNodeKey[] {
  if (!v) return []
  if (Array.isArray(v)) return v as TreeNodeKey[]
  return [v as TreeNodeKey]
}

export default defineComponent({
  name: 'CTreeSelect',
  props: treeSelectProps,
  emits: ['update:modelValue', 'change', 'popup-visible-change', 'focus', 'blur'],
  setup(props: TreeSelectProps, { emit, slots }) {
    const ns = useNamespace('tree-select')
    const cfg = useConfig()
    const uid = getCurrentInstance()?.uid ?? 0
    const popupId = `ccui-tree-select-popup-${uid}`
    const notFoundLocal = computed(() => props.notFoundContent || cfg.locale?.TreeSelect?.notFoundContent || '暂无数据')
    const rootRef = ref<HTMLElement | null>(null)
    const popupRef = ref<HTMLElement | null>(null)
    const inputRef = ref<HTMLInputElement | null>(null)
    const searchInputRef = ref<HTMLInputElement | null>(null)
    const treeRootRef = ref<HTMLElement | null>(null)
    const open = shallowRef(false)
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)

    const fn = computed(() => resolveFieldNames(props.fieldNames))
    const treeFieldNames = computed(() => toTreeFieldNames(fn.value))

    // ===== M-B5 showSearch / loadData =====
    const showSearchActive = computed(() => !!props.showSearch)
    const showSearchCfg = computed<TreeSelectShowSearchConfig>(() => {
      const raw = props.showSearch
      return raw && typeof raw === 'object' ? raw : {}
    })
    const searchValue = shallowRef('')
    // showSearch 启用时：
    // - 用户传 filterTreeNode：包装为 c-tree 的 (node, parentKeys) 签名，input 来自 searchValue
    // - 未传 filterTreeNode：返回 undefined → c-tree 走内置 title 子串匹配（基于 searchValue）
    // 当用户传 treeNodeFilterProp 且 fieldNames.label 不一致时，用 prop 字段子串匹配
    const effectiveFilter = computed<TreeFilterPredicate | undefined>(() => {
      if (!showSearchActive.value) return undefined
      const userFn = showSearchCfg.value.filterTreeNode
      if (userFn) {
        const inputVal = searchValue.value
        return (node: TreeNodeData) => userFn(inputVal, node)
      }
      const customProp = showSearchCfg.value.treeNodeFilterProp
      if (customProp && customProp !== fn.value.label) {
        const inputVal = searchValue.value
        return (node: TreeNodeData) => {
          if (!inputVal) return true
          const v = node[customProp]
          if (v === null || v === undefined) return false
          if (typeof v !== 'string' && typeof v !== 'number') return false
          return String(v).toLowerCase().includes(inputVal.toLowerCase())
        }
      }
      // 走 c-tree 内置 title 子串匹配
      return undefined
    })
    const searchPlaceholderText = computed(
      () => props.searchPlaceholder || cfg.locale?.TreeSelect?.searchPlaceholder || '搜索',
    )

    // 节点索引：value → { key, label, disabled }，方便从 modelValue 反查 label
    const nodeIndex = computed(() => buildNodeIndex(props.treeData, fn.value))

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

    // 单选时单值 / 多选时数组
    const selectedKeys = computed<TreeNodeKey[]>(() => normalizeMultipleValue(props.modelValue))

    // 多选模式标签数据（用于输入框 tags 渲染）
    const selectedTags = computed(() => {
      if (!props.multiple) return []
      return selectedKeys.value.map((k) => {
        const meta = nodeIndex.value.get(k)
        return { key: k, label: meta?.label ?? String(k) }
      })
    })

    const visibleTags = computed(() => selectedTags.value.slice(0, props.maxTagCount))
    const hiddenTagCount = computed(() => Math.max(selectedTags.value.length - visibleTags.value.length, 0))

    // 单选 input 显示
    const inputDisplay = computed(() => {
      if (props.multiple) return ''
      const keys = selectedKeys.value
      if (keys.length === 0) return ''
      const meta = nodeIndex.value.get(keys[0])
      return meta?.label ?? ''
    })

    function openPopup() {
      if (props.disabled || open.value) return
      open.value = true
      emit('popup-visible-change', true)
      if (showSearchActive.value) {
        nextTick(() => searchInputRef.value?.focus())
      }
    }

    function closePopup() {
      if (!open.value) return
      open.value = false
      // 关闭时清空 search，避免下次打开仍带过滤态
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

    function emitChange(nextValue: TreeSelectProps['modelValue']) {
      emit('update:modelValue', nextValue)
      // 收集 labels
      let labels: string[] = []
      if (Array.isArray(nextValue)) {
        labels = nextValue.map((k) => nodeIndex.value.get(k)?.label ?? '')
      } else if (nextValue !== null && nextValue !== undefined) {
        labels = [nodeIndex.value.get(nextValue as TreeNodeKey)?.label ?? '']
      }
      emit('change', nextValue, labels)
      formItem?.validate('change')
    }

    function onTreeSelect(keys: TreeNodeKey[]) {
      // 单选模式 — 始终只取最后一个
      if (!props.multiple) {
        const k = keys[keys.length - 1]
        if (k === undefined || k === null) {
          emitChange(null)
        } else {
          emitChange(k)
        }
        closePopup()
        return
      }
      // 多选 + 非 checkable：用 c-tree 的 multiple selectable
      if (!props.treeCheckable) {
        emitChange(keys.length === 0 ? null : keys)
      }
      // 多选 + checkable 模式下 select 不触发提交（提交走 onTreeCheck）
    }

    function onTreeCheck(keys: TreeNodeKey[]) {
      if (!props.multiple || !props.treeCheckable) return
      emitChange(keys.length === 0 ? null : keys)
    }

    function removeTag(e: MouseEvent, key: TreeNodeKey) {
      e.stopPropagation()
      const next = selectedKeys.value.filter((k) => k !== key)
      emitChange(next.length === 0 ? null : next)
    }

    function clear(e: MouseEvent) {
      e.stopPropagation()
      if (selectedKeys.value.length === 0) return
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

    const showClear = computed(() => props.clearable && !props.disabled && selectedKeys.value.length > 0)

    function buildTree() {
      const usingCheckable = props.multiple && props.treeCheckable
      const baseProps = {
        ref: treeRootRef,
        data: props.treeData,
        fieldNames: treeFieldNames.value,
        defaultExpandAll: props.treeDefaultExpandAll,
        defaultExpandedKeys: props.treeDefaultExpandedKeys,
        blockNode: true,
        searchValue: showSearchActive.value ? searchValue.value : '',
        filterTreeNode: effectiveFilter.value,
        loadData: props.loadData,
      } as Record<string, unknown>
      if (usingCheckable) {
        baseProps.checkable = true
        baseProps.checkStrictly = props.treeCheckStrictly
        baseProps.checkedKeys = selectedKeys.value
        baseProps.selectable = false
        baseProps.onCheck = (keys: TreeNodeKey[]) => onTreeCheck(keys)
      } else {
        baseProps.selectable = true
        baseProps.multiple = !!props.multiple
        baseProps.selectedKeys = selectedKeys.value
        baseProps.onSelect = (keys: TreeNodeKey[]) => onTreeSelect(keys)
      }
      return h(Tree, baseProps)
    }

    function renderSearchBox() {
      if (!showSearchActive.value) return null
      return (
        <div class={ns.e('search')}>
          <input
            ref={searchInputRef}
            class={ns.e('search-input')}
            type="text"
            value={searchValue.value}
            placeholder={searchPlaceholderText.value}
            onInput={(e: Event) => {
              searchValue.value = (e.target as HTMLInputElement).value
            }}
            onKeydown={onPopupKeydown}
          />
        </div>
      )
    }

    function buildPopup() {
      const popupCls = [ns.e('panel'), props.popupClassName].filter(Boolean) as string[]
      const popupStyle = {
        ...(floatingStyles.value as Record<string, unknown>),
        maxHeight: `${props.popupMaxHeight}px`,
      }
      const isEmpty = !props.treeData || props.treeData.length === 0
      return h(
        'div',
        {
          ref: popupRef,
          id: popupId,
          class: [popupCls, props.classNames?.popup],
          style: [popupStyle, props.styles?.popup] as any,
          role: 'dialog',
          'aria-label': props.placeholder || '选择',
        },
        [
          renderSearchBox(),
          isEmpty ? (
            <div class={ns.e('empty')}>{notFoundLocal.value}</div>
          ) : (
            <div class={ns.e('tree-wrap')}>{buildTree()}</div>
          ),
        ],
      )
    }

    // ===== M-B5 键盘导航 =====
    function forwardKeydownToTree(key: string) {
      const el = (treeRootRef.value as unknown as { $el?: HTMLElement } | HTMLElement | null) ?? null
      const dom = (el && (el as { $el?: HTMLElement }).$el) || (el as HTMLElement | null)
      if (!dom) return false
      const evt = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
      dom.dispatchEvent(evt)
      return true
    }

    function onInputKeydown(e: KeyboardEvent) {
      if (props.disabled) return
      const k = e.key
      if (!open.value) {
        if (k === 'Enter' || k === ' ' || k === 'ArrowDown') {
          e.preventDefault()
          openPopup()
        }
        return
      }
      if (k === 'Escape') {
        e.preventDefault()
        closePopup()
        return
      }
      if (k === 'Tab') {
        closePopup()
        return
      }
      // 打开态且非 search 模式：把方向键 / Enter 转发到 tree
      if (showSearchActive.value) return
      if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', 'Home', 'End'].includes(k)) {
        e.preventDefault()
        forwardKeydownToTree(k)
      }
    }

    function onPopupKeydown(e: KeyboardEvent) {
      const k = e.key
      if (k === 'Escape') {
        e.preventDefault()
        closePopup()
        inputRef.value?.focus()
        return
      }
      if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(k)) {
        // search 输入框聚焦时让方向键 / Enter 操作 tree 而非光标
        e.preventDefault()
        forwardKeydownToTree(k)
      }
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
      props.multiple && ns.is('multiple'),
      ns.m(props.size),
      mergedStatus.value && ns.m(`status-${mergedStatus.value}`),
      props.variant && ns.m(`variant-${props.variant}`),
    ])

    function renderInputContent() {
      if (props.multiple) {
        // 多选：tags + 折叠 + 占位
        if (selectedKeys.value.length === 0) {
          return (
            <span class={ns.e('placeholder')} aria-hidden="true">
              {props.placeholder}
            </span>
          )
        }
        return (
          <span class={ns.e('tags')}>
            {visibleTags.value.map((tag) => (
              <span class={ns.e('tag')}>
                <span class={ns.e('tag-label')}>{tag.label}</span>
                {!props.disabled && (
                  <span
                    class={ns.e('tag-close')}
                    role="button"
                    aria-label="移除"
                    onClick={(e: MouseEvent) => removeTag(e, tag.key)}
                  >
                    {slots.removeIcon ? slots.removeIcon() : (renderIconNode(props.removeIcon) ?? '×')}
                  </span>
                )}
              </span>
            ))}
            {hiddenTagCount.value > 0 && (
              <span class={[ns.e('tag'), ns.em('tag', 'overflow')]}>
                <span class={ns.e('tag-label')}>+ {hiddenTagCount.value}</span>
              </span>
            )}
          </span>
        )
      }
      // 单选：input
      return (
        <input
          ref={inputRef}
          class={ns.e('input')}
          type="text"
          readonly={props.inputReadOnly}
          disabled={props.disabled}
          placeholder={props.placeholder}
          value={inputDisplay.value}
          role="combobox"
          aria-haspopup="tree"
          aria-expanded={open.value}
          aria-controls={popupId}
          onFocus={() => emit('focus')}
          onBlur={() => {
            emit('blur')
            formItem?.validate('blur')
          }}
          onKeydown={onInputKeydown}
        />
      )
    }

    return () => (
      <div ref={rootRef} class={[rootCls.value, props.classNames?.root]} style={props.styles?.root}>
        <div
          class={[ns.e('input-wrap'), props.classNames?.inputWrap]}
          style={props.styles?.inputWrap}
          tabindex={props.multiple ? 0 : undefined}
          role={props.multiple ? 'combobox' : undefined}
          aria-haspopup={props.multiple ? 'tree' : undefined}
          aria-expanded={props.multiple ? open.value : undefined}
          aria-controls={props.multiple ? popupId : undefined}
          onClick={togglePopup}
          onKeydown={props.multiple ? onInputKeydown : undefined}
        >
          {renderInputContent()}
          {showClear.value ? (
            <span class={ns.e('clear')} role="button" aria-label="清除" onClick={clear}>
              {slots.clearIcon ? slots.clearIcon() : (renderIconNode(props.clearIcon) ?? '×')}
            </span>
          ) : (
            <span class={ns.e('suffix')} aria-hidden="true">
              {slots.suffixIcon ? slots.suffixIcon() : (renderIconNode(props.suffixIcon) ?? '▾')}
            </span>
          )}
        </div>
        {renderPopup()}
      </div>
    )
  },
})
