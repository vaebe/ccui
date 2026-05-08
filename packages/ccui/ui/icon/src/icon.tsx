import type { CSSProperties } from 'vue'
import type { ConfigContext } from '../../config-provider/src/config-provider-types'
import type { IconProps, IconSize } from './icon-types'
import { Icon as IconifyIcon } from '@iconify/vue'
import { computed, defineComponent, h, inject, useAttrs } from 'vue'
import { CONFIG_INJECT_KEY } from '../../config-provider/src/config-provider-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { resolveIcon } from './icon-registry'
import { iconProps } from './icon-types'
import './icon.scss'

const DEFAULT_CONFIG: ConfigContext = {
  prefixCls: 'ccui',
  componentSize: 'middle',
  locale: undefined,
  direction: 'ltr',
  theme: undefined,
  iconPrefixCls: 'ccui-icon',
}

const SIZE_PRESETS: Record<string, number> = {
  small: 14,
  large: 20,
}

function isIconifyName(name?: string) {
  return !!name && name.includes(':')
}

function resolveSize(size: IconSize | undefined, fallback: IconSize | undefined): string | undefined {
  const effective = size === undefined ? fallback : size
  if (effective === undefined || effective === null || effective === '' || effective === 'default') {
    return undefined
  }
  if (typeof effective === 'number') {
    return `${effective}px`
  }
  if (effective in SIZE_PRESETS) {
    return `${SIZE_PRESETS[effective]}px`
  }
  return effective
}

function mapConfigSize(size: 'small' | 'middle' | 'large' | undefined): IconSize | undefined {
  if (size === 'middle') return 'default'
  return size
}

export default defineComponent({
  name: 'CIcon',
  inheritAttrs: false,
  props: iconProps,
  emits: ['click'],
  setup(props: IconProps, { slots, emit }) {
    const attrs = useAttrs()
    const ns = useNamespace('icon')
    const config = inject<ConfigContext>(CONFIG_INJECT_KEY, DEFAULT_CONFIG)

    const iconPrefixCls = computed(() => props.prefixCls || config.iconPrefixCls || 'ccui-icon')
    const resolvedName = computed(() => {
      if (!props.name) return ''
      if (props.name.includes(':')) return props.name
      if (props.iconifyPrefix) return `${props.iconifyPrefix}:${props.name}`
      return props.name
    })
    const iconifyName = computed(() => (isIconifyName(resolvedName.value) ? resolvedName.value : undefined))
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
      const fontSize = resolveSize(props.size, mapConfigSize(config.componentSize))
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
      [ns.m('spin-ccw')]: props.spin && props.spinDirection === 'ccw',
      [ns.m('font')]: hasNamedFontIcon.value,
      [ns.m('svg')]: !!registryIcon.value || !!iconifyName.value || !!slots.default,
      [ns.m('iconify')]: !!iconifyName.value,
      [ns.m(props.theme!)]: !!props.theme,
      [ns.m('clickable')]: props.clickable,
    }))

    const onClick = (event: MouseEvent) => {
      emit('click', event)
    }

    const onKeydown = (event: KeyboardEvent) => {
      if (!props.clickable) return
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        ;(event.currentTarget as HTMLElement).click()
      }
    }

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

      const interactive = props.clickable
      const role = interactive ? 'button' : props.title || props.ariaLabel ? 'img' : undefined
      const tabindex = interactive ? 0 : undefined

      return h(
        'span',
        {
          ...restAttrs,
          class: [attrClass, iconCls.value],
          style: [attrStyle as CSSProperties, iconStyle.value],
          role,
          tabindex,
          'aria-hidden': interactive ? undefined : props.title || props.ariaLabel ? undefined : 'true',
          'aria-label': props.ariaLabel || props.title || undefined,
          'aria-disabled': interactive && (attrs as Record<string, unknown>).disabled ? 'true' : undefined,
          title: props.title || undefined,
          onClick,
          onKeydown,
        },
        content,
      )
    }
  },
})
