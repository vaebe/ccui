import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { CheckBox } from '../index'

const ns = useNamespace('check-box', true)
const baseClass = ns.b()

describe('checkBox', () => {
  it('dom', async () => {
    const wrapper = shallowMount(CheckBox)

    expect(wrapper.find(baseClass).exists()).toBeTruthy()

    wrapper.unmount()
  })
})
