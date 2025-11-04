import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Avatar } from '../index'

const ns = useNamespace('avatar', true)
const styleClass = ns.e('style')

describe('avatar', () => {
  it('chinese name pick last two character', async () => {
    const wrapper = shallowMount(Avatar, {
      props: {
        name: '组件头像',
      },
    })
    expect(wrapper.find(styleClass).text()).toBe('头像')

    wrapper.unmount()
  })

  it('should only show one character when width less than 30', () => {
    const wrapper = shallowMount(Avatar, {
      props: {
        name: '组件头像',
        width: 25,
      },
    })
    expect(wrapper.find(styleClass).text()).toBe('组')

    wrapper.unmount()
  })

  it('one word name pick first two character', () => {
    const name = 'MyAvatar'
    const wrapper = shallowMount(Avatar, {
      props: {
        name,
      },
    })
    expect(wrapper.find(styleClass).text()).toBe('MY')

    wrapper.unmount()
  })

  it('display origin name when name length less than 2', () => {
    const wrapper = shallowMount(Avatar, {
      props: {
        name: 'A',
      },
    })

    expect(wrapper.find(styleClass).text()).toBe('A')

    wrapper.unmount()
  })

  it('renders image when imgSrc is provided', () => {
    const wrapper = mount(Avatar, {
      props: {
        imgSrc: 'https://example.com/avatar.jpg',
      },
    })

    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/avatar.jpg')

    wrapper.unmount()
  })

  it('shows error icon when image fails to load', async () => {
    const wrapper = mount(Avatar, {
      props: {
        imgSrc: 'https://example.com/avatar.jpg',
      },
    })

    // Simulate image error
    const img = wrapper.find('img')
    img.trigger('error')
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'IconImgError' }).exists()).toBe(true)

    wrapper.unmount()
  })

  it('shows default icon when no name or imgSrc is provided', () => {
    const wrapper = mount(Avatar, {
      props: {
        name: '',
      },
    })

    expect(wrapper.findComponent({ name: 'IconBody' }).exists()).toBe(true)

    wrapper.unmount()
  })

  it('applies round style when isRound is true', () => {
    const wrapper = mount(Avatar, {
      props: {
        name: 'Avatar',
        isRound: true,
      },
    })

    const span = wrapper.find('span')
    expect(span.attributes('style')).toContain('border-radius: 100%')

    wrapper.unmount()
  })

  it('applies square style when isRound is false', () => {
    const wrapper = mount(Avatar, {
      props: {
        name: 'Avatar',
        isRound: false,
      },
    })

    const span = wrapper.find('span')
    expect(span.attributes('style')).toContain('border-radius: 0')

    wrapper.unmount()
  })

  it('computes correct font size based on dimensions', () => {
    const wrapper = mount(Avatar, {
      props: {
        name: 'Avatar',
        width: 40,
        height: 40,
      },
    })

    const span = wrapper.find('span')
    // fontSize = minNum / 4 + 3 = 40 / 4 + 3 = 13
    expect(span.attributes('style')).toContain('font-size: 13px')

    wrapper.unmount()
  })

  it('uses custom text when provided', () => {
    const wrapper = mount(Avatar, {
      props: {
        name: 'Avatar',
        customText: 'CA',
      },
    })

    expect(wrapper.find(styleClass).text()).toBe('C')

    wrapper.unmount()
  })

  it('computes background color based on gender', () => {
    const wrapper = mount(Avatar, {
      props: {
        name: 'Avatar',
        gender: 'male',
      },
    })

    // Check that a background color class is applied
    expect(wrapper.find('span').classes()).toContain('ccui-avatar--background-1')

    wrapper.unmount()
  })
})
