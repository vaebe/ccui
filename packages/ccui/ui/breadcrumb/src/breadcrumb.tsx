import type { BreadcrumbItemProps, BreadcrumbProps } from './breadcrumb-types'
import type { VNode, VNodeChild } from 'vue'
import { cloneVNode, Comment, defineComponent, Fragment, inject, isVNode, provide, ref, Text, toRef } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { breadcrumbItemProps, breadcrumbProps } from './breadcrumb-types'
import './breadcrumb.scss'

const BREADCRUMB_KEY = Symbol('breadcrumb')

/** 判断 VNode 是否为库内 BreadcrumbItem，以保留组件自身输出的 li。 */
const isBreadcrumbItemVNode = (vnode: VNode) =>
  typeof vnode.type === 'object' && vnode.type !== null && (vnode.type as { name?: string }).name === 'CBreadcrumbItem'

interface BreadcrumbSlotEntry {
  /** 实际声明的可渲染节点；Fragment 与数组已在收集阶段展开。 */
  child: VNodeChild
  /** 声明位置生成的回退 key，保证无显式 key 节点的包装层稳定。 */
  fallbackKey: string
  /** BreadcrumbItem 自己渲染 li，其他节点需要由 Breadcrumb 包装。 */
  isItem: boolean
}

/**
 * 展开顶层数组与 Fragment，只收集真正可渲染的声明项。
 * Comment、空 Fragment 与空白 Text 不应为 ol 制造没有内容的 li。
 */
const collectSlotEntries = (children: VNodeChild): BreadcrumbSlotEntry[] => {
  const entries: BreadcrumbSlotEntry[] = []
  const visit = (child: VNodeChild, path: string) => {
    if (Array.isArray(child)) {
      child.forEach((nested, index) => visit(nested, `${path}.${index}`))
      return
    }
    if (child === null || child === undefined || typeof child === 'boolean') return
    if (!isVNode(child)) {
      if (typeof child !== 'string' || child.trim()) {
        entries.push({ child, fallbackKey: path, isItem: false })
      }
      return
    }
    if (child.type === Comment) return
    if (child.type === Text && (typeof child.children !== 'string' || !child.children.trim())) return
    if (child.type === Fragment) {
      visit(child.children as VNodeChild, `${path}.f`)
      return
    }
    entries.push({ child, fallbackKey: path, isItem: isBreadcrumbItemVNode(child) })
  }
  visit(children, 'slot')
  return entries
}

export const Breadcrumb = defineComponent({
  name: 'CBreadcrumb',
  props: breadcrumbProps,
  setup(props: BreadcrumbProps, { slots }) {
    const ns = useNamespace('breadcrumb')

    // 用 toRef 保留 props.separator 响应性，slot 用法下子项可随父级动态更新分隔符
    provide(BREADCRUMB_KEY, { separator: toRef(props, 'separator') })

    /** 数据驱动模式直接生成原生列表语义，并仅把末项标记为当前页。 */
    const renderRoutes = () => {
      const routes = props.routes ?? []
      const total = routes.length
      return routes.map((r, idx) => {
        const text = r.breadcrumbName ?? r.title ?? ''
        const isLast = idx === total - 1
        const link = r.href ?? r.path
        return (
          <li key={idx} class={ns.e('item')}>
            {isLast || !link ? (
              <span class={ns.e('link')} aria-current={isLast ? 'page' : undefined}>
                {text}
              </span>
            ) : (
              <a class={ns.e('link')} href={link}>
                {text}
              </a>
            )}
            {!isLast && (
              <span class={ns.e('separator')} aria-hidden="true">
                {props.separator}
              </span>
            )}
          </li>
        )
      })
    }

    return () => {
      const slotChildren = props.routes?.length ? null : (slots.default?.() ?? [])
      const entries = collectSlotEntries(slotChildren)
      // 混用 RouterLink 等外部节点时，由外部节点独占 current 语义，避免覆盖其 active/aria-current 策略。
      const ownsCurrentState = entries.every((entry) => entry.isItem)
      const content = props.routes?.length
        ? renderRoutes()
        : entries.map((entry, index) => {
            const isLast = index === entries.length - 1
            if (entry.isItem && isVNode(entry.child)) {
              return cloneVNode(entry.child, {
                // 结构末项始终决定 separator；current 仅在纯 BreadcrumbItem 模式下由容器维护。
                __ccuiIsLast: isLast,
                __ccuiIsCurrent: ownsCurrentState && isLast,
              })
            }
            const key = isVNode(entry.child) ? (entry.child.key ?? entry.fallbackKey) : entry.fallbackKey
            return (
              <li key={key} class={ns.e('item')}>
                {entry.child}
                {!isLast && (
                  <span class={ns.e('separator')} aria-hidden="true">
                    {props.separator}
                  </span>
                )}
              </li>
            )
          })
      return (
        <nav class={ns.b()} aria-label="Breadcrumb">
          <ol class={ns.e('list')}>{content}</ol>
        </nav>
      )
    }
  },
})

export const BreadcrumbItem = defineComponent({
  name: 'CBreadcrumbItem',
  props: {
    ...breadcrumbItemProps,
    // Breadcrumb 内部注入的末项状态；不属于公开 BreadcrumbItemProps，也不会透传到 DOM。
    __ccuiIsLast: { type: Boolean, default: false },
    // current 与结构末项分离，混用 RouterLink 时不覆盖外部节点自身的 active 语义。
    __ccuiIsCurrent: { type: Boolean, default: false },
  },
  setup(props: BreadcrumbItemProps & { __ccuiIsCurrent?: boolean; __ccuiIsLast?: boolean }, { slots }) {
    const ns = useNamespace('breadcrumb')
    const ctx = inject<{ separator: { value: string } }>(BREADCRUMB_KEY, { separator: ref('/') })

    return () => {
      // undefined 表示继承父级；显式空字符串是合法覆盖值，可用于隐藏单项分隔符。
      const sep = props.separator ?? ctx.separator.value
      return (
        <li class={ns.e('item')}>
          {props.href ? (
            <a class={ns.e('link')} href={props.href} aria-current={props.__ccuiIsCurrent ? 'page' : undefined}>
              {slots.default?.()}
            </a>
          ) : (
            <span class={ns.e('link')} aria-current={props.__ccuiIsCurrent ? 'page' : undefined}>
              {slots.default?.()}
            </span>
          )}
          {!props.__ccuiIsLast && (
            <span class={ns.e('separator')} aria-hidden="true">
              {slots.separator ? slots.separator() : sep}
            </span>
          )}
        </li>
      )
    }
  },
})
