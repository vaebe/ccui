import type { Component } from 'vue'
import type {
  NotificationAriaRole,
  NotificationGlobalConfig,
  NotificationHandle,
  NotificationOptions,
  NotificationPlacement,
  NotificationType,
} from './notification-types'
import { createApp, h, reactive } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import NotificationItem from './notification-item'
import './notification.scss'

interface NotificationInstance {
  id: string
  options: NotificationOptions
}

const PLACEMENTS: NotificationPlacement[] = ['top', 'topRight', 'topLeft', 'bottom', 'bottomRight', 'bottomLeft']

let counter = 0
const ns = useNamespace('notification')
const containers = new Map<NotificationPlacement, HTMLElement>()
const apps = new Map<NotificationPlacement, ReturnType<typeof createApp>>()
const lists = reactive<Record<NotificationPlacement, NotificationInstance[]>>({
  top: [],
  topRight: [],
  topLeft: [],
  bottom: [],
  bottomRight: [],
  bottomLeft: [],
})

const globalConfig: NotificationGlobalConfig = {
  duration: 4.5,
  maxCount: Infinity,
  stack: false,
  pauseOnHover: true,
  role: 'alert',
  placement: 'topRight',
}

// duration ms→s 归一化：同 message 逻辑
function normalizeDuration(input: number | undefined, defaultSeconds: number): number {
  const v = input === undefined ? defaultSeconds : input
  if (v === 0) return 0
  if (v > 100) return v
  return v * 1000
}

function ensureContainer(placement: NotificationPlacement) {
  if (containers.has(placement)) return
  const el = document.createElement('div')
  el.className = `${ns.b()} ${ns.m(placement)}`
  if (globalConfig.stack) el.classList.add(ns.m('stack'))
  if (placement === 'top' || placement.startsWith('top')) {
    if (globalConfig.top !== undefined) {
      el.style.top = typeof globalConfig.top === 'number' ? `${globalConfig.top}px` : globalConfig.top
    }
  }
  if (placement === 'bottom' || placement.startsWith('bottom')) {
    if (globalConfig.bottom !== undefined) {
      el.style.bottom = typeof globalConfig.bottom === 'number' ? `${globalConfig.bottom}px` : globalConfig.bottom
    }
  }
  const host = globalConfig.getContainer ? globalConfig.getContainer() : document.body
  host.appendChild(el)
  containers.set(placement, el)

  const Container: Component = {
    name: `CNotificationContainer-${placement}`,
    setup() {
      const onDestroy = (id: string) => {
        const arr = lists[placement]
        const idx = arr.findIndex((it) => it.id === id)
        if (idx !== -1) arr.splice(idx, 1)
      }
      return () =>
        lists[placement].map((it) =>
          h(NotificationItem, {
            key: it.id,
            id: it.id,
            title: it.options.title ?? '',
            description: it.options.description as string,
            type: it.options.type ?? 'info',
            duration: normalizeDuration(it.options.duration, globalConfig.duration ?? 4.5),
            showClose: it.options.showClose ?? true,
            icon: it.options.icon ?? '',
            customClass: it.options.customClass ?? '',
            role: it.options.role ?? globalConfig.role ?? 'alert',
            pauseOnHover: it.options.pauseOnHover ?? globalConfig.pauseOnHover ?? true,
            classNames: it.options.classNames,
            styles: it.options.styles,
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

function enforceMaxCount(placement: NotificationPlacement) {
  const cap = globalConfig.maxCount ?? Infinity
  if (!isFinite(cap) || cap <= 0) return
  const arr = lists[placement]
  // 被挤掉的通知也要触发 onClose，避免用户注册的回调被静默吞掉
  while (arr.length > cap) {
    const removed = arr.shift()
    removed?.options.onClose?.()
  }
}

function open(options: NotificationOptions): NotificationHandle {
  const placement = options.placement ?? globalConfig.placement ?? 'topRight'
  ensureContainer(placement)
  const id = `noti-${++counter}`
  lists[placement].push({ id, options })
  enforceMaxCount(placement)

  return {
    close: () => {
      const arr = lists[placement]
      const idx = arr.findIndex((it) => it.id === id)
      if (idx !== -1) arr.splice(idx, 1)
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
  config(cfg: NotificationGlobalConfig) {
    Object.assign(globalConfig, cfg)
    containers.forEach((el) => {
      if (globalConfig.stack) el.classList.add(ns.m('stack'))
      else el.classList.remove(ns.m('stack'))
    })
  },
  destroy(): void {
    PLACEMENTS.forEach((p) => {
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

export const _notificationInternal = {
  normalizeDuration,
  globalConfig,
  PLACEMENTS,
}

export default notification
export type { NotificationAriaRole }
