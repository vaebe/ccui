import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Radio } from '../index'

const ns = useNamespace('radio', true)
const baseClass = ns.b()

describe('radio', () => {
  it('dom', async () => {
    const wrapper = shallowMount(Radio)

    expect(wrapper.find(baseClass).exists()).toBeTruthy()

    wrapper.unmount()
  })
})
