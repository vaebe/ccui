import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vite-plus/test'
import { defineComponent, h, nextTick, ref } from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
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

    it.each([
      [0, 1],
      [-10, 1],
      [2.9, 2],
      [Number.NaN, 1],
      [Number.POSITIVE_INFINITY, 1],
      [Number.MAX_VALUE, 64],
    ])('length=%s 安全归一为 %s 个 cell', (length, expected) => {
      const wrapper = mount(InputOtp, { props: { length } })
      expect(wrapper.findAll(ns.e('cell'))).toHaveLength(expected)
    })

    it('动态超大 length 被限制为 64，随后缩短仍同步归一值', async () => {
      const wrapper = mount(InputOtp, { props: { modelValue: '1234', length: 4 } })
      await wrapper.setProps({ length: Number.MAX_VALUE })
      expect(wrapper.findAll(ns.e('cell'))).toHaveLength(64)
      await wrapper.setProps({ length: 2.9 })
      expect(wrapper.findAll(ns.e('cell'))).toHaveLength(2)
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['12'])
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

    it('动态 type 切换移动端 inputmode，但不负责字符过滤', async () => {
      const wrapper = mount(InputOtp, { props: { type: 'number' } })
      expect(wrapper.findAll(ns.e('cell'))[0].attributes('inputmode')).toBe('numeric')
      await wrapper.setProps({ type: 'text' })
      expect(wrapper.findAll(ns.e('cell'))[0].attributes('inputmode')).toBe('text')
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

    it('显式空 modelValue 不会错误采用 defaultValue', () => {
      const wrapper = mount(InputOtp, {
        props: { modelValue: '', defaultValue: '1234', length: 4 },
      })
      expect(wrapper.findAll(ns.e('cell')).map((cell) => (cell.element as HTMLInputElement).value)).toEqual([
        '',
        '',
        '',
        '',
      ])
    })

    it('从非受控动态切换为显式空 modelValue 时清空 defaultValue', async () => {
      const wrapper = mount(InputOtp, { props: { defaultValue: '1234', length: 4 } })
      await wrapper.setProps({ modelValue: '' })
      expect(wrapper.findAll(ns.e('cell')).map((cell) => (cell.element as HTMLInputElement).value)).toEqual([
        '',
        '',
        '',
        '',
      ])
    })

    it('截断超长外部值，并在 length 缩短时同步归一值', async () => {
      const wrapper = mount(InputOtp, { props: { modelValue: '123456', length: 6 } })
      await wrapper.setProps({ length: 4 })
      expect(wrapper.findAll(ns.e('cell')).map((cell) => (cell.element as HTMLInputElement).value)).toEqual([
        '1',
        '2',
        '3',
        '4',
      ])
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['1234'])
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

    it('在真实 v-model 父组件中保留输入值并推进焦点', async () => {
      const Host = defineComponent({
        setup() {
          const value = ref('')
          return () =>
            h(InputOtp, {
              modelValue: value.value,
              length: 4,
              'onUpdate:modelValue': (next: string) => {
                value.value = next
              },
            })
        },
      })
      const wrapper = mount(Host, { attachTo: document.body })
      const cells = wrapper.findAll(ns.e('cell'))
      ;(cells[0].element as HTMLInputElement).focus()
      ;(cells[0].element as HTMLInputElement).value = '1'
      await cells[0].trigger('input')
      await nextTick()

      expect((cells[0].element as HTMLInputElement).value).toBe('1')
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

    it('IME 组合期间不提交中间态，并吞掉 compositionend 后同任务尾随 input', async () => {
      const validate = vi.fn(() => Promise.resolve(true))
      const wrapper = mount(InputOtp, {
        props: { length: 1 },
        global: {
          provide: {
            [formItemInjectionKey as symbol]: {
              validateStatus: ref(''),
              isInsideForm: true,
              validate,
            },
          },
        },
      })
      const first = wrapper.findAll(ns.e('cell'))[0]
      first.element.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
      ;(first.element as HTMLInputElement).value = 'h'
      first.element.dispatchEvent(new InputEvent('input', { bubbles: true, data: 'h', isComposing: true }))
      expect(wrapper.emitted('change')).toBeUndefined()
      ;(first.element as HTMLInputElement).value = '汉'
      first.element.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '汉' }))
      first.element.dispatchEvent(new InputEvent('input', { bubbles: true, data: '汉' }))
      await nextTick()
      expect(wrapper.emitted('update:modelValue')).toEqual([['汉']])
      expect(wrapper.emitted('change')).toEqual([['汉', { index: 0 }]])
      expect(wrapper.emitted('complete')).toEqual([['汉']])
      expect(validate).toHaveBeenCalledTimes(1)
      expect(validate).toHaveBeenCalledWith('change')
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

    it('Delete 清除当前格且不移动焦点', async () => {
      const wrapper = mount(InputOtp, {
        props: { modelValue: '12', length: 4 },
        attachTo: document.body,
      })
      const second = wrapper.findAll(ns.e('cell'))[1]
      ;(second.element as HTMLInputElement).focus()
      await second.trigger('keydown', { key: 'Delete' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['1'])
      expect(document.activeElement).toBe(second.element)
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

    it('填满时 complete 对同一完成值只触发一次，变为未完成后可再次触发', async () => {
      const wrapper = mount(InputOtp, { props: { length: 4 } })
      const first = wrapper.findAll(ns.e('cell'))[0]
      const dt = { getData: (_t: string) => '1234' }
      await first.trigger('paste', { clipboardData: dt })
      await first.trigger('paste', { clipboardData: dt })
      expect(wrapper.emitted('complete')).toEqual([['1234']])
      await wrapper.findAll(ns.e('cell'))[3].trigger('keydown', { key: 'Backspace' })
      ;(wrapper.findAll(ns.e('cell'))[3].element as HTMLInputElement).value = '4'
      await wrapper.findAll(ns.e('cell'))[3].trigger('input')
      expect(wrapper.emitted('complete')).toEqual([['1234'], ['1234']])
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

    it('formatter 拒绝字符时不发出无变化事件', async () => {
      const wrapper = mount(InputOtp, { props: { length: 4, formatter: () => '' } })
      const first = wrapper.findAll(ns.e('cell'))[0]
      ;(first.element as HTMLInputElement).value = 'x'
      await first.trigger('input')
      await first.trigger('paste', { clipboardData: { getData: () => 'abcd' } })
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.emitted('change')).toBeUndefined()
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

    it('mask 显示值产生的尾随 input 不会覆盖真实字符', async () => {
      const wrapper = mount(InputOtp, { props: { length: 4, modelValue: '1', mask: true } })
      const first = wrapper.findAll(ns.e('cell'))[0]
      ;(first.element as HTMLInputElement).value = '•'
      await first.trigger('input')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect((first.element as HTMLInputElement).value).toBe('•')
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

    it('内部 cell 间移动只产生一次 group focus，离开 group 才产生 blur', async () => {
      const outside = document.createElement('button')
      document.body.append(outside)
      const wrapper = mount(InputOtp, { props: { length: 4 }, attachTo: document.body })
      const cells = wrapper.findAll(ns.e('cell'))
      ;(cells[0].element as HTMLInputElement).focus()
      ;(cells[1].element as HTMLInputElement).focus()
      await nextTick()
      expect(wrapper.emitted('focus')).toHaveLength(1)
      expect(wrapper.emitted('blur')).toBeUndefined()
      outside.focus()
      await nextTick()
      expect(wrapper.emitted('blur')).toHaveLength(1)
      wrapper.unmount()
      outside.remove()
    })

    it('readonly 保持可聚焦，但输入、粘贴和删除均不修改值', async () => {
      const wrapper = mount(InputOtp, { props: { modelValue: '12', length: 4, readOnly: true } })
      const first = wrapper.findAll(ns.e('cell'))[0]
      expect(first.attributes('readonly')).toBeDefined()
      ;(first.element as HTMLInputElement).value = '9'
      await first.trigger('input')
      await first.trigger('keydown', { key: 'Backspace' })
      await first.trigger('paste', { clipboardData: { getData: () => '9876' } })
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect((first.element as HTMLInputElement).value).toBe('1')
      expect(wrapper.attributes('aria-readonly')).toBe('true')
    })

    it('聚焦期间动态 disabled 会退出组件并只触发一次聚合 blur', async () => {
      const wrapper = mount(InputOtp, { props: { length: 4 }, attachTo: document.body })
      ;(wrapper.findAll(ns.e('cell'))[0].element as HTMLInputElement).focus()
      await wrapper.setProps({ disabled: true })
      await nextTick()
      expect(wrapper.emitted('blur')).toHaveLength(1)
      expect(wrapper.findAll(ns.e('cell')).every((cell) => cell.attributes('disabled') !== undefined)).toBe(true)
      wrapper.unmount()
    })

    it('卸载会取消排队中的 group blur 提交', async () => {
      const wrapper = mount(InputOtp, { props: { length: 4 }, attachTo: document.body })
      const first = wrapper.findAll(ns.e('cell'))[0]
      ;(first.element as HTMLInputElement).focus()
      await first.trigger('blur')
      wrapper.unmount()
      await nextTick()
      expect(wrapper.emitted('blur')).toBeUndefined()
    })

    it('通知 FormItem change/blur，内部焦点移动不误触 blur 校验', async () => {
      const validate = vi.fn(() => Promise.resolve(true))
      const outside = document.createElement('button')
      document.body.append(outside)
      const wrapper = mount(InputOtp, {
        props: { length: 4 },
        attachTo: document.body,
        global: {
          provide: {
            [formItemInjectionKey as symbol]: {
              validateStatus: ref('error'),
              messageId: ref('otp-error'),
              isInsideForm: true,
              validate,
            },
          },
        },
      })
      const cells = wrapper.findAll(ns.e('cell'))
      ;(cells[0].element as HTMLInputElement).value = '1'
      await cells[0].trigger('input')
      ;(cells[1].element as HTMLInputElement).focus()
      await nextTick()
      expect(validate).toHaveBeenCalledTimes(1)
      outside.focus()
      await nextTick()
      expect(validate.mock.calls).toEqual([['change'], ['blur']])
      expect(wrapper.attributes('aria-invalid')).toBe('true')
      expect(wrapper.attributes('aria-describedby')).toBe('otp-error')
      expect(cells.every((cell) => cell.attributes('aria-describedby') === 'otp-error')).toBe(true)
      wrapper.unmount()
      outside.remove()
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

    it('允许覆盖 group 名称，并为 cell 暴露位置与总数', () => {
      const wrapper = mount(InputOtp, { props: { length: 4 }, attrs: { 'aria-label': '短信验证码' } })
      expect(wrapper.attributes('aria-label')).toBe('短信验证码')
      expect(wrapper.findAll(ns.e('cell'))[2].attributes('aria-label')).toBe('短信验证码, cell 3 of 4')
    })

    it('group 与每个 cell 都关联去重后的调用方及 FormItem 描述', () => {
      const wrapper = mount(InputOtp, {
        attrs: { 'aria-describedby': 'hint shared' },
        global: {
          provide: {
            [formItemInjectionKey as symbol]: {
              validateStatus: ref('error'),
              messageId: ref('shared'),
              isInsideForm: true,
              validate: vi.fn(),
            },
          },
        },
      })
      expect(wrapper.attributes('aria-describedby')).toBe('hint shared')
      expect(wrapper.findAll(ns.e('cell')).every((cell) => cell.attributes('aria-describedby') === 'hint shared')).toBe(
        true,
      )
    })
  })
})
