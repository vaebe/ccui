import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { nextTick } from 'vue'
import { Select } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'

const ns = useNamespace('select', true)
const options = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma', disabled: true },
]
const manyOptions = options.concat({ label: 'Delta', value: 'delta' })
const wrappers: VueWrapper[] = []

function mountSelect(props = {}) {
  const wrapper = mount(Select, { props })
  wrappers.push(wrapper)
  return wrapper
}

afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
})

describe('select', () => {
  it('renders placeholder and opens options', async () => {
    const wrapper = mountSelect({ options, placeholder: 'Pick one' })

    expect(wrapper.find(ns.e('placeholder')).text()).toBe('Pick one')
    await wrapper.trigger('click')
    expect(wrapper.findAll(ns.e('option')).length).toBe(3)
  })

  it('emits selected value in single mode and closes the dropdown', async () => {
    const wrapper = mountSelect({ options })

    await wrapper.trigger('click')
    await wrapper.findAll(ns.e('option'))[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['beta'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['beta'])
    expect(wrapper.find(ns.e('dropdown')).exists()).toBe(false)
  })

  it('renders selected label from modelValue', () => {
    const wrapper = mountSelect({ options, modelValue: 'alpha' })

    expect(wrapper.find(ns.e('single')).text()).toBe('Alpha')
  })

  it('does not emit or close when a disabled option is clicked', async () => {
    const wrapper = mountSelect({ options })

    await wrapper.trigger('click')
    await wrapper.findAll(ns.e('option'))[2].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find(ns.e('dropdown')).exists()).toBe(true)
  })

  it('does not open when disabled', async () => {
    const wrapper = mountSelect({ options, disabled: true })

    await wrapper.trigger('click')
    await wrapper.trigger('keydown', { key: 'Enter' })

    expect(wrapper.find(ns.e('dropdown')).exists()).toBe(false)
    expect(wrapper.emitted('visible-change')).toBeUndefined()
  })

  it('clears a single value and emits clear', async () => {
    const wrapper = mountSelect({ options, modelValue: 'alpha', clearable: true })

    await wrapper.find(ns.e('clear')).trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
    expect(wrapper.emitted('change')?.[0]).toEqual([undefined])
    expect(wrapper.emitted('clear')?.length).toBe(1)
    expect(wrapper.find(ns.e('dropdown')).exists()).toBe(false)
  })

  it('supports multiple selection, deselection, and tag removal', async () => {
    const wrapper = mountSelect({ options, multiple: true })

    await wrapper.trigger('click')
    await wrapper.findAll(ns.e('option'))[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['alpha']])

    await wrapper.setProps({ modelValue: ['alpha'] })
    await wrapper.findAll(ns.e('option'))[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([[]])

    await wrapper.setProps({ modelValue: ['alpha'] })
    expect(wrapper.find(ns.e('tag')).text()).toContain('Alpha')
    await wrapper.find(ns.e('tag-close')).trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[2]).toEqual([[]])
  })

  it('clears multiple values as an empty array', async () => {
    const wrapper = mountSelect({ options, multiple: true, modelValue: ['alpha', 'beta'], clearable: true })

    await wrapper.find(ns.e('clear')).trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
    expect(wrapper.emitted('change')?.[0]).toEqual([[]])
    expect(wrapper.emitted('clear')?.length).toBe(1)
  })

  it('limits rendered tags with maxTagCount', () => {
    const wrapper = mountSelect({
      options: manyOptions,
      multiple: true,
      modelValue: ['alpha', 'beta', 'delta'],
      maxTagCount: 1,
    })

    const tags = wrapper.findAll(ns.e('tag'))
    expect(tags.length).toBe(2)
    expect(tags[0].text()).toContain('Alpha')
    expect(tags[1].text()).toBe('+2')
  })

  it('filters options by label or value and emits search text', async () => {
    const onSearch = vi.fn()
    const wrapper = mountSelect({ options: manyOptions, filterable: true, onSearch })

    await wrapper.trigger('click')
    await wrapper.find('input').setValue('bet')

    expect(onSearch).toHaveBeenCalledWith('bet')
    expect(wrapper.findAll(ns.e('option')).length).toBe(1)
    expect(wrapper.find(ns.e('option')).text()).toContain('Beta')

    await wrapper.find('input').setValue('delta')
    expect(wrapper.find(ns.e('option')).text()).toContain('Delta')
  })

  it('keeps search input available for multiple filterable select with selected tags', async () => {
    const wrapper = mountSelect({ options, multiple: true, filterable: true, modelValue: ['alpha'] })

    await wrapper.trigger('click')
    expect(wrapper.find(ns.e('tag')).text()).toContain('Alpha')
    expect(wrapper.find('input').exists()).toBe(true)

    await wrapper.find('input').setValue('bet')
    expect(wrapper.findAll(ns.e('option')).length).toBe(1)
    expect(wrapper.find(ns.e('option')).text()).toContain('Beta')
  })

  it('resets search text after single selection', async () => {
    const wrapper = mountSelect({ options, filterable: true })

    await wrapper.trigger('click')
    await wrapper.find('input').setValue('bet')
    await wrapper.find(ns.e('option')).trigger('click')
    await wrapper.trigger('click')

    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
    expect(wrapper.findAll(ns.e('option')).length).toBe(3)
  })

  it('renders loading and empty states with custom text', async () => {
    const wrapper = mountSelect({ options: [], loading: true, loadingText: 'Fetching', noDataText: 'Nothing here' })

    await wrapper.trigger('click')
    expect(wrapper.find(ns.e('loading')).text()).toBe('Fetching')

    await wrapper.setProps({ loading: false })
    expect(wrapper.find(ns.e('empty')).text()).toBe('Nothing here')
  })

  it('emits visible-change on open, escape close, and outside close', async () => {
    const wrapper = mountSelect({ options })

    await wrapper.trigger('click')
    expect(wrapper.emitted('visible-change')?.[0]).toEqual([true])

    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('visible-change')?.[1]).toEqual([false])

    await wrapper.trigger('click')
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()

    expect(wrapper.emitted('visible-change')?.[2]).toEqual([true])
    expect(wrapper.emitted('visible-change')?.[3]).toEqual([false])
  })

  it('selects active enabled option from keyboard and skips disabled options', async () => {
    const wrapper = mountSelect({ options })

    await wrapper.trigger('keydown', { key: 'Enter' })
    await wrapper.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.findAll(ns.e('option'))[1].classes()).toContain(ns.em('option', 'active').slice(1))

    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['beta'])
  })
})
