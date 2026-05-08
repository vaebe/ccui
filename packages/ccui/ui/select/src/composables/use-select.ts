import type { ComputedRef, Ref } from 'vue'
import type {
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

function toValueArray(value: SelectModelValue): SelectRawValue[] {
  if (Array.isArray(value)) {
    return value
  }
  if (value === undefined || value === null || value === '') {
    return []
  }
  return [value]
}

function isGroup(option: SelectRawOption, optionsKey: string): option is SelectGroupOption {
  const candidate = (option as Record<string, unknown>)[optionsKey]
  return Array.isArray(candidate)
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

interface FlattenedItem {
  type: 'group' | 'option'
  group?: { label: unknown }
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
  groupLabel?: unknown,
): ResolvedSelectOption {
  return {
    raw,
    label: raw[names.label],
    value: raw[names.value] as SelectRawValue,
    disabled: !!raw[names.disabled],
    groupLabel,
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

  const flattenedAllOptions = computed<ResolvedSelectOption[]>(() => {
    const names = fieldNames.value
    const result: ResolvedSelectOption[] = []
    for (const raw of props.options) {
      if (isGroup(raw, names.options)) {
        const children = (raw as Record<string, unknown>)[names.options] as SelectOption[]
        for (const child of children) {
          result.push(buildResolvedOption(child, names, raw[names.label]))
        }
      } else {
        result.push(buildResolvedOption(raw as SelectOption, names))
      }
    }
    return result
  })

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
      }
    })
  })

  const selectedLabel = computed(() => selectedOptions.value[0]?.label ?? '')

  const visibleFlatOptions = computed<FlattenedItem[]>(() => {
    const names = fieldNames.value
    const keyword = searchText.value.trim()
    const filterOption = props.filterable ? props.filterOption : false
    const items: FlattenedItem[] = []

    for (const raw of props.options) {
      if (isGroup(raw, names.options)) {
        const children = (raw as Record<string, unknown>)[names.options] as SelectOption[]
        const groupResolved = children.map((child) => buildResolvedOption(child, names, raw[names.label]))
        const filtered = applyFilter(groupResolved, keyword, filterOption)
        if (filtered.length === 0) {
          continue
        }
        items.push({ type: 'group', group: { label: raw[names.label] } })
        for (const opt of filtered) {
          items.push({ type: 'option', option: opt })
        }
      } else {
        const resolved = [buildResolvedOption(raw as SelectOption, names)]
        const filtered = applyFilter(resolved, keyword, filterOption)
        for (const opt of filtered) {
          items.push({ type: 'option', option: opt })
        }
      }
    }

    return items
  })

  const visibleOptions = computed<ResolvedSelectOption[]>(() =>
    visibleFlatOptions.value
      .filter((item): item is { type: 'option'; option: ResolvedSelectOption } => item.type === 'option')
      .map((item) => item.option),
  )

  const selectedValueSet: ComputedRef<Set<SelectRawValue>> = computed(() => new Set(selectedValues.value))

  const updateValue = (value: SelectModelValue) => {
    emit('update:modelValue', value)
    emit('change', value)
  }

  const selectOption = (option: ResolvedSelectOption) => {
    if (option.disabled) {
      return
    }
    if (!isMultiple.value) {
      updateValue(option.value)
      return
    }

    const next = selectedValues.value.includes(option.value)
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
    updateValue(isMultiple.value ? [] : undefined)
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
    updateValue(selectedValues.value.concat(trimmed))
    return true
  }

  return {
    addTagValue,
    clearValue,
    fieldNames,
    isMultiple,
    mode,
    removeValue,
    selectOption,
    selectedLabel,
    selectedOptions,
    selectedValueSet,
    selectedValues,
    visibleFlatOptions,
    visibleOptions,
  }
}
