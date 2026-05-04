import type { ListProps } from './list-types'
import { computed, defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { listProps } from './list-types'
import './list.scss'

function getRowKey(item: unknown, index: number, rowKey: ListProps['rowKey']): string | number {
  if (typeof rowKey === 'function') {
    return rowKey(item, index)
  }
  if (typeof rowKey === 'string' && item && typeof item === 'object') {
    const v = (item as Record<string, unknown>)[rowKey]
    if (typeof v === 'string' || typeof v === 'number') {
      return v
    }
  }
  return index
}

export default defineComponent({
  name: 'CList',
  props: listProps,
  setup(props: ListProps, { slots }) {
    const ns = useNamespace('list')

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.size)]: props.size !== 'default',
      [ns.m('bordered')]: props.bordered,
      [ns.m('split')]: props.split,
      [ns.m(`layout-${props.layout}`)]: true,
      [ns.m(`item-${props.itemLayout}`)]: true,
      [ns.m('loading')]: props.loading,
    }))

    return () => (
      <div class={cls.value}>
        {slots.header && <div class={ns.e('header')}>{slots.header()}</div>}

        <div class={ns.e('container')}>
          {props.loading && (
            <div class={ns.e('loading-overlay')}>
              <span class={ns.e('loading-dot')} />
            </div>
          )}
          {props.dataSource.length ? (
            <ul class={ns.e('items')}>
              {props.dataSource.map((item, index) => (
                <li key={getRowKey(item, index, props.rowKey)} class={ns.e('item')}>
                  {slots.renderItem ? slots.renderItem({ item, index }) : null}
                </li>
              ))}
            </ul>
          ) : (
            <div class={ns.e('empty')}>{slots.empty ? slots.empty() : '暂无数据'}</div>
          )}
        </div>

        {(slots.footer || slots.loadMore) && (
          <div class={ns.e('footer')}>
            {slots.footer?.()}
            {slots.loadMore?.()}
          </div>
        )}
      </div>
    )
  },
})
