import type { Component } from 'vue'
import type { MessageGlobalConfig, MessageHandle, MessageOptions, MessagePlacement, MessageType } from './message-types'
import { defineComponent, h, reactive, Teleport } from 'vue'
import MessageItem from './message-item'
import './message.scss'

interface MessageInstance {
  id: string
  options: MessageOptions
}

const PLACEMENTS: MessagePlacement[] = ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight']

function normalizeDuration(input: number | undefined, defaultSeconds: number): number {
  const v = input === undefined ? defaultSeconds : input
  if (v === 0) return 0
  if (v > 100) return v
  return v * 1000
}

export interface UseMessageReturn {
  message: {
    open(options: MessageOptions): MessageHandle
    info(content: string | MessageOptions, duration?: number): MessageHandle
    success(content: string | MessageOptions, duration?: number): MessageHandle
    warning(content: string | MessageOptions, duration?: number): MessageHandle
    error(content: string | MessageOptions, duration?: number): MessageHandle
    loading(content: string | MessageOptions, duration?: number): MessageHandle
    config(cfg: MessageGlobalConfig): void
    destroy(): void
  }
  holder: Component
}

let instanceCounter = 0

/**
 * `useMessage()`：返回 `{ message, holder }` 对象（**不是 React 风格元组**）。
 *
 * - `holder` 是 Vue 组件，必须挂到模板中：`<component :is="holder" />`
 * - 容器渲染在当前 Vue 子树里，自动继承父组件 provide 的 ConfigProvider / 主题等上下文
 * - 与模块级 `message` 不同：模块级用独立 `createApp`，**无法**拿到调用方应用的 inject
 *
 * @example
 * ```vue
 * <script setup>
 * const { message, holder } = useMessage()
 * message.success('hi', 2)
 * </script>
 * <template>
 *   <component :is="holder" />
 * </template>
 * ```
 */
export function useMessage(): UseMessageReturn {
  const tag = `use-msg-${++instanceCounter}`
  let counter = 0

  const lists = reactive<Record<MessagePlacement, MessageInstance[]>>({
    top: [],
    topLeft: [],
    topRight: [],
    bottom: [],
    bottomLeft: [],
    bottomRight: [],
  })

  const config: MessageGlobalConfig = {
    duration: 3,
    maxCount: Infinity,
    stack: false,
    pauseOnHover: true,
    role: 'alert',
  }

  function enforceMaxCount(placement: MessagePlacement) {
    const cap = config.maxCount ?? Infinity
    if (!isFinite(cap) || cap <= 0) return
    const arr = lists[placement]
    while (arr.length > cap) arr.shift()
  }

  function open(options: MessageOptions): MessageHandle {
    const placement = options.placement ?? 'top'
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
    config(cfg: MessageGlobalConfig) {
      Object.assign(config, cfg)
    },
    destroy() {
      PLACEMENTS.forEach((p) => {
        lists[p].splice(0, lists[p].length)
      })
    },
  }

  const holder: Component = defineComponent({
    name: 'CMessageHolder',
    setup() {
      const onDestroy = (placement: MessagePlacement, id: string) => {
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
              class: ['ccui-message', `ccui-message--${p}`, config.stack && 'ccui-message--stack'],
              style: containerStyle,
            },
            lists[p].map((it) =>
              h(MessageItem, {
                key: it.id,
                id: it.id,
                content: it.options.content as string,
                type: it.options.type ?? 'info',
                duration: normalizeDuration(it.options.duration, config.duration ?? 3),
                showClose: it.options.showClose ?? false,
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

  return { message, holder }
}
