import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'
import { nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { InputOtp } from '../index'

const ns = useNamespace('input-otp', true)

describe('input-otp', () => {
  describe('基本渲染', () => {
    it('挂载基础 DOM + 默认 6 个 cell', () => {
      const wrapper = mount(InputOtp)
      expect(wrapper.find(ns.b()).exists()).toBe(true)
      expect(wrapper.findAll(ns.e('cell')).length).toBe(6)
    })

    it('length=4 渲染 4 个 cell', () => {
      const wrapper = mount(InputOtp, { props: { length: 4 } })
      expect(wrapper.findAll(ns.e('cell')).length).toBe(4)
    })

    it('disabled 时所有 cell disabled', () => {
      const wrapper = mount(InputOtp, { props: { disabled: true } })
      const cells = wrapper.findAll(ns.e('cell'))
      cells.forEach((c) => expect(c.attributes('disabled')).toBeDefined())
      expect(wrapper.find(ns.m('disabled')).exists()).toBe(true)
    })

    it('size=large 加 --large', () => {
      const wrapper = mount(InputOtp, { props: { size: 'large' } })
      expect(wrapper.find(ns.m('large')).exists()).toBe(true)
    })

    it('cell 上有 role=group + inputmode=numeric + maxlength=1', () => {
      const wrapper = mount(InputOtp)
      expect(wrapper.find(ns.b()).attributes('role')).toBe('group')
      const first = wrapper.findAll(ns.e('cell'))[0]
      expect(first.attributes('inputmode')).toBe('numeric')
      expect(first.attributes('maxlength')).toBe('1')
    })
  })

  describe('v-model + defaultValue', () => {
    it('modelValue 拆到各 cell', () => {
      const wrapper = mount(InputOtp, { props: { modelValue: '123456' } })
      const cells = wrapper.findAll(ns.e('cell'))
      expect((cells[0].element as HTMLInputElement).value).toBe('1')
      expect((cells[5].element as HTMLInputElement).value).toBe('6')
    })

    it('短于 length 时右侧 cell 为空', () => {
      const wrapper = mount(InputOtp, { props: { modelValue: '12', length: 4 } })
      const cells = wrapper.findAll(ns.e('cell'))
      expect((cells[0].element as HTMLInputElement).value).toBe('1')
      expect((cells[1].element as HTMLInputElement).value).toBe('2')
      expect((cells[2].element as HTMLInputElement).value).toBe('')
      expect((cells[3].element as HTMLInputElement).value).toBe('')
    })

    it('defaultValue 在未传 modelValue 时生效', () => {
      const wrapper = mount(InputOtp, { props: { defaultValue: 'abcd', length: 4 } })
      const cells = wrapper.findAll(ns.e('cell'))
      expect((cells[2].element as HTMLInputElement).value).toBe('c')
    })

    it('父 modelValue 变化时各 cell 同步', async () => {
      const wrapper = mount(InputOtp, { props: { modelValue: '111111' } })
      await wrapper.setProps({ modelValue: '222222' })
      const cells = wrapper.findAll(ns.e('cell'))
      expect((cells[0].element as HTMLInputElement).value).toBe('2')
    })
  })

  describe('输入 + 焦点流转', () => {
    it('输入单字符触发 update:modelValue + change', async () => {
      const wrapper = mount(InputOtp, { props: { length: 4 } })
      const cells = wrapper.findAll(ns.e('cell'))
      const first = cells[0]
      ;(first.element as HTMLInputElement).value = '5'
      await first.trigger('input')
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[0]).toEqual(['5'])
      const changes = wrapper.emitted('change')
      expect(changes?.[0]).toEqual(['5', { index: 0 }])
    })

    it('输入字符后焦点跳到下一格', async () => {
      const wrapper = mount(InputOtp, { props: { length: 4 }, attachTo: document.body })
      const cells = wrapper.findAll(ns.e('cell'))
      const first = cells[0]
      ;(first.element as HTMLInputElement).value = '7'
      await first.trigger('input')
      await nextTick()
      expect(document.activeElement).toBe(cells[1].element)
      wrapper.unmount()
    })

    it('一次输入多字符（IME / 安卓）逐格填入', async () => {
      const wrapper = mount(InputOtp, { props: { length: 4 } })
      const cells = wrapper.findAll(ns.e('cell'))
      const first = cells[0]
      ;(first.element as HTMLInputElement).value = '123'
      await first.trigger('input')
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[emitted.length - 1]).toEqual(['123'])
    })
  })

  describe('Backspace', () => {
    it('当前格有值时清掉，不跳焦点', async () => {
      const wrapper = mount(InputOtp, {
        props: { modelValue: '12', length: 4, autoFocus: true },
        attachTo: document.body,
      })
      const cells = wrapper.findAll(ns.e('cell'))
      const second = cells[1]
      ;(second.element as HTMLInputElement).focus()
      await second.trigger('keydown', { key: 'Backspace' })
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[emitted.length - 1]).toEqual(['1'])
      wrapper.unmount()
    })

    it('当前格为空且 idx>0 时回到上一格并清掉', async () => {
      const wrapper = mount(InputOtp, { props: { modelValue: '1', length: 4 }, attachTo: document.body })
      const cells = wrapper.findAll(ns.e('cell'))
      const second = cells[1]
      await second.trigger('keydown', { key: 'Backspace' })
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[emitted.length - 1]).toEqual([''])
      wrapper.unmount()
    })
  })

  describe('ArrowLeft / ArrowRight', () => {
    it('ArrowLeft 把焦点移到上一格', async () => {
      const wrapper = mount(InputOtp, { props: { length: 4 }, attachTo: document.body })
      const cells = wrapper.findAll(ns.e('cell'))
      ;(cells[2].element as HTMLInputElement).focus()
      await cells[2].trigger('keydown', { key: 'ArrowLeft' })
      expect(document.activeElement).toBe(cells[1].element)
      wrapper.unmount()
    })

    it('ArrowRight 把焦点移到下一格', async () => {
      const wrapper = mount(InputOtp, { props: { length: 4 }, attachTo: document.body })
      const cells = wrapper.findAll(ns.e('cell'))
      ;(cells[0].element as HTMLInputElement).focus()
      await cells[0].trigger('keydown', { key: 'ArrowRight' })
      expect(document.activeElement).toBe(cells[1].element)
      wrapper.unmount()
    })
  })

  describe('粘贴填充', () => {
    it('从第 0 格粘贴 4 字符填满 length=4', async () => {
      const wrapper = mount(InputOtp, { props: { length: 4 } })
      const first = wrapper.findAll(ns.e('cell'))[0]
      const dt = { getData: (_t: string) => '8765' }
      await first.trigger('paste', { clipboardData: dt })
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[emitted.length - 1]).toEqual(['8765'])
    })

    it('从中间格粘贴只填后半段', async () => {
      const wrapper = mount(InputOtp, { props: { length: 4, modelValue: 'AB' } })
      const cells = wrapper.findAll(ns.e('cell'))
      const dt = { getData: (_t: string) => 'XY' }
      await cells[2].trigger('paste', { clipboardData: dt })
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[emitted.length - 1]).toEqual(['ABXY'])
    })
  })

  describe('formatter', () => {
    it('formatter 转大写', async () => {
      const wrapper = mount(InputOtp, { props: { length: 4, formatter: (v: string) => v.toUpperCase() } })
      const first = wrapper.findAll(ns.e('cell'))[0]
      ;(first.element as HTMLInputElement).value = 'a'
      await first.trigger('input')
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[0]).toEqual(['A'])
    })
  })

  describe('mask', () => {
    it('mask=true 显示 • 但 emit 真实值', () => {
      const wrapper = mount(InputOtp, { props: { length: 4, modelValue: '12', mask: true } })
      const cells = wrapper.findAll(ns.e('cell'))
      expect((cells[0].element as HTMLInputElement).value).toBe('•')
      expect((cells[1].element as HTMLInputElement).value).toBe('•')
      expect((cells[2].element as HTMLInputElement).value).toBe('')
    })

    it('mask="#" 用自定义遮罩字符', () => {
      const wrapper = mount(InputOtp, { props: { length: 4, modelValue: '99', mask: '#' } })
      const first = wrapper.findAll(ns.e('cell'))[0]
      expect((first.element as HTMLInputElement).value).toBe('#')
    })
  })

  describe('status', () => {
    it('status="error" 加 --status-error', () => {
      const wrapper = mount(InputOtp, { props: { status: 'error' } })
      expect(wrapper.find(ns.m('status-error')).exists()).toBe(true)
    })

    it('status="warning" 加 --status-warning', () => {
      const wrapper = mount(InputOtp, { props: { status: 'warning' } })
      expect(wrapper.find(ns.m('status-warning')).exists()).toBe(true)
    })
  })

  describe('focus / blur', () => {
    it('cell focus / blur 透传', async () => {
      const wrapper = mount(InputOtp)
      const first = wrapper.findAll(ns.e('cell'))[0]
      await first.trigger('focus')
      await first.trigger('blur')
      expect(wrapper.emitted('focus')).toBeTruthy()
      expect(wrapper.emitted('blur')).toBeTruthy()
    })
  })

  describe('XL-4 ARIA', () => {
    it('root 加 role="group" + aria-label', () => {
      const wrapper = mount(InputOtp)
      expect(wrapper.attributes('role')).toBe('group')
      expect(wrapper.attributes('aria-label')).toBe('OTP input')
    })

    it('disabled / status=error 时补 aria-disabled / aria-invalid', () => {
      const wrapper = mount(InputOtp, { props: { disabled: true, status: 'error' } })
      expect(wrapper.attributes('aria-disabled')).toBe('true')
      expect(wrapper.attributes('aria-invalid')).toBe('true')
    })
  })
})
