import type { StatisticProps } from './statistic-types'
import { computed, defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { statisticProps } from './statistic-types'
import './statistic.scss'

function formatNumber(
  value: number | string,
  groupSeparator: string,
  decimalSeparator: string,
  precision?: number,
): { int: string; decimal: string } {
  const num = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(num)) {
    return { int: String(value), decimal: '' }
  }
  const fixed = precision !== undefined ? num.toFixed(precision) : String(num)
  const [intPart, decPart = ''] = fixed.split('.')
  const reg = /\B(?=(\d{3})+(?!\d))/g
  const intStr = intPart.replace(reg, groupSeparator)
  const decStr = decPart ? `${decimalSeparator}${decPart}` : ''
  return { int: intStr, decimal: decStr }
}

export default defineComponent({
  name: 'CStatistic',
  props: statisticProps,
  setup(props: StatisticProps, { slots }) {
    const ns = useNamespace('statistic')

    const formatted = computed(() =>
      formatNumber(props.value, props.groupSeparator, props.decimalSeparator, props.precision),
    )

    return () => (
      <div class={ns.b()}>
        {(props.title || slots.title) && <div class={ns.e('title')}>{slots.title ? slots.title() : props.title}</div>}
        <div class={ns.e('content')}>
          {props.loading ? (
            <span class={ns.e('loading')}>--</span>
          ) : (
            <>
              {(props.prefix || slots.prefix) && (
                <span class={ns.e('prefix')}>{slots.prefix ? slots.prefix() : props.prefix}</span>
              )}
              <span class={ns.e('value')} style={props.valueStyle}>
                <span class={ns.e('value-int')}>{formatted.value.int}</span>
                {formatted.value.decimal && <span class={ns.e('value-decimal')}>{formatted.value.decimal}</span>}
              </span>
              {(props.suffix || slots.suffix) && (
                <span class={ns.e('suffix')}>{slots.suffix ? slots.suffix() : props.suffix}</span>
              )}
            </>
          )}
        </div>
      </div>
    )
  },
})
