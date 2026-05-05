import type { ComputedRef, Ref } from 'vue'
import type { SelectModelValue, SelectOption, SelectProps, SelectRawValue } from '../select-types'
import { computed } from 'vue'

function toValueArray(value: SelectModelValue) {
  if (Array.isArray(value)) {
    return value
  }
  if (value === undefined || value === '') {
    return []
  }
  return [value]
}

export function useSelect(
  props: SelectProps,
  searchText: Ref<string>,
  emit: (event: 'update:modelValue' | 'change', value: SelectModelValue) => void,
) {
  const selectedValues = computed(() => toValueArray(props.modelValue))

  const selectedOptions = computed(() =>
    selectedValues.value
      .map((value) => props.options.find((option) => option.value === value))
      .filter((option): option is SelectOption => !!option),
  )

  const selectedLabel = computed(() => selectedOptions.value[0]?.label ?? '')

  const visibleOptions = computed(() => {
    const keyword = searchText.value.trim().toLowerCase()
    if (!props.filterable || !keyword) {
      return props.options
    }
    return props.options.filter(
      (option) => option.label.toLowerCase().includes(keyword) || String(option.value).toLowerCase().includes(keyword),
    )
  })

  const selectedValueSet: ComputedRef<Set<SelectRawValue>> = computed(() => new Set(selectedValues.value))

  const updateValue = (value: SelectModelValue) => {
    emit('update:modelValue', value)
    emit('change', value)
  }

  const selectOption = (option: SelectOption) => {
    if (option.disabled) {
      return
    }

    if (!props.multiple) {
      updateValue(option.value)
      return
    }

    const next = selectedValues.value.includes(option.value)
      ? selectedValues.value.filter((value) => value !== option.value)
      : selectedValues.value.concat(option.value)
    updateValue(next)
  }

  const removeValue = (value: SelectRawValue) => {
    if (!props.multiple) {
      return
    }
    updateValue(selectedValues.value.filter((item) => item !== value))
  }

  const clearValue = () => {
    updateValue(props.multiple ? [] : undefined)
  }

  return {
    clearValue,
    removeValue,
    selectOption,
    selectedLabel,
    selectedOptions,
    selectedValueSet,
    selectedValues,
    visibleOptions,
  }
}
