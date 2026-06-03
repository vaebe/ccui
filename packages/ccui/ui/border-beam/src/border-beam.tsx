import type { CSSProperties } from 'vue'
import type { BorderBeamColor, BorderBeamColorStop, BorderBeamProps } from './border-beam-types'
import { computed, defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { borderBeamProps, MAX_BEAM_COLOR_STOP_PERCENT } from './border-beam-types'
import './border-beam.scss'

/** 把数字补 px，字符串原样返回 */
function toLength(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}

function normalizeColor(value?: BorderBeamColor): BorderBeamColorStop[] {
  if (typeof value === 'string') {
    return value ? [{ color: value, percent: 0 }] : []
  }
  return value ?? []
}

/** 末尾停靠点补到 100%，保证自定义渐变末端有可见拖尾 */
function fillGradientEnd(items: BorderBeamColorStop[]): BorderBeamColorStop[] {
  const last = items[items.length - 1]
  if (!last || last.percent === 100) {
    return items
  }
  return [...items, { ...last, percent: 100 }]
}

/** 把用户的 0~100 映射进光带前 70%（保留尾段淡出），按比例缩放而非硬裁剪 */
function mapStopPercent(percent: number): number {
  const clamped = Math.min(Math.max(percent, 0), 100)
  return Number(((clamped / 100) * MAX_BEAM_COLOR_STOP_PERCENT).toFixed(2))
}

/** 由单色或渐变停靠点构建光带渐变；无颜色时返回 undefined（由样式回退到主题主色） */
function getBorderBeamGradient(value?: BorderBeamColor): string | undefined {
  const stops = fillGradientEnd(normalizeColor(value)).map((item) => ({
    ...item,
    percent: mapStopPercent(item.percent),
  }))
  if (!stops.length) {
    return undefined
  }
  const colorStops = stops.map((item) => `${item.color} ${item.percent}%`).join(', ')
  return `linear-gradient(to left, ${colorStops}, transparent)`
}

export default defineComponent({
  name: 'CBorderBeam',
  props: borderBeamProps,
  setup(props: BorderBeamProps, { slots }) {
    const ns = useNamespace('border-beam')

    const beamGradient = computed(() => getBorderBeamGradient(props.color))

    const rootStyle = computed<CSSProperties>(() => {
      const vars: Record<string, string> = {
        '--ccui-bb-outset': toLength(props.outset),
        '--ccui-bb-border-width': `${props.borderWidth}px`,
        '--ccui-bb-radius': `${props.borderRadius}px`,
        '--ccui-bb-duration': `${props.duration}s`,
      }
      if (beamGradient.value) {
        vars['--ccui-bb-beam-gradient'] = beamGradient.value
      }
      return vars as CSSProperties
    })

    return () => (
      <div class={ns.b()} style={rootStyle.value}>
        {slots.default?.()}
        <div class={ns.e('effect')} aria-hidden="true" />
      </div>
    )
  },
})
