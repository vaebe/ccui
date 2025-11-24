import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, markRaw } from 'vue'
import { Timeline, TimelineItem } from '../index'

// 测试辅助函数
function createTimelineWrapper(slots = {}) {
  return mount(Timeline, { slots })
}

function createItemWrapper(props = {}, slots = {}) {
  return mount(TimelineItem, {
    props: {
      timestamp: '2018/4/12',
      ...props,
    },
    slots: {
      default: 'Test content',
      ...slots,
    },
  })
}

describe('timeline', () => {
  it('should render', () => {
    const wrapper = createTimelineWrapper()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('ccui-timeline')
  })

  it('should render timeline items', () => {
    const wrapper = createTimelineWrapper({
      default: () => [
        h(TimelineItem, { timestamp: '2018/4/12' }, () => 'Test content 1'),
        h(TimelineItem, { timestamp: '2018/4/3' }, () => 'Test content 2'),
      ],
    })

    expect(wrapper.element.tagName).toBe('UL')
    expect(wrapper.findAll('.ccui-timeline-item')).toHaveLength(2)
    expect(wrapper.findAll('.ccui-timeline-item__timestamp')[0].text()).toBe('2018/4/12')
    expect(wrapper.findAll('.ccui-timeline-item__timestamp')[1].text()).toBe('2018/4/3')
  })
})

describe('timelineItem', () => {
  it('should render with timestamp', () => {
    const wrapper = createItemWrapper()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('ccui-timeline-item')
    expect(wrapper.find('.ccui-timeline-item__timestamp').text()).toBe('2018/4/12')
    expect(wrapper.find('.ccui-timeline-item__content').text()).toBe('Test content')
  })

  it('should hide timestamp when hideTimestamp is true', () => {
    const wrapper = createItemWrapper({ hideTimestamp: true })
    expect(wrapper.find('.ccui-timeline-item__timestamp').exists()).toBe(false)
  })

  it.each([
    ['primary', '.ccui-timeline-item__node--primary'],
    ['success', '.ccui-timeline-item__node--success'],
    ['warning', '.ccui-timeline-item__node--warning'],
    ['danger', '.ccui-timeline-item__node--danger'],
    ['info', '.ccui-timeline-item__node--info'],
  ])('should render with type %s', (type, expectedClass) => {
    const wrapper = createItemWrapper({ type })
    expect(wrapper.find(expectedClass).exists()).toBe(true)
  })

  it('should render with custom color', () => {
    const wrapper = createItemWrapper({ color: '#ff0000' })
    const node = wrapper.find('.ccui-timeline-item__node')
    expect(node.attributes('style')).toContain('background-color: rgb(255, 0, 0)')
  })

  it('should render with large size', () => {
    const wrapper = createItemWrapper({ size: 'large' })
    expect(wrapper.find('.ccui-timeline-item__node--large').exists()).toBe(true)
  })

  it('should render with hollow style', () => {
    const wrapper = createItemWrapper({ hollow: true })
    expect(wrapper.find('.ccui-timeline-item__node.is-hollow').exists()).toBe(true)
  })

  it('should render timestamp at top when placement is top', () => {
    const wrapper = createItemWrapper({ placement: 'top' })
    expect(wrapper.find('.ccui-timeline-item__timestamp.is-top').exists()).toBe(true)
  })

  it('should render with center alignment', () => {
    const wrapper = createItemWrapper({ center: true })
    expect(wrapper.classes()).toContain('ccui-timeline-item__center')
  })

  it('should render with string icon', () => {
    const wrapper = createItemWrapper({ icon: 'icon-class-name' })
    expect(wrapper.find('.ccui-timeline-item__icon').exists()).toBe(true)
    expect(wrapper.find('.icon-class-name').exists()).toBe(true)
  })

  it('should render with component icon', () => {
    const IconComponent = markRaw({
      name: 'TestIcon',
      render() {
        return h('span', { class: 'test-icon' }, 'Icon')
      },
    })

    const wrapper = createItemWrapper({ icon: IconComponent })
    expect(wrapper.find('.ccui-timeline-item__icon').exists()).toBe(true)
    expect(wrapper.find('.test-icon').exists()).toBe(true)
  })

  it('should render with custom dot slot', () => {
    const wrapper = createItemWrapper({}, {
      dot: '<div class="custom-dot">Custom</div>',
    })
    expect(wrapper.find('.ccui-timeline-item__dot').exists()).toBe(true)
    expect(wrapper.find('.custom-dot').exists()).toBe(true)
  })
})
