import type { ExtractPropTypes } from 'vue'

export const appProps = {
  // 用作命名空间的 className
  className: {
    type: String,
    default: '',
  },
} as const

export type AppProps = ExtractPropTypes<typeof appProps>

export const APP_INJECT_KEY = Symbol('ccui-app')

// 后续 message / notification / modal 静态方法都通过此上下文挂载
export interface AppMessageApi {
  info?: (content: string) => void
  success?: (content: string) => void
  warning?: (content: string) => void
  error?: (content: string) => void
}

export interface AppContext {
  message: AppMessageApi
  notification: AppMessageApi
  modal: AppMessageApi
}
