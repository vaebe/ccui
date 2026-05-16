import type { ExtractPropTypes, PropType } from 'vue'
import type { ButtonSizeType, ButtonType } from '../../button/src/button-types'
import type { PopoverPlacement } from '../../popover/src/popover-types'
import type { DropdownItem } from '../../dropdown/src/dropdown-types'

/**
 * 主按钮 + 下拉触发按钮组合控件。
 *
 * - 主按钮：点击触发 `click` 事件（与普通 Button 一致，承担主操作）。
 * - 下拉触发按钮：hover / click 打开 Dropdown 菜单（与现有 `<c-dropdown>` 行为对齐）。
 * - menu / items 与 `<c-dropdown>` 一致（slot `menu` 优先于 `items` prop）。
 *
 * **完全平铺顶层**：`<c-dropdown-button>` / `import { DropdownButton }`，不挂 Dropdown.Button 静态属性。
 */
export const dropdownButtonProps = {
  // —— Dropdown 透传 ——
  items: {
    type: Array as PropType<DropdownItem[]>,
    default: () => [],
  },
  trigger: {
    type: String as PropType<'hover' | 'click' | 'contextmenu'>,
    default: 'hover',
  },
  placement: {
    type: String as PropType<PopoverPlacement>,
    default: 'bottom-end',
  },
  visible: {
    type: Boolean,
    default: undefined,
  },
  hideOnClick: {
    type: Boolean,
    default: true,
  },
  width: {
    type: [Number, String] as PropType<number | string>,
    default: '',
  },
  // —— Button 透传 ——
  /**
   * 主 + 下拉按钮共享的视觉 type；与 `<c-button>` 同义。
   */
  type: {
    type: String as PropType<ButtonType>,
    default: 'default',
  },
  size: {
    type: String as PropType<ButtonSizeType>,
    default: 'default',
  },
  /**
   * 整体禁用（主按钮 + 下拉触发同时灰化）。
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 危险型 button；与 `<c-button danger>` 同义，应用到两个按钮。
   */
  danger: {
    type: Boolean,
    default: false,
  },
  /**
   * 主按钮 loading（透传到主按钮）。下拉触发按钮不显示 loading。
   */
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   * 主按钮文本（default slot 优先）。
   */
  label: {
    type: String,
    default: '',
  },
  /**
   * 下拉触发按钮的图标（slot `icon` 优先）。默认 ▼。
   */
  icon: {
    type: String,
    default: '',
  },
  /**
   * 主按钮原生 type；与 `<c-button>` 同义。
   */
  htmlType: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button',
  },
  /**
   * 主按钮 href；设置后渲染成 `<a>`。下拉触发按钮始终是 `<button>`。
   */
  href: {
    type: String,
    default: '',
  },
} as const

export type DropdownButtonProps = ExtractPropTypes<typeof dropdownButtonProps>
