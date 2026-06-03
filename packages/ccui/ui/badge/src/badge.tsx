import type { CSSProperties } from 'vue'
import type { BadgeProps } from './badge-types'
import { computed, defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { badgeProps } from './badge-types'
import './badge.scss'

export default defineComponent({
  name: 'CBadge',
  props: badgeProps,
  setup(props: BadgeProps, { slots }) {
    const ns = useNamespace('badge')

    const isStandalone = computed(() => !slots.default)

    // 是否显示数字 / dot
    const hasCount = computed(() => {
      if (props.dot) {
        return true
      }
      const count = props.count
      if (count === null || count === undefined || count === '') {
        return false
      }
      if (typeof count === 'number' && count === 0 && !props.showZero) {
        return false
      }
      return true
    })

    const displayCount = computed(() => {
      if (props.dot) {
        return ''
      }
      const count = props.count
      if (typeof count === 'number') {
        return count > props.overflowCount ? `${props.overflowCount}+` : String(count)
      }
      return String(count ?? '')
    })

    const countStyle = computed<CSSProperties | undefined>(() => {
      const style: CSSProperties = {}
      if (props.color) {
        style.backgroundColor = props.color
      }
      if (props.offset && Array.isArray(props.offset)) {
        const [x, y] = props.offset
        style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
      }
      return Object.keys(style).length ? style : undefined
    })

    return () => {
      // 状态点 + 文本
      if (props.status || (props.color && !slots.default && !hasCount.value)) {
        return (
          <span class={[ns.b(), props.classNames?.root]} style={props.styles?.root}>
            <span
              class={[ns.e('status-dot'), props.status && ns.em('status-dot', props.status), props.classNames?.dot]}
              style={[props.color ? { backgroundColor: props.color } : undefined, props.styles?.dot] as any}
            />
            {props.text && <span class={ns.e('status-text')}>{props.text}</span>}
          </span>
        )
      }

      // 独立模式 - count 或 dot
      if (isStandalone.value) {
        if (!hasCount.value) {
          return null
        }
        if (props.dot) {
          return (
            <span
              class={[ns.b(), ns.m('dot-standalone'), props.classNames?.root, props.classNames?.dot]}
              style={[countStyle.value, props.styles?.root, props.styles?.dot] as any}
            />
          )
        }
        return (
          <span
            class={[ns.b(), ns.m('count-standalone'), props.classNames?.root, props.classNames?.count]}
            style={[countStyle.value, props.styles?.root, props.styles?.count] as any}
          >
            {displayCount.value}
          </span>
        )
      }

      // 包裹模式
      const sup = hasCount.value ? (
        <sup
          class={[
            ns.e('sup'),
            props.dot && ns.em('sup', 'dot'),
            props.dot ? props.classNames?.dot : props.classNames?.count,
          ]}
          style={[countStyle.value, props.dot ? props.styles?.dot : props.styles?.count] as any}
        >
          {props.dot ? null : displayCount.value}
        </sup>
      ) : null

      return (
        <span class={[ns.b(), props.classNames?.root]} style={props.styles?.root}>
          {slots.default?.()}
          {sup}
        </span>
      )
    }
  },
})
