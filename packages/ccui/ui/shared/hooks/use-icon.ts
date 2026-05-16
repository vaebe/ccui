import type { VNode } from 'vue'
import { Icon as IconifyIcon } from '@iconify/vue'
import { h } from 'vue'

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
