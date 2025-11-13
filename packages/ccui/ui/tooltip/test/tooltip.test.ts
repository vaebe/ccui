import { mount, shallowMount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { Tooltip } from '../index'

describe('tooltip', () => {
  let wrapper: any

  beforeEach(() => {
    // 模拟 DOM 环境
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    })
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    vi.clearAllTimers()
  })

  describe('基础功能', () => {
    it('应该正确渲染组件', () => {
      wrapper = shallowMount(Tooltip, {
        props: {
          content: 'Test tooltip',
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.ccui-tooltip').exists()).toBe(true)
      expect(wrapper.find('.ccui-tooltip__trigger').exists()).toBe(true)
    })

    it('应该正确显示内容', async () => {
      wrapper = mount(Tooltip, {
        props: {
          content: 'Test tooltip content',
          visible: true,
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })

      await nextTick()
      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(true)
      expect(wrapper.find('.ccui-tooltip__content').text()).toBe('Test tooltip content')
    })

    it('应该支持插槽内容', async () => {
      wrapper = mount(Tooltip, {
        props: {
          visible: true,
        },
        slots: {
          default: '<button>Trigger</button>',
          content: '<div class="custom-content">Custom content</div>',
        },
      })

      await nextTick()
      expect(wrapper.find('.custom-content').exists()).toBe(true)
      expect(wrapper.find('.custom-content').text()).toBe('Custom content')
    })

    it('应该支持 HTML 内容', async () => {
      wrapper = mount(Tooltip, {
        props: {
          content: '<strong>Bold text</strong>',
          rawContent: true,
          visible: true,
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })

      await nextTick()
      expect(wrapper.find('.ccui-tooltip__content strong').exists()).toBe(true)
    })
  })

  describe('主题和样式', () => {
    it('应该正确应用 dark 主题', async () => {
      wrapper = mount(Tooltip, {
        props: {
          content: 'Test',
          effect: 'dark',
          visible: true,
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })

      await nextTick()
      expect(wrapper.find('.ccui-tooltip__popper--dark').exists()).toBe(true)
    })

    it('应该正确应用 light 主题', async () => {
      wrapper = mount(Tooltip, {
        props: {
          content: 'Test',
          effect: 'light',
          visible: true,
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })

      await nextTick()
      expect(wrapper.find('.ccui-tooltip__popper--light').exists()).toBe(true)
    })

    it('应该正确应用位置样式', async () => {
      const placements = ['top', 'bottom', 'left', 'right']

      for (const placement of placements) {
        wrapper = mount(Tooltip, {
          props: {
            content: 'Test',
            placement: placement as any,
            visible: true,
          },
          slots: {
            default: '<button>Trigger</button>',
          },
        })

        await nextTick()
        expect(wrapper.find(`.ccui-tooltip__popper--${placement}`).exists()).toBe(true)
        wrapper.unmount()
      }
    })

    it('应该显示箭头', async () => {
      wrapper = mount(Tooltip, {
        props: {
          content: 'Test',
          showArrow: true,
          visible: true,
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })

      await nextTick()
      expect(wrapper.find('.ccui-tooltip__arrow').exists()).toBe(true)
    })

    it('应该隐藏箭头', async () => {
      wrapper = mount(Tooltip, {
        props: {
          content: 'Test',
          showArrow: false,
          visible: true,
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })

      await nextTick()
      expect(wrapper.find('.ccui-tooltip__arrow').exists()).toBe(false)
    })
  })

  describe('交互功能', () => {
    it('应该在鼠标悬停时显示', async () => {
      wrapper = mount(Tooltip, {
        props: {
          content: 'Test',
          trigger: 'hover',
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })

      const trigger = wrapper.find('.ccui-tooltip__trigger')
      await trigger.trigger('mouseenter')
      await nextTick()

      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(true)
    })

    it('应该在鼠标离开时隐藏', async () => {
      wrapper = mount(Tooltip, {
        props: {
          content: 'Test',
          trigger: 'hover',
          hideAfter: 0,
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })

      const trigger = wrapper.find('.ccui-tooltip__trigger')
      await trigger.trigger('mouseenter')
      await nextTick()

      await trigger.trigger('mouseleave')
      await nextTick()

      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(false)
    })

    it('应该在点击时切换显示状态', async () => {
      wrapper = mount(Tooltip, {
        props: {
          content: 'Test',
          trigger: 'click',
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })

      const trigger = wrapper.find('.ccui-tooltip__trigger')

      // 第一次点击显示
      await trigger.trigger('click')
      await nextTick()
      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(true)

      // 第二次点击隐藏
      await trigger.trigger('click')
      await nextTick()
      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(false)
    })

    it('应该在获得焦点时显示', async () => {
      wrapper = mount(Tooltip, {
        props: {
          content: 'Test',
          trigger: 'focus',
        },
        slots: {
          default: '<input type="text" />',
        },
      })

      const trigger = wrapper.find('.ccui-tooltip__trigger')
      await trigger.trigger('focus')
      await nextTick()

      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(true)
    })

    it('应该在失去焦点时隐藏', async () => {
      wrapper = mount(Tooltip, {
        props: {
          content: 'Test',
          trigger: 'focus',
          hideAfter: 0,
        },
        slots: {
          default: '<input type="text" />',
        },
      })

      const trigger = wrapper.find('.ccui-tooltip__trigger')
      await trigger.trigger('focus')
      await nextTick()

      await trigger.trigger('blur')
      await nextTick()

      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(false)
    })
  })

  describe('禁用状态', () => {
    it('禁用时不应该显示', async () => {
      wrapper = mount(Tooltip, {
        props: {
          content: 'Test',
          disabled: true,
          trigger: 'hover',
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })

      const trigger = wrapper.find('.ccui-tooltip__trigger')
      await trigger.trigger('mouseenter')
      await nextTick()

      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(false)
    })
  })

  describe('延迟功能', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('应该支持延迟显示', async () => {
      wrapper = mount(Tooltip, {
        props: {
          content: 'Test',
          trigger: 'hover',
          showAfter: 100,
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })

      const trigger = wrapper.find('.ccui-tooltip__trigger')
      await trigger.trigger('mouseenter')
      await nextTick()

      // 延迟前不应该显示
      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(false)

      // 等待延迟时间
      vi.advanceTimersByTime(100)
      await nextTick()

      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(true)
    })

    it('应该支持延迟隐藏', async () => {
      wrapper = mount(Tooltip, {
        props: {
          content: 'Test',
          trigger: 'hover',
          hideAfter: 100,
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })

      const trigger = wrapper.find('.ccui-tooltip__trigger')
      await trigger.trigger('mouseenter')
      await nextTick()

      // 先显示
      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(true)

      await trigger.trigger('mouseleave')
      await nextTick()

      // 延迟前仍然显示
      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(true)

      // 等待延迟时间
      vi.advanceTimersByTime(100)
      await nextTick()

      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(false)
    })
  })

  describe('事件触发', () => {
    it('应该触发 before-show 事件', async () => {
      const beforeShow = vi.fn()
      wrapper = mount(Tooltip, {
        props: {
          'content': 'Test',
          'trigger': 'hover',
          'onBefore-show': beforeShow,
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })

      const trigger = wrapper.find('.ccui-tooltip__trigger')
      await trigger.trigger('mouseenter')
      await nextTick()

      expect(beforeShow).toHaveBeenCalled()
    })

    it('应该触发 show 事件', async () => {
      const show = vi.fn()
      wrapper = mount(Tooltip, {
        props: {
          content: 'Test',
          trigger: 'hover',
          onShow: show,
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })

      const trigger = wrapper.find('.ccui-tooltip__trigger')
      await trigger.trigger('mouseenter')
      await nextTick()

      expect(show).toHaveBeenCalled()
    })

    it('应该触发 before-hide 事件', async () => {
      const beforeHide = vi.fn()
      wrapper = mount(Tooltip, {
        props: {
          'content': 'Test',
          'trigger': 'hover',
          'hideAfter': 0,
          'onBefore-hide': beforeHide,
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })

      const trigger = wrapper.find('.ccui-tooltip__trigger')
      await trigger.trigger('mouseenter')
      await nextTick()
      await trigger.trigger('mouseleave')
      await nextTick()

      expect(beforeHide).toHaveBeenCalled()
    })

    it('应该触发 hide 事件', async () => {
      const hide = vi.fn()
      wrapper = mount(Tooltip, {
        props: {
          content: 'Test',
          trigger: 'hover',
          hideAfter: 0,
          onHide: hide,
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })

      const trigger = wrapper.find('.ccui-tooltip__trigger')
      await trigger.trigger('mouseenter')
      await nextTick()
      await trigger.trigger('mouseleave')
      await nextTick()

      expect(hide).toHaveBeenCalled()
    })
  })

  describe('可访问性', () => {
    it('应该设置正确的 ARIA 属性', async () => {
      wrapper = mount(Tooltip, {
        props: {
          content: 'Test',
          ariaLabel: 'Test tooltip',
          visible: true,
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })

      await nextTick()
      const trigger = wrapper.find('.ccui-tooltip__trigger')
      const popper = wrapper.find('.ccui-tooltip__popper')

      expect(trigger.attributes('aria-label')).toBe('Test tooltip')
      expect(trigger.attributes('aria-describedby')).toBe('ccui-tooltip__popper')
      expect(popper.attributes('role')).toBe('tooltip')
    })
  })
})
