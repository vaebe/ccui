import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { CardMeta } from '../index'

const ns = useNamespace('card-meta', true)

describe('card-meta', () => {
  it('挂载基础 DOM', () => {
    const wrapper = mount(CardMeta, { props: { title: 't', description: 'd' } })
    expect(wrapper.find(ns.b()).exists()).toBe(true)
    expect(wrapper.find(ns.e('detail')).exists()).toBe(true)
  })

  it('title prop 渲染', () => {
    const wrapper = mount(CardMeta, { props: { title: '标题' } })
    expect(wrapper.find(ns.e('title')).text()).toBe('标题')
  })

  it('description prop 渲染', () => {
    const wrapper = mount(CardMeta, { props: { description: '描述' } })
    expect(wrapper.find(ns.e('description')).text()).toBe('描述')
  })

  it('title slot 优先于 prop', () => {
    const wrapper = mount(CardMeta, {
      props: { title: 'fallback' },
      slots: { title: '<span class="t">自定义标题</span>' },
    })
    expect(wrapper.find('.t').exists()).toBe(true)
    expect(wrapper.find(ns.e('title')).text()).toBe('自定义标题')
  })

  it('description slot 优先于 prop', () => {
    const wrapper = mount(CardMeta, {
      props: { description: 'fallback' },
      slots: { description: '<span class="d">自定义描述</span>' },
    })
    expect(wrapper.find('.d').exists()).toBe(true)
  })

  it('avatar slot 渲染于左侧', () => {
    const wrapper = mount(CardMeta, {
      props: { title: 't' },
      slots: { avatar: '<img class="my-avatar" />' },
    })
    expect(wrapper.find(ns.e('avatar')).exists()).toBe(true)
    expect(wrapper.find('.my-avatar').exists()).toBe(true)
  })

  it('未传任何 title / description 时仍渲染容器但无文字节点', () => {
    const wrapper = mount(CardMeta)
    expect(wrapper.find(ns.b()).exists()).toBe(true)
    expect(wrapper.find(ns.e('title')).exists()).toBe(false)
    expect(wrapper.find(ns.e('description')).exists()).toBe(false)
  })
})
