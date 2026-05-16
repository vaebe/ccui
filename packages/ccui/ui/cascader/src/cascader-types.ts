import type { ExtractPropTypes, PropType, VNode } from 'vue'

/**
 * 对标 ant `Cascader.SHOW_CHILD` / `.SHOW_PARENT`：`showCheckedStrategy` 取值。
 *
 * - `CASCADER_SHOW_CHILD`：只输出最末级叶子节点（默认）
 * - `CASCADER_SHOW_PARENT`：父节点全部子节点都选中时，只输出父节点
 *
 * 与 ant 的 `Cascader.SHOW_CHILD` 静态属性等价，**不挂命名空间**，从 `vue3-ccui` 顶层 export。
 * 当前 ccui Cascader 尚未接入 `showCheckedStrategy` 这条 API；常量先 export 出去，方便外部代码
 * 提前按 ant 习惯引用，待后续 batch 接入实际逻辑时直接对接。
 */
export const CASCADER_SHOW_CHILD = 'SHOW_CHILD' as const
export const CASCADER_SHOW_PARENT = 'SHOW_PARENT' as const
export type CascaderShowCheckedStrategy = typeof CASCADER_SHOW_CHILD | typeof CASCADER_SHOW_PARENT

export type CascaderRawValue = string | number
export type CascaderValuePath = CascaderRawValue[]
export type CascaderModelValue = CascaderValuePath | CascaderValuePath[] | null
export type CascaderExpandTrigger = 'click' | 'hover'
export type CascaderSize = 'large' | 'default' | 'small'
export type CascaderStatus = '' | 'error' | 'warning' | 'success' | 'validating'
export type CascaderPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
export type GetPopupContainer = (triggerNode: HTMLElement | null) => HTMLElement | null

export interface CascaderOption {
  label?: unknown
  value?: CascaderRawValue
  disabled?: boolean
  children?: CascaderOption[]
  // 显式标记节点是否是叶子。配合 loadData：isLeaf=false 即使无 children 也按可加载处理。
  isLeaf?: boolean
  // 配合 multiple：true 表示该节点视为选中（受控）
  checked?: boolean
  [key: string]: unknown
}

export interface CascaderFieldNames {
  label?: string
  value?: string
  children?: string
  disabled?: string
}

export type CascaderDisplayRender = (labels: string[], selectedOptions: CascaderOption[]) => string

export interface CascaderColumnItem {
  raw: CascaderOption
  value: CascaderRawValue
  label: string
  disabled: boolean
  isLeaf: boolean
  children: CascaderOption[]
}

export const cascaderProps = {
  modelValue: {
    type: Array as unknown as PropType<CascaderModelValue>,
    default: undefined,
  },
  options: {
    type: Array as PropType<CascaderOption[]>,
    default: () => [],
  },
  fieldNames: {
    type: Object as PropType<CascaderFieldNames>,
    default: () => ({}),
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  separator: {
    type: String,
    default: ' / ',
  },
  // 中间节点（非叶子）也可以选中并提交
  changeOnSelect: {
    type: Boolean,
    default: false,
  },
  // 列展开触发方式
  expandTrigger: {
    type: String as PropType<CascaderExpandTrigger>,
    default: 'click',
  },
  // 多选模式：modelValue 变 CascaderValuePath[]；勾选叶子节点聚合提交
  multiple: {
    type: Boolean,
    default: false,
  },
  // 搜索匹配。true → 默认 includes 匹配；函数 → 自定义 (input, path) => boolean
  showSearch: {
    type: [Boolean, Object] as PropType<boolean | { filter?: (input: string, path: CascaderOption[]) => boolean }>,
    default: false,
  },
  // 异步加载非叶子节点的 children。返回 Promise，组件按 path 调用并 swap loading 状态。
  loadData: {
    type: Function as PropType<(path: CascaderOption[]) => Promise<void> | void>,
    default: undefined,
  },
  // 自定义路径展示
  displayRender: {
    type: Function as PropType<CascaderDisplayRender>,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String as PropType<CascaderSize>,
    default: 'default',
  },
  status: {
    type: String as PropType<CascaderStatus>,
    default: '',
  },
  placement: {
    type: String as PropType<CascaderPlacement>,
    default: 'bottomLeft',
  },
  popupClassName: {
    type: String,
    default: '',
  },
  popupAppendToBody: {
    type: Boolean,
    default: false,
  },
  getPopupContainer: {
    type: Function as PropType<GetPopupContainer>,
    default: undefined,
  },
  autoFocus: {
    type: Boolean,
    default: false,
  },
  inputReadOnly: {
    type: Boolean,
    default: true,
  },
  transitionName: {
    type: String,
    default: 'ccui-cascader-fade',
  },
  /**
   * 嵌套展开箭头图标（M-A4 增强）。原 string 形态保留向后兼容，新增 VNode 形态支持；
   * 同名 `expandIcon` slot 优先级最高。
   */
  expandIcon: {
    type: [String, Object] as PropType<string | VNode>,
    default: '›',
  },
  /**
   * Ant Design 风格自定义清除图标（M-A4）。接 string（Iconify name / CSS class）或 VNode；
   * 同名 `clearIcon` slot 优先级最高。
   */
  clearIcon: {
    type: [String, Object] as PropType<string | VNode>,
    default: undefined,
  },
  /**
   * Ant Design 风格自定义下拉箭头图标（M-A4）。接 string（Iconify name / CSS class）或 VNode；
   * 同名 `suffixIcon` slot 优先级最高。
   */
  suffixIcon: {
    type: [String, Object] as PropType<string | VNode>,
    default: undefined,
  },
  /**
   * Ant Design 风格自定义 multiple 模式下 tag 的删除图标（M-A4）。接 string（Iconify name / CSS class）或 VNode；
   * 同名 `removeIcon` slot 优先级最高。
   */
  removeIcon: {
    type: [String, Object] as PropType<string | VNode>,
    default: undefined,
  },
  notFoundContent: {
    type: String,
    // 默认从 ConfigProvider.locale.Cascader.notFoundContent 取值；显式 prop 仍优先。
    default: '',
  },
  /**
   * Ant Design v5.13+ 录入组件统一 variant 形态。
   * `'outlined' | 'filled' | 'borderless' | 'underlined'`，默认 `'outlined'`。
   */
  variant: {
    type: String as PropType<CascaderVariant>,
    default: 'outlined',
  },
} as const

export type CascaderProps = ExtractPropTypes<typeof cascaderProps>

/**
 * Ant Design v5.13+ 录入组件统一 variant 形态。
 */
export type CascaderVariant = 'outlined' | 'filled' | 'borderless' | 'underlined'
