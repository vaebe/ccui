import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { ConfigProvider, useConfig } from '../index'

const ConsumerComp = defineComponent({
  name: 'TestConsumer',
  setup() {
    const cfg = useConfig()
    return () => h('div', { 'data-testid': 'consumer' }, JSON.stringify(cfg))
  },
})

describe('configProvider', () => {
  it('provides default config to descendants', () => {
    const wrapper = mount({
      components: { ConfigProvider, ConsumerComp },
      template: `<ConfigProvider><ConsumerComp /></ConfigProvider>`,
    })
    const txt = wrapper.find('[data-testid="consumer"]').text()
    expect(txt).toContain('"prefixCls":"ccui"')
    expect(txt).toContain('"componentSize":"middle"')
  })

  it('overrides componentSize via props', () => {
    const wrapper = mount({
      components: { ConfigProvider, ConsumerComp },
      template: `<ConfigProvider component-size="small"><ConsumerComp /></ConfigProvider>`,
    })
    expect(wrapper.find('[data-testid="consumer"]').text()).toContain('"componentSize":"small"')
  })

  it('applies theme tokens as CSS variables', () => {
    const wrapper = mount(ConfigProvider, {
      props: { theme: { token: { colorPrimary: '#ff0000' } } },
      slots: { default: '<span>x</span>' },
    })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('--ccui-color-primary')
    expect(style.toLowerCase()).toContain('#ff0000')
  })

  it('sets dir attribute for rtl', () => {
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: { default: 'x' },
    })
    expect(wrapper.attributes('dir')).toBe('rtl')
  })

  it('algorithm="dark" 在 wrapper 上加 .dark 类', () => {
    const wrapper = mount(ConfigProvider, {
      props: { theme: { algorithm: 'dark' } },
      slots: { default: 'x' },
    })
    expect(wrapper.classes()).toContain('dark')
  })

  it('algorithm="default" 不加 .dark 类', () => {
    const wrapper = mount(ConfigProvider, {
      props: { theme: { algorithm: 'default' } },
      slots: { default: 'x' },
    })
    expect(wrapper.classes()).not.toContain('dark')
  })

  it('algorithm="compact" 注入紧凑尺寸 CSS 变量', () => {
    const wrapper = mount(ConfigProvider, {
      props: { theme: { algorithm: 'compact' } },
      slots: { default: 'x' },
    })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('--ccui-control-height: 24px')
    expect(style).toContain('--ccui-padding: 12px')
  })

  it('algorithm="compact" 与 token 同传时，用户 token 优先级更高', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        theme: {
          algorithm: 'compact',
          // 用户显式覆盖 controlHeight，应胜过 compact 的默认 24px
          token: { controlHeight: '20px' },
        },
      },
      slots: { default: 'x' },
    })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('--ccui-control-height: 20px')
  })

  it('locale namespace 默认填 zhCN，user 部分覆盖时 namespace 内浅合并', () => {
    const Consumer = defineComponent({
      setup() {
        const cfg = useConfig()
        return () => h('div', { 'data-testid': 'c' }, JSON.stringify(cfg.locale))
      },
    })
    const wrapper = mount({
      components: { ConfigProvider, Consumer },
      template: `<ConfigProvider :locale="{ locale: 'custom', Modal: { okText: '是' } }"><Consumer /></ConfigProvider>`,
    })
    const txt = wrapper.find('[data-testid="c"]').text()
    // user 覆盖的 okText 生效
    expect(txt).toContain('"okText":"是"')
    // 没覆盖的 cancelText 回退 zhCN '取 消'
    expect(txt).toContain('"cancelText":"取 消"')
    // 没覆盖的 namespace（Empty）整体回退 zhCN
    expect(txt).toContain('"description":"暂无数据"')
  })
})
