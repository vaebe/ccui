import type { CSSProperties } from 'vue'
import type { ConfigContext, ConfigProviderProps, Locale } from './config-provider-types'
import { computed, defineComponent, inject, provide } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import defaultLocale from '../../locale/zh-CN'
import { CONFIG_INJECT_KEY, configProviderProps } from './config-provider-types'

/**
 * 合并 user locale 与 zhCN 默认 locale；按 namespace 浅合并，
 * 用户没覆盖的子 key 自动回退到 zhCN，避免 cfg.locale.Modal?.okText 这种深取值时变 undefined。
 */
function mergeLocale(user?: Locale): Locale {
  if (!user) {
    return defaultLocale
  }
  const merged: Locale = { ...defaultLocale, ...user }
  for (const ns of Object.keys(defaultLocale) as (keyof Locale)[]) {
    if (typeof defaultLocale[ns] === 'object' && defaultLocale[ns] !== null) {
      merged[ns] = { ...(defaultLocale[ns] as object), ...((user[ns] as object) ?? {}) }
    }
  }
  return merged
}

export function useConfig(): ConfigContext {
  return inject<ConfigContext>(CONFIG_INJECT_KEY, {
    prefixCls: 'ccui',
    componentSize: 'middle',
    locale: defaultLocale,
    direction: 'ltr',
    theme: undefined,
    iconPrefixCls: 'ccui-icon',
  })
}

export const ConfigProvider = defineComponent({
  name: 'CConfigProvider',
  props: configProviderProps,
  setup(props: ConfigProviderProps, { slots }) {
    const ns = useNamespace('config-provider')

    const ctx = computed<ConfigContext>(() => ({
      prefixCls: props.prefixCls,
      componentSize: props.componentSize,
      locale: mergeLocale(props.locale),
      direction: props.direction,
      theme: props.theme,
      iconPrefixCls: props.iconPrefixCls,
    }))

    provide<ConfigContext>(CONFIG_INJECT_KEY, ctx.value)

    const tokenStyle = computed<CSSProperties>(() => {
      const style: Record<string, string> = {}
      const tokens = props.theme?.token
      if (tokens) {
        for (const k in tokens) {
          // 把 colorPrimary 等 camelCase token 名称映射到 --ccui-color-primary
          const cssVarName = `--${props.prefixCls}-${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`
          style[cssVarName] = String(tokens[k])
        }
      }
      return style as CSSProperties
    })

    return () => (
      <div class={ns.b()} style={tokenStyle.value} dir={props.direction}>
        {slots.default?.()}
      </div>
    )
  },
})
