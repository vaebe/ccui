import type { CSSProperties } from 'vue'
import type { FormItemContext, FormItemProps, FormRule, FormValidateTrigger } from './form-types'
import { computed, defineComponent, h, inject, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { formInjectionKey, formItemInjectionKey, formItemProps } from './form-types'
import {
  cloneValue,
  getPathKey,
  getTriggeredRules,
  getValueByPath,
  normalizeRules,
  setValueByPath,
  validateRule,
} from './utils'
import './form.scss'

export default defineComponent({
  name: 'CFormItem',
  props: formItemProps,
  setup(props: FormItemProps, { expose, slots }) {
    const ns = useNamespace('form-item')
    const form = inject(formInjectionKey, null)
    const validateState = ref<'validating' | 'success' | 'error' | ''>('')
    const validateMessage = ref('')
    const itemRef = ref<HTMLElement | null>(null)
    const fieldName = computed(() => props.name ?? props.prop)
    const fieldKey = computed(() => getPathKey(fieldName.value))
    const labelText = computed(() => props.label || fieldKey.value)
    const initialValue = ref()

    const getInitialValue = () => {
      if (props.initialValue !== undefined) {
        return props.initialValue
      }
      const formInitialValue = form ? getValueByPath(form.initialValues.value, fieldName.value) : undefined
      if (formInitialValue !== undefined) {
        return formInitialValue
      }
      return form ? getValueByPath(form.model.value, fieldName.value) : undefined
    }

    const mergedRules = computed<FormRule[]>(() => {
      const rules = [...normalizeRules(form?.rules.value?.[fieldKey.value]), ...normalizeRules(props.rules)]

      if (props.required && !rules.some((rule) => rule.required)) {
        rules.unshift({ required: true })
      }

      return rules
    })

    const isRequired = computed(() => props.required || mergedRules.value.some((rule) => rule.required))
    const currentStatus = computed(() => props.validateStatus || validateState.value)
    const currentMessage = computed(() => validateMessage.value || props.help)
    const shouldShowOptional = computed(() => !isRequired.value && form?.requiredMark.value === 'optional')
    const shouldShowRequiredMark = computed(() => isRequired.value && form?.requiredMark.value !== false)
    const mergedColon = computed(() => props.colon ?? form?.colon.value ?? true)
    const labelStyle = computed<CSSProperties>(() => {
      if (!form?.labelWidth.value || form.labelPosition.value === 'top' || form.layout.value === 'vertical') {
        return {}
      }
      const width = typeof form.labelWidth.value === 'number' ? `${form.labelWidth.value}px` : form.labelWidth.value
      return { width }
    })

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(currentStatus.value)]: !!currentStatus.value,
      [ns.m('required')]: shouldShowRequiredMark.value,
      [ns.m('optional')]: shouldShowOptional.value,
      [ns.m('no-style')]: props.noStyle,
      [ns.m('hidden')]: props.hidden,
      [ns.m('top')]: form?.labelPosition.value === 'top' || form?.layout.value === 'vertical',
    }))

    const clearValidate = () => {
      validateState.value = ''
      validateMessage.value = ''
    }

    const validate = async (trigger?: FormValidateTrigger) => {
      if (!fieldKey.value || !form) {
        return true
      }

      const rules = getTriggeredRules(mergedRules.value, trigger)
      if (rules.length === 0) {
        clearValidate()
        return true
      }

      validateState.value = 'validating'
      const value = getValueByPath(form.model.value, fieldName.value)

      for (const rule of rules) {
        const error = await validateRule(
          rule,
          value,
          form.model.value,
          fieldKey.value,
          labelText.value,
          form.validateMessages.value,
        )
        if (error) {
          validateState.value = 'error'
          validateMessage.value = error.message
          form.emitValidate(fieldKey.value, false, error.message)
          return false
        }
      }

      validateState.value = 'success'
      validateMessage.value = ''
      form.emitValidate(fieldKey.value, true, '')
      return true
    }

    const resetField = () => {
      if (fieldKey.value && form) {
        setValueByPath(form.model.value, fieldName.value!, cloneValue(initialValue.value))
      }
      clearValidate()
    }

    const fieldContext: FormItemContext = {
      prop: fieldName.value,
      field: fieldKey.value,
      dependencies: props.dependencies,
      validate,
      resetField,
      clearValidate,
      getValidateMessage: () => validateMessage.value,
      getElement: () => itemRef.value,
    }

    const onChangeCapture = () => {
      void validate('change')
    }

    const onFocusoutCapture = () => {
      void validate('blur')
    }

    onMounted(() => {
      initialValue.value = cloneValue(getInitialValue())
      if (fieldName.value && form && getValueByPath(form.model.value, fieldName.value) === undefined) {
        const value = getInitialValue()
        if (value !== undefined) {
          setValueByPath(form.model.value, fieldName.value, cloneValue(value))
        }
      }
      form?.addField(fieldContext)
    })

    onUnmounted(() => {
      form?.removeField(fieldContext)
    })

    expose({
      validate,
      resetField,
      clearValidate,
    })

    provide(formItemInjectionKey, {
      validateStatus: currentStatus,
      isInsideForm: !!form,
      validate,
    })

    watch(
      () => form?.model.value,
      () => {
        if (props.dependencies.length > 0) {
          void validate()
        }
      },
      { deep: true },
    )

    const renderLabel = () => {
      if (!props.label && !slots.label) {
        return null
      }

      const content = [
        slots.label?.() || props.label,
        shouldShowOptional.value ? h('span', { class: ns.e('optional') }, ' (optional)') : null,
      ]

      return h(
        'label',
        {
          class: [ns.e('label'), mergedColon.value && ns.em('label', 'colon')],
          style: labelStyle.value,
          for: props.htmlFor || undefined,
        },
        content,
      )
    }

    const renderContent = () =>
      h('div', { class: ns.e('content') }, [
        slots.default?.(),
        currentMessage.value ? h('div', { class: ns.e('message'), role: 'alert' }, currentMessage.value) : null,
        props.extra ? h('div', { class: ns.e('extra') }, props.extra) : null,
      ])

    return () =>
      props.noStyle
        ? h(
            'div',
            {
              ref: itemRef,
              class: cls.value,
              'data-field': fieldKey.value || undefined,
              onChangeCapture,
              onFocusoutCapture,
            },
            slots.default?.(),
          )
        : h(
            'div',
            {
              ref: itemRef,
              class: cls.value,
              'data-field': fieldKey.value || undefined,
              'aria-invalid': currentStatus.value === 'error' ? 'true' : undefined,
              onChangeCapture,
              onFocusoutCapture,
            },
            [renderLabel(), renderContent()],
          )
  },
})
