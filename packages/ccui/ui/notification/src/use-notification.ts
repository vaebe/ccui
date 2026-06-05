import type { Component } from 'vue'
import type {
  NotificationGlobalConfig,
  NotificationHandle,
  NotificationOptions,
  NotificationPlacement,
  NotificationType,
} from './notification-types'
import { defineComponent, h, reactive, Teleport } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import NotificationItem from './notification-item'
import './notification.scss'

interface NotificationInstance {
  id: string
  options: NotificationOptions
}

const PLACEMENTS: NotificationPlacement[] = ['top', 'topRight', 'topLeft', 'bottom', 'bottomRight', 'bottomLeft']

function normalizeDuration(input: number | undefined, defaultSeconds: number): number {
  const v = input === undefined ? defaultSeconds : input
  if (v === 0) return 0
  if (v > 100) return v
  return v * 1000
}

export interface UseNotificationReturn {
  notification: {
    open(options: NotificationOptions): NotificationHandle
    info(options: NotificationOptions): NotificationHandle
    success(options: NotificationOptions): NotificationHandle
    warning(options: NotificationOptions): NotificationHandle
    error(options: NotificationOptions): NotificationHandle
    config(cfg: NotificationGlobalConfig): void
    destroy(): void
  }
  holder: Component
}

let instanceCounter = 0

/**
 * `useNotification()`：返回 `{ notification, holder }` 对象（**不是 React 风格元组**）。
 *
 * - `holder` 是 Vue 组件，必须挂到模板中：`<component :is="holder" />`
 * - 容器渲染在当前 Vue 子树里，自动继承父组件 provide 的 ConfigProvider / 主题等上下文
 * - 与模块级 `notification` 不同：模块级用独立 `createApp`，**无法**拿到调用方应用的 inject
 *
 * @example
 * ```vue
 * <script setup>
 * const { notification, holder } = useNotification()
 * notification.success({ title: 'hi', duration: 2 })
 * </script>
 * <template>
 *   <component :is="holder" />
 * </template>
 * ```
 */
export function useNotification(): UseNotificationReturn {
  const tag = `use-noti-${++instanceCounter}`
  let counter = 0

  const lists = reactive<Record<NotificationPlacement, NotificationInstance[]>>({
    top: [],
    topRight: [],
    topLeft: [],
    bottom: [],
    bottomRight: [],
    bottomLeft: [],
  })

  const config: NotificationGlobalConfig = {
    duration: 4.5,
    maxCount: Infinity,
    stack: false,
    pauseOnHover: true,
    role: 'alert',
    placement: 'topRight',
  }

  function enforceMaxCount(placement: NotificationPlacement) {
    const cap = config.maxCount ?? Infinity
    if (!isFinite(cap) || cap <= 0) return
    const arr = lists[placement]
    // 被挤掉的通知也要触发 onClose，避免用户注册的回调被静默吞掉
    while (arr.length > cap) {
      const removed = arr.shift()
      removed?.options.onClose?.()
    }
  }

  function open(options: NotificationOptions): NotificationHandle {
    const placement = options.placement ?? config.placement ?? 'topRight'
    const id = `${tag}-${++counter}`
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
      Object.assign(config, cfg)
    },
    destroy() {
      PLACEMENTS.forEach((p) => {
        lists[p].splice(0, lists[p].length)
      })
    },
  }

  const holder: Component = defineComponent({
    name: 'CNotificationHolder',
    setup() {
      const ns = useNamespace('notification')
      const onDestroy = (placement: NotificationPlacement, id: string) => {
        const arr = lists[placement]
        const idx = arr.findIndex((it) => it.id === id)
        if (idx !== -1) arr.splice(idx, 1)
      }

      return () => {
        const containers = PLACEMENTS.filter((p) => lists[p].length > 0).map((p) => {
          const containerStyle: Record<string, string> = {}
          if ((p === 'top' || p.startsWith('top')) && config.top !== undefined) {
            containerStyle.top = typeof config.top === 'number' ? `${config.top}px` : String(config.top)
          }
          if ((p === 'bottom' || p.startsWith('bottom')) && config.bottom !== undefined) {
            containerStyle.bottom = typeof config.bottom === 'number' ? `${config.bottom}px` : String(config.bottom)
          }

          return h(
            'div',
            {
              key: p,
              class: [ns.b(), ns.m(p), config.stack && ns.m('stack')],
              style: containerStyle,
            },
            lists[p].map((it) =>
              h(NotificationItem, {
                key: it.id,
                id: it.id,
                title: it.options.title ?? '',
                description: it.options.description as string,
                type: it.options.type ?? 'info',
                duration: normalizeDuration(it.options.duration, config.duration ?? 4.5),
                showClose: it.options.showClose ?? true,
                icon: it.options.icon ?? '',
                customClass: it.options.customClass ?? '',
                role: it.options.role ?? config.role ?? 'alert',
                pauseOnHover: it.options.pauseOnHover ?? config.pauseOnHover ?? true,
                classNames: it.options.classNames,
                styles: it.options.styles,
                onClose: () => it.options.onClose?.(),
                onDestroy: () => onDestroy(p, it.id),
              }),
            ),
          )
        })

        if (containers.length === 0) return null
        const target = config.getContainer ? config.getContainer() : 'body'
        return h(Teleport, { to: target }, containers)
      }
    },
  })

  return { notification, holder }
}
