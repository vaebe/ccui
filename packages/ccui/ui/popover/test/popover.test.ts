import { mount, shallowMount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { Popover } from '../index'

describe('popover', () => {
  let wrapper: any

  beforeEach(() => {
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
    it('正确渲染组件', () => {
      wrapper = shallowMount(Popover, {
        slots: {
          default: '<button>Trigger</button>',
        },
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.ccui-popover').exists()).toBe(true)
      expect(wrapper.find('.ccui-popover__trigger').exists()).toBe(true)
    })

    it('显示内容与标题', async () => {
      wrapper = mount(Popover, {
        props: {
          title: 'Title',
          content: 'Popover content',
          visible: true,
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(true)
      expect(wrapper.find('.ccui-popover__header').text()).toBe('Title')
      expect(wrapper.find('.ccui-popover__content').text()).toBe('Popover content')
    })

    it('支持插槽内容', async () => {
      wrapper = mount(Popover, {
        props: {
          visible: true,
        },
        slots: {
          default: '<button>Trigger</button>',
          title: '<div class="custom-title">Custom Title</div>',
          content: '<div class="custom-content">Custom content</div>',
        },
      })
      await nextTick()
      expect(wrapper.find('.custom-title').exists()).toBe(true)
      expect(wrapper.find('.custom-content').exists()).toBe(true)
    })

    it('支持 HTML 内容', async () => {
      wrapper = mount(Popover, {
        props: {
          content: '<strong>Bold</strong>',
          rawContent: true,
          visible: true,
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })
      await nextTick()
      expect(wrapper.find('.ccui-popover__content strong').exists()).toBe(true)
    })

    it('支持设置宽度', async () => {
      wrapper = mount(Popover, {
        props: {
          content: 'W',
          width: '200px',
          visible: true,
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })
      await nextTick()
      const popper = wrapper.find('.ccui-popover__popper')
      expect(popper.element.style.width).toBe('200px')
    })
  })

  describe('主题与样式', () => {
    it('应用 light 主题', async () => {
      wrapper = mount(Popover, {
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
      expect(wrapper.find('.ccui-popover__popper--light').exists()).toBe(true)
    })

    it('应用 dark 主题', async () => {
      wrapper = mount(Popover, {
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
      expect(wrapper.find('.ccui-popover__popper--dark').exists()).toBe(true)
    })

    it('应用位置样式', async () => {
      const placements = ['top', 'bottom', 'left', 'right']
      for (const placement of placements) {
        wrapper = mount(Popover, {
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
        expect(wrapper.find(`.ccui-popover__popper--${placement}`).exists()).toBe(true)
        wrapper.unmount()
      }
    })

    it('显示箭头', async () => {
      wrapper = mount(Popover, {
        props: {
          content: 'Test',
          showArrow: true,
          visible: true,
        },
        slots: { default: '<button>Trigger</button>' },
      })
      await nextTick()
      expect(wrapper.find('.ccui-popover__arrow').exists()).toBe(true)
    })

    it('隐藏箭头', async () => {
      wrapper = mount(Popover, {
        props: {
          content: 'Test',
          showArrow: false,
          visible: true,
        },
        slots: { default: '<button>Trigger</button>' },
      })
      await nextTick()
      expect(wrapper.find('.ccui-popover__arrow').exists()).toBe(false)
    })
  })

  describe('交互功能', () => {
    it('点击时切换显示状态', async () => {
      wrapper = mount(Popover, {
        props: {
          content: 'Test',
          trigger: 'click',
        },
        slots: { default: '<button>Trigger</button>' },
      })
      const trigger = wrapper.find('.ccui-popover__trigger')
      await trigger.trigger('click')
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(true)
      await trigger.trigger('click')
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(false)
    })

    it('悬停时显示与隐藏', async () => {
      wrapper = mount(Popover, {
        props: { content: 'Test', trigger: 'hover', hideAfter: 0 },
        slots: { default: '<button>Trigger</button>' },
      })
      const trigger = wrapper.find('.ccui-popover__trigger')
      await trigger.trigger('mouseenter')
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(true)
      await trigger.trigger('mouseleave')
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(false)
    })

    it('获得焦点时显示，失焦时隐藏', async () => {
      wrapper = mount(Popover, {
        props: { content: 'Test', trigger: 'focus', hideAfter: 0 },
        slots: { default: '<input type="text" />' },
      })
      const trigger = wrapper.find('.ccui-popover__trigger')
      await trigger.trigger('focus')
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(true)
      await trigger.trigger('blur')
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(false)
    })
  })

  describe('禁用与延迟', () => {
    it('禁用时不显示', async () => {
      wrapper = mount(Popover, {
        props: { content: 'Test', disabled: true, trigger: 'hover' },
        slots: { default: '<button>Trigger</button>' },
      })
      const trigger = wrapper.find('.ccui-popover__trigger')
      await trigger.trigger('mouseenter')
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(false)
    })

    describe('延迟', () => {
      beforeEach(() => {
        vi.useFakeTimers()
      })
      afterEach(() => {
        vi.useRealTimers()
      })
      it('延迟显示', async () => {
        wrapper = mount(Popover, {
          props: { content: 'Test', trigger: 'hover', showAfter: 100 },
          slots: { default: '<button>Trigger</button>' },
        })
        const trigger = wrapper.find('.ccui-popover__trigger')
        await trigger.trigger('mouseenter')
        await nextTick()
        expect(wrapper.find('.ccui-popover__popper').exists()).toBe(false)
        vi.advanceTimersByTime(100)
        await nextTick()
        expect(wrapper.find('.ccui-popover__popper').exists()).toBe(true)
      })
      it('延迟隐藏', async () => {
        wrapper = mount(Popover, {
          props: { content: 'Test', trigger: 'hover', hideAfter: 100 },
          slots: { default: '<button>Trigger</button>' },
        })
        const trigger = wrapper.find('.ccui-popover__trigger')
        await trigger.trigger('mouseenter')
        await nextTick()
        expect(wrapper.find('.ccui-popover__popper').exists()).toBe(true)
        await trigger.trigger('mouseleave')
        await nextTick()
        expect(wrapper.find('.ccui-popover__popper').exists()).toBe(true)
        vi.advanceTimersByTime(100)
        await nextTick()
        expect(wrapper.find('.ccui-popover__popper').exists()).toBe(false)
      })
    })
  })

  describe('事件与可访问性', () => {
    it('触发事件', async () => {
      const beforeShow = vi.fn()
      const show = vi.fn()
      const beforeHide = vi.fn()
      const hide = vi.fn()
      wrapper = mount(Popover, {
        props: {
          'content': 'Test',
          'trigger': 'hover',
          'hideAfter': 0,
          'onBefore-show': beforeShow,
          'onShow': show,
          'onBefore-hide': beforeHide,
          'onHide': hide,
        },
        slots: { default: '<button>Trigger</button>' },
      })
      const trigger = wrapper.find('.ccui-popover__trigger')
      await trigger.trigger('mouseenter')
      await nextTick()
      expect(beforeShow).toHaveBeenCalled()
      expect(show).toHaveBeenCalled()
      await trigger.trigger('mouseleave')
      await nextTick()
      expect(beforeHide).toHaveBeenCalled()
      expect(hide).toHaveBeenCalled()
    })

    it('aRIA 属性', async () => {
      wrapper = mount(Popover, {
        props: { content: 'Test', ariaLabel: 'Test popover', visible: true },
        slots: { default: '<button>Trigger</button>' },
      })
      await nextTick()
      const trigger = wrapper.find('.ccui-popover__trigger')
      const popper = wrapper.find('.ccui-popover__popper')
      expect(trigger.attributes('aria-label')).toBe('Test popover')
      expect(trigger.attributes('aria-describedby')).toBe('ccui-popover__popper')
      expect(popper.attributes('role')).toBe('dialog')
    })
  })
})
