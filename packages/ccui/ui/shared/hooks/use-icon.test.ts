import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'
import { Icon as IconifyIcon } from '@iconify/vue'
import { defineComponent, h, isVNode } from 'vue'
import { renderIconNode } from './use-icon'

function renderInWrapper(value: any) {
  const Comp = defineComponent({
    setup: () => () => h('div', { class: 'wrap' }, [renderIconNode(value)]),
  })
  return mount(Comp)
}

describe('renderIconNode', () => {
  it('Iconify name（含 `:`）返回 IconifyIcon VNode 且 icon prop 透传', () => {
    const node = renderIconNode('mdi:close')
    expect(isVNode(node)).toBe(true)
    expect(node?.type).toBe(IconifyIcon)
    expect((node?.props as any)?.icon).toBe('mdi:close')
  })

  it('CSS 类名（不含 `:`）渲染为 <i class="...">', () => {
    const w = renderInWrapper('my-icon-class')
    expect(w.find('i.my-icon-class').exists()).toBe(true)
    w.unmount()
  })

  it('VNode 直接返回', () => {
    const vnode = h('svg', { class: 'custom-svg' }, [])
    const w = renderInWrapper(vnode)
    expect(w.find('svg.custom-svg').exists()).toBe(true)
    w.unmount()
  })

  it('undefined / null / 空字符串 返回 null', () => {
    expect(renderIconNode(undefined)).toBeNull()
    expect(renderIconNode(null)).toBeNull()
    expect(renderIconNode('')).toBeNull()
  })
})
