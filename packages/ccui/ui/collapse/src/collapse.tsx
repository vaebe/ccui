import type { CollapseContext, CollapseProps } from './collapse-types'
import { computed, defineComponent, provide, ref, toRef, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { collapseContextKey, collapseProps } from './collapse-types'
import './collapse.scss'

function normalize(val: CollapseProps['modelValue'], accordion: boolean): (string | number)[] {
  if (val === null || val === undefined || val === '') {
    return []
  }
  const arr = Array.isArray(val) ? val.slice() : [val]
  if (accordion) {
    return arr.slice(0, 1)
  }
  return arr
}

export default defineComponent({
  name: 'CCollapse',
  props: collapseProps,
  emits: ['update:modelValue', 'change'],
  setup(props: CollapseProps, { emit, slots }) {
    const ns = useNamespace('collapse')

    const activeNames = ref<(string | number)[]>(normalize(props.modelValue, props.accordion))

    watch(
      () => [props.modelValue, props.accordion] as const,
      ([val, acc]) => {
        activeNames.value = normalize(val, acc)
      },
    )

    const emitChange = (next: (string | number)[]) => {
      activeNames.value = next
      const out = props.accordion ? (next[0] ?? '') : next
      emit('update:modelValue', out)
      emit('change', out)
    }

    const toggle = (name: string | number) => {
      if (props.accordion) {
        emitChange(activeNames.value[0] === name ? [] : [name])
        return
      }
      const idx = activeNames.value.indexOf(name)
      if (idx === -1) {
        emitChange([...activeNames.value, name])
      } else {
        const next = activeNames.value.slice()
        next.splice(idx, 1)
        emitChange(next)
      }
    }

    const context: CollapseContext = {
      activeNames,
      accordion: toRef(props, 'accordion'),
      expandIconPosition: toRef(props, 'expandIconPosition'),
      toggle,
    }
    provide(collapseContextKey, context)

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m('borderless')]: !props.bordered,
      [ns.m('ghost')]: props.ghost,
      [ns.m(`icon-${props.expandIconPosition}`)]: true,
    }))

    return () => <div class={cls.value}>{slots.default?.()}</div>
  },
})
