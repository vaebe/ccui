import type { CSSProperties } from 'vue'
import type { IconProps, IconSize } from './icon-types'
import { Icon as IconifyIcon } from '@iconify/vue'
import { computed, defineComponent, h, useAttrs } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { resolveIcon } from './icon-registry'
import { iconProps } from './icon-types'
import './icon.scss'

const SIZE_PRESETS: Record<string, number> = {
  small: 14,
  large: 20,
}

function isIconifyName(name?: string) {
  return !!name && name.includes(':')
}

function resolveSize(size: IconSize | undefined): string | undefined {
  if (size === undefined || size === null || size === '' || size === 'default') {
    return undefined
  }
  if (typeof size === 'number') {
    return `${size}px`
  }
  if (size in SIZE_PRESETS) {
    return `${SIZE_PRESETS[size]}px`
  }
  return size
}

export default defineComponent({
  name: 'CIcon',
  inheritAttrs: false,
  props: iconProps,
  setup(props: IconProps, { slots }) {
    const attrs = useAttrs()
    const ns = useNamespace('icon')

    const iconPrefixCls = computed(() => props.prefixCls || 'ccui-icon')
    const iconifyName = computed(() => (isIconifyName(props.name) ? props.name : undefined))
    const registryIcon = computed(() => {
      if (props.component) {
        return props.component
      }
      if (props.name && !iconifyName.value) {
        return resolveIcon(props.name)
      }
      return undefined
    })
    const hasNamedFontIcon = computed(
      () => !!props.name && !iconifyName.value && !registryIcon.value && !props.component,
    )

    const iconStyle = computed(() => {
      const style: CSSProperties & Record<string, string> = {}
      const fontSize = resolveSize(props.size)
      if (fontSize) {
        style.fontSize = fontSize
      }
      if (props.color) {
        style.color = props.color
      }
      if (props.twoToneColor) {
        style['--ccui-icon-two-tone-color'] = props.twoToneColor
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
      [ns.m('svg')]: !!registryIcon.value || !!iconifyName.value || !!slots.default,
      [ns.m('iconify')]: !!iconifyName.value,
      [ns.m(props.theme!)]: !!props.theme,
    }))

    return () => {
      const { class: attrClass, style: attrStyle, ...restAttrs } = attrs as Record<string, unknown>

      let content
      if (registryIcon.value) {
        content = h(registryIcon.value as never)
      } else if (iconifyName.value) {
        content = h(IconifyIcon, { icon: iconifyName.value })
      } else if (hasNamedFontIcon.value) {
        content = h('i', { class: [iconPrefixCls.value, `${iconPrefixCls.value}-${props.name}`] })
      } else {
        content = slots.default?.()
      }

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
