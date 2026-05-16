import type { ExtractPropTypes, PropType } from 'vue'
import type { TreeNodeData, TreeNodeKey } from '../../tree/src/tree-types'
import { treeProps } from '../../tree/src/tree-types'

export type DirectoryTreeExpandAction = 'click' | false

/**
 * 对标 ant `Tree.DirectoryTree`：基于 `<c-tree>` 的目录树预设外壳。
 *
 * 默认值差异（与底层 Tree 比较）：
 *
 * - `defaultExpandAll: true` —— 默认全展开
 * - `blockNode: true` —— 行宽 hover / 选中高亮
 * - `multiple: true` —— 默认多选
 *
 * 额外能力：
 *
 * - 内置 folder open / folder closed / file 三套 SVG 图标（slot `icon` 优先；`node.raw.icon` 次之）
 * - `expandAction: 'click' | false` —— 控制点击节点正文是否同时切换展开（默认 `'click'`）
 *
 * 其他 props / events / slots 完全透传给底层 `<c-tree>`。
 *
 * **不支持 ant 的 `expandAction='doubleClick'`**，当前用 `'click'` 或 `false`。
 */
export const directoryTreeProps = {
  ...treeProps,
  // —— 以下三项覆盖 treeProps 的默认值 ——
  defaultExpandAll: {
    type: Boolean,
    default: true,
  },
  blockNode: {
    type: Boolean,
    default: true,
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  // —— DirectoryTree 独有 ——
  /**
   * 点击展开方式：
   *
   * - `'click'`（默认）：单击节点正文切换展开
   * - `false`：不绑定 click 自动展开，仅 switcher 图标点击展开
   */
  expandAction: {
    type: [String, Boolean] as PropType<DirectoryTreeExpandAction>,
    default: 'click',
  },
  /**
   * 是否启用内置 folder / file 图标。
   *
   * - `true`（默认）：未传 slot `icon` / `node.raw.icon` 时回退到内置 SVG
   * - `false`：禁用内置图标
   */
  showIcon: {
    type: Boolean,
    default: true,
  },
} as const

export type DirectoryTreeProps = ExtractPropTypes<typeof directoryTreeProps>

export type { TreeNodeData, TreeNodeKey }
