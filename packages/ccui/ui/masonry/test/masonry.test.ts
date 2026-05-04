import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Masonry } from '../index'

const ns = useNamespace('masonry', true)

describe('masonry', () => {
  it('splits items into N columns', () => {
    const wrapper = mount(Masonry, {
      props: { columns: 3 },
      slots: {
        default: '<div>1</div><div>2</div><div>3</div><div>4</div><div>5</div>',
      },
    })
    expect(wrapper.findAll(ns.e('column')).length).toBe(3)
  })

  it('clamps columns to at least 1', () => {
    const wrapper = mount(Masonry, {
      props: { columns: 0 },
      slots: { default: '<div>1</div>' },
    })
    expect(wrapper.findAll(ns.e('column')).length).toBe(1)
  })

  it('applies gutter as inline style', () => {
    const wrapper = mount(Masonry, {
      props: { columns: 2, gutter: [8, 12] },
      slots: { default: '<div>1</div><div>2</div>' },
    })
    const item = wrapper.find(ns.e('item'))
    expect(item.attributes('style') ?? '').toContain('margin-bottom: 12px')
  })
})
