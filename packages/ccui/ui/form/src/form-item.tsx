import type { CSSProperties } from 'vue'
import type { FormItemContext, FormItemProps, FormRule, FormValidateTrigger } from './form-types'
import { computed, defineComponent, h, inject, onMounted, onUnmounted, ref } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { formInjectionKey, formItemProps } from './form-types'
import { getTriggeredRules, getValueByPath, normalizeRules, setValueByPath, validateRule } from './utils'
import './form.scss'

export default defineComponent({
  name: 'CFormItem',
  props: formItemProps,
  setup(props: FormItemProps, { expose, slots }) {
    const ns = useNamespace('form-item')
    const form = inject(formInjectionKey, null)
    const validateState = ref<'validating' | 'success' | 'error' | ''>('')
    const validateMessage = ref('')
    const initialValue = ref(props.prop && form ? getValueByPath(form.model.value, props.prop) : undefined)

    const mergedRules = computed<FormRule[]>(() => {
      const rules = [...normalizeRules(form?.rules.value?.[props.prop]), ...normalizeRules(props.rules)]

      if (props.required && !rules.some((rule) => rule.required)) {
        rules.unshift({ required: true, message: `${props.label || props.prop} is required` })
      }

      return rules
    })

    const isRequired = computed(() => props.required || mergedRules.value.some((rule) => rule.required))
    const currentStatus = computed(() => props.validateStatus || validateState.value)
    const currentMessage = computed(() => validateMessage.value || props.help)
    const labelStyle = computed<CSSProperties>(() => {
      if (!form?.labelWidth.value || form.labelPosition.value === 'top') {
        return {}
      }
      const width = typeof form.labelWidth.value === 'number' ? `${form.labelWidth.value}px` : form.labelWidth.value
      return { width }
    })

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(currentStatus.value)]: !!currentStatus.value,
      [ns.m('required')]: isRequired.value,
      [ns.m('top')]: form?.labelPosition.value === 'top',
    }))

    const clearValidate = () => {
      validateState.value = ''
      validateMessage.value = ''
    }

    const validate = async (trigger?: FormValidateTrigger) => {
      if (!props.prop || !form) {
        return true
      }

      const rules = getTriggeredRules(mergedRules.value, trigger)
      if (rules.length === 0) {
        clearValidate()
        return true
      }

      validateState.value = 'validating'
      const value = getValueByPath(form.model.value, props.prop)

      for (const rule of rules) {
        const error = await validateRule(rule, value, form.model.value, props.prop)
        if (error) {
          validateState.value = 'error'
          validateMessage.value = error.message
          form.emitValidate(props.prop, false, error.message)
          return false
        }
      }

      validateState.value = 'success'
      validateMessage.value = ''
      form.emitValidate(props.prop, true, '')
      return true
    }

    const resetField = () => {
      if (props.prop && form) {
        setValueByPath(form.model.value, props.prop, initialValue.value)
      }
      clearValidate()
    }

    const fieldContext: FormItemContext = {
      prop: props.prop,
      validate,
      resetField,
      clearValidate,
    }

    const onChangeCapture = () => {
      void validate('change')
    }

    const onFocusoutCapture = () => {
      void validate('blur')
    }

    onMounted(() => {
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

    return () =>
      h(
        'div',
        {
          class: cls.value,
          onChangeCapture,
          onFocusoutCapture,
        },
        [
          props.label || slots.label
            ? h(
                'label',
                {
                  class: ns.e('label'),
                  style: labelStyle.value,
                },
                slots.label?.() || props.label,
              )
            : null,
          h('div', { class: ns.e('content') }, [
            slots.default?.(),
            currentMessage.value ? h('div', { class: ns.e('message') }, currentMessage.value) : null,
          ]),
        ],
      )
  },
})
