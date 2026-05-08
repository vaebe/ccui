import type { ComputedRef } from 'vue'
import type { FlattenAllResult } from './use-tree-flatten'
import type { TreeNodeKey } from '../tree-types'
import { computed } from 'vue'

export interface CheckedState {
  checked: Set<TreeNodeKey>
  halfChecked: Set<TreeNodeKey>
}

export function useCheckedDerived(
  flatAll: ComputedRef<FlattenAllResult>,
  checkedKeys: ComputedRef<Set<TreeNodeKey>>,
  checkStrictly: ComputedRef<boolean>,
): ComputedRef<CheckedState> {
  return computed(() => {
    const { flatAll: nodes, byKey } = flatAll.value
    if (checkStrictly.value) {
      return { checked: new Set(checkedKeys.value), halfChecked: new Set() }
    }

    // Build effective checked set: a parent is checked when ALL its
    // non-disableCheckbox descendants are checked. A parent is half-checked
    // when at least one descendant is checked but not all.
    const effectiveChecked = new Set<TreeNodeKey>()
    const halfChecked = new Set<TreeNodeKey>()

    // First propagate down: any explicitly checked node checks all its
    // selectable descendants.
    const userChecked = new Set(checkedKeys.value)
    const isCheckable = (key: TreeNodeKey): boolean => {
      const node = byKey.get(key)
      return !!node && !node.disableCheckbox && !node.disabled
    }

    for (const node of nodes) {
      if (userChecked.has(node.key)) {
        const stack = [node]
        while (stack.length) {
          const cur = stack.pop()!
          if (isCheckable(cur.key)) {
            effectiveChecked.add(cur.key)
          }
          for (const childKey of cur.childKeys) {
            const child = byKey.get(childKey)
            if (child) stack.push(child)
          }
        }
      }
    }

    // Bottom-up: parent checked if all checkable children effectively checked
    // We iterate in reverse so deeper nodes are resolved first. Since flatAll
    // is in pre-order (parent before children), reverse is post-order-ish.
    for (let i = nodes.length - 1; i >= 0; i -= 1) {
      const node = nodes[i]
      if (!node.hasChildren) continue

      const checkableChildren = node.childKeys
        .map((key) => byKey.get(key))
        .filter((child): child is NonNullable<typeof child> => !!child && isCheckable(child.key))

      if (checkableChildren.length === 0) continue

      const allChecked = checkableChildren.every((child) => effectiveChecked.has(child.key))
      const someChecked = checkableChildren.some(
        (child) => effectiveChecked.has(child.key) || halfChecked.has(child.key),
      )

      if (allChecked) {
        if (isCheckable(node.key)) {
          effectiveChecked.add(node.key)
        }
        halfChecked.delete(node.key)
      } else if (someChecked) {
        halfChecked.add(node.key)
        effectiveChecked.delete(node.key)
      }
    }

    return { checked: effectiveChecked, halfChecked }
  })
}

export function computeNextCheckedKeys(
  flat: FlattenAllResult,
  current: Set<TreeNodeKey>,
  toggleKey: TreeNodeKey,
  checkStrictly: boolean,
): TreeNodeKey[] {
  const node = flat.byKey.get(toggleKey)
  if (!node || node.disabled || node.disableCheckbox) {
    return Array.from(current)
  }

  const isCurrentlyChecked = current.has(toggleKey)
  const next = new Set(current)

  if (checkStrictly) {
    if (isCurrentlyChecked) next.delete(toggleKey)
    else next.add(toggleKey)
    return Array.from(next)
  }

  // collect descendants
  const descendants: TreeNodeKey[] = []
  const stack: TreeNodeKey[] = [toggleKey]
  while (stack.length) {
    const cur = stack.pop()!
    descendants.push(cur)
    const curNode = flat.byKey.get(cur)
    if (curNode) {
      for (const childKey of curNode.childKeys) {
        stack.push(childKey)
      }
    }
  }

  if (isCurrentlyChecked) {
    for (const key of descendants) next.delete(key)
  } else {
    for (const key of descendants) {
      const item = flat.byKey.get(key)
      if (item && !item.disabled && !item.disableCheckbox) {
        next.add(key)
      }
    }
  }

  // Cleanup ancestors: a parent should be in `next` only when all its
  // checkable children are in `next`; otherwise drop it (downstream logic
  // promotes via halfChecked).
  for (const parentKey of [...node.parentKeys].reverse()) {
    const parentNode = flat.byKey.get(parentKey)
    if (!parentNode) continue
    const checkableChildren = parentNode.childKeys
      .map((key) => flat.byKey.get(key))
      .filter((child): child is NonNullable<typeof child> => !!child && !child.disableCheckbox && !child.disabled)
    if (checkableChildren.length === 0) continue
    const allIn = checkableChildren.every((child) => next.has(child.key))
    if (allIn) {
      next.add(parentKey)
    } else {
      next.delete(parentKey)
    }
  }

  return Array.from(next)
}
