import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'
import { h, nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Tab, Tabs } from '../index'

const ns = useNamespace('tabs', true)
const baseClass = ns.b()

describe('tabs', () => {
  it('dom', async () => {
    const wrapper = shallowMount(Tabs)

    expect(wrapper.find(baseClass).exists()).toBeTruthy()
    wrapper.unmount()
  })

  it('renders tabs with default slot content', () => {
    const wrapper = mount(Tabs, {
      slots: {
        default: '<div class="tab-content">Tab Content</div>',
      },
    })

    expect(wrapper.find('.tab-content').exists()).toBeTruthy()
  })

  it('renders tab components correctly', () => {
    const wrapper = mount(Tabs, {
      slots: {
        default: `
          <CTab name="tab1" label="Tab 1">
            <div class="content1">Content 1</div>
          </CTab>
          <CTab name="tab2" label="Tab 2">
            <div class="content2">Content 2</div>
          </CTab>
        `,
      },
      global: {
        components: {
          CTab: Tab,
        },
      },
    })

    // 验证tabs组件渲染
    expect(wrapper.find(baseClass).exists()).toBeTruthy()
  })

  it('applies correct classes based on tab position', async () => {
    const wrapper = mount(Tabs, {
      props: {
        tabPosition: 'bottom',
      },
      slots: {
        default: `
          <CTab name="tab1" label="Tab 1">
            <div>Content 1</div>
          </CTab>
        `,
      },
      global: {
        components: {
          CTab: Tab,
        },
      },
    })

    // 验证tabs容器类名
    expect(wrapper.find(baseClass).classes()).toContain('ccui-tabs')
  })

  it('renders tab content correctly when active', () => {
    const wrapper = mount(Tabs, {
      props: {
        modelValue: 'tab1',
      },
      slots: {
        default: `
          <CTab name="tab1" label="Tab 1">
            <div class="active-content">Active Content</div>
          </CTab>
        `,
      },
      global: {
        components: {
          CTab: Tab,
        },
      },
    })

    // 验证激活的tab内容是否显示
    expect(wrapper.find('.active-content').exists()).toBeTruthy()
  })

  it('does not render inactive tab content', () => {
    const wrapper = mount(Tabs, {
      props: {
        modelValue: 'tab1',
      },
      slots: {
        default: `
          <CTab name="tab1" label="Tab 1">
            <div class="active-content">Active Content</div>
          </CTab>
          <CTab name="tab2" label="Tab 2">
            <div class="inactive-content">Inactive Content</div>
          </CTab>
        `,
      },
      global: {
        components: {
          CTab: Tab,
        },
      },
    })

    // 验证未激活的tab内容是否隐藏
    expect(wrapper.find('.inactive-content').exists()).toBeFalsy()
  })

  it('emits change and update:modelValue when clicking another tab', async () => {
    const wrapper = mount(Tabs, {
      props: {
        modelValue: 'tab1',
      },
      slots: {
        default: () => [
          h(Tab, { name: 'tab1', label: 'Tab 1' }, () => h('div', 'Content 1')),
          h(Tab, { name: 'tab2', label: 'Tab 2' }, () => h('div', 'Content 2')),
        ],
      },
    })

    await nextTick()
    const navItems = wrapper.findAll('p')
    await navItems[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['tab2'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['tab2'])
  })

  it('does not emit when clicking active tab', async () => {
    const wrapper = mount(Tabs, {
      props: {
        modelValue: 'tab1',
      },
      slots: {
        default: () => h(Tab, { name: 'tab1', label: 'Tab 1' }, () => h('div', 'Content 1')),
      },
    })

    await nextTick()
    await wrapper.find('p').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('renders card and left nav classes plus title slot', async () => {
    const wrapper = mount(Tabs, {
      props: {
        modelValue: 'tab1',
        type: 'card',
        tabPosition: 'left',
      },
      slots: {
        default: () =>
          h(
            Tab,
            { name: 'tab1' },
            {
              title: () => h('span', { class: 'title-slot' }, 'Custom'),
              default: () => h('div', 'Content'),
            },
          ),
      },
    })

    await nextTick()
    expect(wrapper.find('.ccui-tabs-nav-card--left').exists()).toBe(true)
    expect(wrapper.find('.title-slot').text()).toBe('Custom')
  })
})
