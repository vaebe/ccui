import type { FormListField, FormListOperation, FormListProps } from './form-types'
import { computed, defineComponent, inject, onMounted, provide, watch } from 'vue'
import { formInjectionKey, formListInjectionKey, formListProps } from './form-types'
import { cloneValue, getValueByPath, normalizeNamePath, setValueByPath } from './utils'
import { reactive } from 'vue'

export default defineComponent({
  name: 'CFormList',
  props: formListProps,
  setup(props: FormListProps, { slots }) {
    const form = inject(formInjectionKey, null)
    const prefixName = computed(() => normalizeNamePath(props.name))

    const ensureArray = (): any[] => {
      if (!form) {
        return []
      }
      const current = getValueByPath(form.model.value, props.name)
      if (Array.isArray(current)) {
        return current
      }
      const initial = props.initialValue ?? getValueByPath(form.initialValues.value, props.name)
      const next = Array.isArray(initial) ? cloneValue(initial) : []
      setValueByPath(form.model.value, props.name, next)
      return next
    }

    const state = reactive({ keys: [] as number[], seed: 0 })

    const syncKeys = (length: number) => {
      while (state.keys.length < length) {
        state.keys.push(state.seed++)
      }
      if (state.keys.length > length) {
        state.keys.length = length
      }
    }

    onMounted(() => {
      const list = ensureArray()
      syncKeys(list.length)
    })

    // 契约说明：外部对该数组的头部/中部增删（splice）必须通过 operation.add/remove/move，
    // 以保证 keys 与元素一一对齐。此处的 syncKeys 仅是针对“整数组替换”的粗粒度对账：
    // 它只在末尾补 seed 或截断尾部，元素本身又没有可用的 identity 字段，
    // 因此对非末尾的增删它无法正确重排 key（会让后续表单项复用错误的 key，导致状态/校验串位）。
    // 这里刻意不做基于值的“智能重排”——没有稳定身份字段时任何猜测都可能造成更严重的错位。
    watch(
      () => (form ? getValueByPath(form.model.value, props.name) : undefined),
      (next) => {
        if (Array.isArray(next) && next.length !== state.keys.length) {
          syncKeys(next.length)
        }
      },
      { deep: false },
    )

    const operation: FormListOperation = {
      add(defaultValue?: any, insertIndex?: number) {
        if (!form) {
          return
        }
        const list = ensureArray()
        const value = cloneValue(defaultValue)
        const target = insertIndex === undefined ? list.length : Math.max(0, Math.min(insertIndex, list.length))
        list.splice(target, 0, value)
        state.keys.splice(target, 0, state.seed++)
      },
      remove(index: number | number[]) {
        if (!form) {
          return
        }
        const list = ensureArray()
        const indices = (Array.isArray(index) ? index : [index])
          .filter((i) => i >= 0 && i < list.length)
          .sort((a, b) => b - a)
        for (const i of indices) {
          list.splice(i, 1)
          state.keys.splice(i, 1)
        }
      },
      move(from: number, to: number) {
        if (!form) {
          return
        }
        const list = ensureArray()
        if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) {
          return
        }
        const [item] = list.splice(from, 1)
        list.splice(to, 0, item)
        const [keyItem] = state.keys.splice(from, 1)
        state.keys.splice(to, 0, keyItem)
      },
    }

    provide(formListInjectionKey, { prefixName })

    return () => {
      const fields: FormListField[] = state.keys.map((key, index) => ({ key, name: index }))
      return slots.default?.(fields, operation) ?? null
    }
  },
})
