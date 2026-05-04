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

function flatLinks(items: AnchorLink[]): AnchorLink[] {
  const out: AnchorLink[] = []
  const walk = (list: AnchorLink[]) => {
    list.forEach((it) => {
      out.push(it)
      if (it.children?.length) {
        walk(it.children)
      }
    })
  }
  walk(items)
  return out
}

function getElementOffsetTop(el: HTMLElement, container: HTMLElement | Window): number {
  if (isWindow(container)) {
    return el.getBoundingClientRect().top
  }
  if (typeof container.getBoundingClientRect !== 'function') {
    return el.getBoundingClientRect().top
  }
  return el.getBoundingClientRect().top - container.getBoundingClientRect().top
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

    const setLinkRef = (href: string) => (el: unknown) => {
      const node = el as HTMLElement | null
      if (node) {
        linkRefs.value.set(href, node)
      } else {
        linkRefs.value.delete(href)
      }
    }

    const updateInk = () => {
      if (!inkRef.value || !wrapperRef.value) {
        return
      }
      const node = activeLink.value ? linkRefs.value.get(activeLink.value) : null
      if (!node) {
        inkRef.value.style.opacity = '0'
        return
      }
      const wrapperTop = wrapperRef.value.getBoundingClientRect().top
      const top = node.getBoundingClientRect().top - wrapperTop
      inkRef.value.style.opacity = '1'
      inkRef.value.style.top = `${top + node.offsetHeight / 2 - 2}px`
    }

    const computeActive = () => {
      const container = getScrollContainer(props.scrollContainer)
      const all = flatLinks(props.items)
      let current = ''
      let minDelta = Number.POSITIVE_INFINITY
      all.forEach((it) => {
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
      if (current !== activeLink.value) {
        activeLink.value = current
        emit('change', current)
      }
    }

    const onScroll = () => {
      computeActive()
      nextTick(updateInk)
    }

    let container: HTMLElement | Window | null = null
    onMounted(() => {
      container = getScrollContainer(props.scrollContainer)
      container.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
    })
    onBeforeUnmount(() => {
      container?.removeEventListener('scroll', onScroll)
    })

    watch(activeLink, () => {
      nextTick(updateInk)
    })
    watch(
      () => props.items,
      () => {
        nextTick(onScroll)
      },
    )

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
      if (isWindow(cont)) {
        const top = target.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: 'smooth' })
      } else if (typeof cont.scrollTo === 'function' && typeof cont.getBoundingClientRect === 'function') {
        const top = target.getBoundingClientRect().top - cont.getBoundingClientRect().top + cont.scrollTop - offset
        cont.scrollTo({ top, behavior: 'smooth' })
      }
      activeLink.value = link.href
      if (history.replaceState) {
        history.replaceState(null, '', link.href)
      }
    }

    const renderLink = (link: AnchorLink, level = 0): JSX.Element => {
      const active = activeLink.value === link.href
      return (
        <div class={ns.e('link')} key={link.href}>
          <a
            ref={setLinkRef(link.href)}
            class={[ns.e('link-title'), active && ns.em('link-title', 'active')]}
            href={link.href}
            style={{ paddingInlineStart: `${16 + level * 16}px` }}
            onClick={(e: MouseEvent) => onLinkClick(e, link)}
          >
            {link.title ?? link.href}
          </a>
          {link.children?.length && (
            <div class={ns.e('children')}>{link.children.map((child) => renderLink(child, level + 1))}</div>
          )}
        </div>
      )
    }

    return () => (
      <div ref={wrapperRef} class={[ns.b(), props.affix && ns.m('affix')]}>
        <div class={ns.e('ink')}>
          <span ref={inkRef} class={ns.e('ink-ball')} />
        </div>
        {props.items.length ? props.items.map((item) => renderLink(item)) : slots.default?.()}
      </div>
    )
  },
})
