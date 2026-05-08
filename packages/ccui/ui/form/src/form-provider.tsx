import type { FormFinishInfo, FormInstance, FormNamePath } from './form-types'
import { defineComponent, provide } from 'vue'
import { formProviderInjectionKey, formProviderProps } from './form-types'

export default defineComponent({
  name: 'CFormProvider',
  props: formProviderProps,
  emits: ['form-change', 'form-finish'],
  setup(_, { emit, slots }) {
    const forms: Record<string, FormInstance> = {}

    const registerForm = (name: string, instance: FormInstance) => {
      if (!name) {
        return
      }
      forms[name] = instance
    }

    const unregisterForm = (name: string) => {
      if (!name) {
        return
      }
      delete forms[name]
    }

    const triggerFormChange = (name: string, changedFields: Array<{ name: FormNamePath; value: any }>) => {
      if (!name) {
        return
      }
      emit('form-change', name, { changedFields, forms })
    }

    const triggerFormFinish = (name: string, values: FormInstance extends never ? never : FormFinishInfo['values']) => {
      if (!name) {
        return
      }
      emit('form-finish', name, { values, forms })
    }

    provide(formProviderInjectionKey, {
      registerForm,
      unregisterForm,
      triggerFormChange,
      triggerFormFinish,
    })

    return () => slots.default?.() ?? null
  },
})
