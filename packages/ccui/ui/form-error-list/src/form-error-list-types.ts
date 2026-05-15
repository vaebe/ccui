import type { ExtractPropTypes, PropType } from 'vue'

export type FormErrorListStatus = 'error' | 'warning'

/**
 * 对标 ant `Form.ErrorList`：独立于 FormItem 自渲染的错误 / 警告列表。
 *
 * 用法：
 *
 * ```vue
 * <c-form-error-list :errors="['用户名不能为空', '至少 4 个字符']" />
 * <c-form-error-list :warnings="['密码强度较弱']" />
 * ```
 *
 * 与 FormItem 内置的单条 message 互补：FormItem 默认只显示一条 message；
 * 当业务侧需要展示多条错误（如来自后端的字段级错误数组），或需要把错误列表
 * 渲染到 FormItem 外部（如统一汇总区），就用这个组件。
 */
export const formErrorListProps = {
  /**
   * 错误列表（红色显示）。
   */
  errors: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  /**
   * 警告列表（黄色显示）。`errors` 与 `warnings` 可同时存在；先 errors 后 warnings。
   */
  warnings: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  /**
   * 单条 help 文本（与 ant FormItem `help` 同义；error / warning 列表为空时显示）。
   */
  help: {
    type: String,
    default: '',
  },
} as const

export type FormErrorListProps = ExtractPropTypes<typeof formErrorListProps>
