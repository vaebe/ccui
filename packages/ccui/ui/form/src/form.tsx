import type { FormItemContext, FormValidateError, FormValidateTrigger } from './form-types'
import type { FormProps } from './form-types'
import { computed, defineComponent, h, provide, ref, toRef, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { formInjectionKey, formProps } from './form-types'
import './form.scss'

export default defineComponent({
  name: 'CForm',
  props: formProps,
  emits: ['submit', 'validate', 'validate-failed'],
  setup(props: FormProps, { emit, expose, slots }) {
    const ns = useNamespace('form')
    const fields = ref<FormItemContext[]>([])

    const addField = (field: FormItemContext) => {
      if (field.prop && !fields.value.includes(field)) {
        fields.value.push(field)
      }
    }

    const removeField = (field: FormItemContext) => {
      fields.value = fields.value.filter((item) => item !== field)
    }

    const emitValidate = (field: string, valid: boolean, message: string) => {
      emit('validate', field, valid, message)
    }

    provide(formInjectionKey, {
      model: toRef(props, 'model'),
      rules: toRef(props, 'rules'),
      disabled: toRef(props, 'disabled'),
      labelWidth: toRef(props, 'labelWidth'),
      labelPosition: toRef(props, 'labelPosition'),
      addField,
      removeField,
      emitValidate,
    })

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(`label-${props.labelPosition}`)]: !!props.labelPosition,
      [ns.m('disabled')]: props.disabled,
    }))

    const validate = async (callback?: (valid: boolean, errors: FormValidateError[]) => void) => {
      const errors: FormValidateError[] = []

      for (const field of fields.value) {
        const valid = await field.validate()
        if (!valid && field.prop) {
          errors.push({ field: field.prop, message: '' })
        }
      }

      const valid = errors.length === 0
      callback?.(valid, errors)
      if (!valid) {
        emit('validate-failed', errors)
      }
      return valid
    }

    const validateField = async (propsToValidate: string | string[], trigger?: FormValidateTrigger) => {
      const propsList = Array.isArray(propsToValidate) ? propsToValidate : [propsToValidate]
      const targets = fields.value.filter((field) => field.prop && propsList.includes(field.prop))
      const results = await Promise.all(targets.map((field) => field.validate(trigger)))
      return results.every(Boolean)
    }

    const resetFields = (propsToReset?: string | string[]) => {
      const propsList = propsToReset ? (Array.isArray(propsToReset) ? propsToReset : [propsToReset]) : undefined
      fields.value.forEach((field) => {
        if (!propsList || (field.prop && propsList.includes(field.prop))) {
          field.resetField()
        }
      })
    }

    const clearValidate = (propsToClear?: string | string[]) => {
      const propsList = propsToClear ? (Array.isArray(propsToClear) ? propsToClear : [propsToClear]) : undefined
      fields.value.forEach((field) => {
        if (!propsList || (field.prop && propsList.includes(field.prop))) {
          field.clearValidate()
        }
      })
    }

    const handleSubmit = async (event: Event) => {
      event.preventDefault()
      const valid = await validate()
      emit('submit', valid, event)
    }

    watch(
      () => props.rules,
      () => {
        if (props.validateOnRuleChange) {
          clearValidate()
        }
      },
    )

    expose({
      validate,
      validateField,
      resetFields,
      clearValidate,
    })

    return () =>
      h(
        'form',
        {
          class: cls.value,
          novalidate: true,
          onSubmit: handleSubmit,
        },
        slots.default?.(),
      )
  },
})
