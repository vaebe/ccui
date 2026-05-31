import type { Slot, VNode, VNodeChild } from 'vue'
import { Icon as IconifyIcon } from '@iconify/vue'
import { h } from 'vue'
// 副作用 import：把 ccui 内置 mdi 图标注册到 Iconify 本地数据源，
// 让 `mdi:check` 等内置图标无需联网即可渲染（覆盖所有走 renderIconNode 的组件）。
import '@vaebe/ccui-icons/install'

export type CcIconValue = VNode | string

function isIconifyName(name: string): boolean {
  return name.includes(':')
}

/**
 * 渲染图标钩子的值：
 * - string + 含 `:`：当 Iconify name 渲染 `<IconifyIcon icon={value} />`
 * - string + 不含 `:`：当 CSS 类名（兼容自定义 iconfont 接入方）渲染 `<i class={value} />`
 * - VNode：直接返回
 * - null / undefined / 空字符串：返回 null
 */
export function renderIconNode(value: CcIconValue | null | undefined): VNode | null {
  if (!value) return null
  if (typeof value === 'string') {
    if (isIconifyName(value)) {
      return h(IconifyIcon, { icon: value })
    }
    return h('i', { class: value })
  }
  return value
}

/**
 * 录入组件后缀/清除/箭头图标的统一渲染：优先同名 slot，其次 prop（Iconify name /
 * CSS class / VNode），最后回退到内置 mdi 图标。集中 slot>prop>fallback 的优先级，
 * 避免在各组件里重复 `slots.x ? slots.x() : (renderIconNode(props.x) ?? renderIconNode(fallback))`。
 */
export function renderIconWithFallback(
  slot: Slot | undefined,
  value: CcIconValue | null | undefined,
  fallback: string,
): VNodeChild {
  if (slot) return slot()
  return renderIconNode(value) ?? renderIconNode(fallback)
}
