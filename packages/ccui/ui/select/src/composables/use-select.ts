import type { ComputedRef, Ref } from 'vue'
import type {
  LabelInValuePayload,
  ResolvedSelectOption,
  SelectFieldNames,
  SelectFilterOption,
  SelectGroupOption,
  SelectMode,
  SelectModelValue,
  SelectOption,
  SelectProps,
  SelectRawOption,
  SelectRawValue,
} from '../select-types'
import { computed } from 'vue'

const DEFAULT_FIELD_NAMES: Required<SelectFieldNames> = {
  label: 'label',
  value: 'value',
  disabled: 'disabled',
  options: 'options',
}

function primitiveString(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  return ''
}

function isLabelInValuePayload(value: unknown): value is LabelInValuePayload {
  return typeof value === 'object' && value !== null && 'value' in (value as Record<string, unknown>)
}

function extractRawValue(value: unknown): SelectRawValue | undefined {
  if (isLabelInValuePayload(value)) {
    return value.value
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }
  return undefined
}

function toValueArray(value: SelectModelValue): SelectRawValue[] {
  if (Array.isArray(value)) {
    return value.map(extractRawValue).filter((v): v is SelectRawValue => v !== undefined)
  }
  if (value === undefined || value === null || value === '') {
    return []
  }
  const single = extractRawValue(value)
  return single === undefined ? [] : [single]
}

function isGroup(option: SelectRawOption, optionsKey: string): option is SelectGroupOption {
  const candidate = (option as Record<string, unknown>)[optionsKey]
  return Array.isArray(candidate)
}

interface FlattenedItem {
  type: 'group' | 'option'
  group?: { label: unknown; depth: number }
  option?: ResolvedSelectOption
}

export function effectiveMode(props: SelectProps): SelectMode {
  if (props.mode) {
    return props.mode
  }
  return props.multiple ? 'multiple' : 'default'
}

function buildResolvedOption(
  raw: SelectOption,
  names: Required<SelectFieldNames>,
  groupPath: unknown[],
): ResolvedSelectOption {
  return {
    raw,
    label: raw[names.label],
    value: raw[names.value] as SelectRawValue,
    disabled: !!raw[names.disabled],
    groupPath,
  }
}

function applyFilter(
  options: ResolvedSelectOption[],
  keyword: string,
  filterOption: SelectFilterOption,
): ResolvedSelectOption[] {
  if (!keyword || filterOption === false) {
    return options
  }
  if (typeof filterOption === 'function') {
    return options.filter((item) => filterOption(keyword, item.raw))
  }
  const lower = keyword.toLowerCase()
  return options.filter(
    (item) =>
      primitiveString(item.label).toLowerCase().includes(lower) ||
      primitiveString(item.value).toLowerCase().includes(lower),
  )
}

function flattenAll(
  options: SelectRawOption[],
  names: Required<SelectFieldNames>,
  groupPath: unknown[] = [],
  acc: ResolvedSelectOption[] = [],
): ResolvedSelectOption[] {
  for (const raw of options) {
    if (isGroup(raw, names.options)) {
      const nestedPath = [...groupPath, raw[names.label]]
      flattenAll((raw as Record<string, unknown>)[names.options] as SelectRawOption[], names, nestedPath, acc)
    } else {
      acc.push(buildResolvedOption(raw as SelectOption, names, groupPath))
    }
  }
  return acc
}

function flattenVisible(
  options: SelectRawOption[],
  names: Required<SelectFieldNames>,
  keyword: string,
  filterOption: SelectFilterOption,
  depth: number,
  out: FlattenedItem[],
): boolean {
  let appended = false
  for (const raw of options) {
    if (isGroup(raw, names.options)) {
      const groupChildren = (raw as Record<string, unknown>)[names.options] as SelectRawOption[]
      const before = out.length
      out.push({ type: 'group', group: { label: raw[names.label], depth } })
      const nestedAppended = flattenVisible(groupChildren, names, keyword, filterOption, depth + 1, out)
      if (!nestedAppended) {
        out.splice(before, out.length - before)
      } else {
        appended = true
      }
    } else {
      const resolved = [buildResolvedOption(raw as SelectOption, names, [])]
      const filtered = applyFilter(resolved, keyword, filterOption)
      for (const opt of filtered) {
        out.push({ type: 'option', option: opt })
        appended = true
      }
    }
  }
  return appended
}

export function useSelect(
  props: SelectProps,
  searchText: Ref<string>,
  emit: (event: 'update:modelValue' | 'change', value: SelectModelValue) => void,
) {
  const fieldNames = computed<Required<SelectFieldNames>>(() => ({
    ...DEFAULT_FIELD_NAMES,
    ...props.fieldNames,
  }))

  const mode = computed<SelectMode>(() => effectiveMode(props))
  const isMultiple = computed(() => mode.value === 'multiple' || mode.value === 'tags')

  const flattenedAllOptions = computed<ResolvedSelectOption[]>(() => flattenAll(props.options, fieldNames.value))

  const selectedValues = computed(() => toValueArray(props.modelValue))

  const selectedOptions = computed<ResolvedSelectOption[]>(() => {
    const map = new Map<SelectRawValue, ResolvedSelectOption>()
    for (const item of flattenedAllOptions.value) {
      map.set(item.value, item)
    }
    return selectedValues.value.map((value) => {
      const found = map.get(value)
      if (found) {
        return found
      }
      // tags mode: free-form value not present in options
      return {
        raw: { [fieldNames.value.label]: value, [fieldNames.value.value]: value } as SelectOption,
        label: value,
        value,
        disabled: false,
        groupPath: [],
      }
    })
  })

  const displayLabelOf = (option: ResolvedSelectOption): unknown => {
    if (props.optionLabelProp) {
      const fromRaw = (option.raw as Record<string, unknown>)[props.optionLabelProp]
      if (fromRaw !== undefined) {
        return fromRaw
      }
    }
    return option.label
  }

  const selectedLabel = computed(() => {
    const first = selectedOptions.value[0]
    return first ? displayLabelOf(first) : ''
  })

  const visibleFlatOptions = computed<FlattenedItem[]>(() => {
    const names = fieldNames.value
    const keyword = searchText.value.trim()
    const filtering = props.filterable || props.showSearch
    const filterOption: SelectFilterOption = filtering ? props.filterOption : false
    const items: FlattenedItem[] = []
    flattenVisible(props.options, names, keyword, filterOption, 0, items)
    return items
  })

  const visibleOptions = computed<ResolvedSelectOption[]>(() =>
    visibleFlatOptions.value
      .filter((item): item is { type: 'option'; option: ResolvedSelectOption } => item.type === 'option')
      .map((item) => item.option),
  )

  const selectedValueSet: ComputedRef<Set<SelectRawValue>> = computed(() => new Set(selectedValues.value))

  const wrapForEmit = (value: SelectRawValue | undefined): SelectRawValue | LabelInValuePayload | undefined => {
    if (value === undefined) return undefined
    if (!props.labelInValue) return value
    const found = flattenedAllOptions.value.find((opt) => opt.value === value)
    return { value, label: found?.label ?? value }
  }

  const updateValue = (value: SelectRawValue | undefined | SelectRawValue[]) => {
    let payload: SelectModelValue
    if (value === undefined) {
      payload = undefined
    } else if (Array.isArray(value)) {
      payload = props.labelInValue ? value.map((v) => wrapForEmit(v) as LabelInValuePayload) : value
    } else {
      payload = props.labelInValue ? (wrapForEmit(value) as LabelInValuePayload) : value
    }
    emit('update:modelValue', payload)
    emit('change', payload)
  }

  const isAtMaxCount = (): boolean => {
    if (!isMultiple.value || !props.maxCount || props.maxCount <= 0) return false
    return selectedValues.value.length >= props.maxCount
  }

  const selectOption = (option: ResolvedSelectOption) => {
    if (option.disabled) {
      return
    }
    if (!isMultiple.value) {
      updateValue(option.value)
      return
    }

    const already = selectedValues.value.includes(option.value)
    if (!already && isAtMaxCount()) {
      return
    }

    const next = already
      ? selectedValues.value.filter((value) => value !== option.value)
      : selectedValues.value.concat(option.value)
    updateValue(next)
  }

  const removeValue = (value: SelectRawValue) => {
    if (!isMultiple.value) {
      return
    }
    updateValue(selectedValues.value.filter((item) => item !== value))
  }

  const clearValue = () => {
    if (isMultiple.value) {
      updateValue([])
    } else {
      updateValue(undefined)
    }
  }

  const reorderTagValue = (fromValue: SelectRawValue, toValue: SelectRawValue) => {
    if (!isMultiple.value) return
    const order = [...selectedValues.value]
    const fromIndex = order.indexOf(fromValue)
    const toIndex = order.indexOf(toValue)
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return
    order.splice(fromIndex, 1)
    order.splice(toIndex, 0, fromValue)
    updateValue(order)
  }

  const addTagValue = (value: string) => {
    if (mode.value !== 'tags') {
      return false
    }
    const trimmed = value.trim()
    if (!trimmed) {
      return false
    }
    if (selectedValues.value.includes(trimmed)) {
      return false
    }
    if (isAtMaxCount()) {
      return false
    }
    updateValue(selectedValues.value.concat(trimmed))
    return true
  }

  return {
    addTagValue,
    clearValue,
    displayLabelOf,
    fieldNames,
    isMultiple,
    mode,
    removeValue,
    reorderTagValue,
    selectOption,
    selectedLabel,
    selectedOptions,
    selectedValueSet,
    selectedValues,
    visibleFlatOptions,
    visibleOptions,
  }
}
