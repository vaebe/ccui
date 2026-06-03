import type { ButtonGroupProps } from './button-types'
import { defineComponent, provide, toRef } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { buttonGroupInjectionKey, buttonGroupProps } from './button-types'
import './button-group.scss'

export default defineComponent({
  name: 'CButtonGroup',
  props: buttonGroupProps,
  setup(props: ButtonGroupProps, { slots }) {
    const ns = useNamespace('button-group')

    // 把 size / disabled 注入给子按钮；子按钮显式 prop 仍优先
    provide(buttonGroupInjectionKey, {
      size: toRef(props, 'size'),
      disabled: toRef(props, 'disabled'),
    })

    return () => (
      <div class={ns.b()} role="group">
        {slots.default?.()}
      </div>
    )
  },
})
