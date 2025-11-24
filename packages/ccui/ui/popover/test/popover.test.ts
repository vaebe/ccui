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
          teleported: false, // 测试中禁用 teleport，以便在组件内部查找元素
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
          teleported: false, // 测试中禁用 teleport，以便在组件内部查找元素
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
          teleported: false, // 测试中禁用 teleport，以便在组件内部查找元素
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
          teleported: false, // 测试中禁用 teleport，以便在组件内部查找元素
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
          teleported: false, // 测试中禁用 teleport，以便在组件内部查找元素
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
          teleported: false, // 测试中禁用 teleport，以便在组件内部查找元素
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
      wrapper = mount(Popover, {
        props: {
          content: 'Test',
          placement: 'top',
          visible: true,
          teleported: false, // 测试中禁用 teleport，以便在组件内部查找元素
        },
        slots: {
          default: '<button>Trigger</button>',
        },
      })

      for (const placement of placements) {
        await wrapper.setProps({ placement: placement as any })
        await nextTick()
        expect(wrapper.find(`.ccui-popover__popper--${placement}`).exists()).toBe(true)
      }
    })

    it('显示箭头', async () => {
      wrapper = mount(Popover, {
        props: {
          content: 'Test',
          showArrow: true,
          visible: true,
          teleported: false, // 测试中禁用 teleport，以便在组件内部查找元素
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
          teleported: false, // 测试中禁用 teleport，以便在组件内部查找元素
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
          teleported: false, // 测试中禁用 teleport，以便在组件内部查找元素
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
        props: { content: 'Test', trigger: 'hover', hideAfter: 0, teleported: false },
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
        props: { content: 'Test', trigger: 'focus', hideAfter: 0, teleported: false },
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
        props: { content: 'Test', disabled: true, trigger: 'hover', teleported: false },
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
          props: { content: 'Test', trigger: 'hover', showAfter: 100, teleported: false },
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
          props: { content: 'Test', trigger: 'hover', hideAfter: 100, teleported: false },
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
        props: { content: 'Test', ariaLabel: 'Test popover', visible: true, teleported: false },
        slots: { default: '<button>Trigger</button>' },
      })
      await nextTick()
      const trigger = wrapper.find('.ccui-popover__trigger')
      const popper = wrapper.find('.ccui-popover__popper')
      expect(trigger.attributes('aria-label')).toBe('Test popover')
      // aria-describedby 应该匹配实际的 popper ID，格式为 ccui-popover__popper-{数字}
      const popperId = popper.attributes('id')
      expect(trigger.attributes('aria-describedby')).toBe(popperId)
      expect(popper.attributes('role')).toBe('dialog')
    })
  })

  describe('外部交互', () => {
    it('点击页面空白处应关闭（默认）', async () => {
      wrapper = mount(Popover, {
        props: { content: 'Test', trigger: 'click', teleported: false },
        slots: { default: '<button>Trigger</button>' },
        attachTo: document.body,
      })
      const trigger = wrapper.find('.ccui-popover__trigger')
      await trigger.trigger('click')
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(true)
      window.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(false)
    })

    it('hideOnClickOutside=false 时点击外部不关闭', async () => {
      wrapper = mount(Popover, {
        props: { content: 'Test', trigger: 'click', hideOnClickOutside: false, teleported: false },
        slots: { default: '<button>Trigger</button>' },
        attachTo: document.body,
      })
      const trigger = wrapper.find('.ccui-popover__trigger')
      await trigger.trigger('click')
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(true)
      window.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(true)
    })

    it('按下 Escape 应关闭（默认）', async () => {
      wrapper = mount(Popover, {
        props: { content: 'Test', trigger: 'click', teleported: false },
        slots: { default: '<button>Trigger</button>' },
        attachTo: document.body,
      })
      const trigger = wrapper.find('.ccui-popover__trigger')
      await trigger.trigger('click')
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(true)
      const escEvent = new KeyboardEvent('keydown', { key: 'Escape' })
      window.dispatchEvent(escEvent)
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(false)
    })
  })

  describe('新增功能测试', () => {
    it('右键菜单触发', async () => {
      wrapper = mount(Popover, {
        props: { content: 'Test', trigger: 'contextmenu', teleported: false },
        slots: { default: '<button>Trigger</button>' },
      })
      const trigger = wrapper.find('.ccui-popover__trigger')
      await trigger.trigger('contextmenu')
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(true)
    })

    it('虚拟触发功能', async () => {
      const virtualElement = document.createElement('div')
      document.body.appendChild(virtualElement)

      wrapper = mount(Popover, {
        props: {
          content: 'Test',
          virtualTriggering: true,
          virtualRef: virtualElement,
          trigger: 'manual',
          visible: true,
          teleported: false,
        },
      })
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(true)
      expect(wrapper.find('.ccui-popover__trigger').exists()).toBe(false)

      document.body.removeChild(virtualElement)
    })

    it('自动关闭功能', async () => {
      vi.useFakeTimers()
      wrapper = mount(Popover, {
        props: { content: 'Test', trigger: 'click', autoClose: 1000, teleported: false },
        slots: { default: '<button>Trigger</button>' },
      })
      const trigger = wrapper.find('.ccui-popover__trigger')
      await trigger.trigger('click')
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(true)

      vi.advanceTimersByTime(1000)
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(false)
      vi.useRealTimers()
    })

    it('键盘触发功能', async () => {
      wrapper = mount(Popover, {
        props: { content: 'Test', trigger: 'focus', triggerKeys: ['Enter', ' '], hideAfter: 0, teleported: false },
        slots: { default: '<input type="text" />' },
      })
      const trigger = wrapper.find('.ccui-popover__trigger')

      // focus 事件会自动显示 popover
      await trigger.trigger('focus')
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(true)

      // 测试 Enter 键 - 此时应该隐藏 popover
      await trigger.trigger('keydown', { key: 'Enter' })
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(false)

      // 再次按 Enter 键显示 popover
      await trigger.trigger('keydown', { key: 'Enter' })
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(true)

      // 测试空格键 - 应该隐藏 popover
      await trigger.trigger('keydown', { key: ' ' })
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(false)

      // 再次按空格键显示 popover
      await trigger.trigger('keydown', { key: ' ' })
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(true)

      // 清理：失焦关闭
      await trigger.trigger('blur')
      await nextTick()
    })

    it('teleport 功能', async () => {
      wrapper = mount(Popover, {
        props: { content: 'Test', visible: true, teleported: true },
        slots: { default: '<button>Trigger</button>' },
        attachTo: document.body,
      })
      await nextTick()

      // 检查弹出框是否被传送到 body 中
      const popperInBody = document.body.querySelector('.ccui-popover__popper')
      expect(popperInBody).toBeTruthy()
    })

    it('动画事件触发', async () => {
      const beforeEnter = vi.fn()
      const afterEnter = vi.fn()
      const beforeLeave = vi.fn()
      const afterLeave = vi.fn()

      wrapper = mount(Popover, {
        props: {
          'content': 'Test',
          'trigger': 'click',
          'teleported': false,
          'onBefore-enter': beforeEnter,
          'onAfter-enter': afterEnter,
          'onBefore-leave': beforeLeave,
          'onAfter-leave': afterLeave,
        },
        slots: { default: '<button>Trigger</button>' },
      })

      const trigger = wrapper.find('.ccui-popover__trigger')
      await trigger.trigger('click')
      await nextTick()

      // 模拟动画事件
      const transition = wrapper.findComponent({ name: 'Transition' })
      if (transition.exists()) {
        await transition.vm.$emit('before-enter')
        await transition.vm.$emit('after-enter')

        expect(beforeEnter).toHaveBeenCalled()
        expect(afterEnter).toHaveBeenCalled()

        await trigger.trigger('click')
        await nextTick()

        await transition.vm.$emit('before-leave')
        await transition.vm.$emit('after-leave')

        expect(beforeLeave).toHaveBeenCalled()
        expect(afterLeave).toHaveBeenCalled()
      }
    })

    it('exposes methods', async () => {
      wrapper = mount(Popover, {
        props: { content: 'Test', visible: true, teleported: false },
        slots: { default: '<button>Trigger</button>' },
      })
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(true)

      // 调用暴露的 hide 方法
      // 注意：在受控模式下（有 visible 属性），hide 方法不会直接修改 visible
      // 所以需要测试非受控模式
      wrapper.unmount()

      wrapper = mount(Popover, {
        props: { content: 'Test', teleported: false },
        slots: { default: '<button>Trigger</button>' },
      })

      // 手动触发显示
      const trigger = wrapper.find('.ccui-popover__trigger')
      await trigger.trigger('click')
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(true)

      // 调用暴露的 hide 方法
      wrapper.vm.hide()
      await nextTick()
      expect(wrapper.find('.ccui-popover__popper').exists()).toBe(false)
    })
  })
})
