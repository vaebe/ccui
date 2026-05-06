import type { ExtractPropTypes, InjectionKey, PropType, Ref } from 'vue'

export type FormLabelPosition = 'left' | 'right' | 'top'
export type FormValidateTrigger = 'change' | 'blur' | 'submit'
export type FormValidateStatus = '' | 'validating' | 'success' | 'error'
export type FormModel = Record<string, any>

export interface FormRule {
  required?: boolean
  message?: string
  trigger?: FormValidateTrigger | FormValidateTrigger[]
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object'
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
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
  prop?: string
  validate: (trigger?: FormValidateTrigger) => Promise<boolean>
  resetField: () => void
  clearValidate: () => void
}

export interface FormContext {
  model: Ref<FormModel>
  rules: Ref<FormRules>
  disabled: Ref<boolean>
  labelWidth: Ref<string | number>
  labelPosition: Ref<FormLabelPosition>
  addField: (field: FormItemContext) => void
  removeField: (field: FormItemContext) => void
  emitValidate: (field: string, valid: boolean, message: string) => void
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
  validateOnRuleChange: {
    type: Boolean,
    default: true,
  },
} as const

export const formItemProps = {
  label: {
    type: String,
    default: '',
  },
  prop: {
    type: String,
    default: '',
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
} as const

export type FormProps = ExtractPropTypes<typeof formProps>
export type FormItemProps = ExtractPropTypes<typeof formItemProps>
