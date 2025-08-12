import type { Button3dProps } from './button-3d-types'
import { defineComponent, toRefs } from 'vue'
import { button3dProps } from './button-3d-types'
import './button-3d.scss'

export default defineComponent({
  name: 'CButton3d',
  props: button3dProps,
  emits: ['click'],
  setup(props: Button3dProps, { slots, emit }) {
    const { type, size, disabled, loading } = toRefs(props)

    const onClick = (e: MouseEvent) => {
      if (loading.value) {
        return
      }
      emit('click', e)
    }

    return () => (
      <button
        class={{
          'cc-button-3d': true,
          [`cc-button-3d--${type.value}`]: true,
          [`cc-button-3d--${size.value}`]: true,
          'is-disabled': disabled.value || loading.value,
        }}
        disabled={disabled.value || loading.value}
        onClick={onClick}
      >
        <span class="shadow"></span>
        <span class="edge"></span>
        <span class="front">
          {loading.value ? 'Loading...' : slots.default?.()}
        </span>
      </button>
    )
  },
})
