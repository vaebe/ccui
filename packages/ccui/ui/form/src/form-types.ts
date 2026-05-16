import type { ComputedRef, ExtractPropTypes, InjectionKey, PropType, Ref } from 'vue'

export type FormNamePath = string | number | Array<string | number>
export type FormLabelPosition = 'left' | 'right' | 'top'
export type FormLayout = 'horizontal' | 'vertical' | 'inline'
export type FormValidateTrigger = 'change' | 'blur' | 'submit'
export type FormValidateStatus = '' | 'validating' | 'success' | 'error' | 'warning'
export type FormModel = Record<string, any>
export type FormRequiredMark = boolean | 'optional'

export interface FormValidateMessages {
  default?: string
  required?: string
  enum?: string
  whitespace?: string
  pattern?: string
  types?: Partial<Record<NonNullable<FormRule['type']>, string>>
  string?: {
    len?: string
    min?: string
    max?: string
    range?: string
  }
  number?: {
    len?: string
    min?: string
    max?: string
    range?: string
  }
  array?: {
    len?: string
    min?: string
    max?: string
    range?: string
  }
}

export interface FormRule {
  required?: boolean
  message?: string
  trigger?: FormValidateTrigger | FormValidateTrigger[]
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'email' | 'url'
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  enum?: any[]
  whitespace?: boolean
  /**
   * 仅警告：校验失败时 FormItem 状态降级为 `'warning'`，不阻塞 form-level submit/validate。
   */
  warningOnly?: boolean
  validator?: (
    rule: FormRule,
    value: any,
    model: FormModel,
  ) => boolean | string | Error | Promise<boolean | string | Error>
}

/**
 * Ant Design 风格：rules 可以是规则对象、数组，或返回规则的工厂函数 `(form) => Rule | Rule[]`。
 * 工厂函数每次校验时执行，可基于当前 form model 派生规则。
 */
export type FormRuleFactory = (model: FormModel) => FormRule | FormRule[]
export type FormItemRule = FormRule | FormRule[] | FormRuleFactory

export type FormRules = Record<string, FormRule | FormRule[]>

/**
 * Ant Design 栅格对象（与 Grid Col 一致的子集）。
 *
 * `labelCol` / `wrapperCol` 用 24 栅格制描述 label 与控件的宽度比例。
 */
export interface FormColAttrs {
  /** 栅格占据数（0–24） */
  span?: number
  /** 栅格偏移格数（0–24） */
  offset?: number
  /** flex 布局字符串 */
  flex?: string | number
}

export interface FormValidateError {
  field: string
  message: string
}

export interface FormItemContext {
  prop?: FormNamePath
  field: string
  dependencies: FormNamePath[]
  validate: (trigger?: FormValidateTrigger) => Promise<boolean>
  resetField: () => void
  clearValidate: () => void
  getValidateMessage: () => string
  getElement: () => HTMLElement | null
}

export interface FormContext {
  model: Ref<FormModel>
  rules: Ref<FormRules>
  initialValues: Ref<FormModel>
  validateMessages: Ref<FormValidateMessages>
  disabled: Ref<boolean>
  labelWidth: Ref<string | number>
  labelPosition: Ref<FormLabelPosition>
  layout: Ref<FormLayout>
  colon: Ref<boolean>
  requiredMark: Ref<FormRequiredMark>
  preserve: Ref<boolean>
  /** Form 级栅格列（Ant Design 主名）。FormItem 显式 labelCol 优先。 */
  labelCol: Ref<FormColAttrs | undefined>
  /** Form 级栅格列。FormItem 显式 wrapperCol 优先。 */
  wrapperCol: Ref<FormColAttrs | undefined>
  /** Form 级 hasFeedback 默认值。FormItem 显式 hasFeedback 优先。 */
  hasFeedback: Ref<boolean>
  addField: (field: FormItemContext) => void
  removeField: (field: FormItemContext) => void
  emitValidate: (field: string, valid: boolean, message: string) => void
  validateField: (propsToValidate: FormNamePath | FormNamePath[], trigger?: FormValidateTrigger) => Promise<boolean>
  notifyFieldChange: (field: FormNamePath, value: any) => void
}

export const formInjectionKey: InjectionKey<FormContext> = Symbol('ccuiForm')

export interface FormItemInjectedContext {
  validateStatus: Ref<FormValidateStatus>
  isInsideForm: boolean
  validate: (trigger?: FormValidateTrigger) => Promise<boolean>
}

export const formItemInjectionKey: InjectionKey<FormItemInjectedContext> = Symbol('ccuiFormItem')

export interface FormListField {
  key: number
  name: number
}

export interface FormListOperation {
  add: (defaultValue?: any, insertIndex?: number) => void
  remove: (index: number | number[]) => void
  move: (from: number, to: number) => void
}

export interface FormListContext {
  prefixName: ComputedRef<Array<string | number>>
}

export const formListInjectionKey: InjectionKey<FormListContext> = Symbol('ccuiFormList')

export interface FormInstance {
  validate: (callback?: (valid: boolean, errors: FormValidateError[]) => void) => Promise<boolean>
  validateField: (propsToValidate: FormNamePath | FormNamePath[], trigger?: FormValidateTrigger) => Promise<boolean>
  resetFields: (propsToReset?: FormNamePath | FormNamePath[]) => void
  clearValidate: (propsToClear?: FormNamePath | FormNamePath[]) => void
  scrollToField: (name: FormNamePath, options?: ScrollIntoViewOptions) => void
  getFieldsValue: () => FormModel
}

export interface FormChangeInfo {
  changedFields: Array<{ name: FormNamePath; value: any }>
  forms: Record<string, FormInstance>
}

export interface FormFinishInfo {
  values: FormModel
  forms: Record<string, FormInstance>
}

export interface FormProviderContext {
  registerForm: (name: string, instance: FormInstance) => void
  unregisterForm: (name: string) => void
  triggerFormChange: (name: string, changedFields: Array<{ name: FormNamePath; value: any }>) => void
  triggerFormFinish: (name: string, values: FormModel) => void
}

export const formProviderInjectionKey: InjectionKey<FormProviderContext> = Symbol('ccuiFormProvider')

export const formProps = {
  model: {
    type: Object as PropType<FormModel>,
    default: () => ({}),
  },
  rules: {
    type: Object as PropType<FormRules>,
    default: () => ({}),
  },
  initialValues: {
    type: Object as PropType<FormModel>,
    default: () => ({}),
  },
  labelWidth: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },
  labelPosition: {
    type: String as PropType<FormLabelPosition>,
    default: 'right',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  layout: {
    type: String as PropType<FormLayout>,
    default: 'horizontal',
  },
  colon: {
    type: Boolean,
    default: true,
  },
  requiredMark: {
    type: [Boolean, String] as PropType<FormRequiredMark>,
    default: true,
  },
  validateMessages: {
    type: Object as PropType<FormValidateMessages>,
    default: () => ({}),
  },
  validateOnRuleChange: {
    type: Boolean,
    default: true,
  },
  scrollToFirstError: {
    type: [Boolean, Object] as PropType<boolean | ScrollIntoViewOptions>,
    default: false,
  },
  name: {
    type: String,
    default: '',
  },
  preserve: {
    type: Boolean,
    default: true,
  },
  /**
   * Ant Design 风格栅格 label 列宽。配合 wrapperCol 使用，覆盖 `labelWidth` 的单一宽度方案。
   */
  labelCol: {
    type: Object as PropType<FormColAttrs>,
    default: undefined,
  },
  /**
   * Ant Design 风格栅格控件列宽。
   */
  wrapperCol: {
    type: Object as PropType<FormColAttrs>,
    default: undefined,
  },
  /**
   * Form 级 hasFeedback：所有 FormItem 默认显示校验状态图标。FormItem 显式优先。
   */
  hasFeedback: {
    type: Boolean,
    default: false,
  },
} as const

export const formItemProps = {
  name: {
    type: [String, Number, Array] as PropType<FormNamePath>,
    default: undefined,
  },
  label: {
    type: String,
    default: '',
  },
  prop: {
    type: [String, Number, Array] as PropType<FormNamePath>,
    default: undefined,
  },
  initialValue: {
    type: null as unknown as PropType<any>,
    default: undefined,
  },
  required: {
    type: Boolean,
    default: false,
  },
  rules: {
    /**
     * 支持规则对象、数组，或工厂函数 `(model) => Rule | Rule[]`。
     */
    type: [Object, Array, Function] as PropType<FormItemRule>,
    default: undefined,
  },
  help: {
    type: String,
    default: '',
  },
  validateStatus: {
    type: String as PropType<FormValidateStatus>,
    default: '',
  },
  extra: {
    type: String,
    default: '',
  },
  htmlFor: {
    type: String,
    default: '',
  },
  colon: {
    type: Boolean,
    default: undefined,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  noStyle: {
    type: Boolean,
    default: false,
  },
  dependencies: {
    type: Array as PropType<FormNamePath[]>,
    default: () => [],
  },
  preserve: {
    type: Boolean,
    default: undefined,
  },
  /**
   * @deprecated React Ant Design 用于强制重渲染的 prop。Vue 端的响应式系统已经自动处理依赖收集，
   * 通常无需指定。保留 prop 接收以兼容现有代码；新代码不建议使用。详见 docs-notes/roadmap.md 「对标原则」节。
   */
  shouldUpdate: {
    type: [Boolean, Function] as PropType<boolean | ((prevValues: any, curValues: any) => boolean)>,
    default: undefined,
  },
  /**
   * FormItem 级 hasFeedback：显示 success / warning / error / validating 状态图标。
   * 显式 `hasFeedback` 优先于 Form 级。
   */
  hasFeedback: {
    type: Boolean,
    default: undefined,
  },
  /**
   * Ant Design 栅格 label 列宽（FormItem 级，覆盖 Form 级 labelCol）。
   */
  labelCol: {
    type: Object as PropType<FormColAttrs>,
    default: undefined,
  },
  /**
   * Ant Design 栅格控件列宽（FormItem 级，覆盖 Form 级 wrapperCol）。
   */
  wrapperCol: {
    type: Object as PropType<FormColAttrs>,
    default: undefined,
  },
  // 校验防抖延迟（毫秒），0 = 不防抖
  validateDebounce: {
    type: Number,
    default: 0,
  },
  // 值预处理函数：在值写入 model 之前调用
  normalize: {
    type: Function as PropType<(value: any, prevValue: any, allValues: any) => any>,
    default: undefined,
  },
} as const

export const formListProps = {
  name: {
    type: [String, Number, Array] as PropType<FormNamePath>,
    required: true,
  },
  initialValue: {
    type: Array as PropType<any[]>,
    default: undefined,
  },
} as const

export const formProviderProps = {} as const

export type FormProps = ExtractPropTypes<typeof formProps>
export type FormItemProps = ExtractPropTypes<typeof formItemProps>
export type FormListProps = ExtractPropTypes<typeof formListProps>
