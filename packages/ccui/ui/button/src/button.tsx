import type { CSSProperties, VNode } from 'vue'
import type { ButtonLoadingObject, ButtonProps } from './button-types'
import { Icon as IconifyIcon } from '@iconify/vue'
import { computed, defineComponent, h, inject, onBeforeUnmount, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { buttonGroupInjectionKey, buttonProps } from './button-types'
import './button.scss'

// 实心型 type：注入 background-color + border-color
const SOLID_TYPES = new Set(['primary', 'success', 'warning', 'danger', 'info'])
// 仅注入文字色（无边框/无背景）
const TEXT_LIKE_TYPES = new Set(['text', 'link'])

// Iconify 命名规范：`<collection>:<icon>`，例如 `mdi:magnify`。
// 含 `:` 时按 Iconify 渲染 SVG；否则当 CSS 类名（兼容自定义 iconfont 接入方）。
function isIconifyName(name: string): boolean {
  return name.includes(':')
}

const CJK_RE = /^[一-鿿]{2}$/

// 解析 loading：boolean | { delay, icon }
function isLoadingObject(value: unknown): value is ButtonLoadingObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export default defineComponent({
  name: 'CButton',
  props: buttonProps,
  emits: ['click'],
  setup(props: ButtonProps, { slots, emit }) {
    const ns = useNamespace('button')

    // Group 注入：size / disabled 透传到子按钮
    const group = inject(buttonGroupInjectionKey, null)

    // size：Group 注入优先级低于显式 prop
    const resolvedSize = computed(() => props.size || group?.size.value || '')

    // disabled：Group 注入 OR 自身
    const resolvedDisabled = computed(() => !!(group?.disabled.value || props.disabled))

    // ── loading 解析（含 delay） ──────────────────────────
    const delayLoading = ref(false)
    let delayTimer: ReturnType<typeof setTimeout> | undefined

    const loadingObj = computed<ButtonLoadingObject | null>(() =>
      isLoadingObject(props.loading) ? (props.loading as ButtonLoadingObject) : null,
    )
    const loadingDelay = computed(() => loadingObj.value?.delay ?? 0)
    const loadingIconNode = computed(() => loadingObj.value?.icon)

    function applyLoading(target: boolean) {
      if (delayTimer) {
        clearTimeout(delayTimer)
        delayTimer = undefined
      }
      if (target && loadingDelay.value > 0) {
        delayTimer = setTimeout(() => {
          delayLoading.value = true
          delayTimer = undefined
        }, loadingDelay.value)
      } else {
        delayLoading.value = target
      }
    }

    watch(
      () => props.loading,
      (val) => {
        const target = isLoadingObject(val) ? true : !!val
        applyLoading(target)
      },
      { immediate: true },
    )

    onBeforeUnmount(() => {
      if (delayTimer) clearTimeout(delayTimer)
    })

    const isLoading = computed(() => {
      // 对象形 + delay：等 delayLoading 翻 true
      if (loadingObj.value && loadingDelay.value > 0) return delayLoading.value
      // 对象形 + 无 delay：立即 loading
      if (loadingObj.value) return true
      // boolean
      return !!props.loading
    })

    // ── autoInsertSpace：2 个 CJK 字符之间插空格 ──────────
    const insertedContent = computed<string | null>(() => {
      if (!props.autoInsertSpace) return null
      const child = slots.default?.()
      if (!child || child.length !== 1) return null
      const node = child[0]
      if (typeof node.children !== 'string') return null
      const txt = node.children
      return CJK_RE.test(txt) ? `${txt[0]} ${txt[1]}` : null
    })

    // ── class 计算 ───────────────────────────────────────
    const butCls = computed(() => {
      return {
        [ns.b()]: true,
        [ns.m(props.type)]: !!props.type,
        [ns.m(`plain-${props.type}`)]: !!props.plain && !!props.type,
        [ns.m(resolvedSize.value)]: !!resolvedSize.value,
        [ns.m('round')]: props.round,
        [ns.m('circle')]: props.circle,
        [ns.m('loading')]: isLoading.value,
        [ns.m('disabled')]: resolvedDisabled.value || isLoading.value,
        // 用 `--dangerous` 避免与 type='danger' 共用同名类
        [ns.m('dangerous')]: props.danger,
        [ns.m('ghost')]: props.ghost,
        [ns.m('block')]: props.block,
        [ns.m('icon-end')]: props.iconPosition === 'end',
      }
    })

    // ── 自定义颜色 inline style（支持任意 CSS color） ────
    const customColorStyle = computed<CSSProperties | undefined>(() => {
      if (!props.color) return undefined
      if (TEXT_LIKE_TYPES.has(props.type)) {
        return { color: props.color }
      }
      if (SOLID_TYPES.has(props.type)) {
        return { backgroundColor: props.color, borderColor: props.color }
      }
      // 描边型（'' / 'default' / 'dashed'）
      return { color: props.color, borderColor: props.color }
    })

    // ── 事件 ─────────────────────────────────────────────
    const onClick = (e: MouseEvent) => {
      if (resolvedDisabled.value || isLoading.value) {
        e.preventDefault()
        return
      }
      emit('click', e)
    }

    // ── 渲染：href 时为 <a>，否则 <button> ──────────────
    return () => {
      const iconNode = (() => {
        if (isLoading.value) {
          // loading icon 优先用 prop 提供的，否则默认 SVG-less span
          if (loadingIconNode.value) {
            return typeof loadingIconNode.value === 'string' ? (
              isIconifyName(loadingIconNode.value) ? (
                <IconifyIcon icon={loadingIconNode.value} class={ns.e('loading-icon')} />
              ) : (
                <i class={[ns.e('loading-icon'), loadingIconNode.value]}></i>
              )
            ) : (
              (loadingIconNode.value as VNode)
            )
          }
          return <span class={ns.e('loading-icon')}></span>
        }
        if (slots.icon) return <span class={ns.e('icon')}>{slots.icon()}</span>
        if (props.icon) {
          return isIconifyName(props.icon) ? (
            <IconifyIcon icon={props.icon} class={ns.e('icon')} />
          ) : (
            <i class={[ns.e('icon'), props.icon]}></i>
          )
        }
        return null
      })()

      const contentNode = (() => {
        if (!slots.default) return null
        const text = insertedContent.value
        return <span class={ns.e('content')}>{text ?? slots.default()}</span>
      })()

      const children = [iconNode, contentNode].filter(Boolean)

      // 链接按钮：href 设置时渲染 <a>
      if (props.href !== undefined) {
        return h(
          'a',
          {
            class: butCls.value,
            style: customColorStyle.value,
            href: resolvedDisabled.value || isLoading.value ? undefined : props.href,
            target: props.target,
            // disabled <a> 没有原生支持，用 aria-disabled + click 拦截
            'aria-disabled': resolvedDisabled.value || isLoading.value ? 'true' : undefined,
            role: 'button',
            tabindex: resolvedDisabled.value || isLoading.value ? -1 : 0,
            onClick,
          },
          children,
        )
      }

      return h(
        'button',
        {
          class: butCls.value,
          style: customColorStyle.value,
          type: props.nativeType,
          autofocus: props.autofocus || undefined,
          disabled: resolvedDisabled.value || isLoading.value,
          onClick,
        },
        children,
      )
    }
  },
})
