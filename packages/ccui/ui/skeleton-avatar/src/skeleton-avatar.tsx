import type { CSSProperties } from 'vue'
import type { SkeletonAvatarProps } from './skeleton-avatar-types'
import { computed, defineComponent, h } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { skeletonAvatarProps } from './skeleton-avatar-types'
import './skeleton-avatar.scss'

export default defineComponent({
  name: 'CSkeletonAvatar',
  props: skeletonAvatarProps,
  setup(props: SkeletonAvatarProps) {
    const ns = useNamespace('skeleton-avatar')

    // size 为字符串档位走 SCSS modifier；number 走 inline style。
    const isPresetSize = computed(() => typeof props.size === 'string')

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(String(props.size))]: isPresetSize.value && props.size !== 'default',
      [ns.m(props.shape)]: props.shape && props.shape !== 'circle',
      [ns.m('active')]: props.active,
    }))

    const style = computed<CSSProperties>(() => {
      if (typeof props.size !== 'number') return {}
      return { width: `${props.size}px`, height: `${props.size}px`, minWidth: `${props.size}px` }
    })

    return () => h('span', { class: cls.value, style: style.value, 'aria-busy': 'true', 'aria-hidden': 'true' })
  },
})
