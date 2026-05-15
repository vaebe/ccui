import type { ErrorBoundaryProps } from './error-boundary-types'
import { defineComponent, onErrorCaptured, ref } from 'vue'
import Alert from '../../alert/src/alert'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { errorBoundaryProps } from './error-boundary-types'

export default defineComponent({
  name: 'CErrorBoundary',
  props: errorBoundaryProps,
  emits: ['error', 'reset'],
  setup(props: ErrorBoundaryProps, { slots, emit, expose }) {
    const ns = useNamespace('error-boundary')

    const error = ref<Error | null>(null)
    const errorInfo = ref<string>('')

    // Vue 的错误传播：返回 false 即停止向上冒泡，由本 boundary 承担。
    onErrorCaptured((err, _instance, info) => {
      error.value = err instanceof Error ? err : new Error(String(err))
      errorInfo.value = info
      emit('error', error.value, info)
      // 阻止继续往上冒泡（不影响 app errorHandler 仍能在 emit 之前处理）。
      return false
    })

    // 业务侧重试 / 显式重置
    const reset = () => {
      error.value = null
      errorInfo.value = ''
      emit('reset')
    }

    // 暴露给父组件：通过 ref 调用 reset 重置错误态。
    expose({ reset, error })

    return () => {
      if (error.value) {
        // 自定义 fallback slot 优先
        if (slots.fallback) {
          return slots.fallback({ error: error.value, errorInfo: errorInfo.value, reset })
        }
        const message = slots.message ? slots.message() : props.message || error.value.message || 'Something went wrong'
        const description = slots.description
          ? slots.description()
          : props.description || (errorInfo.value ? `(${errorInfo.value})` : '')
        return (
          <div class={ns.b()}>
            <Alert type="error" showIcon message={message} description={description} />
          </div>
        )
      }
      return slots.default ? slots.default() : null
    }
  },
})
