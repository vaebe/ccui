import type { CSSProperties } from 'vue'
import type { ConfigContext, ConfigProviderProps, Locale } from './config-provider-types'
import { computed, defineComponent, inject, provide } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import defaultLocale from '../../locale/zh-CN'
import { CONFIG_INJECT_KEY, configProviderProps } from './config-provider-types'

/**
 * compact 算法的尺寸 token 覆盖。对齐 Ant Design v6 compact 算法：
 * controlHeight 从 32 → 24，padding/margin 系列按比例缩小，font 不动。
 * 仅作用于 ConfigProvider 包裹的子树（通过 CSS 变量级联）。
 */
const COMPACT_TOKENS: Record<string, string> = {
  '--ccui-control-height': '24px',
  '--ccui-control-height-lg': '32px',
  '--ccui-control-height-sm': '16px',
  '--ccui-control-height-xs': '12px',
  '--ccui-padding': '12px',
  '--ccui-padding-lg': '16px',
  '--ccui-padding-md': '8px',
  '--ccui-padding-sm': '8px',
  '--ccui-padding-xs': '4px',
  '--ccui-padding-xxs': '0px',
  '--ccui-margin': '12px',
  '--ccui-margin-lg': '16px',
  '--ccui-margin-md': '8px',
  '--ccui-margin-sm': '8px',
  '--ccui-margin-xs': '4px',
  '--ccui-margin-xxs': '0px',
}

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

      // algorithm: compact 时先注入紧凑尺寸 token，再被用户 token 覆盖
      if (props.theme?.algorithm === 'compact') {
        Object.assign(style, COMPACT_TOKENS)
      }

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

    // algorithm: dark 把全局 .dark 类加到 wrapper 上，触发 darkTheme.css 中
    // .dark { ... } 选择器内的 CSS 变量覆盖（颜色 + 非颜色 token）。
    const wrapperClass = computed(() => {
      const cls: (string | false)[] = [ns.b()]
      if (props.theme?.algorithm === 'dark') {
        cls.push('dark')
      }
      return cls.filter(Boolean) as string[]
    })

    return () => (
      <div class={wrapperClass.value} style={tokenStyle.value} dir={props.direction}>
        {slots.default?.()}
      </div>
    )
  },
})
