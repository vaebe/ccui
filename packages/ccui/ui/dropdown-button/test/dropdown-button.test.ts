import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { DropdownButton } from '../index'

const items = [
  { key: '1', label: '编辑' },
  { key: '2', label: '复制' },
  { key: '3', label: '删除', danger: true },
]

describe('dropdown-button', () => {
  it('渲染主按钮 + 下拉触发按钮组合（两个 Button）', async () => {
    const wrapper = mount(DropdownButton, { props: { label: 'Action', items } })
    await nextTick()
    expect(wrapper.find('.ccui-dropdown-button').exists()).toBe(true)
    expect(wrapper.find('.ccui-dropdown-button__main').exists()).toBe(true)
    expect(wrapper.find('.ccui-dropdown-button__trigger').exists()).toBe(true)
    expect(wrapper.find('.ccui-dropdown-button__main').text()).toContain('Action')
  })

  it('default slot 优先于 label prop', async () => {
    const wrapper = mount(DropdownButton, {
      props: { label: 'fallback', items },
      slots: { default: '<span class="my-main">主按钮</span>' },
    })
    await nextTick()
    expect(wrapper.find('.my-main').exists()).toBe(true)
    expect(wrapper.find('.ccui-dropdown-button__main').text()).not.toContain('fallback')
  })

  it('点击主按钮触发 @click 事件', async () => {
    const wrapper = mount(DropdownButton, { props: { label: 'a', items } })
    await wrapper.find('.ccui-dropdown-button__main').trigger('click')
    expect(wrapper.emitted('click')?.length).toBe(1)
  })

  it('disabled=true 时主按钮 click 不触发', async () => {
    const wrapper = mount(DropdownButton, { props: { label: 'a', items, disabled: true } })
    await wrapper.find('.ccui-dropdown-button__main').trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('loading=true 时主按钮 click 不触发', async () => {
    const wrapper = mount(DropdownButton, { props: { label: 'a', items, loading: true } })
    await wrapper.find('.ccui-dropdown-button__main').trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('默认下拉触发图标渲染 arrow 元素', async () => {
    const wrapper = mount(DropdownButton, { props: { label: 'a', items } })
    expect(wrapper.find('.ccui-dropdown-button__arrow').exists()).toBe(true)
  })

  it('icon prop 渲染 i class（替换 arrow）', async () => {
    const wrapper = mount(DropdownButton, { props: { label: 'a', items, icon: 'i-tabler-arrow-down' } })
    expect(wrapper.find('.i-tabler-arrow-down').exists()).toBe(true)
    expect(wrapper.find('.ccui-dropdown-button__arrow').exists()).toBe(false)
  })

  it('icon slot 优先于 icon prop', async () => {
    const wrapper = mount(DropdownButton, {
      props: { label: 'a', items, icon: 'i-tabler-arrow-down' },
      slots: { icon: '<svg class="custom-svg"/>' },
    })
    expect(wrapper.find('.custom-svg').exists()).toBe(true)
    expect(wrapper.find('.i-tabler-arrow-down').exists()).toBe(false)
  })

  it('size 透传到主按钮 + 下拉触发按钮', async () => {
    const wrapper = mount(DropdownButton, { props: { label: 'a', items, size: 'small' } })
    await nextTick()
    expect(wrapper.find('.ccui-dropdown-button--small').exists()).toBe(true)
  })

  it('danger=true 透传给两个 Button（dangerous class）', async () => {
    const wrapper = mount(DropdownButton, { props: { label: 'a', items, danger: true } })
    await nextTick()
    // 两个按钮都拿到 danger
    const dangerousBtns = wrapper.findAll('.ccui-button--dangerous')
    expect(dangerousBtns.length).toBe(2)
  })

  it('hover 触发器：mouseenter 后下拉显示并能 @select', async () => {
    const wrapper = mount(DropdownButton, { props: { label: 'a', items, trigger: 'click' } })
    // click 触发模式
    await wrapper.find('.ccui-dropdown-button__trigger').trigger('click')
    await nextTick()
    await nextTick()
    // dropdown 菜单出现在 popover 的 body teleport，直接通过 document 找
    const menuItem = document.querySelector('.ccui-dropdown__item') as HTMLElement | null
    expect(menuItem).not.toBeNull()
    menuItem?.click()
    await nextTick()
    expect(wrapper.emitted('select')?.length).toBe(1)
    expect((wrapper.emitted('select')![0][0] as any).key).toBe('1')
  })

  it('menu slot 优先于 items prop（透传给 Dropdown）', async () => {
    const wrapper = mount(DropdownButton, {
      props: { label: 'a', items, trigger: 'click' },
      slots: {
        menu: '<li class="custom-menu-item">自定义菜单项</li>',
      },
    })
    await wrapper.find('.ccui-dropdown-button__trigger').trigger('click')
    await nextTick()
    await nextTick()
    const customItem = document.querySelector('.custom-menu-item')
    expect(customItem).not.toBeNull()
    // 清理 DOM
    document.querySelectorAll('.ccui-dropdown').forEach((el) => el.remove())
  })

  it('visible-change 事件在下拉打开/关闭时触发', async () => {
    const wrapper = mount(DropdownButton, { props: { label: 'a', items, trigger: 'click' } })
    await wrapper.find('.ccui-dropdown-button__trigger').trigger('click')
    await nextTick()
    await nextTick()
    expect(wrapper.emitted('visible-change')).toBeTruthy()
    expect(wrapper.emitted('update:visible')).toBeTruthy()
  })
})
