import type { Component } from 'vue'
import type {
  NotificationHandle,
  NotificationOptions,
  NotificationPlacement,
  NotificationType,
} from './notification-types'
import { createApp, h, reactive } from 'vue'
import NotificationItem from './notification-item'
import './notification.scss'

interface NotificationInstance {
  id: string
  options: NotificationOptions
}

let counter = 0
const containers = new Map<NotificationPlacement, HTMLElement>()
const apps = new Map<NotificationPlacement, ReturnType<typeof createApp>>()
const lists = reactive<Record<NotificationPlacement, NotificationInstance[]>>({
  topRight: [],
  topLeft: [],
  bottomRight: [],
  bottomLeft: [],
})

function ensureContainer(placement: NotificationPlacement) {
  if (containers.has(placement)) {
    return
  }
  const el = document.createElement('div')
  el.className = `ccui-notification ccui-notification--${placement}`
  document.body.appendChild(el)
  containers.set(placement, el)

  const Container: Component = {
    name: `CNotificationContainer-${placement}`,
    setup() {
      const onDestroy = (id: string) => {
        const arr = lists[placement]
        const idx = arr.findIndex((it) => it.id === id)
        if (idx !== -1) {
          arr.splice(idx, 1)
        }
      }
      return () =>
        lists[placement].map((it) =>
          h(NotificationItem, {
            key: it.id,
            id: it.id,
            title: it.options.title ?? '',
            description: it.options.description as string,
            type: it.options.type ?? 'info',
            duration: it.options.duration ?? 4500,
            showClose: it.options.showClose ?? true,
            icon: it.options.icon ?? '',
            customClass: it.options.customClass ?? '',
            onClose: () => it.options.onClose?.(),
            onDestroy: () => onDestroy(it.id),
          }),
        )
    },
  }

  const inst = createApp(Container)
  inst.mount(el)
  apps.set(placement, inst)
}

function open(options: NotificationOptions): NotificationHandle {
  const placement = options.placement ?? 'topRight'
  ensureContainer(placement)
  const id = `noti-${++counter}`
  lists[placement].push({ id, options })

  return {
    close: () => {
      const arr = lists[placement]
      const idx = arr.findIndex((it) => it.id === id)
      if (idx !== -1) {
        arr.splice(idx, 1)
      }
    },
  }
}

function buildShortcut(type: NotificationType) {
  return (options: NotificationOptions): NotificationHandle => open({ ...options, type })
}

const notification = {
  open,
  info: buildShortcut('info'),
  success: buildShortcut('success'),
  warning: buildShortcut('warning'),
  error: buildShortcut('error'),
  destroy() {
    ;(['topRight', 'topLeft', 'bottomRight', 'bottomLeft'] as NotificationPlacement[]).forEach((p) => {
      lists[p].splice(0, lists[p].length)
      const inst = apps.get(p)
      const el = containers.get(p)
      if (inst) {
        inst.unmount()
        apps.delete(p)
      }
      if (el) {
        el.remove()
        containers.delete(p)
      }
    })
  },
}

export default notification
