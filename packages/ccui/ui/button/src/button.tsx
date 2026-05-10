import type { ButtonProps } from './button-types'
import { Icon as IconifyIcon } from '@iconify/vue'
import { computed, defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { buttonProps } from './button-types'
import './button.scss'

// Iconify 命名规范：`<collection>:<icon>`，例如 `mdi:magnify`。
// 含 `:` 时按 Iconify 渲染 SVG；否则当 CSS 类名（兼容自定义 iconfont 接入方）。
function isIconifyName(name: string): boolean {
  return name.includes(':')
}

export default defineComponent({
  name: 'CButton',
  props: buttonProps,
  emits: ['click'],
  setup(props: ButtonProps, { slots, emit }) {
    const ns = useNamespace('button')
    const butCls = computed(() => {
      return {
        [ns.b()]: true,
        [ns.m(props.type)]: !!props.type,
        [ns.m(`plain-${props.type}`)]: !!props.plain,
        [ns.m(props.size)]: !!props.size,
        [ns.m('round')]: props.round,
        [ns.m('circle')]: props.circle,
        [ns.m('loading')]: props.loading,
        [ns.m('disabled')]: props.disabled || props.loading,
      }
    })

    const onClick = (e: MouseEvent) => {
      // 如果按钮处于加载状态或禁用状态，则不触发点击事件
      if (props.disabled || props.loading) {
        e.preventDefault()
        return
      }
      emit('click', e)
    }

    return () => {
      return (
        <button
          class={butCls.value}
          type={props.nativeType}
          autofocus={props.autofocus}
          disabled={props.disabled || props.loading}
          onClick={onClick}
        >
          {props.loading && <span class={ns.e('loading-icon')}></span>}
          {slots.icon
            ? slots.icon()
            : props.icon &&
              (isIconifyName(props.icon) ? (
                <IconifyIcon icon={props.icon} class={ns.e('icon')} />
              ) : (
                <i class={[ns.e('icon'), props.icon]}></i>
              ))}
          {slots.default && <span class={ns.e('content')}>{slots.default()}</span>}
        </button>
      )
    }
  },
})
