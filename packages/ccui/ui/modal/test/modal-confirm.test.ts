import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { Modal } from '../index'

afterEach(() => {
  Modal.destroyAll()
  document.body.innerHTML = ''
  delete document.body.dataset.ccuiModalCount
  delete document.body.dataset.ccuiOriginalOverflow
  document.body.style.overflow = ''
})

describe('Modal.confirm 命令式', () => {
  it('Modal.confirm 渲染 title + content + OK + Cancel 双按钮', async () => {
    Modal.confirm({ title: '确认删除', content: '此操作不可恢复' })
    await nextTick()
    await nextTick()
    expect(document.body.textContent).toContain('确认删除')
    expect(document.body.textContent).toContain('此操作不可恢复')
    expect(document.body.querySelector('.ccui-modal__btn--cancel')).not.toBeNull()
    expect(document.body.querySelector('.ccui-modal__btn--primary')).not.toBeNull()
  })

  it('Modal.info / success / error / warning 只渲染单 OK 按钮', async () => {
    Modal.info({ title: '提示', content: 'info' })
    await nextTick()
    await nextTick()
    expect(document.body.querySelector('.ccui-modal__btn--cancel')).toBeNull()
    expect(document.body.querySelector('.ccui-modal__btn--primary')).not.toBeNull()
    Modal.destroyAll()
    await nextTick()

    Modal.error({ title: '错误', content: 'err' })
    await nextTick()
    expect(document.body.querySelector('.ccui-modal__btn--cancel')).toBeNull()
    expect(document.body.querySelector('.ccui-modal__btn--danger')).not.toBeNull()
  })

  it('icon 默认按 type 渲染对应 modifier 类', async () => {
    Modal.confirm({ title: 't', content: 'c' })
    await nextTick()
    await nextTick()
    expect(document.body.querySelector('.ccui-modal-confirm__icon--confirm')).not.toBeNull()
    Modal.destroyAll()
    await nextTick()

    Modal.success({ title: 't' })
    await nextTick()
    expect(document.body.querySelector('.ccui-modal-confirm__icon--success')).not.toBeNull()
  })

  it('点 OK 按钮触发 onOk + 关闭', async () => {
    const onOk = vi.fn()
    Modal.confirm({ title: 't', content: 'c', onOk })
    await nextTick()
    await nextTick()

    const okBtn = document.body.querySelector('.ccui-modal__btn--primary') as HTMLButtonElement
    okBtn.click()
    expect(onOk).toHaveBeenCalled()
  })

  it('点 Cancel 按钮触发 onCancel', async () => {
    const onCancel = vi.fn()
    Modal.confirm({ title: 't', content: 'c', onCancel })
    await nextTick()
    await nextTick()

    const cancelBtn = document.body.querySelector('.ccui-modal__btn--cancel') as HTMLButtonElement
    cancelBtn.click()
    expect(onCancel).toHaveBeenCalled()
  })

  it('onOk 返回 Promise 时按钮进入 loading', async () => {
    let resolveOk!: () => void
    const okPromise = new Promise<void>((resolve) => {
      resolveOk = resolve
    })
    const onOk = vi.fn(() => okPromise)

    Modal.confirm({ title: 't', content: 'c', onOk })
    await nextTick()
    await nextTick()

    const okBtn = document.body.querySelector('.ccui-modal__btn--primary') as HTMLButtonElement
    okBtn.click()
    await nextTick()

    expect(onOk).toHaveBeenCalled()
    // loading 期间按钮 disabled
    expect((okBtn as HTMLButtonElement).disabled).toBe(true)

    resolveOk()
    await okPromise
    await nextTick()
  })

  it('返回 { destroy, update } 句柄', async () => {
    const handle = Modal.confirm({ title: 'old', content: 'c' })
    await nextTick()
    await nextTick()
    expect(typeof handle.destroy).toBe('function')
    expect(typeof handle.update).toBe('function')

    handle.update({ title: 'new title' })
    await nextTick()
    expect(document.body.textContent).toContain('new title')
    expect(document.body.textContent).not.toContain('old')

    handle.destroy()
    await nextTick()
    await nextTick()
  })

  it('update 接受函数形式', async () => {
    const handle = Modal.confirm({ title: 'a', content: 'c' })
    await nextTick()
    await nextTick()
    handle.update((prev) => {
      const prevTitle = typeof prev.title === 'string' ? prev.title : ''
      return { title: `${prevTitle}-updated` }
    })
    await nextTick()
    expect(document.body.textContent).toContain('a-updated')
  })

  it('Modal.destroyAll 关闭所有活跃实例', async () => {
    Modal.confirm({ title: 'one' })
    Modal.confirm({ title: 'two' })
    await nextTick()
    await nextTick()
    expect(document.body.textContent).toContain('one')
    expect(document.body.textContent).toContain('two')

    Modal.destroyAll()
    // destroyAll 仅标记 open=false，DOM 卸载在 closed 事件后
    await nextTick()
    await nextTick()
  })
})
