import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { ListItemMeta } from '../index'

// 共享 list 命名空间（与 ListItem 内嵌 meta 一致）
const ns = useNamespace('list', true)

describe('list-item-meta', () => {
  it('挂载 item-inner + item-main 基本骨架', () => {
    const wrapper = mount(ListItemMeta, { props: { title: 't' } })
    expect(wrapper.find(ns.e('item-inner')).exists()).toBe(true)
    expect(wrapper.find(ns.e('item-main')).exists()).toBe(true)
  })

  it('title prop 渲染到 h4', () => {
    const wrapper = mount(ListItemMeta, { props: { title: '标题' } })
    expect(wrapper.find(ns.e('item-title')).text()).toBe('标题')
    expect(wrapper.find(ns.e('item-title')).element.tagName).toBe('H4')
  })

  it('description prop 渲染', () => {
    const wrapper = mount(ListItemMeta, { props: { description: '描述' } })
    expect(wrapper.find(ns.e('item-desc')).text()).toBe('描述')
  })

  it('title slot 优先于 prop', () => {
    const wrapper = mount(ListItemMeta, {
      props: { title: 'fallback' },
      slots: { title: '<b class="custom-t">真</b>' },
    })
    expect(wrapper.find('.custom-t').exists()).toBe(true)
  })

  it('description slot 优先于 prop', () => {
    const wrapper = mount(ListItemMeta, {
      props: { description: 'fallback' },
      slots: { description: '<i class="custom-d">desc</i>' },
    })
    expect(wrapper.find('.custom-d').exists()).toBe(true)
  })

  it('avatar slot 渲染于左侧 item-avatar', () => {
    const wrapper = mount(ListItemMeta, {
      props: { title: 't' },
      slots: { avatar: '<img class="my-av" />' },
    })
    expect(wrapper.find(ns.e('item-avatar')).exists()).toBe(true)
    expect(wrapper.find('.my-av').exists()).toBe(true)
  })

  it('未传任何 title / description 时不渲染 item-meta 容器', () => {
    const wrapper = mount(ListItemMeta)
    expect(wrapper.find(ns.e('item-meta')).exists()).toBe(false)
  })

  it('默认 slot 渲染于 item-main 内（meta 之后）', () => {
    const wrapper = mount(ListItemMeta, {
      props: { title: 't' },
      slots: { default: '<p class="my-p">额外内容</p>' },
    })
    expect(wrapper.find('.my-p').exists()).toBe(true)
  })
})
