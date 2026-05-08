import type { ComputedRef, Ref } from 'vue'
import type { FlattenedTreeNode, TreeFieldNames, TreeFilterPredicate, TreeNodeData, TreeNodeKey } from '../tree-types'
import { computed } from 'vue'

const DEFAULTS: Required<TreeFieldNames> = {
  key: 'key',
  title: 'title',
  children: 'children',
  disabled: 'disabled',
  disableCheckbox: 'disableCheckbox',
  isLeaf: 'isLeaf',
  selectable: 'selectable',
}

export function resolveFieldNames(input?: TreeFieldNames): Required<TreeFieldNames> {
  return { ...DEFAULTS, ...input }
}

function readKey(node: TreeNodeData, names: Required<TreeFieldNames>, fallback: number): TreeNodeKey {
  const value = node[names.key] as TreeNodeKey | undefined
  if (value !== undefined && value !== null) {
    return value
  }
  return `__auto_${fallback}`
}

function readChildren(node: TreeNodeData, names: Required<TreeFieldNames>): TreeNodeData[] | undefined {
  const value = node[names.children] as TreeNodeData[] | undefined
  return Array.isArray(value) ? value : undefined
}

function buildNode(
  raw: TreeNodeData,
  names: Required<TreeFieldNames>,
  level: number,
  parentKeys: TreeNodeKey[],
  fallbackId: number,
): FlattenedTreeNode {
  const children = readChildren(raw, names)
  const isLeafExplicit = raw[names.isLeaf] as boolean | undefined
  const hasChildren = !!children && children.length > 0
  const isLeaf = isLeafExplicit !== undefined ? isLeafExplicit : !hasChildren && !raw.loadable
  const key = readKey(raw, names, fallbackId)

  return {
    key,
    raw,
    title: (raw[names.title] as FlattenedTreeNode['title']) ?? key,
    level,
    parentKeys,
    isLeaf,
    disabled: !!raw[names.disabled],
    disableCheckbox: !!raw[names.disableCheckbox],
    selectable: raw[names.selectable] !== false,
    hasChildren,
    childKeys: hasChildren ? children!.map((child, i) => readKey(child, names, fallbackId * 1000 + i)) : [],
  }
}

export interface FlattenAllResult {
  flatAll: FlattenedTreeNode[]
  byKey: Map<TreeNodeKey, FlattenedTreeNode>
  childrenByKey: Map<TreeNodeKey, FlattenedTreeNode[]>
  rootKeys: TreeNodeKey[]
}

function primitiveString(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return ''
}

export function useTreeFlattenAll(
  data: Ref<TreeNodeData[]>,
  fieldNames: ComputedRef<Required<TreeFieldNames>>,
): ComputedRef<FlattenAllResult> {
  return computed(() => {
    const flatAll: FlattenedTreeNode[] = []
    const byKey = new Map<TreeNodeKey, FlattenedTreeNode>()
    const childrenByKey = new Map<TreeNodeKey, FlattenedTreeNode[]>()
    const rootKeys: TreeNodeKey[] = []
    const names = fieldNames.value
    let counter = 0

    const walk = (nodes: TreeNodeData[], level: number, parentKeys: TreeNodeKey[]) => {
      const siblings: FlattenedTreeNode[] = []
      for (const raw of nodes) {
        counter += 1
        const node = buildNode(raw, names, level, parentKeys, counter)
        flatAll.push(node)
        siblings.push(node)
        byKey.set(node.key, node)
        const children = readChildren(raw, names)
        if (children) {
          walk(children, level + 1, [...parentKeys, node.key])
        }
      }
      if (parentKeys.length === 0) {
        rootKeys.push(...siblings.map((node) => node.key))
      } else {
        childrenByKey.set(parentKeys[parentKeys.length - 1], siblings)
      }
    }

    walk(data.value, 0, [])
    return { flatAll, byKey, childrenByKey, rootKeys }
  })
}

export function useTreeVisible(
  flatAll: ComputedRef<FlattenAllResult>,
  expandedKeys: ComputedRef<Set<TreeNodeKey>>,
  searchValue: Ref<string>,
  filterTreeNode?: ComputedRef<TreeFilterPredicate | undefined>,
): ComputedRef<FlattenedTreeNode[]> {
  return computed(() => {
    const { flatAll: allNodes } = flatAll.value
    const expanded = expandedKeys.value
    const keyword = searchValue.value.trim()
    const customFilter = filterTreeNode?.value

    const result: FlattenedTreeNode[] = []
    const visibleAncestors = new Set<TreeNodeKey>()

    if (keyword || customFilter) {
      // Determine matched keys, then include ancestors
      for (const node of allNodes) {
        const matched = customFilter
          ? customFilter(node.raw, node.parentKeys)
          : keyword.length > 0 && primitiveString(node.title).toLowerCase().includes(keyword.toLowerCase())
        if (matched) {
          visibleAncestors.add(node.key)
          for (const parentKey of node.parentKeys) {
            visibleAncestors.add(parentKey)
          }
        }
      }
    }

    for (const node of allNodes) {
      if (visibleAncestors.size > 0 && !visibleAncestors.has(node.key)) {
        continue
      }
      const allParentsExpanded = node.parentKeys.every((parentKey) => expanded.has(parentKey))
      if (!allParentsExpanded) {
        continue
      }
      result.push(node)
    }

    return result
  })
}
