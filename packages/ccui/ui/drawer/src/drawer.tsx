import type { CSSProperties, VNode } from 'vue'
import type { DrawerClosableObject, DrawerProps, DrawerPushObject } from './drawer-types'
import { Icon as IconifyIcon } from '@iconify/vue'
import {
  computed,
  defineComponent,
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  provide,
  ref,
  Teleport,
  toRef,
  Transition,
  watch,
} from 'vue'
import { isPropExplicit, warnDeprecatedProp } from '../../shared/hooks/use-deprecation-warning'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { drawerParentInjectionKey, drawerProps } from './drawer-types'
import './drawer.scss'

function isIconifyName(name: string): boolean {
  return name.includes(':')
}

function isClosableObject(value: unknown): value is DrawerClosableObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isPushObject(value: unknown): value is DrawerPushObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

const DEFAULT_PUSH_DISTANCE = 180

export default defineComponent({
  name: 'CDrawer',
  props: drawerProps,
  emits: ['update:visible', 'update:open', 'open', 'opened', 'close', 'closed', 'after-open-change'],
  setup(props: DrawerProps, { emit, slots }) {
    const ns = useNamespace('drawer')

    // M-A5：旧 prop 一次性 deprecation warn（全局 per-key 一次）
    const rawProps = getCurrentInstance()?.vnode.props as Record<string, unknown> | undefined
    if (isPropExplicit(rawProps, 'visible', 'visible')) {
      warnDeprecatedProp('Drawer', 'visible', 'open（v-model:open）')
    }
    if (isPropExplicit(rawProps, 'closeOnEsc', 'close-on-esc')) {
      warnDeprecatedProp('Drawer', 'closeOnEsc', 'keyboard')
    }
    if (isPropExplicit(rawProps, 'showFooter', 'show-footer')) {
      warnDeprecatedProp('Drawer', 'showFooter', 'footer slot 或 footer prop')
    }
    if (isPropExplicit(rawProps, 'appendToBody', 'append-to-body')) {
      warnDeprecatedProp('Drawer', 'appendToBody', 'getContainer')
    }

    // ── open / visible 受控解析 ───────────────────────────
    const isOpen = computed(() => (props.open !== undefined ? props.open : props.visible))

    const trigger = ref<HTMLElement | null>(null)
    const rendered = ref(isOpen.value || props.keepAlive)

    // ── closable 复合解析 ─────────────────────────────────
    const closableObj = computed<DrawerClosableObject | null>(() =>
      isClosableObject(props.closable) ? props.closable : null,
    )
    const closableEnabled = computed(() => {
      const v = props.closable
      return typeof v === 'boolean' ? v : v !== null && v !== undefined
    })
    const closeDisabled = computed(() => !!closableObj.value?.disabled)
    const closeAriaLabel = computed(() => closableObj.value?.ariaLabel || 'Close')

    // ── 别名 ──────────────────────────────────────────────
    const keyboardEnabled = computed(() => (props.keyboard !== undefined ? props.keyboard : props.closeOnEsc))

    // ── 嵌套抽屉 push（父被子推开） ─────────────────────
    const parent = inject(drawerParentInjectionKey, null)
    const activeChildCount = ref(0)

    const pushEnabled = computed(() => {
      const v = props.push
      return typeof v === 'boolean' ? v : v !== null && v !== undefined
    })
    const pushDistance = computed(() => {
      const v = props.push
      return isPushObject(v) ? (v.distance ?? DEFAULT_PUSH_DISTANCE) : DEFAULT_PUSH_DISTANCE
    })

    // 子抽屉打开时调用 register；关闭时 unregister
    provide(drawerParentInjectionKey, {
      placement: toRef(props, 'placement'),
      register: () => {
        activeChildCount.value++
      },
      unregister: () => {
        activeChildCount.value = Math.max(0, activeChildCount.value - 1)
      },
    })

    // 抽屉打开 / 关闭时无条件通知父亲（push 控制权在父抽屉端，见 pushTransform）
    // immediate 让初次挂载即开的子抽屉也能让位父抽屉
    let pushedToParent = false
    watch(
      isOpen,
      (val) => {
        if (!parent) return
        if (val && !pushedToParent) {
          parent.register()
          pushedToParent = true
        } else if (!val && pushedToParent) {
          parent.unregister()
          pushedToParent = false
        }
      },
      { immediate: true },
    )

    // 自身有 active 子抽屉时主动让位（push 由父抽屉决定）
    const pushTransform = computed<string | undefined>(() => {
      if (!pushEnabled.value) return undefined
      if (activeChildCount.value === 0) return undefined
      const d = pushDistance.value
      switch (props.placement) {
        case 'right':
          return `translateX(-${d}px)`
        case 'left':
          return `translateX(${d}px)`
        case 'top':
          return `translateY(${d}px)`
        case 'bottom':
          return `translateY(-${d}px)`
      }
    })

    // ── 尺寸 / 样式 ──────────────────────────────────────
    const isHorizontal = computed(() => props.placement === 'left' || props.placement === 'right')

    const sizeStyle = computed<CSSProperties>(() => {
      const size = typeof props.size === 'number' ? `${props.size}px` : String(props.size)
      const base = isHorizontal.value ? { width: size } : { height: size }
      if (pushTransform.value) {
        return { ...base, transform: pushTransform.value }
      }
      return base
    })

    // ── 关闭流程 ──────────────────────────────────────────
    const emitOpen = (val: boolean) => {
      emit('update:visible', val)
      emit('update:open', val)
    }

    const close = () => {
      if (closeDisabled.value) return
      emitOpen(false)
      emit('close')
    }

    const onMaskClick = () => {
      if (props.maskClosable) close()
    }

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && keyboardEnabled.value && isOpen.value) {
        close()
      }
    }

    // ── body scroll lock ────────────────────────────────
    const lockScroll = () => {
      const body = document.body
      if (body.dataset.ccuiDrawerCount) {
        body.dataset.ccuiDrawerCount = String(Number(body.dataset.ccuiDrawerCount) + 1)
        return
      }
      body.dataset.ccuiDrawerCount = '1'
      body.dataset.ccuiDrawerOverflow = body.style.overflow
      body.style.overflow = 'hidden'
    }
    const unlockScroll = () => {
      const body = document.body
      const count = Number(body.dataset.ccuiDrawerCount ?? 0) - 1
      if (count <= 0) {
        body.style.overflow = body.dataset.ccuiDrawerOverflow ?? ''
        delete body.dataset.ccuiDrawerCount
        delete body.dataset.ccuiDrawerOverflow
      } else {
        body.dataset.ccuiDrawerCount = String(count)
      }
    }

    watch(
      isOpen,
      (val) => {
        if (val) {
          if (typeof document !== 'undefined') {
            const active = document.activeElement
            if (active instanceof HTMLElement) trigger.value = active
          }
          rendered.value = true
          lockScroll()
          document.addEventListener('keydown', onKeydown)
          emit('open')
        } else {
          document.removeEventListener('keydown', onKeydown)
          unlockScroll()
        }
        emit('after-open-change', val)
      },
      { immediate: true },
    )

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onKeydown)
      if (isOpen.value) unlockScroll()
      // 卸载时若仍有 push 状态，主动解除父亲让位
      if (parent && pushedToParent) {
        parent.unregister()
        pushedToParent = false
      }
    })

    const onAfterEnter = () => emit('opened')
    const onAfterLeave = () => {
      if (props.destroyOnClose && !props.keepAlive) {
        rendered.value = false
      }
      if (props.focusTriggerAfterClose && trigger.value && document.body.contains(trigger.value)) {
        try {
          trigger.value.focus({ preventScroll: true })
        } catch {}
      }
      emit('closed')
    }

    // ── 渲染辅助 ──────────────────────────────────────────
    const renderCloseIcon = (): VNode => {
      if (slots['close-icon']) return <>{slots['close-icon']()}</>
      const icon = closableObj.value?.closeIcon
      if (!icon) return <span>×</span>
      if (typeof icon === 'string') {
        return isIconifyName(icon) ? <IconifyIcon icon={icon} /> : <i class={icon}></i>
      }
      return icon as VNode
    }

    const hasHeader = computed(() => !!(props.title || slots.title || closableEnabled.value || slots.extra))

    const renderHeader = (): VNode | null => {
      if (!hasHeader.value) return null
      return (
        <div class={[ns.e('header'), props.classNames?.header]} style={props.styles?.header}>
          <div class={ns.e('title')}>{slots.title ? slots.title() : props.title}</div>
          {slots.extra && <div class={ns.e('extra')}>{slots.extra()}</div>}
          {closableEnabled.value && (
            <button
              class={[ns.e('close'), closeDisabled.value && ns.is('disabled')]}
              onClick={close}
              disabled={closeDisabled.value}
              aria-label={closeAriaLabel.value}
            >
              {renderCloseIcon()}
            </button>
          )}
        </div>
      )
    }

    const renderBody = (): VNode => {
      if (props.loading) {
        return (
          <div class={[ns.e('body'), ns.em('body', 'loading'), props.classNames?.body]} style={props.styles?.body}>
            <div class={ns.e('skeleton')} aria-busy="true">
              <span class={ns.em('skeleton', 'line')} />
              <span class={ns.em('skeleton', 'line')} />
              <span class={ns.em('skeleton', 'line')} />
            </div>
          </div>
        )
      }
      return (
        <div class={[ns.e('body'), props.classNames?.body]} style={props.styles?.body}>
          {slots.default?.()}
        </div>
      )
    }

    // footer 隐藏判定：footer=null 显式隐藏；否则有 slot 或 (旧 showFooter || footer prop) 才显示
    const footerIsHidden = computed(() => {
      if (slots.footer) return false
      if (props.footer === null) return true
      if (props.footer === undefined && !props.showFooter) return true
      return false
    })

    const renderFooter = (): VNode | null => {
      if (footerIsHidden.value) return null
      const footerClass = [ns.e('footer'), props.classNames?.footer]
      const footerStyle = props.styles?.footer
      if (slots.footer) {
        return (
          <div class={footerClass} style={footerStyle}>
            {slots.footer()}
          </div>
        )
      }
      if (typeof props.footer === 'string') {
        return (
          <div class={footerClass} style={footerStyle}>
            {props.footer}
          </div>
        )
      }
      if (props.footer && typeof props.footer === 'object') {
        return (
          <div class={footerClass} style={footerStyle}>
            {props.footer as VNode}
          </div>
        )
      }
      // 兼容旧 showFooter=true 但无 slot 时，渲染空 footer
      return <div class={footerClass} style={footerStyle}></div>
    }

    // ── 渲染容器决策 ─────────────────────────────────────
    const renderContainer = (wrap: VNode): VNode | null => {
      if (props.getContainer) {
        const target = props.getContainer(null)
        return target ? <Teleport to={target}>{wrap}</Teleport> : wrap
      }
      return props.appendToBody ? <Teleport to="body">{wrap}</Teleport> : wrap
    }

    return () => {
      const wrap = (
        <div
          class={[ns.b(), ns.m(props.placement), props.classNames?.root]}
          style={[{ zIndex: props.zIndex }, props.styles?.root] as any}
          aria-modal="true"
          role="dialog"
        >
          <Transition name={`${ns.b()}-fade`}>
            {props.mask && isOpen.value && (
              <div class={[ns.e('mask'), props.classNames?.mask]} style={props.styles?.mask} onClick={onMaskClick} />
            )}
          </Transition>
          <Transition name={`${ns.b()}-${props.placement}`} onAfterEnter={onAfterEnter} onAfterLeave={onAfterLeave}>
            {isOpen.value && (
              <div
                class={[ns.e('content'), props.classNames?.wrap]}
                style={[sizeStyle.value, props.styles?.wrap] as any}
              >
                <div class={ns.e('inner')}>
                  {renderHeader()}
                  {renderBody()}
                  {renderFooter()}
                </div>
              </div>
            )}
          </Transition>
        </div>
      )

      if (props.destroyOnClose && !props.keepAlive && !rendered.value) {
        return null
      }

      return renderContainer(wrap)
    }
  },
})
