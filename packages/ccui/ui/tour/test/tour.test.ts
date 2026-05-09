import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vite-plus/test'
import { defineComponent, h, nextTick, ref } from 'vue'
import { Tour } from '../index'
import { useNamespace } from '../../shared/hooks/use-namespace'

const ns = useNamespace('tour', true)
const wrappers: VueWrapper[] = []

function findInBody(selector: string) {
  return document.body.querySelectorAll(selector)
}

afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
  // 清理 Tour 通过 Teleport 挂到 body 的残留
  document.body.querySelectorAll('.ccui-tour').forEach((n) => n.remove())
})

const STEPS = [
  { title: '步骤一', description: '介绍 1' },
  { title: '步骤二', description: '介绍 2' },
  { title: '步骤三', description: '介绍 3' },
]

describe('tour rendering', () => {
  it('does not render anything when open=false', () => {
    mount(Tour, { props: { open: false, steps: STEPS, current: 0 } })
    expect(findInBody('.ccui-tour').length).toBe(0)
  })

  it('renders panel and mask when open=true', async () => {
    const wrapper = mount(Tour, { props: { open: true, steps: STEPS, current: 0 } })
    wrappers.push(wrapper)
    await nextTick()
    expect(findInBody('.ccui-tour').length).toBe(1)
    expect(findInBody('.ccui-tour__panel').length).toBe(1)
    expect(findInBody('.ccui-tour__mask').length).toBeGreaterThan(0)
  })

  it('renders current step title and description', async () => {
    const wrapper = mount(Tour, { props: { open: true, steps: STEPS, current: 1 } })
    wrappers.push(wrapper)
    await nextTick()
    const panel = document.body.querySelector('.ccui-tour__panel')!
    expect(panel.querySelector('.ccui-tour__title')!.textContent).toBe('步骤二')
    expect(panel.querySelector('.ccui-tour__description')!.textContent).toBe('介绍 2')
    expect(panel.querySelector('.ccui-tour__indicator')!.textContent).toBe('2 / 3')
  })

  it('does not render when current is out of range', async () => {
    const wrapper = mount(Tour, { props: { open: true, steps: STEPS, current: 10 } })
    wrappers.push(wrapper)
    await nextTick()
    expect(findInBody('.ccui-tour__panel').length).toBe(0)
  })

  it('hides mask when global mask=false', async () => {
    const wrapper = mount(Tour, {
      props: { open: true, steps: STEPS, current: 0, mask: false },
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(findInBody('.ccui-tour__mask').length).toBe(0)
    expect(findInBody('.ccui-tour__panel').length).toBe(1)
  })

  it('per-step mask=false overrides global mask=true', async () => {
    const wrapper = mount(Tour, {
      props: {
        open: true,
        current: 0,
        mask: true,
        steps: [{ title: 'no mask step', mask: false }],
      },
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(findInBody('.ccui-tour__mask').length).toBe(0)
  })
})

describe('tour navigation', () => {
  it('clicking next advances current and emits change', async () => {
    const wrapper = mount(Tour, { props: { open: true, steps: STEPS, current: 0 } })
    wrappers.push(wrapper)
    await nextTick()
    const next = document.body.querySelector('.ccui-tour__btn--next')! as HTMLButtonElement
    next.click()
    await nextTick()
    expect(wrapper.emitted('update:current')?.[0]).toEqual([1])
    expect(wrapper.emitted('change')?.[0]).toEqual([1])
  })

  it('prev button is hidden on first step', async () => {
    const wrapper = mount(Tour, { props: { open: true, steps: STEPS, current: 0 } })
    wrappers.push(wrapper)
    await nextTick()
    expect(findInBody('.ccui-tour__btn--prev').length).toBe(0)
  })

  it('prev button on later step decreases current', async () => {
    const wrapper = mount(Tour, { props: { open: true, steps: STEPS, current: 1 } })
    wrappers.push(wrapper)
    await nextTick()
    const prev = document.body.querySelector('.ccui-tour__btn--prev')! as HTMLButtonElement
    prev.click()
    await nextTick()
    expect(wrapper.emitted('update:current')?.[0]).toEqual([0])
  })

  it('last step shows finish button which emits finish + closes', async () => {
    const wrapper = mount(Tour, { props: { open: true, steps: STEPS, current: 2 } })
    wrappers.push(wrapper)
    await nextTick()
    const next = document.body.querySelector('.ccui-tour__btn--next')! as HTMLButtonElement
    expect(next.textContent).toBe('完成')
    next.click()
    await nextTick()
    expect(wrapper.emitted('finish')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('custom prevText / nextText / finishText', async () => {
    const wrapper = mount(Tour, {
      props: { open: true, steps: STEPS, current: 1, prevText: '上', nextText: '下', finishText: '收' },
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(document.body.querySelector('.ccui-tour__btn--prev')!.textContent).toBe('上')
    expect(document.body.querySelector('.ccui-tour__btn--next')!.textContent).toBe('下')
    await wrapper.setProps({ open: true, steps: STEPS, current: 2, prevText: '上', nextText: '下', finishText: '收' })
    expect(document.body.querySelector('.ccui-tour__btn--next')!.textContent).toBe('收')
  })
})

describe('tour close behavior', () => {
  it('clicking the × button emits close + update:open(false)', async () => {
    const wrapper = mount(Tour, { props: { open: true, steps: STEPS, current: 0 } })
    wrappers.push(wrapper)
    await nextTick()
    const closeBtn = document.body.querySelector('.ccui-tour__close')! as HTMLButtonElement
    closeBtn.click()
    await nextTick()
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('Esc key closes when closeOnEsc=true (default)', async () => {
    const wrapper = mount(Tour, { props: { open: true, steps: STEPS, current: 0 } })
    wrappers.push(wrapper)
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('Esc key does not close when closeOnEsc=false', async () => {
    const wrapper = mount(Tour, {
      props: { open: true, steps: STEPS, current: 0, closeOnEsc: false },
    })
    wrappers.push(wrapper)
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('clicking mask panel closes', async () => {
    const wrapper = mount(Tour, { props: { open: true, steps: STEPS, current: 0 } })
    wrappers.push(wrapper)
    await nextTick()
    const mask = document.body.querySelector('.ccui-tour__mask')! as HTMLElement
    mask.click()
    await nextTick()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})

describe('tour with target', () => {
  it('renders highlight cutout when step has a target element', async () => {
    const targetEl = document.createElement('div')
    targetEl.style.width = '100px'
    targetEl.style.height = '60px'
    targetEl.getBoundingClientRect = () =>
      ({
        top: 100,
        left: 200,
        width: 100,
        height: 60,
        right: 300,
        bottom: 160,
        x: 200,
        y: 100,
        toJSON: () => ({}),
      }) as DOMRect
    document.body.appendChild(targetEl)

    const wrapper = mount(Tour, {
      props: {
        open: true,
        current: 0,
        steps: [{ title: 'pointed', target: targetEl }],
      },
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(findInBody('.ccui-tour__highlight').length).toBe(1)
    const highlight = document.body.querySelector('.ccui-tour__highlight')! as HTMLElement
    expect(highlight.style.top).toBe('100px')
    expect(highlight.style.left).toBe('200px')
    expect(highlight.style.width).toBe('100px')
    expect(highlight.style.height).toBe('60px')

    document.body.removeChild(targetEl)
  })

  it('falls back to centered modal when target is null', async () => {
    const wrapper = mount(Tour, {
      props: { open: true, current: 0, steps: [{ title: 'no target' }] },
    })
    wrappers.push(wrapper)
    await nextTick()
    const panel = document.body.querySelector('.ccui-tour__panel')! as HTMLElement
    expect(panel.style.position).toBe('fixed')
    expect(panel.style.top).toBe('50%')
    expect(panel.style.left).toBe('50%')
  })

  it('target as function is resolved at render time', async () => {
    const targetEl = document.createElement('div')
    targetEl.id = 'tour-target'
    document.body.appendChild(targetEl)

    const wrapper = mount(Tour, {
      props: {
        open: true,
        current: 0,
        steps: [{ title: 'fn target', target: () => document.getElementById('tour-target') }],
      },
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(findInBody('.ccui-tour__panel').length).toBe(1)

    document.body.removeChild(targetEl)
  })
})

describe('tour v-model integration', () => {
  it('parent can drive open + current via v-model', async () => {
    const open = ref(true)
    const current = ref(0)
    const Host = defineComponent({
      setup() {
        return () =>
          h(Tour, {
            open: open.value,
            current: current.value,
            steps: STEPS,
            'onUpdate:open': (v: boolean) => (open.value = v),
            'onUpdate:current': (v: number) => (current.value = v),
          })
      },
    })
    const wrapper = mount(Host)
    wrappers.push(wrapper)
    await nextTick()
    const next = document.body.querySelector('.ccui-tour__btn--next')! as HTMLButtonElement
    next.click()
    await nextTick()
    expect(current.value).toBe(1)
    next.click()
    await nextTick()
    expect(current.value).toBe(2)
    next.click() // 完成
    await nextTick()
    expect(open.value).toBe(false)
  })
})

describe('tour type=primary', () => {
  it('applies primary modifier to panel and root', async () => {
    mount(Tour, {
      props: { open: true, steps: STEPS, current: 0, type: 'primary' },
      attachTo: document.body,
    })
    await nextTick()
    expect(findInBody('.ccui-tour__type--primary').length).toBe(1)
    expect(findInBody('.ccui-tour__panel--primary').length).toBe(1)
  })
})

describe('tour arrow', () => {
  it('renders arrow element when arrow=true and target exists', async () => {
    const target = document.createElement('div')
    document.body.appendChild(target)
    Object.defineProperty(target, 'getBoundingClientRect', {
      value: () => ({
        top: 100,
        left: 100,
        width: 50,
        height: 50,
        right: 150,
        bottom: 150,
        x: 100,
        y: 100,
        toJSON: () => ({}),
      }),
    })
    mount(Tour, {
      props: { open: true, steps: [{ title: 'Arrow', target }], current: 0, arrow: true },
      attachTo: document.body,
    })
    await nextTick()
    expect(findInBody('.ccui-tour__arrow').length).toBe(1)
    document.body.removeChild(target)
  })

  it('does not render arrow when arrow=false', async () => {
    const target = document.createElement('div')
    document.body.appendChild(target)
    Object.defineProperty(target, 'getBoundingClientRect', {
      value: () => ({
        top: 100,
        left: 100,
        width: 50,
        height: 50,
        right: 150,
        bottom: 150,
        x: 100,
        y: 100,
        toJSON: () => ({}),
      }),
    })
    mount(Tour, {
      props: { open: true, steps: [{ title: 'No arrow', target }], current: 0, arrow: false },
      attachTo: document.body,
    })
    await nextTick()
    expect(findInBody('.ccui-tour__arrow').length).toBe(0)
    document.body.removeChild(target)
  })

  it('does not render arrow for no-target centered modal', async () => {
    mount(Tour, {
      props: { open: true, steps: [{ title: 'Centered' }], current: 0, arrow: true },
      attachTo: document.body,
    })
    await nextTick()
    expect(findInBody('.ccui-tour__arrow').length).toBe(0)
  })
})

describe('tour cover', () => {
  it('renders cover image from step.cover string', async () => {
    const steps = [{ title: 'Cover', cover: 'https://example.com/img.png' }]
    mount(Tour, {
      props: { open: true, steps, current: 0 },
      attachTo: document.body,
    })
    await nextTick()
    const cover = document.body.querySelector('.ccui-tour__cover')
    expect(cover).toBeTruthy()
    expect(cover!.querySelector('img')?.getAttribute('src')).toBe('https://example.com/img.png')
  })

  it('does not render cover when step has no cover', async () => {
    mount(Tour, {
      props: { open: true, steps: STEPS, current: 0 },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.ccui-tour__cover')).toBeNull()
  })
})
