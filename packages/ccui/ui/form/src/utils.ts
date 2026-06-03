import type {
  FormModel,
  FormNamePath,
  FormRule,
  FormValidateError,
  FormValidateMessages,
  FormValidateTrigger,
} from './form-types'

export function normalizeNamePath(path?: FormNamePath): Array<string | number> {
  if (path === undefined || path === null || path === '') {
    return []
  }
  if (Array.isArray(path)) {
    return [...path]
  }
  if (typeof path === 'number') {
    return [path]
  }
  return path
    .replace(/\[(\w+)\]/g, '.$1')
    .split('.')
    .filter(Boolean)
}

export function getPathKey(path?: FormNamePath): string {
  return normalizeNamePath(path).join('.')
}

export function getValueByPath(model: FormModel, path?: FormNamePath): any {
  const keys = normalizeNamePath(path)
  if (keys.length === 0) {
    return undefined
  }
  return keys.reduce((value, key) => value?.[key], model)
}

export function setValueByPath(model: FormModel, path: FormNamePath, value: any): void {
  const keys = normalizeNamePath(path)
  const lastKey = keys.pop()
  if (lastKey === undefined) {
    return
  }
  const target = keys.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {}
    }
    return current[key]
  }, model)
  target[lastKey] = value
}

export function deleteValueByPath(model: FormModel, path: FormNamePath): void {
  const keys = normalizeNamePath(path)
  if (keys.length === 0) {
    return
  }
  const lastKey = keys.pop()!
  let target = model
  for (const key of keys) {
    if (target?.[key] === undefined || target[key] === null) {
      return
    }
    target = target[key]
  }
  if (target && typeof target === 'object') {
    if (Array.isArray(target) && typeof lastKey === 'number') {
      target.splice(lastKey, 1)
    } else {
      delete (target as Record<string | number, any>)[lastKey]
    }
  }
}

export function cloneValue<T>(value: T): T {
  if (value === undefined || value === null) {
    return value
  }
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      // Vue reactive proxies are not structured-cloneable in jsdom.
    }
  }
  return JSON.parse(JSON.stringify(value))
}

export function normalizeRules(rules?: FormRule | FormRule[]): FormRule[] {
  if (!rules) {
    return []
  }
  return Array.isArray(rules) ? rules : [rules]
}

export function getTriggeredRules(rules: FormRule[], trigger?: FormValidateTrigger): FormRule[] {
  if (!trigger) {
    return rules
  }

  return rules.filter((rule) => {
    if (!rule.trigger) {
      return true
    }
    const triggers = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger]
    return triggers.includes(trigger)
  })
}

function isEmptyValue(value: any): boolean {
  return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
}

function getTypeValid(rule: FormRule, value: any): boolean {
  if (isEmptyValue(value) || !rule.type) {
    return true
  }
  if (rule.type === 'email') {
    return typeof value === 'string' && /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(value)
  }
  if (rule.type === 'url') {
    return typeof value === 'string' && /^https?:\/\/\S+$/i.test(value)
  }
  if (rule.type === 'array') {
    return Array.isArray(value)
  }
  if (rule.type === 'object') {
    return typeof value === 'object' && !Array.isArray(value)
  }
  return typeof value === rule.type
}

function getSize(value: any): number | undefined {
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length
  }
  if (typeof value === 'number') {
    return value
  }
  return undefined
}

const defaultValidateMessages: FormValidateMessages = {
  default: '${label} is invalid',
  required: '${label} is required',
  enum: '${label} must be one of ${enum}',
  whitespace: '${label} cannot be empty',
  pattern: '${label} is invalid',
  types: {
    string: '${label} is not a valid string',
    number: '${label} is not a valid number',
    boolean: '${label} is not a valid boolean',
    array: '${label} is not a valid array',
    object: '${label} is not a valid object',
    email: '${label} is not a valid email',
    url: '${label} is not a valid url',
  },
  string: {
    len: '${label} must be ${len} characters',
    min: '${label} must be at least ${min} characters',
    max: '${label} must be up to ${max} characters',
    range: '${label} must be between ${min} and ${max} characters',
  },
  number: {
    len: '${label} must equal ${len}',
    min: '${label} must be at least ${min}',
    max: '${label} must be up to ${max}',
    range: '${label} must be between ${min} and ${max}',
  },
  array: {
    len: '${label} must contain ${len} items',
    min: '${label} must contain at least ${min} items',
    max: '${label} must contain up to ${max} items',
    range: '${label} must contain between ${min} and ${max} items',
  },
}

function formatMessage(template: string, values: Record<string, any>): string {
  return template.replace(/\$\{(\w+)\}/g, (_, key) => String(values[key] ?? ''))
}

function getMessage(
  rule: FormRule,
  field: string,
  label: string,
  validateMessages: FormValidateMessages,
  type?: keyof FormValidateMessages,
  subType?: string,
): string {
  if (rule.message) {
    return rule.message
  }
  const messages = {
    ...defaultValidateMessages,
    ...validateMessages,
    types: { ...defaultValidateMessages.types, ...validateMessages.types },
    string: { ...defaultValidateMessages.string, ...validateMessages.string },
    number: { ...defaultValidateMessages.number, ...validateMessages.number },
    array: { ...defaultValidateMessages.array, ...validateMessages.array },
  }
  const groupedMessage =
    subType && type && typeof messages[type] === 'object'
      ? (messages[type] as Record<string, string>)?.[subType]
      : undefined
  const template =
    groupedMessage ||
    (type === 'types' && rule.type ? messages.types?.[rule.type] : undefined) ||
    (type ? (messages[type] as string | undefined) : undefined) ||
    messages.default ||
    '${label} is invalid'

  return formatMessage(template, {
    label: label || field,
    name: field,
    field,
    enum: rule.enum?.join(', '),
    len: rule.len,
    min: rule.min,
    max: rule.max,
  })
}

function getSizeMessageType(rule: FormRule, value: any): 'string' | 'number' | 'array' {
  if (rule.type === 'array' || Array.isArray(value)) {
    return 'array'
  }
  if (typeof value === 'number') {
    return 'number'
  }
  return 'string'
}

export async function validateRule(
  rule: FormRule,
  value: any,
  model: FormModel,
  field: string,
  label = field,
  validateMessages: FormValidateMessages = {},
): Promise<FormValidateError | null> {
  if (rule.required && isEmptyValue(value)) {
    return { field, message: getMessage(rule, field, label, validateMessages, 'required') }
  }

  if (rule.whitespace && typeof value === 'string' && value.trim() === '') {
    return { field, message: getMessage(rule, field, label, validateMessages, 'whitespace') }
  }

  if (rule.enum && !isEmptyValue(value) && !rule.enum.includes(value)) {
    return { field, message: getMessage(rule, field, label, validateMessages, 'enum') }
  }

  if (!getTypeValid(rule, value)) {
    return { field, message: getMessage(rule, field, label, validateMessages, 'types') }
  }

  const size = getSize(value)
  if (size !== undefined) {
    const sizeMessageType = getSizeMessageType(rule, value)
    if (rule.len !== undefined && size !== rule.len) {
      return { field, message: getMessage(rule, field, label, validateMessages, sizeMessageType, 'len') }
    }
    if (rule.min !== undefined && rule.max !== undefined && (size < rule.min || size > rule.max)) {
      return { field, message: getMessage(rule, field, label, validateMessages, sizeMessageType, 'range') }
    }
    if (rule.min !== undefined && size < rule.min) {
      return { field, message: getMessage(rule, field, label, validateMessages, sizeMessageType, 'min') }
    }
    if (rule.max !== undefined && size > rule.max) {
      return { field, message: getMessage(rule, field, label, validateMessages, sizeMessageType, 'max') }
    }
  }

  if (rule.pattern && !rule.pattern.test(String(value))) {
    return { field, message: getMessage(rule, field, label, validateMessages, 'pattern') }
  }

  if (rule.validator) {
    const result = await rule.validator(rule, value, model)
    if (result === false) {
      return { field, message: getMessage(rule, field, label, validateMessages) }
    }
    if (typeof result === 'string') {
      return { field, message: result }
    }
    if (result instanceof Error) {
      return { field, message: result.message }
    }
  }

  return null
}
