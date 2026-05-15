import type { AvatarGroupProps } from './avatar-group-types'
import { computed, defineComponent, h, provide, ref, type VNode } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { avatarGroupInjectionKey, avatarGroupProps, resolveAvatarSize } from './avatar-group-types'
import './avatar-group.scss'

export default defineComponent({
  name: 'CAvatarGroup',
  props: avatarGroupProps,
  setup(props: AvatarGroupProps, { slots }) {
    const ns = useNamespace('avatar-group')
    const sizeRef = computed(() => props.size)
    const shapeRef = computed(() => props.shape)

    provide(avatarGroupInjectionKey, {
      size: sizeRef,
      shape: shapeRef,
    })

    const popoverVisible = ref(false)
    const triggerRef = ref<HTMLElement | null>(null)

    const isHoverTrigger = computed(() => props.maxPopoverTrigger === 'hover')
    const isClickTrigger = computed(() => props.maxPopoverTrigger === 'click')

    const openPopover = () => {
      popoverVisible.value = true
    }
    const closePopover = () => {
      popoverVisible.value = false
    }
    const togglePopover = () => {
      popoverVisible.value = !popoverVisible.value
    }

    return () => {
      const children = (slots.default?.() ?? []).filter((vnode) => {
        // 过滤纯文本 / 注释节点，只留 vnode（含 Avatar）
        if (typeof vnode.type === 'symbol') return false
        return true
      }) as VNode[]

      const total = children.length
      const max = props.maxCount
      const visibleChildren = max !== undefined && total > max ? children.slice(0, max) : children
      const hiddenChildren = max !== undefined && total > max ? children.slice(max) : []
      const hiddenCount = hiddenChildren.length

      const sizePx = resolveAvatarSize(props.size)

      const overflowAvatar =
        hiddenCount > 0
          ? h(
              'span',
              {
                ref: (el: unknown) => {
                  triggerRef.value = (el as HTMLElement | null) ?? null
                },
                class: ns.e('overflow'),
                style: {
                  width: `${sizePx}px`,
                  height: `${sizePx}px`,
                  fontSize: `${Math.max(12, Math.round(sizePx * 0.4))}px`,
                  borderRadius: props.shape === 'square' ? '4px' : '50%',
                  ...props.maxStyle,
                },
                onMouseenter: isHoverTrigger.value ? openPopover : undefined,
                onMouseleave: isHoverTrigger.value ? closePopover : undefined,
                onClick: isClickTrigger.value ? togglePopover : undefined,
                onFocus: props.maxPopoverTrigger === 'focus' ? openPopover : undefined,
                onBlur: props.maxPopoverTrigger === 'focus' ? closePopover : undefined,
                tabindex: props.maxPopoverTrigger === 'focus' ? 0 : undefined,
              },
              `+${hiddenCount}`,
            )
          : null

      const popover =
        hiddenCount > 0 && popoverVisible.value
          ? h(
              'div',
              {
                class: [ns.e('popover'), ns.em('popover', props.maxPopoverPlacement)],
                role: 'tooltip',
                onMouseenter: isHoverTrigger.value ? openPopover : undefined,
                onMouseleave: isHoverTrigger.value ? closePopover : undefined,
              },
              hiddenChildren,
            )
          : null

      return h('div', { class: ns.b(), role: 'group' }, [
        ...visibleChildren,
        overflowAvatar
          ? h(
              'span',
              {
                class: ns.e('overflow-wrap'),
                style: { position: 'relative' },
              },
              [overflowAvatar, popover],
            )
          : null,
      ])
    }
  },
})
