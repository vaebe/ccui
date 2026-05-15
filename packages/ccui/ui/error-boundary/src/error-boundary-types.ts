import type { ExtractPropTypes } from 'vue'

/**
 * 对标 ant `Alert.ErrorBoundary`：错误边界容器。Vue 内部用 `onErrorCaptured` 实现。
 *
 * **不挂到 Alert**（与 ccui 整体「不挂静态属性命名空间」原则一致），平铺独立顶层组件 `<c-error-boundary>`。
 *
 * 用法：
 *
 * ```vue
 * <c-error-boundary message="组件加载失败" description="请刷新页面或联系管理员">
 *   <SomeComponentThatMightThrow />
 * </c-error-boundary>
 * ```
 *
 * 子节点抛出错误时，渲染 Alert（type=error）替代 default slot。
 *
 * **限制**：Vue 的 `onErrorCaptured` 同 React error boundary 一样**只捕同步渲染错误 + lifecycle hook 错误**；不捕异步操作（setTimeout/Promise reject）内部抛的错。业务侧应在 setup 顶层用 try/catch 包异步逻辑，把错误存到 ref 后让 ErrorBoundary 通过 `setError(...)` slot prop 渲染。
 */
export const errorBoundaryProps = {
  /**
   * 错误标题。slot `message` 优先于 prop。
   */
  message: {
    type: String,
    default: '',
  },
  /**
   * 错误描述。slot `description` 优先于 prop。
   */
  description: {
    type: String,
    default: '',
  },
} as const

export type ErrorBoundaryProps = ExtractPropTypes<typeof errorBoundaryProps>
