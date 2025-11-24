import { mount, shallowMount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { Tooltip } from '../index'

// 测试辅助函数
function createWrapper(props = {}, slots = {}) {
  return mount(Tooltip, {
    props: {
      teleported: false,
      ...props,
    },
    slots: {
      default: '<button>Trigger</button>',
      ...slots,
    },
  })
}

function createShallowWrapper(props = {}, slots = {}) {
  return shallowMount(Tooltip, {
    props: {
      teleported: false,
      ...props,
    },
    slots: {
      default: '<button>Trigger</button>',
      ...slots,
    },
  })
}

describe('tooltip', () => {
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
      wrapper = createShallowWrapper()
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.ccui-tooltip').exists()).toBe(true)
      expect(wrapper.find('.ccui-tooltip__trigger').exists()).toBe(true)
    })

    it('显示内容', async () => {
      wrapper = createWrapper({
        content: 'Test tooltip content',
        visible: true,
      })
      await nextTick()
      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(true)
      expect(wrapper.find('.ccui-tooltip__content').text()).toBe('Test tooltip content')
    })

    it('支持插槽内容', async () => {
      wrapper = createWrapper(
        { visible: true },
        { content: '<div class="custom-content">Custom content</div>' },
      )
      await nextTick()
      expect(wrapper.find('.custom-content').exists()).toBe(true)
      expect(wrapper.find('.custom-content').text()).toBe('Custom content')
    })

    it('支持 HTML 内容', async () => {
      wrapper = createWrapper({
        content: '<strong>Bold text</strong>',
        rawContent: true,
        visible: true,
      })
      await nextTick()
      expect(wrapper.find('.ccui-tooltip__content strong').exists()).toBe(true)
    })
  })

  describe('主题与样式', () => {
    it.each([
      ['dark', 'ccui-tooltip__popper--dark'],
      ['light', 'ccui-tooltip__popper--light'],
    ])('应用 %s 主题', async (effect, expectedClass) => {
      wrapper = createWrapper({
        content: 'Test',
        effect: effect as any,
        visible: true,
      })
      await nextTick()
      expect(wrapper.find(`.${expectedClass}`).exists()).toBe(true)
    })

    it('应用位置样式', async () => {
      const placements = ['top', 'bottom', 'left', 'right']
      wrapper = createWrapper({
        content: 'Test',
        placement: 'top',
        visible: true,
      })

      for (const placement of placements) {
        await wrapper.setProps({ placement: placement as any })
        await nextTick()
        expect(wrapper.find(`.ccui-tooltip__popper--${placement}`).exists()).toBe(true)
      }
    })

    it.each([
      [true, true],
      [false, false],
    ])('箭头显示状态: showArrow=%s', async (showArrow, shouldExist) => {
      wrapper = createWrapper({
        content: 'Test',
        showArrow,
        visible: true,
      })
      await nextTick()
      expect(wrapper.find('.ccui-tooltip__arrow').exists()).toBe(shouldExist)
    })
  })

  describe('交互功能', () => {
    it('悬停时显示与隐藏', async () => {
      wrapper = createWrapper({ content: 'Test', trigger: 'hover', hideAfter: 0 })
      const trigger = wrapper.find('.ccui-tooltip__trigger')
      await trigger.trigger('mouseenter')
      await nextTick()
      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(true)
      await trigger.trigger('mouseleave')
      await nextTick()
      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(false)
    })

    it('点击时切换显示状态', async () => {
      wrapper = createWrapper({ content: 'Test', trigger: 'click' })
      const trigger = wrapper.find('.ccui-tooltip__trigger')
      await trigger.trigger('click')
      await nextTick()
      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(true)
      await trigger.trigger('click')
      await nextTick()
      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(false)
    })

    it('获得焦点时显示，失焦时隐藏', async () => {
      wrapper = createWrapper(
        { content: 'Test', trigger: 'focus', hideAfter: 0 },
        { default: '<input type="text" />' },
      )
      const trigger = wrapper.find('.ccui-tooltip__trigger')
      await trigger.trigger('focus')
      await nextTick()
      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(true)
      await trigger.trigger('blur')
      await nextTick()
      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(false)
    })
  })

  describe('禁用状态', () => {
    it('禁用时不显示', async () => {
      wrapper = createWrapper({ content: 'Test', disabled: true, trigger: 'hover' })
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

    it('延迟显示', async () => {
      wrapper = createWrapper({ content: 'Test', trigger: 'hover', showAfter: 100 })
      const trigger = wrapper.find('.ccui-tooltip__trigger')
      await trigger.trigger('mouseenter')
      await nextTick()
      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(false)
      vi.advanceTimersByTime(100)
      await nextTick()
      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(true)
    })

    it('延迟隐藏', async () => {
      wrapper = createWrapper({ content: 'Test', trigger: 'hover', hideAfter: 100 })
      const trigger = wrapper.find('.ccui-tooltip__trigger')
      await trigger.trigger('mouseenter')
      await nextTick()
      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(true)
      await trigger.trigger('mouseleave')
      await nextTick()
      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(true)
      vi.advanceTimersByTime(100)
      await nextTick()
      expect(wrapper.find('.ccui-tooltip__popper').exists()).toBe(false)
    })
  })

  describe('事件触发', () => {
    it('触发事件', async () => {
      const beforeShow = vi.fn()
      const show = vi.fn()
      const beforeHide = vi.fn()
      const hide = vi.fn()
      wrapper = createWrapper({
        'content': 'Test',
        'trigger': 'hover',
        'hideAfter': 0,
        'onBefore-show': beforeShow,
        'onShow': show,
        'onBefore-hide': beforeHide,
        'onHide': hide,
      })
      const trigger = wrapper.find('.ccui-tooltip__trigger')
      await trigger.trigger('mouseenter')
      await nextTick()
      expect(beforeShow).toHaveBeenCalled()
      expect(show).toHaveBeenCalled()
      await trigger.trigger('mouseleave')
      await nextTick()
      expect(beforeHide).toHaveBeenCalled()
      expect(hide).toHaveBeenCalled()
    })
  })

  describe('可访问性', () => {
    it('aRIA 属性', async () => {
      wrapper = createWrapper({ content: 'Test', ariaLabel: 'Test tooltip', visible: true })
      await nextTick()
      const trigger = wrapper.find('.ccui-tooltip__trigger')
      const popper = wrapper.find('.ccui-tooltip__popper')
      expect(trigger.attributes('aria-label')).toBe('Test tooltip')
      expect(trigger.attributes('aria-describedby')).toBe('ccui-tooltip__popper')
      expect(popper.attributes('role')).toBe('tooltip')
    })
  })
})
