import type { ComputedRef, Ref } from 'vue'
import type { TreeNodeKey, TreeProps } from '../tree-types'
import { computed, ref, watch } from 'vue'

function toSet(keys: TreeNodeKey[] | undefined): Set<TreeNodeKey> {
  return new Set(keys ?? [])
}

export function useControllableSet(
  controlled: ComputedRef<TreeNodeKey[] | undefined>,
  defaultValue: ComputedRef<TreeNodeKey[]>,
  emitUpdate: (next: TreeNodeKey[]) => void,
) {
  const internal = ref<Set<TreeNodeKey>>(toSet(defaultValue.value))

  watch(controlled, (value) => {
    if (value !== undefined) {
      internal.value = toSet(value)
    }
  })

  const current = computed<Set<TreeNodeKey>>(() => {
    if (controlled.value !== undefined) {
      return toSet(controlled.value)
    }
    return internal.value
  })

  const setKeys = (keys: TreeNodeKey[]) => {
    if (controlled.value === undefined) {
      internal.value = toSet(keys)
    }
    emitUpdate(keys)
  }

  return { current, setKeys }
}

export interface TreeStateContext {
  selectedKeys: ComputedRef<Set<TreeNodeKey>>
  setSelectedKeys: (keys: TreeNodeKey[]) => void
  checkedKeys: ComputedRef<Set<TreeNodeKey>>
  setCheckedKeys: (keys: TreeNodeKey[]) => void
  expandedKeys: ComputedRef<Set<TreeNodeKey>>
  setExpandedKeys: (keys: TreeNodeKey[]) => void
}

type TreeEmit = (
  event: 'update:selectedKeys' | 'update:checkedKeys' | 'update:expandedKeys',
  value: TreeNodeKey[],
) => void

export function useTreeState(
  props: TreeProps,
  initialExpandedAll: Ref<TreeNodeKey[]>,
  emit: TreeEmit,
): TreeStateContext {
  const selectedKeysProp = computed(() => props.selectedKeys)
  const defaultSelected = computed(() => props.defaultSelectedKeys ?? [])
  const checkedKeysProp = computed(() => props.checkedKeys)
  const defaultChecked = computed(() => props.defaultCheckedKeys ?? [])
  const expandedKeysProp = computed(() => props.expandedKeys)
  const defaultExpanded = computed(() =>
    props.expandedKeys
      ? props.expandedKeys
      : initialExpandedAll.value.length > 0
        ? initialExpandedAll.value
        : (props.defaultExpandedKeys ?? []),
  )

  const selected = useControllableSet(selectedKeysProp, defaultSelected, (keys) => emit('update:selectedKeys', keys))
  const checked = useControllableSet(checkedKeysProp, defaultChecked, (keys) => emit('update:checkedKeys', keys))
  const expanded = useControllableSet(expandedKeysProp, defaultExpanded, (keys) => emit('update:expandedKeys', keys))

  return {
    selectedKeys: selected.current,
    setSelectedKeys: selected.setKeys,
    checkedKeys: checked.current,
    setCheckedKeys: checked.setKeys,
    expandedKeys: expanded.current,
    setExpandedKeys: expanded.setKeys,
  }
}
