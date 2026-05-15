import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject, nextTick, ref } from 'vue'
import { Modal } from '../index'
import { useModal } from '../src/use-modal'

afterEach(() => {
  Modal.destroyAll()
  document.body.innerHTML = ''
  delete document.body.dataset.ccuiModalCount
  delete document.body.dataset.ccuiOriginalOverflow
  document.body.style.overflow = ''
})

function makeWrapper() {
  const api: { current: ReturnType<typeof useModal> | null } = { current: null }
  const Comp = defineComponent({
    setup() {
      const { modal, holder } = useModal()
      api.current = { modal, holder }
      return () => h(holder)
    },
  })
  const wrapper = mount(Comp, { attachTo: document.body })
  return { wrapper, api }
}

describe('useModal composable', () => {
  it('returns { modal, holder } object (NOT tuple)', () => {
    const { wrapper, api } = makeWrapper()
    expect(api.current).not.toBeNull()
    expect(typeof api.current!.modal).toBe('object')
    expect(typeof api.current!.holder).toBe('object')
    expect(Array.isArray(api.current)).toBe(false)
    wrapper.unmount()
  })

  it('modal.confirm() renders dialog body', async () => {
    const { wrapper, api } = makeWrapper()
    api.current!.modal.confirm({ title: 'hook-confirm', content: 'body' })
    await nextTick()
    await nextTick()
    expect(document.body.textContent).toContain('hook-confirm')
    expect(document.body.textContent).toContain('body')
    wrapper.unmount()
  })

  it('returns destroy / update handle', async () => {
    const { wrapper, api } = makeWrapper()
    const handle = api.current!.modal.confirm({ title: 'a', content: 'c' })
    await nextTick()
    await nextTick()
    expect(typeof handle.destroy).toBe('function')
    expect(typeof handle.update).toBe('function')
    handle.update({ title: 'b' })
    await nextTick()
    expect(document.body.textContent).toContain('b')
    wrapper.unmount()
  })

  it('modal.info/success/error/warning shortcuts', async () => {
    const { wrapper, api } = makeWrapper()
    api.current!.modal.info({ title: 'i' })
    await nextTick()
    await nextTick()
    expect(document.body.querySelector('.ccui-modal-confirm__icon--info')).not.toBeNull()
    Modal.destroyAll()
    await nextTick()

    api.current!.modal.success({ title: 's' })
    await nextTick()
    expect(document.body.querySelector('.ccui-modal-confirm__icon--success')).not.toBeNull()
    wrapper.unmount()
  })

  it('inherits provide/inject from parent Vue tree (核心存在理由)', async () => {
    const captured = ref<string | null>(null)
    let triggered = false

    const Parent = defineComponent({
      provide() {
        return { 'parent-theme': 'dark' }
      },
      setup() {
        const { modal, holder } = useModal()
        return () => {
          // 在子组件可见时手动触发一次（避免 setup 内立刻同步打开）
          if (!triggered) {
            triggered = true
            // 用 defineComponent 内部子组件 inject
            const Probe = defineComponent({
              setup() {
                captured.value = inject<string>('parent-theme', 'NONE')
                return () => null
              },
            })
            modal.confirm({ title: 't', content: h(Probe) })
          }
          return h('div', [h(holder)])
        }
      },
    })
    const wrapper = mount(Parent, { attachTo: document.body })
    await nextTick()
    await nextTick()
    expect(captured.value).toBe('dark')
    wrapper.unmount()
  })

  it('onOk Promise loading', async () => {
    const { wrapper, api } = makeWrapper()
    let resolveOk!: () => void
    const okPromise = new Promise<void>((resolve) => {
      resolveOk = resolve
    })
    const onOk = vi.fn(() => okPromise)
    api.current!.modal.confirm({ title: 't', onOk })
    await nextTick()
    await nextTick()
    const okBtn = document.body.querySelector('.ccui-modal__btn--primary') as HTMLButtonElement
    okBtn.click()
    await nextTick()
    expect((okBtn as HTMLButtonElement).disabled).toBe(true)
    resolveOk()
    await okPromise
    await nextTick()
    wrapper.unmount()
  })
})
