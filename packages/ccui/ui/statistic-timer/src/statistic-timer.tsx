import type { StatisticTimerProps } from './statistic-timer-types'
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { statisticTimerProps } from './statistic-timer-types'

// 复用 statistic 命名空间和 SCSS（与 Statistic / StatisticCountdown 视觉一致）。
// 不再单独建 statistic-timer.scss，避免重复样式定义。
import '../../statistic/src/statistic.scss'

function toTimestamp(value: number | string | Date): number {
  if (value instanceof Date) return value.getTime()
  if (typeof value === 'number') return value
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
  name: 'CStatisticTimer',
  props: statisticTimerProps,
  emits: ['finish', 'change'],
  setup(props: StatisticTimerProps, { emit, slots }) {
    const ns = useNamespace('statistic')

    const targetTs = computed(() => toTimestamp(props.value))
    const now = ref(Date.now())
    let timer: number | null = null

    // 倒计时方向：diff = target - now（>=0），归零触发 finish。
    // 正计时方向：diff = now - start（>=0），永不归零。
    const diff = computed(() => {
      if (props.type === 'countup') {
        return Math.max(0, now.value - targetTs.value)
      }
      return Math.max(0, targetTs.value - now.value)
    })
    const display = computed(() => formatDuration(diff.value, props.format))

    const stopTimer = () => {
      if (timer !== null) {
        clearInterval(timer)
        timer = null
      }
    }

    const tick = () => {
      now.value = Date.now()
      emit('change', diff.value)
      // countdown 模式：归 0 时触发 finish 并停表。
      if (props.type === 'countdown' && targetTs.value - now.value <= 0) {
        stopTimer()
        emit('finish')
      }
    }

    const startTimer = () => {
      stopTimer()
      now.value = Date.now()
      // countdown：目标时间未到才启动；countup：始终启动。
      if (props.type === 'countup' || targetTs.value > now.value) {
        timer = window.setInterval(tick, 1000 / 30)
      }
    }

    onMounted(() => startTimer())

    watch([targetTs, () => props.type], () => startTimer())

    onBeforeUnmount(() => stopTimer())

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
