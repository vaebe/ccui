import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Tabs } from '../index'

// todo tabs-tab 测试用例待补充
const ns = useNamespace('tabs', true)
const baseClass = ns.b()

describe('tabs', () => {
  it('dom', async () => {
    const wrapper = shallowMount(Tabs)

    expect(wrapper.find(baseClass).exists()).toBeTruthy()
    wrapper.unmount()
  })
})
