import type { TagProps, TagVariant } from './tag-types'
import { computed, defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { isPresetColor, tagProps } from './tag-types'
import './tag.scss'

export default defineComponent({
  name: 'CTag',
  props: tagProps,
  emits: ['close'],
  setup(props: TagProps, { slots, emit }) {
    const ns = useNamespace('tag')

    const isPreset = computed(() => isPresetColor(props.color))

    // 解析有效 variant：显式 prop > bordered=false → 'filled' > 默认 'outlined'
    const effectiveVariant = computed<TagVariant>(() => {
      if (props.variant) return props.variant
      return props.bordered ? 'outlined' : 'filled'
    })

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.color)]: isPreset.value,
      [ns.m(`variant-${effectiveVariant.value}`)]: true,
      // 兼容旧类：variant='filled' 等价于历史 bordered=false 输出的 --borderless 类
      [ns.m('borderless')]: effectiveVariant.value !== 'outlined',
      [ns.m('has-color')]: !isPreset.value && !!props.color,
    }))

    const style = computed(() => {
      if (isPreset.value || !props.color) {
        return undefined
      }
      return {
        backgroundColor: props.color,
        borderColor: props.color,
      }
    })

    const onClose = (e: MouseEvent) => {
      e.stopPropagation()
      emit('close', e)
    }

    return () => (
      <span class={cls.value} style={style.value}>
        {slots.icon ? (
          <span class={ns.e('icon')}>{slots.icon()}</span>
        ) : (
          props.icon && <i class={[ns.e('icon'), props.icon]} />
        )}
        <span class={ns.e('content')}>{slots.default?.()}</span>
        {props.closable && (
          <span class={ns.e('close')} onClick={onClose}>
            <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor" aria-hidden="true">
              <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
            </svg>
          </span>
        )}
      </span>
    )
  },
})
