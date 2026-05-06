import type { ExtractPropTypes, InjectionKey, PropType, Ref } from 'vue'

export type FormNamePath = string | number | Array<string | number>
export type FormLabelPosition = 'left' | 'right' | 'top'
export type FormLayout = 'horizontal' | 'vertical' | 'inline'
export type FormValidateTrigger = 'change' | 'blur' | 'submit'
export type FormValidateStatus = '' | 'validating' | 'success' | 'error'
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
  validator?: (
    rule: FormRule,
    value: any,
    model: FormModel,
  ) => boolean | string | Error | Promise<boolean | string | Error>
}

export type FormRules = Record<string, FormRule | FormRule[]>

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
  addField: (field: FormItemContext) => void
  removeField: (field: FormItemContext) => void
  emitValidate: (field: string, valid: boolean, message: string) => void
  validateField: (propsToValidate: FormNamePath | FormNamePath[], trigger?: FormValidateTrigger) => Promise<boolean>
}

export const formInjectionKey: InjectionKey<FormContext> = Symbol('ccuiForm')

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
    type: [Object, Array] as PropType<FormRule | FormRule[]>,
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
} as const

export type FormProps = ExtractPropTypes<typeof formProps>
export type FormItemProps = ExtractPropTypes<typeof formItemProps>
