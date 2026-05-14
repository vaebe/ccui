import type { ExtractPropTypes, PropType, VNode } from 'vue'
import { inputProps } from '../../input/src/input-types'

export type InputSearchEnterButton = boolean | string | VNode

export const inputSearchProps = {
  // 复用 Input 的所有 props（type/size/placeholder/disabled/readonly/allowClear/showCount/...）
  ...inputProps,
  /**
   * 搜索按钮（与 Ant `Input.Search` 对齐）：
   *
   * - `false`（默认）：右侧只显示放大镜图标
   * - `true`：右侧显示默认搜索按钮
   * - `string`：作为按钮文字
   * - `VNode`：作为按钮整体内容
   *
   * 也可用同名 slot `enter-button` 完全自定义按钮内容。
   */
  enterButton: {
    type: [Boolean, String, Object] as PropType<InputSearchEnterButton>,
    default: false,
  },
  /**
   * 搜索中状态。开启后按钮内放大镜会替换为旋转 loading 图标，按钮变为 disabled。
   */
  loading: {
    type: Boolean,
    default: false,
  },
} as const

export type InputSearchProps = ExtractPropTypes<typeof inputSearchProps>
