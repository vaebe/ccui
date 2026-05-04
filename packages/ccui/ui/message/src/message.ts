import type { Component } from 'vue'
import type { MessageHandle, MessageOptions, MessageType } from './message-types'
import { createApp, h, ref } from 'vue'
import MessageItem from './message-item'
import './message.scss'

interface MessageInstance {
  id: string
  options: MessageOptions
}

let counter = 0
let containerEl: HTMLElement | null = null
let appInstance: ReturnType<typeof createApp> | null = null
const items = ref<MessageInstance[]>([])

function ensureContainer() {
  if (containerEl) {
    return
  }
  containerEl = document.createElement('div')
  containerEl.className = 'ccui-message'
  document.body.appendChild(containerEl)

  const Container: Component = {
    name: 'CMessageContainer',
    setup() {
      const onDestroy = (id: string) => {
        const idx = items.value.findIndex((it) => it.id === id)
        if (idx !== -1) {
          items.value.splice(idx, 1)
        }
      }
      return () =>
        items.value.map((it) =>
          h(MessageItem, {
            key: it.id,
            id: it.id,
            content: it.options.content as string,
            type: it.options.type ?? 'info',
            duration: it.options.duration ?? 3000,
            showClose: it.options.showClose ?? false,
            icon: it.options.icon ?? '',
            customClass: it.options.customClass ?? '',
            onClose: () => it.options.onClose?.(),
            onDestroy: () => onDestroy(it.id),
          }),
        )
    },
  }

  appInstance = createApp(Container)
  appInstance.mount(containerEl)
}

function open(options: MessageOptions): MessageHandle {
  ensureContainer()
  const id = `msg-${++counter}`
  items.value.push({ id, options })

  return {
    close: () => {
      const idx = items.value.findIndex((it) => it.id === id)
      if (idx !== -1) {
        items.value.splice(idx, 1)
      }
    },
  }
}

function buildShortcut(type: MessageType) {
  return (content: string | MessageOptions, duration?: number): MessageHandle => {
    const opts: MessageOptions = typeof content === 'string' ? { content, type, duration } : { ...content, type }
    return open(opts)
  }
}

const message = {
  open,
  info: buildShortcut('info'),
  success: buildShortcut('success'),
  warning: buildShortcut('warning'),
  error: buildShortcut('error'),
  loading: buildShortcut('loading'),
  destroy() {
    items.value = []
    if (appInstance) {
      appInstance.unmount()
      appInstance = null
    }
    if (containerEl) {
      containerEl.remove()
      containerEl = null
    }
  },
}

export default message
