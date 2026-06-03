import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vite-plus/test'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Card } from '../../card'
import { BorderBeam, borderBeamPresetKeys, borderBeamPresets } from '../index'

const ns = useNamespace('border-beam', true)

describe('border-beam', () => {
  it('mount component', () => {
    const wrapper = mount(BorderBeam)
    expect(wrapper.classes()).toContain('ccui-border-beam')
  })

  it('renders default slot content', () => {
    const wrapper = mount(BorderBeam, {
      slots: {
        default: '<div class="content">Beam Content</div>',
      },
    })
    expect(wrapper.find('.content').exists()).toBeTruthy()
    expect(wrapper.find('.content').text()).toBe('Beam Content')
  })

  it('renders the effect layer', () => {
    const wrapper = mount(BorderBeam)
    expect(wrapper.find(ns.e('effect')).exists()).toBeTruthy()
  })

  it('marks the effect layer as decorative (aria-hidden)', () => {
    const wrapper = mount(BorderBeam)
    expect(wrapper.find(ns.e('effect')).attributes('aria-hidden')).toBe('true')
  })

  it('places the slot content before the effect layer in DOM order', () => {
    const wrapper = mount(BorderBeam, {
      slots: { default: '<span class="content">inner</span>' },
    })
    const root = wrapper.element
    // 内容在前、流光层作为最后一个子节点覆盖其上
    expect(root.querySelector('.content')).toBeTruthy()
    expect(root.lastElementChild?.classList.contains('ccui-border-beam__effect')).toBe(true)
  })

  it('wraps a ccui Card without swallowing it', () => {
    const wrapper = mount(BorderBeam, {
      slots: {
        default: () => h(Card, { header: '智能助手' }, () => '流光卡片'),
      },
    })
    expect(wrapper.find('.ccui-card').exists()).toBeTruthy()
    expect(wrapper.find('.ccui-card').text()).toContain('流光卡片')
    expect(wrapper.find(ns.e('effect')).exists()).toBeTruthy()
  })

  it('uses the theme default gradient (no inline gradient var) when color is omitted', () => {
    const wrapper = mount(BorderBeam)
    const style = wrapper.attributes('style') || ''
    expect(style).not.toContain('--ccui-bb-beam-gradient')
  })

  it('builds the beam gradient from a single color (mapped into the first 70%)', () => {
    const wrapper = mount(BorderBeam, {
      props: { color: '#ff0000' },
    })
    const style = wrapper.attributes('style') || ''
    expect(style).toContain('--ccui-bb-beam-gradient: linear-gradient(to left, #ff0000 0%, #ff0000 70%, transparent)')
  })

  it('builds the beam gradient from color stops scaled into the first 70%', () => {
    const wrapper = mount(BorderBeam, {
      props: {
        color: [
          { color: '#1677ff', percent: 0 },
          { color: '#36cfc9', percent: 52 },
          { color: '#95de64', percent: 100 },
        ],
      },
    })
    const style = wrapper.attributes('style') || ''
    // 0→0% / 52→36.4% / 100→70%，末尾补 transparent
    expect(style).toContain(
      '--ccui-bb-beam-gradient: linear-gradient(to left, #1677ff 0%, #36cfc9 36.4%, #95de64 70%, transparent)',
    )
  })

  it('fills the gradient end to 100% (mapped to 70%) when the last stop is below 100', () => {
    const wrapper = mount(BorderBeam, {
      props: {
        color: [
          { color: '#1677ff', percent: 0 },
          { color: '#95de64', percent: 40 },
        ],
      },
    })
    const style = wrapper.attributes('style') || ''
    // 末尾 #95de64 被补到 100%→70%
    expect(style).toContain(
      '--ccui-bb-beam-gradient: linear-gradient(to left, #1677ff 0%, #95de64 28%, #95de64 70%, transparent)',
    )
  })

  it('injects default css variables onto container', () => {
    const wrapper = mount(BorderBeam)
    const style = wrapper.attributes('style') || ''
    expect(style).toContain('--ccui-bb-outset: 0px')
    expect(style).toContain('--ccui-bb-border-width: 1px')
    expect(style).toContain('--ccui-bb-radius: 8px')
    expect(style).toContain('--ccui-bb-duration: 6s')
  })

  it('injects css variables from props onto container', () => {
    const wrapper = mount(BorderBeam, {
      props: {
        borderWidth: 2,
        borderRadius: 12,
        outset: 4,
        duration: 8,
      },
    })
    const style = wrapper.attributes('style') || ''
    expect(style).toContain('--ccui-bb-border-width: 2px')
    expect(style).toContain('--ccui-bb-radius: 12px')
    expect(style).toContain('--ccui-bb-outset: 4px')
    expect(style).toContain('--ccui-bb-duration: 8s')
  })

  it('accepts string outset as-is', () => {
    const wrapper = mount(BorderBeam, {
      props: { outset: '1rem' },
    })
    const style = wrapper.attributes('style') || ''
    expect(style).toContain('--ccui-bb-outset: 1rem')
  })

  describe('presets', () => {
    it('ships 6 built-in color presets in a stable order', () => {
      expect(borderBeamPresetKeys).toEqual(['ocean', 'sunset', 'aurora', 'forest', 'ember', 'nebula'])
    })

    it('each preset has a name and 3 gradient stops anchored at 0 and 100', () => {
      borderBeamPresetKeys.forEach((key) => {
        const preset = borderBeamPresets[key]
        expect(preset.name).toBeTruthy()
        expect(preset.color).toHaveLength(3)
        expect(preset.color[0].percent).toBe(0)
        expect(preset.color[preset.color.length - 1].percent).toBe(100)
      })
    })

    it('renders a preset color as a beam gradient', () => {
      const wrapper = mount(BorderBeam, {
        props: { color: borderBeamPresets.ocean.color },
      })
      const style = wrapper.attributes('style') || ''
      // ocean: #1677ff 0 / #36cfc9 52 / #95de64 100 → 映射进前 70%
      expect(style).toContain(
        '--ccui-bb-beam-gradient: linear-gradient(to left, #1677ff 0%, #36cfc9 36.4%, #95de64 70%, transparent)',
      )
    })
  })
})
