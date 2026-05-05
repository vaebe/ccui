import type { CSSProperties } from 'vue'
import type { IconProps } from './icon-types'
import { computed, defineComponent, h, useAttrs } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { resolveIcon } from './icon-registry'
import { iconProps } from './icon-types'
import './icon.scss'

export default defineComponent({
  name: 'CIcon',
  inheritAttrs: false,
  props: iconProps,
  setup(props: IconProps, { slots }) {
    const attrs = useAttrs()
    const ns = useNamespace('icon')

    const iconPrefixCls = computed(() => props.prefixCls || 'ccui-icon')
    const resolvedIcon = computed(() => props.component ?? resolveIcon(props.name))
    const hasNamedFontIcon = computed(() => !!props.name && !resolvedIcon.value)

    const iconStyle = computed(() => {
      const style: CSSProperties & Record<string, string> = {}
      if (props.size !== undefined && props.size !== null && props.size !== '') {
        style.fontSize = typeof props.size === 'number' ? `${props.size}px` : props.size
      }
      if (props.color) {
        style.color = props.color
      }
      if (props.rotate !== undefined) {
        style['--ccui-icon-rotate'] = `${props.rotate}deg`
      }
      return style
    })

    const iconCls = computed(() => ({
      [ns.b()]: true,
      [ns.m('spin')]: props.spin,
      [ns.m('font')]: hasNamedFontIcon.value,
      [ns.m('svg')]: !!resolvedIcon.value || !!slots.default,
    }))

    return () => {
      const { class: attrClass, style: attrStyle, ...restAttrs } = attrs as Record<string, unknown>
      const IconComponent = resolvedIcon.value
      const content = IconComponent
        ? h(IconComponent as never)
        : hasNamedFontIcon.value
          ? h('i', { class: [iconPrefixCls.value, `${iconPrefixCls.value}-${props.name}`] })
          : slots.default?.()

      return h(
        'span',
        {
          ...restAttrs,
          class: [attrClass, iconCls.value],
          style: [attrStyle as CSSProperties, iconStyle.value],
          role: props.title || props.ariaLabel ? 'img' : undefined,
          'aria-hidden': props.title || props.ariaLabel ? undefined : 'true',
          'aria-label': props.ariaLabel || props.title || undefined,
          title: props.title || undefined,
        },
        content,
      )
    }
  },
})
