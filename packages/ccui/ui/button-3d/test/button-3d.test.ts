import type { Button3dProps, Button3DNativeType, Button3DSizeType, Button3DType } from '../index'
import { mount } from '@vue/test-utils'
import { resolve } from 'node:path'
import { compile } from 'sass'
import { describe, expect, expectTypeOf, it, vi } from 'vite-plus/test'
import { Button3d } from '../index'

// 编译真实 SCSS 后检查最终选择器，避免只比较同源字符串而漏掉 Sass 展开后的层叠特异度。
const button3dCss = compile(resolve(process.cwd(), 'ui/button-3d/src/button-3d.scss'), {
  loadPaths: [resolve(process.cwd(), 'node_modules')],
  quietDeps: true,
  logger: { debug: () => {}, warn: () => {} },
}).css

describe('button3d', () => {
  it('从入口导出公开 props 与联合类型', () => {
    expectTypeOf<Button3dProps['type']>().toEqualTypeOf<Button3DType>()
    expectTypeOf<Button3dProps['size']>().toEqualTypeOf<Button3DSizeType>()
    expectTypeOf<Button3dProps['nativeType']>().toEqualTypeOf<Button3DNativeType>()
  })

  it('空 type/size 是公开且可赋值的默认基态', () => {
    const defaultType: Button3DType = ''
    const defaultSize: Button3DSizeType = ''
    const wrapper = mount(Button3d)

    expect(defaultType).toBe('')
    expect(defaultSize).toBe('')
    expect(wrapper.props('type')).toBe('')
    expect(wrapper.props('size')).toBe('')
    expect(wrapper.classes()).toEqual(['ccui-button-3d'])
  })

  it('should render correctly', () => {
    const wrapper = mount(Button3d, {
      slots: {
        default: 'Click me',
      },
    })
    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('ccui-button-3d')
  })

  it('should handle click events', async () => {
    const wrapper = mount(Button3d)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('should be disabled', async () => {
    const wrapper = mount(Button3d, {
      props: {
        disabled: true,
      },
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('loading 保留调用方文本并禁用原生交互', async () => {
    const wrapper = mount(Button3d, {
      props: {
        loading: true,
      },
      slots: { default: '正在保存' },
    })
    expect(wrapper.text()).toBe('正在保存')
    expect(wrapper.classes()).toContain('is-loading')
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('.loading-spinner').attributes('aria-hidden')).toBe('true')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('should apply size classes', () => {
    const wrapper = mount(Button3d, {
      props: {
        size: 'large',
      },
    })
    expect(wrapper.classes()).toContain('ccui-button-3d--large')
  })

  it('should apply type classes', () => {
    const wrapper = mount(Button3d, {
      props: {
        type: 'secondary',
      },
    })
    expect(wrapper.classes()).toContain('ccui-button-3d--secondary')
  })

  it('nativeType、size、type 与状态 props 动态响应', async () => {
    const wrapper = mount(Button3d, {
      props: { nativeType: 'submit', size: 'small', type: 'primary' },
      slots: { default: '提交' },
    })
    expect(wrapper.attributes('type')).toBe('submit')
    expect(wrapper.classes()).toContain('ccui-button-3d--small')
    expect(wrapper.classes()).toContain('ccui-button-3d--primary')

    await wrapper.setProps({ nativeType: 'reset', size: 'large', type: 'danger', disabled: true })

    expect(wrapper.attributes('type')).toBe('reset')
    expect(wrapper.classes()).toContain('ccui-button-3d--large')
    expect(wrapper.classes()).not.toContain('ccui-button-3d--small')
    expect(wrapper.classes()).toContain('ccui-button-3d--danger')
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('默认 button 不提交表单，submit/reset 保留原生行为', async () => {
    const form = document.createElement('form')
    const input = document.createElement('input')
    input.defaultValue = 'initial'
    input.value = 'changed'
    form.append(input)
    document.body.append(form)
    const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault())
    form.addEventListener('submit', onSubmit)

    const wrapper = mount(Button3d, { attachTo: form, slots: { default: 'Action' } })
    await wrapper.trigger('click')
    expect(onSubmit).not.toHaveBeenCalled()

    await wrapper.setProps({ nativeType: 'submit' })
    await wrapper.trigger('click')
    expect(onSubmit).toHaveBeenCalledTimes(1)

    await wrapper.setProps({ nativeType: 'reset' })
    await wrapper.trigger('click')
    expect(input.value).toBe('initial')
    wrapper.unmount()
    form.remove()
  })

  it('透传可访问名称与原生 attrs', () => {
    const wrapper = mount(Button3d, {
      attrs: { 'aria-label': '保存设置', name: 'action', value: 'save', form: 'settings-form' },
    })

    expect(wrapper.attributes('aria-label')).toBe('保存设置')
    expect(wrapper.attributes('name')).toBe('action')
    expect(wrapper.attributes('value')).toBe('save')
    expect(wrapper.attributes('form')).toBe('settings-form')
  })

  it('3D CSS 清除 UA 间距、禁用状态无按压位移并适配系统偏好', () => {
    const reducedStart = button3dCss.indexOf('@media (prefers-reduced-motion: reduce)')
    const forcedColorsStart = button3dCss.indexOf('@media (forced-colors: active)')
    const reducedCss = button3dCss.slice(reducedStart, forcedColorsStart)
    const hoverFront = '.ccui-button-3d:not(:disabled):hover .front'
    const activeFront = '.ccui-button-3d:not(:disabled):active .front'
    // 截取选择器所在声明块，证明同特异度状态规则本身获得 none，而非媒体内恰好存在无关声明。
    const declarationBlockFor = (selector: string) => {
      const start = reducedCss.indexOf(selector)
      return reducedCss.slice(start, reducedCss.indexOf('}', start))
    }

    expect(button3dCss).toContain('border: 0')
    expect(button3dCss).toContain('padding: 0')
    expect(button3dCss.indexOf(hoverFront)).toBeLessThan(reducedStart)
    expect(button3dCss.indexOf(activeFront)).toBeLessThan(reducedStart)
    expect(reducedCss).toContain(hoverFront)
    expect(reducedCss).toContain(activeFront)
    expect(declarationBlockFor(hoverFront)).toContain('transition: none')
    expect(declarationBlockFor(activeFront)).toContain('transition: none')
    expect(reducedCss.match(/transition: none/g)?.length).toBeGreaterThanOrEqual(2)
    expect(reducedCss).not.toContain('!important')
    expect(forcedColorsStart).toBeGreaterThan(reducedStart)
  })
})
