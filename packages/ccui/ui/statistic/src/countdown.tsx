import type { StatisticCountdownProps } from './statistic-types'
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { statisticCountdownProps } from './statistic-types'
import './statistic.scss'

function toTimestamp(value: number | string | Date): number {
  if (value instanceof Date) {
    return value.getTime()
  }
  if (typeof value === 'number') {
    return value
  }
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

function formatDuration(diff: number, fmt: string): string {
  const safe = Math.max(0, diff)
  const days = Math.floor(safe / 86_400_000)
  const hours = Math.floor((safe % 86_400_000) / 3_600_000)
  const minutes = Math.floor((safe % 3_600_000) / 60_000)
  const seconds = Math.floor((safe % 60_000) / 1000)
  const ms = safe % 1000

  return fmt
    .replace(/DD/g, String(days).padStart(2, '0'))
    .replace(/D/g, String(days))
    .replace(/HH/g, String(hours).padStart(2, '0'))
    .replace(/H/g, String(hours))
    .replace(/mm/g, String(minutes).padStart(2, '0'))
    .replace(/m/g, String(minutes))
    .replace(/ss/g, String(seconds).padStart(2, '0'))
    .replace(/s/g, String(seconds))
    .replace(/SSS/g, String(ms).padStart(3, '0'))
}

export default defineComponent({
  name: 'CStatisticCountdown',
  props: statisticCountdownProps,
  emits: ['finish', 'change'],
  setup(props: StatisticCountdownProps, { emit, slots }) {
    const ns = useNamespace('statistic')

    const targetTs = computed(() => toTimestamp(props.value))
    const now = ref(Date.now())
    let timer: number | null = null

    const diff = computed(() => Math.max(0, targetTs.value - now.value))
    const display = computed(() => formatDuration(diff.value, props.format))

    const tick = () => {
      now.value = Date.now()
      const remaining = targetTs.value - now.value
      emit('change', remaining)
      if (remaining <= 0) {
        if (timer !== null) {
          clearInterval(timer)
          timer = null
        }
        emit('finish')
      }
    }

    onMounted(() => {
      now.value = Date.now()
      if (targetTs.value > now.value) {
        timer = window.setInterval(tick, 1000 / 30)
      }
    })

    onBeforeUnmount(() => {
      if (timer !== null) {
        clearInterval(timer)
        timer = null
      }
    })

    return () => (
      <div class={ns.b()}>
        {(props.title || slots.title) && <div class={ns.e('title')}>{slots.title ? slots.title() : props.title}</div>}
        <div class={ns.e('content')}>
          {(props.prefix || slots.prefix) && (
            <span class={ns.e('prefix')}>{slots.prefix ? slots.prefix() : props.prefix}</span>
          )}
          <span class={ns.e('value')} style={props.valueStyle}>
            {display.value}
          </span>
          {(props.suffix || slots.suffix) && (
            <span class={ns.e('suffix')}>{slots.suffix ? slots.suffix() : props.suffix}</span>
          )}
        </div>
      </div>
    )
  },
})
