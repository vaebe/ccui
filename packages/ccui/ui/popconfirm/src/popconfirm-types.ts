import type { ExtractPropTypes, PropType } from 'vue'
import type { PopoverPlacement } from '../../popover/src/popover-types'

export type PopconfirmType = 'primary' | 'danger' | 'default'

export const popconfirmProps = {
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  placement: {
    type: String as PropType<PopoverPlacement>,
    default: 'top' as PopoverPlacement,
  },
  /**
   * @deprecated 请改用 `okText`（Ant Design 主名）。
   * 运行时从 ConfigProvider.locale.Popconfirm 取值；用户显式传 ok-text 仍优先。
   */
  confirmText: {
    type: String,
    default: '',
  },
  /**
   * Ant Design 主名：确认按钮文案。显式 `okText` 优先于 `confirmText`。
   */
  okText: {
    type: String,
    default: '',
  },
  cancelText: {
    type: String,
    default: '',
  },
  /**
   * @deprecated 请改用 `okType`（Ant Design 主名）。
   */
  confirmType: {
    type: String as PropType<PopconfirmType>,
    default: 'primary' as PopconfirmType,
  },
  /**
   * Ant Design 主名：确认按钮 type。
   */
  okType: {
    type: String as PropType<PopconfirmType>,
    default: undefined,
  },
  icon: {
    type: String,
    default: '',
  },
  iconColor: {
    type: String,
    default: '#faad14',
  },
  hideIcon: {
    type: Boolean,
    default: false,
  },
  width: {
    type: [Number, String] as PropType<number | string>,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * @deprecated 请改用 `open`（Ant Design 主名 + `v-model:open`）。
   */
  visible: {
    type: Boolean,
    default: undefined,
  },
  /**
   * Ant Design 主名：受控显示。显式 `open` 优先于 `visible`。
   */
  open: {
    type: Boolean,
    default: undefined,
  },
  trigger: {
    type: String as PropType<'click' | 'hover' | 'focus' | 'manual'>,
    default: 'click' as const,
  },
} as const

export type PopconfirmProps = ExtractPropTypes<typeof popconfirmProps>
