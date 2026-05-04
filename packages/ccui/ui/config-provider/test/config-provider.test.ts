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
})
