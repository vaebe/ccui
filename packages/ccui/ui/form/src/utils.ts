import type { FormModel, FormRule, FormValidateError, FormValidateTrigger } from './form-types'

export function getValueByPath(model: FormModel, path: string): any {
  if (!path) {
    return undefined
  }
  return path.split('.').reduce((value, key) => value?.[key], model)
}

export function setValueByPath(model: FormModel, path: string, value: any): void {
  const keys = path.split('.')
  const lastKey = keys.pop()
  if (!lastKey) {
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

export async function validateRule(
  rule: FormRule,
  value: any,
  model: FormModel,
  field: string,
): Promise<FormValidateError | null> {
  const fallbackMessage = rule.message || `${field} is invalid`

  if (rule.required && isEmptyValue(value)) {
    return { field, message: rule.message || `${field} is required` }
  }

  if (!getTypeValid(rule, value)) {
    return { field, message: fallbackMessage }
  }

  const size = getSize(value)
  if (size !== undefined) {
    if (rule.len !== undefined && size !== rule.len) {
      return { field, message: fallbackMessage }
    }
    if (rule.min !== undefined && size < rule.min) {
      return { field, message: fallbackMessage }
    }
    if (rule.max !== undefined && size > rule.max) {
      return { field, message: fallbackMessage }
    }
  }

  if (rule.pattern && !rule.pattern.test(String(value))) {
    return { field, message: fallbackMessage }
  }

  if (rule.validator) {
    const result = await rule.validator(rule, value, model)
    if (result === false) {
      return { field, message: fallbackMessage }
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
