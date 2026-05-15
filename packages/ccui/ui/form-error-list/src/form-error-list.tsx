import type { FormErrorListProps } from './form-error-list-types'
import { computed, defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { formErrorListProps } from './form-error-list-types'
import './form-error-list.scss'

export default defineComponent({
  name: 'CFormErrorList',
  props: formErrorListProps,
  setup(props: FormErrorListProps) {
    const ns = useNamespace('form-error-list')

    // 渲染优先级：errors > warnings > help。三类都为空时不渲染外层容器。
    const hasErrors = computed(() => props.errors.length > 0)
    const hasWarnings = computed(() => props.warnings.length > 0)
    const hasHelp = computed(() => !!props.help && !hasErrors.value && !hasWarnings.value)
    const isEmpty = computed(() => !hasErrors.value && !hasWarnings.value && !hasHelp.value)

    const items = computed(() => {
      const list: Array<{ key: string; type: 'error' | 'warning' | 'help'; text: string }> = []
      props.errors.forEach((text, i) => list.push({ key: `e-${i}-${text}`, type: 'error', text }))
      props.warnings.forEach((text, i) => list.push({ key: `w-${i}-${text}`, type: 'warning', text }))
      if (hasHelp.value) {
        list.push({ key: 'help', type: 'help', text: props.help })
      }
      return list
    })

    return () => {
      if (isEmpty.value) return null
      return (
        <ul class={ns.b()} role="alert" aria-live="polite">
          {items.value.map((item) => (
            <li key={item.key} class={[ns.e('item'), ns.em('item', item.type)]}>
              {item.text}
            </li>
          ))}
        </ul>
      )
    }
  },
})
