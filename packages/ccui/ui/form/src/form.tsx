import type {
  FormInstance,
  FormItemContext,
  FormNamePath,
  FormProps,
  FormValidateError,
  FormValidateTrigger,
} from './form-types'
import { computed, defineComponent, h, inject, onMounted, onUnmounted, provide, ref, toRef, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { formInjectionKey, formProps, formProviderInjectionKey } from './form-types'
import { getPathKey } from './utils'
import './form.scss'

export default defineComponent({
  name: 'CForm',
  props: formProps,
  emits: ['submit', 'validate', 'validate-failed', 'values-change'],
  setup(props: FormProps, { emit, expose, slots }) {
    const ns = useNamespace('form')
    const fields = ref<FormItemContext[]>([])
    const provider = inject(formProviderInjectionKey, null)

    const getFieldList = (propsToHandle?: FormNamePath | FormNamePath[]) => {
      if (propsToHandle === undefined) {
        return fields.value
      }
      if (!Array.isArray(propsToHandle)) {
        const key = getPathKey(propsToHandle)
        return fields.value.filter((field) => field.field === key)
      }

      const directKey = getPathKey(propsToHandle as FormNamePath)
      if (fields.value.some((field) => field.field === directKey)) {
        return fields.value.filter((field) => field.field === directKey)
      }

      const keys = new Set(propsToHandle.map((item) => getPathKey(item as FormNamePath)))
      return fields.value.filter((field) => keys.has(field.field))
    }

    const addField = (field: FormItemContext) => {
      if (field.field && !fields.value.includes(field)) {
        fields.value.push(field)
      }
    }

    const removeField = (field: FormItemContext) => {
      fields.value = fields.value.filter((item) => item !== field)
    }

    const emitValidate = (field: string, valid: boolean, message: string) => {
      emit('validate', field, valid, message)
    }

    const notifyFieldChange = (field: FormNamePath, value: any) => {
      emit('values-change', { name: field, value }, props.model)
      if (props.name && provider) {
        provider.triggerFormChange(props.name, [{ name: field, value }])
      }
    }

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(`label-${props.labelPosition}`)]: !!props.labelPosition,
      [ns.m(props.layout)]: !!props.layout,
      [ns.m('disabled')]: props.disabled,
    }))

    const validate = async (callback?: (valid: boolean, errors: FormValidateError[]) => void) => {
      const errors: FormValidateError[] = []

      for (const field of fields.value) {
        const valid = await field.validate()
        if (!valid && field.prop) {
          errors.push({ field: field.field, message: field.getValidateMessage() })
        }
      }

      const valid = errors.length === 0
      callback?.(valid, errors)
      if (!valid) {
        emit('validate-failed', errors)
        if (props.scrollToFirstError) {
          scrollToField(errors[0].field, props.scrollToFirstError === true ? undefined : props.scrollToFirstError)
        }
      }
      return valid
    }

    const validateField = async (propsToValidate: FormNamePath | FormNamePath[], trigger?: FormValidateTrigger) => {
      const targets = getFieldList(propsToValidate)
      const results = await Promise.all(targets.map((field) => field.validate(trigger)))
      return results.every(Boolean)
    }

    const resetFields = (propsToReset?: FormNamePath | FormNamePath[]) => {
      getFieldList(propsToReset).forEach((field) => field.resetField())
    }

    const clearValidate = (propsToClear?: FormNamePath | FormNamePath[]) => {
      getFieldList(propsToClear).forEach((field) => field.clearValidate())
    }

    const scrollToField = (name: FormNamePath, options?: ScrollIntoViewOptions) => {
      const field = getFieldList(name)[0]
      field?.getElement()?.scrollIntoView(options ?? { block: 'nearest' })
    }

    const getFieldsValue = () => props.model

    const handleSubmit = async (event: Event) => {
      event.preventDefault()
      const valid = await validate()
      emit('submit', valid, event)
      if (valid && props.name && provider) {
        provider.triggerFormFinish(props.name, props.model)
      }
    }

    watch(
      () => props.rules,
      () => {
        if (props.validateOnRuleChange) {
          clearValidate()
        }
      },
    )

    watch(
      () => props.model,
      () => {
        fields.value.forEach((field) => {
          if (field.dependencies.length > 0) {
            void field.validate()
          }
        })
      },
      { deep: true },
    )

    const exposed: FormInstance = {
      validate,
      validateField,
      resetFields,
      clearValidate,
      scrollToField,
      getFieldsValue,
    }

    expose(exposed)

    onMounted(() => {
      if (props.name && provider) {
        provider.registerForm(props.name, exposed)
      }
    })

    onUnmounted(() => {
      if (props.name && provider) {
        provider.unregisterForm(props.name)
      }
    })

    provide(formInjectionKey, {
      model: toRef(props, 'model'),
      rules: toRef(props, 'rules'),
      initialValues: toRef(props, 'initialValues'),
      validateMessages: toRef(props, 'validateMessages'),
      disabled: toRef(props, 'disabled'),
      labelWidth: toRef(props, 'labelWidth'),
      labelPosition: toRef(props, 'labelPosition'),
      layout: toRef(props, 'layout'),
      colon: toRef(props, 'colon'),
      requiredMark: toRef(props, 'requiredMark'),
      preserve: toRef(props, 'preserve'),
      labelCol: toRef(props, 'labelCol'),
      wrapperCol: toRef(props, 'wrapperCol'),
      hasFeedback: toRef(props, 'hasFeedback'),
      addField,
      removeField,
      emitValidate,
      validateField,
      notifyFieldChange,
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
