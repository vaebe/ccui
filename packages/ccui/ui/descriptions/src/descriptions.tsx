import type { VNode } from 'vue'
import type { DescriptionsItem, DescriptionsProps } from './descriptions-types'
import { computed, defineComponent, Fragment } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { descriptionsProps } from './descriptions-types'
import './descriptions.scss'

interface ResolvedItem {
  label: VNode | string
  content: VNode | string | number
  span: number
  labelStyle?: Record<string, string | number>
  contentStyle?: Record<string, string | number>
}

function resolveFromSlots(children: VNode[] | undefined): ResolvedItem[] {
  if (!children) {
    return []
  }
  const flat: VNode[] = []
  children.forEach((child) => {
    if (child.type === Fragment && Array.isArray(child.children)) {
      ;(child.children as VNode[]).forEach((c) => flat.push(c))
    } else {
      flat.push(child)
    }
  })
  return flat
    .filter((c) => {
      const type = c.type as { name?: string } | undefined
      return type?.name === 'CDescriptionsItem'
    })
    .map((c) => {
      const props = (c.props ?? {}) as Record<string, unknown>
      const itemSlots = (c.children ?? {}) as Record<string, () => VNode>
      const labelNode = typeof itemSlots.label === 'function' ? itemSlots.label() : ((props.label as string) ?? '')
      const defaultNode = typeof itemSlots.default === 'function' ? itemSlots.default() : ''
      return {
        label: labelNode,
        content: defaultNode,
        span: Number(props.span ?? 1),
        labelStyle: props.labelStyle as Record<string, string | number> | undefined,
        contentStyle: props.contentStyle as Record<string, string | number> | undefined,
      }
    })
}

function resolveFromItems(items: DescriptionsItem[]): ResolvedItem[] {
  return items.map((it) => ({
    label: it.label ?? '',
    content: it.value ?? '',
    span: it.span ?? 1,
    labelStyle: it.labelStyle,
    contentStyle: it.contentStyle,
  }))
}

function chunkRows(items: ResolvedItem[], column: number): ResolvedItem[][] {
  const rows: ResolvedItem[][] = []
  let cur: ResolvedItem[] = []
  let used = 0
  items.forEach((item) => {
    const span = Math.min(item.span, column)
    if (used + span > column) {
      if (cur.length) {
        rows.push(cur)
      }
      cur = []
      used = 0
    }
    cur.push({ ...item, span })
    used += span
    if (used === column) {
      rows.push(cur)
      cur = []
      used = 0
    }
  })
  if (cur.length) {
    // 最后一行如果未填满，最后一项跨满剩余列
    cur[cur.length - 1] = { ...cur[cur.length - 1], span: cur[cur.length - 1].span + (column - used) }
    rows.push(cur)
  }
  return rows
}

export default defineComponent({
  name: 'CDescriptions',
  props: descriptionsProps,
  setup(props: DescriptionsProps, { slots }) {
    const ns = useNamespace('descriptions')

    const items = computed<ResolvedItem[]>(() => {
      if (props.items && props.items.length) {
        return resolveFromItems(props.items)
      }
      const raw = slots.default?.() as VNode[] | undefined
      return resolveFromSlots(raw)
    })

    const rows = computed(() => chunkRows(items.value, props.column))

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m('bordered')]: props.bordered,
      [ns.m(props.size)]: props.size !== 'default',
      [ns.m(props.layout)]: true,
    }))

    const renderHeader = () => {
      if (!props.title && !props.extra && !slots.title && !slots.extra) {
        return null
      }
      return (
        <div class={ns.e('header')}>
          <div class={ns.e('title')}>{slots.title ? slots.title() : props.title}</div>
          {(props.extra || slots.extra) && <div class={ns.e('extra')}>{slots.extra ? slots.extra() : props.extra}</div>}
        </div>
      )
    }

    return () => (
      <div class={cls.value}>
        {renderHeader()}
        <div class={ns.e('view')}>
          <table>
            <tbody>
              {rows.value.map((row, rIdx) => {
                if (props.layout === 'vertical') {
                  return (
                    <Fragment key={`r-${rIdx}`}>
                      <tr class={ns.e('row')}>
                        {row.map((it, idx) => (
                          <th
                            key={`l-${idx}`}
                            class={ns.e('label')}
                            scope="col"
                            colspan={it.span}
                            style={it.labelStyle}
                          >
                            {it.label}
                            {props.colon && !props.bordered ? ':' : ''}
                          </th>
                        ))}
                      </tr>
                      <tr class={ns.e('row')}>
                        {row.map((it, idx) => (
                          <td key={`c-${idx}`} class={ns.e('content')} colspan={it.span} style={it.contentStyle}>
                            {it.content}
                          </td>
                        ))}
                      </tr>
                    </Fragment>
                  )
                }
                return (
                  <tr class={ns.e('row')} key={`r-${rIdx}`}>
                    {row.map((it, idx) => {
                      if (props.bordered) {
                        return (
                          <Fragment key={`p-${idx}`}>
                            <th class={ns.e('label')} scope="row" style={it.labelStyle}>
                              {it.label}
                            </th>
                            <td class={ns.e('content')} colspan={it.span * 2 - 1} style={it.contentStyle}>
                              {it.content}
                            </td>
                          </Fragment>
                        )
                      }
                      return (
                        <td key={`c-${idx}`} class={ns.e('cell')} colspan={it.span} style={it.contentStyle}>
                          <span class={ns.e('label')} style={it.labelStyle}>
                            {it.label}
                            {props.colon ? ':' : ''}
                          </span>
                          <span class={ns.e('content')}>{it.content}</span>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
})
