import type { Component } from 'vue'
import type {
  MessageAriaRole,
  MessageGlobalConfig,
  MessageHandle,
  MessageOptions,
  MessagePlacement,
  MessageType,
} from './message-types'
import { createApp, h, reactive } from 'vue'
import MessageItem from './message-item'
import './message.scss'

interface MessageInstance {
  id: string
  options: MessageOptions
}

const PLACEMENTS: MessagePlacement[] = ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight']

let counter = 0
const containers = new Map<MessagePlacement, HTMLElement>()
const apps = new Map<MessagePlacement, ReturnType<typeof createApp>>()
const lists = reactive<Record<MessagePlacement, MessageInstance[]>>({
  top: [],
  topLeft: [],
  topRight: [],
  bottom: [],
  bottomLeft: [],
  bottomRight: [],
})

// 模块级全局配置（message.config(...) 设置）
const globalConfig: MessageGlobalConfig = {
  duration: 3,
  maxCount: Infinity,
  stack: false,
  pauseOnHover: true,
  role: 'alert',
}

// duration ms→s 归一化
// - 0 → 0（不自动关闭，与历史一致）
// - ≤ 100 → 视为秒（ant 主路径：3 → 3s / 1.5 → 1.5s）
// - > 100 → 视为毫秒（兼容历史 ms 写法：3000 / 4500）
function normalizeDuration(input: number | undefined, defaultSeconds: number): number {
  const v = input === undefined ? defaultSeconds : input
  if (v === 0) return 0
  if (v > 100) return v
  return v * 1000
}

function ensureContainer(placement: MessagePlacement) {
  if (containers.has(placement)) return
  const el = document.createElement('div')
  el.className = `ccui-message ccui-message--${placement}`
  if (globalConfig.stack) el.classList.add('ccui-message--stack')
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
    name: `CMessageContainer-${placement}`,
    setup() {
      const onDestroy = (id: string) => {
        const arr = lists[placement]
        const idx = arr.findIndex((it) => it.id === id)
        if (idx !== -1) arr.splice(idx, 1)
      }
      return () =>
        lists[placement].map((it) =>
          h(MessageItem, {
            key: it.id,
            id: it.id,
            content: it.options.content as string,
            type: it.options.type ?? 'info',
            duration: normalizeDuration(it.options.duration, globalConfig.duration ?? 3),
            showClose: it.options.showClose ?? false,
            icon: it.options.icon ?? '',
            customClass: it.options.customClass ?? '',
            role: it.options.role ?? globalConfig.role ?? 'alert',
            pauseOnHover: it.options.pauseOnHover ?? globalConfig.pauseOnHover ?? true,
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

function enforceMaxCount(placement: MessagePlacement) {
  const cap = globalConfig.maxCount ?? Infinity
  if (!isFinite(cap) || cap <= 0) return
  const arr = lists[placement]
  while (arr.length > cap) arr.shift()
}

function open(options: MessageOptions): MessageHandle {
  const placement = options.placement ?? 'top'
  ensureContainer(placement)
  const id = `msg-${++counter}`
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
  // L-3.5：模块级配置，对齐 ant `message.config({ top, duration, maxCount, ... })`
  config(cfg: MessageGlobalConfig) {
    Object.assign(globalConfig, cfg)
    // stack class 切换：已挂载容器同步刷新
    containers.forEach((el) => {
      if (globalConfig.stack) el.classList.add('ccui-message--stack')
      else el.classList.remove('ccui-message--stack')
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

// 暴露内部句柄给 composable / useMessage 复用模块级实例
export const _messageInternal = {
  normalizeDuration,
  globalConfig,
  PLACEMENTS,
}

export default message
export type { MessageAriaRole }
