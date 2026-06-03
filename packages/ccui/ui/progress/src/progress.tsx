import type { CSSProperties } from 'vue'
import type { ProgressProps, ProgressStatus } from './progress-types'
import { computed, defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { clampPercent, progressProps } from './progress-types'
import './progress.scss'

const STATUS_ICONS: Record<ProgressStatus, string | null> = {
  success:
    'M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z',
  exception:
    'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z',
  normal: null,
  active: null,
}

export default defineComponent({
  name: 'CProgress',
  props: progressProps,
  setup(props: ProgressProps, { slots }) {
    const ns = useNamespace('progress')

    const percent = computed(() => clampPercent(props.percent))

    const finalStatus = computed<ProgressStatus>(() => {
      if (props.status && props.status !== 'normal') {
        return props.status
      }
      return percent.value === 100 ? 'success' : 'normal'
    })

    const trackColor = computed(() => {
      if (props.strokeColor) {
        return props.strokeColor
      }
      if (finalStatus.value === 'exception') {
        return 'var(--ccui-color-error)'
      }
      if (finalStatus.value === 'success') {
        return 'var(--ccui-color-success)'
      }
      return 'var(--ccui-color-primary)'
    })

    const renderInfo = () => {
      if (!props.showInfo) {
        return null
      }
      if (slots.format) {
        return slots.format({ percent: percent.value })
      }
      if (props.format) {
        return props.format(percent.value)
      }
      if (finalStatus.value === 'success') {
        return (
          <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor" class={ns.e('status-icon')}>
            <path d={STATUS_ICONS.success} />
          </svg>
        )
      }
      if (finalStatus.value === 'exception') {
        return (
          <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor" class={ns.e('status-icon')}>
            <path d={STATUS_ICONS.exception} />
          </svg>
        )
      }
      return `${percent.value}%`
    }

    const renderLine = () => {
      const sizeIsSmall = props.size === 'small'
      const height = props.strokeWidth ?? (sizeIsSmall ? 6 : 8)
      const lineStyle: CSSProperties = {
        width: `${percent.value}%`,
        backgroundColor: trackColor.value,
        height: `${height}px`,
      }
      const trailStyle: CSSProperties = {
        height: `${height}px`,
        backgroundColor: props.trailColor || undefined,
      }

      return (
        <div class={[ns.b(), ns.m('line'), ns.m(`status-${finalStatus.value}`), sizeIsSmall && ns.m('small')]}>
          <div class={ns.e('outer')}>
            <div class={ns.e('inner')} style={trailStyle}>
              <div class={ns.e('bg')} style={lineStyle} />
            </div>
          </div>
          {props.showInfo && (
            <span class={[ns.e('text'), ns.em('text', `status-${finalStatus.value}`)]}>{renderInfo()}</span>
          )}
        </div>
      )
    }

    const renderCircle = () => {
      const isDashboard = props.type === 'dashboard'
      const size = props.width
      const radius = 50 - (props.strokeWidth ?? 6) / 2
      const strokeWidth = props.strokeWidth ?? 6
      const circumference = 2 * Math.PI * radius
      const dashOffset = circumference * (1 - percent.value / 100)
      // 仪表盘：底部缺口 75%
      const gapDegree = isDashboard ? 75 : 0
      const dashRatio = (360 - gapDegree) / 360
      const adjustedDashArray = circumference * dashRatio
      const adjustedDashOffset = circumference * dashRatio * (1 - percent.value / 100)
      const transform = isDashboard ? `rotate(${gapDegree / 2 + 90}deg)` : 'rotate(-90deg)'

      return (
        <div
          class={[ns.b(), ns.m(props.type), ns.m(`status-${finalStatus.value}`)]}
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          <svg viewBox="0 0 100 100" class={ns.e('svg')} style={{ transform }}>
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={props.trailColor || 'rgba(0, 0, 0, 0.06)'}
              stroke-width={strokeWidth}
              stroke-dasharray={isDashboard ? `${adjustedDashArray} ${circumference}` : `${circumference}`}
              stroke-linecap="round"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={trackColor.value}
              stroke-width={strokeWidth}
              stroke-dasharray={
                isDashboard ? `${adjustedDashArray} ${circumference}` : `${circumference} ${circumference}`
              }
              stroke-dashoffset={isDashboard ? adjustedDashOffset : dashOffset}
              stroke-linecap="round"
              style={{ transition: 'stroke-dashoffset 0.3s ease 0s, stroke 0.3s' }}
            />
          </svg>
          {props.showInfo && <span class={ns.e('inner-text')}>{renderInfo()}</span>}
        </div>
      )
    }

    return () => (props.type === 'line' ? renderLine() : renderCircle())
  },
})
