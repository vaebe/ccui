import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, markRaw } from 'vue'
import { Timeline, TimelineItem } from '../index'

describe('timeline', () => {
  it('should render', () => {
    const wrapper = mount(Timeline)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('ccui-timeline')
  })

  it('should render timeline items', () => {
    const wrapper = mount(Timeline, {
      slots: {
        default: () => [
          h(TimelineItem, { timestamp: '2018/4/12' }, () => 'Test content 1'),
          h(TimelineItem, { timestamp: '2018/4/3' }, () => 'Test content 2'),
        ],
      },
    })

    expect(wrapper.element.tagName).toBe('UL')
    expect(wrapper.findAll('.ccui-timeline-item')).toHaveLength(2)
    expect(wrapper.findAll('.ccui-timeline-item__timestamp')[0].text()).toBe('2018/4/12')
    expect(wrapper.findAll('.ccui-timeline-item__timestamp')[1].text()).toBe('2018/4/3')
  })
})

describe('timelineItem', () => {
  it('should render with timestamp', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        timestamp: '2018/4/12',
      },
      slots: {
        default: 'Test content',
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('ccui-timeline-item')
    expect(wrapper.find('.ccui-timeline-item__timestamp').text()).toBe('2018/4/12')
    expect(wrapper.find('.ccui-timeline-item__content').text()).toBe('Test content')
  })

  it('should hide timestamp when hideTimestamp is true', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        timestamp: '2018/4/12',
        hideTimestamp: true,
      },
      slots: {
        default: 'Test content',
      },
    })

    expect(wrapper.find('.ccui-timeline-item__timestamp').exists()).toBe(false)
  })

  it('should render with different types', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        timestamp: '2018/4/12',
        type: 'primary',
      },
      slots: {
        default: 'Test content',
      },
    })

    expect(wrapper.find('.ccui-timeline-item__node--primary').exists()).toBe(true)
  })

  it('should render with custom color', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        timestamp: '2018/4/12',
        color: '#ff0000',
      },
      slots: {
        default: 'Test content',
      },
    })

    const node = wrapper.find('.ccui-timeline-item__node')
    expect(node.attributes('style')).toContain('background-color: rgb(255, 0, 0)')
  })

  it('should render with large size', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        timestamp: '2018/4/12',
        size: 'large',
      },
      slots: {
        default: 'Test content',
      },
    })

    expect(wrapper.find('.ccui-timeline-item__node--large').exists()).toBe(true)
  })

  it('should render with hollow style', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        timestamp: '2018/4/12',
        hollow: true,
      },
      slots: {
        default: 'Test content',
      },
    })

    expect(wrapper.find('.ccui-timeline-item__node.is-hollow').exists()).toBe(true)
  })

  it('should render timestamp at top when placement is top', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        timestamp: '2018/4/12',
        placement: 'top',
      },
      slots: {
        default: 'Test content',
      },
    })

    expect(wrapper.find('.ccui-timeline-item__timestamp.is-top').exists()).toBe(true)
  })

  it('should render with center alignment', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        timestamp: '2018/4/12',
        center: true,
      },
      slots: {
        default: 'Test content',
      },
    })

    expect(wrapper.classes()).toContain('ccui-timeline-item__center')
  })

  it('should render with string icon', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        timestamp: '2018/4/12',
        icon: 'icon-class-name',
      },
      slots: {
        default: 'Test content',
      },
    })

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

    const wrapper = mount(TimelineItem, {
      props: {
        timestamp: '2018/4/12',
        icon: IconComponent,
      },
      slots: {
        default: 'Test content',
      },
    })

    expect(wrapper.find('.ccui-timeline-item__icon').exists()).toBe(true)
    expect(wrapper.find('.test-icon').exists()).toBe(true)
  })

  it('should render with custom dot slot', () => {
    const wrapper = mount(TimelineItem, {
      props: {
        timestamp: '2018/4/12',
      },
      slots: {
        default: 'Test content',
        dot: '<div class="custom-dot">Custom</div>',
      },
    })

    expect(wrapper.find('.ccui-timeline-item__dot').exists()).toBe(true)
    expect(wrapper.find('.custom-dot').exists()).toBe(true)
  })
})
