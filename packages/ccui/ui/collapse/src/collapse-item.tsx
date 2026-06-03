import type { CollapseItemProps } from './collapse-types'
import { computed, defineComponent, inject, ref, Transition } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { collapseContextKey, collapseItemProps } from './collapse-types'

export default defineComponent({
  name: 'CCollapseItem',
  props: collapseItemProps,
  setup(props: CollapseItemProps, { slots }) {
    const ns = useNamespace('collapse')
    const ctx = inject(collapseContextKey)

    const contentRef = ref<HTMLDivElement>()

    const isActive = computed(() => {
      if (!ctx) {
        return false
      }
      return ctx.activeNames.value.includes(props.name)
    })

    const handleClick = () => {
      if (props.disabled) {
        return
      }
      ctx?.toggle(props.name)
    }

    const onBeforeEnter = (el: Element) => {
      ;(el as HTMLElement).style.height = '0'
    }
    const onEnter = (el: Element) => {
      const target = el as HTMLElement
      target.style.height = `${target.scrollHeight}px`
    }
    const onAfterEnter = (el: Element) => {
      ;(el as HTMLElement).style.height = ''
    }
    const onBeforeLeave = (el: Element) => {
      const target = el as HTMLElement
      target.style.height = `${target.scrollHeight}px`
    }
    const onLeave = (el: Element) => {
      ;(el as HTMLElement).style.height = '0'
    }
    const onAfterLeave = (el: Element) => {
      ;(el as HTMLElement).style.height = ''
    }

    return () => {
      const itemCls = [
        ns.e('item'),
        isActive.value && ns.em('item', 'active'),
        props.disabled && ns.em('item', 'disabled'),
      ]

      const arrow = props.showArrow ? (
        <span class={[ns.e('arrow'), isActive.value && ns.em('arrow', 'active')]}>›</span>
      ) : null

      const headerChildren =
        ctx?.expandIconPosition.value === 'end' ? (
          <>
            <div class={ns.e('header-text')}>{slots.title ? slots.title() : props.title}</div>
            {arrow}
          </>
        ) : (
          <>
            {arrow}
            <div class={ns.e('header-text')}>{slots.title ? slots.title() : props.title}</div>
          </>
        )

      const headerId = `c-collapse-header-${String(props.name)}`
      const panelId = `c-collapse-panel-${String(props.name)}`
      return (
        <div class={itemCls}>
          <div
            class={ns.e('header')}
            role="button"
            id={headerId}
            aria-expanded={isActive.value}
            aria-controls={panelId}
            aria-disabled={props.disabled || undefined}
            tabindex={props.disabled ? -1 : 0}
            onClick={handleClick}
            onKeydown={(e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleClick()
              }
            }}
          >
            {headerChildren}
          </div>
          <Transition
            name={ns.b()}
            onBeforeEnter={onBeforeEnter}
            onEnter={onEnter}
            onAfterEnter={onAfterEnter}
            onBeforeLeave={onBeforeLeave}
            onLeave={onLeave}
            onAfterLeave={onAfterLeave}
          >
            {isActive.value && (
              <div class={ns.e('wrapper')} ref={contentRef} role="region" id={panelId} aria-labelledby={headerId}>
                <div class={ns.e('content')}>{slots.default?.()}</div>
              </div>
            )}
          </Transition>
        </div>
      )
    }
  },
})
