import type { AnchorLink, AnchorProps } from './anchor-types'
import { defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { anchorProps } from './anchor-types'
import './anchor.scss'

function getScrollContainer(target: AnchorProps['scrollContainer']): HTMLElement | Window {
  if (!target) {
    return window
  }
  if (typeof target === 'string') {
    const el = document.querySelector(target)
    return (el as HTMLElement) ?? window
  }
  return target
}

function isWindow(target: HTMLElement | Window): target is Window {
  return target === window
}

interface IndexedAnchorLink {
  /** 用户声明的公开链接数据。 */
  link: AnchorLink
  /** 由嵌套数组 index 组成的内部唯一路径，不改变公开 href。 */
  instanceId: string
}

interface ProgrammaticScrollTarget {
  /** 当前点击 href 对应的目标元素。 */
  element: HTMLElement
  /** 发起平滑滚动时实际绑定的滚动容器。 */
  container: HTMLElement | Window
  /** 目标最终应停留在内容视口内的纵向偏移。 */
  offset: number
}

// scrollend 尚未在所有运行环境稳定触发；短暂停止窗口为平滑滚动提供一次无轮询的收敛兜底。
const PROGRAMMATIC_SCROLL_SETTLE_DELAY = 120

/** 展平链接并保留声明 index 路径，为重复 href 提供唯一且可复现的内部实例身份。 */
function flatLinks(items: AnchorLink[]): IndexedAnchorLink[] {
  const out: IndexedAnchorLink[] = []
  const walk = (list: AnchorLink[], parentPath = '') => {
    list.forEach((it, index) => {
      const instanceId = parentPath ? `${parentPath}.${index}` : `${index}`
      out.push({ link: it, instanceId })
      if (it.children?.length) {
        walk(it.children, instanceId)
      }
    })
  }
  walk(items)
  return out
}

/** 返回目标相对滚动内容视口的 top；元素容器需排除边框占用的 clientTop。 */
function getElementOffsetTop(el: HTMLElement, container: HTMLElement | Window): number {
  if (isWindow(container)) {
    return el.getBoundingClientRect().top
  }
  if (typeof container.getBoundingClientRect !== 'function') {
    return el.getBoundingClientRect().top
  }
  return el.getBoundingClientRect().top - container.getBoundingClientRect().top - container.clientTop
}

export default defineComponent({
  name: 'CAnchor',
  props: anchorProps,
  emits: ['change', 'click'],
  setup(props: AnchorProps, { emit, slots }) {
    const ns = useNamespace('anchor')
    const activeLink = ref<string>('')
    const wrapperRef = ref<HTMLElement>()
    const inkRef = ref<HTMLElement>()
    const linkRefs = ref<Map<string, HTMLElement>>(new Map())

    // 缓存每个声明实例的 ref 回调，避免重复 href 共用槽位，也避免 render 时发生 detach/attach 抖动。
    const linkRefSetters = new Map<string, (el: unknown) => void>()
    const getLinkRef = (instanceId: string) => {
      let setter = linkRefSetters.get(instanceId)
      if (!setter) {
        setter = (el: unknown) => {
          const node = el as HTMLElement | null
          if (node) {
            linkRefs.value.set(instanceId, node)
          } else {
            linkRefs.value.delete(instanceId)
          }
        }
        linkRefSetters.set(instanceId, setter)
      }
      return setter
    }

    const updateInk = () => {
      if (!inkRef.value || !wrapperRef.value) {
        return
      }
      // 重复 href 固定由第一个声明实例持有 current 与 ink，避免视觉目标随 ref 挂载顺序漂移。
      const activeInstanceId = flatLinks(props.items).find(({ link }) => link.href === activeLink.value)?.instanceId
      const node = activeInstanceId ? linkRefs.value.get(activeInstanceId) : null
      if (!node) {
        inkRef.value.style.opacity = '0'
        return
      }
      const wrapperTop = wrapperRef.value.getBoundingClientRect().top
      const top = node.getBoundingClientRect().top - wrapperTop
      inkRef.value.style.opacity = '1'
      inkRef.value.style.top = `${top + node.offsetHeight / 2 - 2}px`
    }

    /** 统一提交当前锚点，确保滚动和点击都只在值真实变化时发送 change。 */
    const setActiveLink = (nextLink: string) => {
      if (nextLink === activeLink.value) {
        return
      }
      activeLink.value = nextLink
      emit('change', nextLink)
    }

    let programmaticTarget: ProgrammaticScrollTarget | null = null
    let programmaticSettleTimer: ReturnType<typeof setTimeout> | null = null

    /** 判断平滑滚动是否已到目标线；1px 容差吸收浏览器的子像素取整。 */
    const hasReachedProgrammaticTarget = () =>
      Boolean(
        programmaticTarget &&
        Math.abs(
          getElementOffsetTop(programmaticTarget.element, programmaticTarget.container) - programmaticTarget.offset,
        ) <= 1,
      )

    /** 清除单次程序化导航锁及其停止计时器，确保所有结束路径都恢复普通滚动计算。 */
    const clearProgrammaticTarget = () => {
      if (programmaticSettleTimer !== null) {
        clearTimeout(programmaticSettleTimer)
        programmaticSettleTimer = null
      }
      programmaticTarget = null
    }

    const computeActive = () => {
      const container = getScrollContainer(props.scrollContainer)
      const all = flatLinks(props.items)
      let current = ''
      let minDelta = Number.POSITIVE_INFINITY
      all.forEach(({ link: it }) => {
        const id = it.href.replace(/^#/, '')
        const el = document.getElementById(id)
        if (!el) {
          return
        }
        const top = getElementOffsetTop(el, container)
        const delta = top - props.bounds - props.offsetTop
        if (delta <= 0 && Math.abs(delta) < minDelta) {
          minDelta = Math.abs(delta)
          current = it.href
        }
      })

      // 滚动到底部时，最后一个区段可能因为容器无法继续上滚而始终越不过 bounds 线，
      // 导致高亮停留在倒数第二个。此时直接激活最后一个有目标元素的锚点。
      const metrics = isWindow(container)
        ? {
            top: window.scrollY,
            client: window.innerHeight,
            scroll: document.documentElement.scrollHeight,
          }
        : { top: container.scrollTop, client: container.clientHeight, scroll: container.scrollHeight }
      const scrollable = metrics.scroll - metrics.client > 4
      const atBottom = scrollable && Math.ceil(metrics.top + metrics.client) >= metrics.scroll - 2
      if (atBottom) {
        for (let i = all.length - 1; i >= 0; i--) {
          const id = all[i].link.href.replace(/^#/, '')
          if (document.getElementById(id)) {
            current = all[i].link.href
            break
          }
        }
      }

      setActiveLink(current)
    }

    /** 在滚动停止后按真实几何收敛；每个 scroll 都重置窗口，以免动画中途提前解锁。 */
    const scheduleProgrammaticSettle = () => {
      if (programmaticSettleTimer !== null) {
        clearTimeout(programmaticSettleTimer)
      }
      programmaticSettleTimer = setTimeout(() => {
        programmaticSettleTimer = null
        if (!programmaticTarget) return
        programmaticTarget = null
        computeActive()
        nextTick(updateInk)
      }, PROGRAMMATIC_SCROLL_SETTLE_DELAY)
    }

    const onScroll = () => {
      if (programmaticTarget) {
        if (hasReachedProgrammaticTarget()) {
          clearProgrammaticTarget()
        } else {
          scheduleProgrammaticSettle()
        }
        // 动画途中保持点击目标；到达事件也保留目标，下一次用户滚动再按几何重新选择。
        nextTick(updateInk)
        return
      }
      computeActive()
      nextTick(updateInk)
    }

    /** scrollend 在动画被用户打断时负责收敛到实际区段，避免目标锁永久残留。 */
    const onScrollEnd = () => {
      if (!programmaticTarget) return
      const reached = hasReachedProgrammaticTarget()
      clearProgrammaticTarget()
      if (!reached) {
        computeActive()
      }
      nextTick(updateInk)
    }

    let container: HTMLElement | Window | null = null
    const bind = () => {
      container = getScrollContainer(props.scrollContainer)
      container.addEventListener('scroll', onScroll, { passive: true })
      container.addEventListener('scrollend', onScrollEnd, { passive: true })
    }
    const unbind = () => {
      container?.removeEventListener('scroll', onScroll)
      container?.removeEventListener('scrollend', onScrollEnd)
      container = null
    }
    onMounted(() => {
      bind()
      onScroll()
    })
    onBeforeUnmount(() => {
      clearProgrammaticTarget()
      unbind()
    })
    // scrollContainer 运行时变化时，需把监听从旧容器迁移到新容器并重算高亮，
    // 否则旧容器监听泄漏、新容器无监听导致滚动驱动失效。
    watch(
      () => props.scrollContainer,
      () => {
        clearProgrammaticTarget()
        unbind()
        bind()
        onScroll()
      },
    )

    watch(activeLink, () => {
      nextTick(updateInk)
    })
    watch(
      () => props.items,
      () => {
        nextTick(onScroll)
      },
      // items 支持嵌套且调用方可能原地增删；深度监听才能在 DOM 更新后重算新目标。
      { deep: true },
    )
    // 两个阈值都会改变当前区段判定，运行时更新后必须立即同步高亮。
    watch(
      () => [props.bounds, props.offsetTop],
      () => nextTick(onScroll),
    )

    /** 阻止浏览器瞬移，按配置平滑滚动并同步当前锚点与地址 hash。 */
    const onLinkClick = (e: MouseEvent, link: AnchorLink) => {
      e.preventDefault()
      emit('click', e, link)
      const id = link.href.replace(/^#/, '')
      const target = document.getElementById(id)
      if (!target) {
        return
      }
      const offset = props.targetOffset ?? props.offsetTop
      const cont = getScrollContainer(props.scrollContainer)
      // 必须在调用 scrollTo 前锁定并提交目标，因为 instant/mock 实现可能同步派发 scroll。
      clearProgrammaticTarget()
      programmaticTarget = { element: target, container: cont, offset }
      setActiveLink(link.href)
      if (isWindow(cont)) {
        const top = target.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: 'smooth' })
      } else if (typeof cont.scrollTo === 'function' && typeof cont.getBoundingClientRect === 'function') {
        // clientTop 是容器边框，不属于可滚动内容；不扣除会让目标停在边框宽度之后。
        const top =
          target.getBoundingClientRect().top -
          cont.getBoundingClientRect().top -
          cont.clientTop +
          cont.scrollTop -
          offset
        cont.scrollTo({ top, behavior: 'smooth' })
      } else {
        clearProgrammaticTarget()
      }
      // 已位于目标线或 instant scroll 已同步完成时立即解锁，不依赖后续 scrollend。
      if (programmaticTarget && hasReachedProgrammaticTarget()) {
        clearProgrammaticTarget()
      }
      if (history.replaceState) {
        history.replaceState(null, '', link.href)
      }
    }

    /** 渲染带唯一声明路径的原生链接；重复 href 仍保留，但仅首个实例持有 current。 */
    const renderLink = (
      link: AnchorLink,
      instanceId: string,
      activeInstanceId: string | undefined,
      level = 0,
    ): JSX.Element => {
      const active = activeInstanceId === instanceId
      return (
        <div class={ns.e('link')} key={instanceId}>
          <a
            ref={getLinkRef(instanceId)}
            class={[ns.e('link-title'), active && ns.em('link-title', 'active')]}
            href={link.href}
            aria-current={active ? 'location' : undefined}
            style={{ paddingInlineStart: `${16 + level * 16}px` }}
            onClick={(e: MouseEvent) => onLinkClick(e, link)}
          >
            {link.title ?? link.href}
          </a>
          {!!link.children?.length && (
            <div class={ns.e('children')}>
              {link.children.map((child, childIndex) =>
                renderLink(child, `${instanceId}.${childIndex}`, activeInstanceId, level + 1),
              )}
            </div>
          )}
        </div>
      )
    }

    // sticky 必须带明确 top，且 flex 子项不能被拉伸到父级高度；否则没有可用的固定移动区间。
    return () => {
      const activeInstanceId = flatLinks(props.items).find(({ link }) => link.href === activeLink.value)?.instanceId
      return (
        <nav
          ref={wrapperRef}
          class={[ns.b(), props.affix && ns.m('affix')]}
          style={props.affix ? { position: 'sticky', top: `${props.offsetTop}px`, alignSelf: 'flex-start' } : undefined}
        >
          <div class={ns.e('ink')} aria-hidden="true">
            <span ref={inkRef} class={ns.e('ink-ball')} />
          </div>
          {props.items.length
            ? props.items.map((item, index) => renderLink(item, `${index}`, activeInstanceId))
            : slots.default?.()}
        </nav>
      )
    }
  },
})
