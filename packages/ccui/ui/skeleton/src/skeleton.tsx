import type { CSSProperties } from 'vue'
import type { SkeletonAvatarShape, SkeletonParagraphShape, SkeletonProps, SkeletonTitleShape } from './skeleton-types'
import { computed, defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { skeletonProps } from './skeleton-types'
import './skeleton.scss'

function toSize(s: string | number): string {
  return typeof s === 'number' ? `${s}px` : s
}

export default defineComponent({
  name: 'CSkeleton',
  props: skeletonProps,
  setup(props: SkeletonProps, { slots }) {
    const ns = useNamespace('skeleton')

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m('active')]: props.active,
      [ns.m('round')]: props.round,
      [ns.m('with-avatar')]: !!props.avatar,
    }))

    const avatarStyle = computed<CSSProperties>(() => {
      const av = props.avatar as SkeletonAvatarShape | boolean
      if (!av || typeof av !== 'object') {
        return {}
      }
      const sizeMap: Record<string, number> = { small: 24, default: 32, large: 40 }
      const size = typeof av.size === 'number' ? av.size : sizeMap[av.size ?? 'default']
      return {
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: av.shape === 'square' ? '4px' : '50%',
      }
    })

    const titleStyle = computed<CSSProperties>(() => {
      const t = props.title as SkeletonTitleShape | boolean
      if (typeof t === 'object' && t.width !== undefined) {
        return { width: toSize(t.width) }
      }
      return { width: '38%' }
    })

    const paragraphRows = computed(() => {
      const p = props.paragraph as SkeletonParagraphShape | boolean
      if (!p) {
        return 0
      }
      if (typeof p === 'object' && p.rows !== undefined) {
        return p.rows
      }
      return 3
    })

    const paragraphRowStyle = (i: number, total: number): CSSProperties => {
      const p = props.paragraph as SkeletonParagraphShape | boolean
      if (typeof p === 'object' && p.width) {
        if (Array.isArray(p.width)) {
          return { width: p.width[i] !== undefined ? toSize(p.width[i]) : undefined }
        }
        if (i === total - 1) {
          return { width: toSize(p.width) }
        }
      }
      if (i === total - 1) {
        return { width: '61%' }
      }
      return {}
    }

    return () => {
      if (!props.loading) {
        return slots.default?.()
      }

      const total = paragraphRows.value

      return (
        <div class={cls.value}>
          {props.avatar && (
            <div class={ns.e('header')}>
              <span class={ns.e('avatar')} style={avatarStyle.value} />
            </div>
          )}
          <div class={ns.e('content')}>
            {props.title && <h3 class={ns.e('title')} style={titleStyle.value} />}
            {total > 0 && (
              <div class={ns.e('paragraph')}>
                {Array.from({ length: total }).map((_, i) => (
                  <div key={i} class={ns.e('paragraph-row')} style={paragraphRowStyle(i, total)} />
                ))}
              </div>
            )}
          </div>
        </div>
      )
    }
  },
})
