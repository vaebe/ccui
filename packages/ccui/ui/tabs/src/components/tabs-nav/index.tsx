import type { TabsProps, TabsState } from '../../tabs-types'
import type { TabProps } from '../tab/tab-types'
import { computed, defineComponent, inject } from 'vue'
import { useNamespace } from '../../../../shared/hooks/use-namespace'
import { tabsInjectionKey, tabsProps } from '../../tabs-types'
import './tabs-nav.scss'

export default defineComponent({
  name: 'CTabs-nav',
  props: tabsProps,
  emits: ['active-tab-change'],
  setup(props: TabsProps, { emit }) {
    const ns = useNamespace('tabs-nav')

    const tabsState = inject<TabsState>(tabsInjectionKey)

    const navList = computed(() => tabsState?.data || [])
    const slotsList = computed(() => tabsState?.slots || [])

    const containerClass = computed(() => {
      let cls = ns.b()
      if (props.type) {
        cls += `-${props.type}`
      }
      return `${cls}--${props.tabPosition}`
    })

    const getNavItemClass = (item: TabProps) => {
      const itemClass = `${containerClass.value}-item`
      const itemActiveClass = tabsState?.active === item.name ? `${itemClass}-active` : ''

      return `${itemClass} ${itemActiveClass}`
    }

    const navItemClick = (item: TabProps) => {
      if (tabsState) {
        // 相同不进行切换
        if (tabsState.active === item.name) {
          return
        }

        emit('active-tab-change', item.name)
      }
    }

    const onKeydown = (event: KeyboardEvent, index: number) => {
      const list = navList.value
      if (!list.length) return
      let nextIndex: number | null = null
      const isHorizontal = ['top', 'bottom'].includes(props.tabPosition)
      if ((isHorizontal && event.key === 'ArrowRight') || (!isHorizontal && event.key === 'ArrowDown')) {
        nextIndex = (index + 1) % list.length
      } else if ((isHorizontal && event.key === 'ArrowLeft') || (!isHorizontal && event.key === 'ArrowUp')) {
        nextIndex = (index - 1 + list.length) % list.length
      } else if (event.key === 'Home') {
        nextIndex = 0
      } else if (event.key === 'End') {
        nextIndex = list.length - 1
      }
      if (nextIndex !== null) {
        event.preventDefault()
        const target = list[nextIndex]
        if (target && !target.disabled) {
          navItemClick(target)
        }
      }
    }

    const navItemDom = computed(() => {
      return navList.value.map((item, index) => {
        const curSlotTitle = slotsList.value[index]
        const active = tabsState?.active === item.name
        return (
          <p
            class={getNavItemClass(item)}
            role="tab"
            id={`c-tab-${String(item.name)}`}
            aria-selected={active}
            aria-controls={`c-tabpanel-${String(item.name)}`}
            aria-disabled={item.disabled || undefined}
            tabindex={active ? 0 : -1}
            onClick={() => {
              navItemClick(item)
            }}
            onKeydown={(e: KeyboardEvent) => onKeydown(e, index)}
          >
            {curSlotTitle.title ? curSlotTitle.title() : item.label}
          </p>
        )
      })
    })

    return () => {
      return (
        <div
          class={containerClass.value}
          role="tablist"
          aria-orientation={['top', 'bottom'].includes(props.tabPosition) ? 'horizontal' : 'vertical'}
        >
          {navItemDom.value}
        </div>
      )
    }
  },
})
