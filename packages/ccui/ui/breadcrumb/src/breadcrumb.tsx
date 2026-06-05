import type { BreadcrumbItemProps, BreadcrumbProps } from './breadcrumb-types'
import { defineComponent, inject, provide, ref, toRef } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { breadcrumbItemProps, breadcrumbProps } from './breadcrumb-types'
import './breadcrumb.scss'

const BREADCRUMB_KEY = Symbol('breadcrumb')

export const Breadcrumb = defineComponent({
  name: 'CBreadcrumb',
  props: breadcrumbProps,
  setup(props: BreadcrumbProps, { slots }) {
    const ns = useNamespace('breadcrumb')

    // 用 toRef 保留 props.separator 响应性，slot 用法下子项可随父级动态更新分隔符
    provide(BREADCRUMB_KEY, { separator: toRef(props, 'separator') })

    const renderRoutes = () => {
      const routes = props.routes ?? []
      const total = routes.length
      return routes.map((r, idx) => {
        const text = r.breadcrumbName ?? r.title ?? ''
        const isLast = idx === total - 1
        const link = r.href ?? r.path
        return (
          <span key={idx} class={ns.e('item')}>
            {isLast || !link ? (
              <span class={ns.e('link')} aria-current="page">
                {text}
              </span>
            ) : (
              <a class={ns.e('link')} href={link}>
                {text}
              </a>
            )}
            {!isLast && <span class={ns.e('separator')}>{props.separator}</span>}
          </span>
        )
      })
    }

    return () => (
      <nav class={ns.b()} aria-label="Breadcrumb">
        {props.routes && props.routes.length ? renderRoutes() : slots.default?.()}
      </nav>
    )
  },
})

export const BreadcrumbItem = defineComponent({
  name: 'CBreadcrumbItem',
  props: breadcrumbItemProps,
  setup(props: BreadcrumbItemProps, { slots }) {
    const ns = useNamespace('breadcrumb')
    const ctx = inject<{ separator: { value: string } }>(BREADCRUMB_KEY, { separator: ref('/') })

    return () => {
      const sep = props.separator || ctx.separator.value
      return (
        <span class={ns.e('item')}>
          {props.href ? (
            <a class={ns.e('link')} href={props.href}>
              {slots.default?.()}
            </a>
          ) : (
            <span class={ns.e('link')} aria-current="page">
              {slots.default?.()}
            </span>
          )}
          <span class={ns.e('separator')}>{slots.separator ? slots.separator() : sep}</span>
        </span>
      )
    }
  },
})
