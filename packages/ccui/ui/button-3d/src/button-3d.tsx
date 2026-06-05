import type { Button3dProps } from './button-3d-types'
import { defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { button3dProps } from './button-3d-types'
import './button-3d.scss'

export default defineComponent({
  name: 'CButton3d',
  props: button3dProps,
  emits: ['click'],
  setup(props: Button3dProps, { slots, emit }) {
    const ns = useNamespace('button-3d')

    const onClick = (e: MouseEvent) => {
      if (props.disabled || props.loading) {
        return
      }
      emit('click', e)
    }

    return () => (
      <button
        class={{
          [ns.b()]: true,
          [ns.m(props.type)]: !!props.type,
          [ns.m(props.size)]: !!props.size,
          'is-disabled': props.disabled,
          'is-loading': props.loading,
        }}
        type={props.nativeType}
        // loading 时同步原生 disabled，避免键盘 Enter/Space 触发原生提交
        disabled={props.disabled || props.loading}
        // 向辅助技术暴露忙碌状态
        aria-busy={props.loading || undefined}
        onClick={onClick}
      >
        <span class="shadow"></span>
        <span class="edge"></span>
        <span class="front">
          {props.loading ? (
            <>
              <span class="loading-spinner"></span>
              Loading...
            </>
          ) : (
            slots.default?.()
          )}
        </span>
      </button>
    )
  },
})
