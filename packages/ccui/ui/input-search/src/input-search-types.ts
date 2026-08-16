import type { ExtractPropTypes, PropType, VNode } from 'vue'
import { inputProps } from '../../input/src/input-types'

export type InputSearchEnterButton = boolean | string | VNode

export const inputSearchProps = {
  // 保留历史上由 Input 展开的完整 props，避免小版本升级收窄 InputSearchProps，或让这些
  // 已识别属性意外跌落为原生 DOM attrs。未实现的兼容项已在文档标为 deprecated。
  ...inputProps,
  /**
   * 搜索按钮：
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
