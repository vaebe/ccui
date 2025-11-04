import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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
})
