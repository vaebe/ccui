import type { AppContext, AppProps } from './app-types'
import { defineComponent, inject, provide } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { APP_INJECT_KEY, appProps } from './app-types'
import './app.scss'

function noop() {
  if (typeof console !== 'undefined') {
    console.warn('[ccui:App] 静态方法尚未挂载，需先在应用根部包裹 <c-app />。')
  }
}

const defaultApi = {
  info: noop,
  success: noop,
  warning: noop,
  error: noop,
}

export function useApp(): AppContext {
  return inject<AppContext>(APP_INJECT_KEY, {
    message: { ...defaultApi },
    notification: { ...defaultApi },
    modal: { ...defaultApi },
  })
}

export const App = defineComponent({
  name: 'CApp',
  props: appProps,
  setup(props: AppProps, { slots }) {
    const ns = useNamespace('app')

    // 后续 message / notification / modal 注册时，会通过 provide 替换这些 api
    const ctx: AppContext = {
      message: { ...defaultApi },
      notification: { ...defaultApi },
      modal: { ...defaultApi },
    }
    provide<AppContext>(APP_INJECT_KEY, ctx)

    return () => <div class={[ns.b(), props.className]}>{slots.default?.()}</div>
  },
})
