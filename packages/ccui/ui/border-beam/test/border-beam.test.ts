import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vite-plus/test'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Card } from '../../card'
import { BorderBeam, borderBeamPresetKeys, borderBeamPresets } from '../index'

const ns = useNamespace('border-beam', true)

describe('border-beam', () => {
  it('mount component', () => {
    const wrapper = mount(BorderBeam)
    expect(wrapper.classes()).toContain('ccui-border-beam')
  })

  it('forwards root attrs without replacing generated CSS variables', () => {
    const wrapper = mount(BorderBeam, {
      attrs: { id: 'beam', 'aria-label': 'decorative border' },
    })
    expect(wrapper.attributes('id')).toBe('beam')
    expect(wrapper.attributes('aria-label')).toBe('decorative border')
    expect(wrapper.attributes('style')).toContain('--ccui-bb-duration: 6s')
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
    expect(style).toContain('--ccui-bb-size: 100px')
    expect(style).toContain('--ccui-bb-duration: 6s')
  })

  it('injects css variables from props onto container', () => {
    const wrapper = mount(BorderBeam, {
      props: {
        borderWidth: 2,
        borderRadius: 12,
        outset: 4,
        size: 40,
        duration: 8,
      },
    })
    const style = wrapper.attributes('style') || ''
    expect(style).toContain('--ccui-bb-border-width: 2px')
    expect(style).toContain('--ccui-bb-radius: 12px')
    expect(style).toContain('--ccui-bb-outset: 4px')
    expect(style).toContain('--ccui-bb-size: 40px')
    expect(style).toContain('--ccui-bb-duration: 8s')
  })

  it('accepts string outset as-is', () => {
    const wrapper = mount(BorderBeam, {
      props: { outset: '1rem' },
    })
    const style = wrapper.attributes('style') || ''
    expect(style).toContain('--ccui-bb-outset: 1rem')
  })

  it('accepts string size as-is', () => {
    const wrapper = mount(BorderBeam, {
      props: { size: '3rem' },
    })
    const style = wrapper.attributes('style') || ''
    expect(style).toContain('--ccui-bb-size: 3rem')
  })

  it('accepts CSS lengths for border width and non-uniform radius', () => {
    const wrapper = mount(BorderBeam, {
      props: { borderWidth: '0.125rem', borderRadius: '20px 20px 0 0' },
    })
    const style = wrapper.attributes('style') || ''
    expect(style).toContain('--ccui-bb-border-width: 0.125rem')
    expect(style).toContain('--ccui-bb-radius: 20px 20px 0 0')
  })

  it('renders multiple beams with evenly distributed negative delays', () => {
    const wrapper = mount(BorderBeam, { props: { count: 3, duration: 6 } })
    const effects = wrapper.findAll(ns.e('effect'))
    expect(effects).toHaveLength(3)
    expect(effects[0].attributes('style')).toContain('--ccui-bb-delay: 0s')
    expect(effects[1].attributes('style')).toContain('--ccui-bb-delay: -2s')
    expect(effects[2].attributes('style')).toContain('--ccui-bb-delay: -4s')
  })

  it('normalizes invalid count, duration and numeric lengths', () => {
    const wrapper = mount(BorderBeam, {
      props: {
        count: Number.NaN,
        duration: 0,
        borderWidth: -1,
        borderRadius: Number.NaN,
        size: -10,
      },
    })
    expect(wrapper.findAll(ns.e('effect'))).toHaveLength(1)
    const style = wrapper.attributes('style') || ''
    expect(style).toContain('--ccui-bb-duration: 6s')
    expect(style).toContain('--ccui-bb-border-width: 1px')
    expect(style).toContain('--ccui-bb-radius: 8px')
    expect(style).toContain('--ccui-bb-size: 100px')
    expect(style).not.toContain('NaN')
  })

  describe('asChild', () => {
    it('mounts effects into the single native child and forwards attrs', async () => {
      const wrapper = mount(BorderBeam, {
        attachTo: document.body,
        attrs: { id: 'beam-host' },
        props: { asChild: true, count: 2 },
        slots: {
          default: () =>
            h(
              'section',
              {
                class: 'host',
                style:
                  'position: relative; border-style: solid; border-width: 2px 3px 4px 5px; border-radius: 20px 20px 0 0',
              },
              'Beam content',
            ),
        },
      })
      await nextTick()

      const host = wrapper.find('.host')
      expect(host.attributes('id')).toBe('beam-host')
      expect(wrapper.find('.ccui-border-beam').exists()).toBe(false)
      expect(host.findAll(ns.e('effect'))).toHaveLength(2)
      expect(host.find(ns.em('effect', 'child')).attributes('style')).toContain(
        '--ccui-bb-inset-offset: -2px -3px -4px -5px',
      )
      expect(host.find(ns.e('effect')).attributes('style')).not.toContain('--ccui-bb-radius')
      wrapper.unmount()
    })

    it('uses explicit outset and radius instead of inferred geometry', async () => {
      const wrapper = mount(BorderBeam, {
        props: { asChild: true, outset: '0.5rem', borderRadius: '12px 12px 0 0' },
        slots: { default: () => h('div', { class: 'host', style: 'position: relative' }) },
      })
      await nextTick()

      const style = wrapper.find(ns.e('effect')).attributes('style')
      expect(style).toContain('--ccui-bb-inset-offset: calc(-1 * 0.5rem)')
      expect(style).toContain('--ccui-bb-radius: 12px 12px 0 0')
    })

    it('falls back from an invalid numeric outset without emitting NaN', async () => {
      const wrapper = mount(BorderBeam, {
        props: { asChild: true, outset: Number.NaN },
        slots: { default: () => h('div', { class: 'host', style: 'position: relative' }) },
      })
      await nextTick()

      const style = wrapper.find(ns.e('effect')).attributes('style')
      expect(style).toContain('--ccui-bb-inset-offset: 0px')
      expect(style).not.toContain('NaN')
    })

    it('supports a component with a single HTMLElement root', async () => {
      const wrapper = mount(BorderBeam, {
        props: { asChild: true },
        slots: { default: () => h(Card, { class: 'host', header: '卡片' }, () => '内容') },
      })
      await nextTick()

      expect(wrapper.find('.ccui-card.host').exists()).toBe(true)
      expect(wrapper.find('.ccui-card.host').find(ns.e('effect')).exists()).toBe(true)
    })

    it('refreshes inferred border widths after host style mutations', async () => {
      let widths = ['1px', '1px', '1px', '1px']
      let mutationCallback: MutationCallback | undefined
      class MutationObserverMock {
        constructor(callback: MutationCallback) {
          mutationCallback = callback
        }

        /** 测试只需捕获回调，宿主样式读取由 getComputedStyle mock 控制。 */
        observe(): void {}

        /** 与浏览器接口一致，组件卸载时可安全清理观察器。 */
        disconnect(): void {}
      }
      vi.stubGlobal('MutationObserver', MutationObserverMock)
      const computedStyle = vi.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            borderTopWidth: widths[0],
            borderRightWidth: widths[1],
            borderBottomWidth: widths[2],
            borderLeftWidth: widths[3],
          }) as CSSStyleDeclaration,
      )

      const wrapper = mount(BorderBeam, {
        props: { asChild: true },
        slots: {
          default: () =>
            h('div', {
              class: 'host',
              style: 'position: relative; border-style: solid; border-width: 1px',
            }),
        },
      })
      await nextTick()
      expect(wrapper.find(ns.e('effect')).attributes('style')).toContain('--ccui-bb-inset-offset: -1px -1px -1px -1px')

      widths = ['4px', '3px', '2px', '1px']
      mutationCallback?.([], {} as MutationObserver)
      await nextTick()
      expect(wrapper.find(ns.e('effect')).attributes('style')).toContain('--ccui-bb-inset-offset: -4px -3px -2px -1px')

      wrapper.unmount()
      computedStyle.mockRestore()
      vi.unstubAllGlobals()
    })

    it('warns and renders no effect for multiple children', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
      const wrapper = mount(BorderBeam, {
        props: { asChild: true },
        slots: { default: () => [h('div', 'one'), h('div', 'two')] },
      })

      expect(wrapper.find(ns.e('effect')).exists()).toBe(false)
      expect(warn).toHaveBeenCalledWith('[ccui BorderBeam] asChild 需要唯一的元素或单根组件插槽。')
      warn.mockRestore()
    })

    it('warns and renders no effect when the child root is not an HTMLElement', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
      const wrapper = mount(BorderBeam, {
        props: { asChild: true },
        slots: { default: () => h('svg', { class: 'host', viewBox: '0 0 10 10' }) },
      })
      await nextTick()

      expect(wrapper.find(ns.e('effect')).exists()).toBe(false)
      expect(warn).toHaveBeenCalledWith('[ccui BorderBeam] asChild 的插槽根节点必须渲染为 HTMLElement。')
      warn.mockRestore()
    })
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
