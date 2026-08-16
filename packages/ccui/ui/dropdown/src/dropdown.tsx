import type { DropdownItem, DropdownProps } from './dropdown-types'
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
import Popover from '../../popover/src/popover'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { dropdownProps } from './dropdown-types'
import './dropdown.scss'

export default defineComponent({
  name: 'CDropdown',
  props: dropdownProps,
  emits: ['select', 'update:visible', 'visible-change'],
  setup(props: DropdownProps, { emit, slots }) {
    const ns = useNamespace('dropdown')

    const popoverRef = ref<{ hide?: () => void } | null>(null)
    const menuRef = ref<HTMLElement | null>(null)
    const triggerRef = ref<HTMLElement | null>(null)
    const innerVisible = ref(false)
    const isControlled = computed(() => props.visible !== undefined)
    const popoverVisible = computed(() => (isControlled.value ? props.visible : innerVisible.value))

    watch(
      () => props.visible,
      (val) => {
        if (val !== undefined) {
          innerVisible.value = !!val
        }
      },
    )

    const captureTrigger = () => {
      const popper = menuRef.value?.closest<HTMLElement>('[id]')
      if (!popper?.id) return
      triggerRef.value = document.querySelector<HTMLElement>(`[aria-controls="${popper.id}"]`)
    }

    const restoreTriggerFocus = () => {
      captureTrigger()
      const trigger = triggerRef.value
      if (!trigger) return
      void nextTick(() => {
        const active = document.activeElement
        if (
          active instanceof HTMLElement &&
          active !== document.body &&
          !menuRef.value?.contains(active) &&
          !trigger.contains(active)
        ) {
          return
        }
        const focusTarget = trigger.querySelector<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        ;(focusTarget ?? trigger).focus()
      })
    }

    const requestVisible = (value: boolean) => {
      if (!isControlled.value) innerVisible.value = value
      emit('update:visible', value)
      emit('visible-change', value)
      if (!value) restoreTriggerFocus()
    }

    const onSelect = (item: DropdownItem) => {
      if (item.disabled) {
        return
      }
      emit('select', item)
      if (props.hideOnClick) {
        requestVisible(false)
      }
    }

    const focusMenuItem = (event: KeyboardEvent, mode: 'next' | 'previous' | 'first' | 'last') => {
      const items = Array.from(menuRef.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []).filter(
        (item) => item.getAttribute('aria-disabled') !== 'true',
      )
      if (items.length === 0) return
      const currentIndex = items.indexOf(event.currentTarget as HTMLElement)
      const targetIndex =
        mode === 'first'
          ? 0
          : mode === 'last'
            ? items.length - 1
            : mode === 'next'
              ? (currentIndex + 1 + items.length) % items.length
              : (currentIndex - 1 + items.length) % items.length
      event.preventDefault()
      items[targetIndex].focus()
    }

    const onItemKeydown = (event: KeyboardEvent, item: DropdownItem) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onSelect(item)
      } else if (event.key === 'ArrowDown') {
        focusMenuItem(event, 'next')
      } else if (event.key === 'ArrowUp') {
        focusMenuItem(event, 'previous')
      } else if (event.key === 'Home') {
        focusMenuItem(event, 'first')
      } else if (event.key === 'End') {
        focusMenuItem(event, 'last')
      }
    }

    return () => (
      <Popover
        ref={popoverRef}
        trigger={props.trigger}
        placement={props.placement}
        disabled={props.disabled}
        visible={popoverVisible.value}
        showArrow={false}
        offset={4}
        popperClass={ns.b()}
        width={props.width}
        role="menu"
        ariaHasPopup="menu"
        onUpdate:visible={(val: boolean) => {
          requestVisible(val)
          if (val && props.trigger === 'click') {
            void nextTick(() => {
              captureTrigger()
              menuRef.value?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')?.focus()
            })
          }
        }}
        v-slots={{
          default: () => slots.default?.(),
          content: () => (
            <ul ref={menuRef} class={ns.e('menu')}>
              {slots.menu
                ? slots.menu({ select: onSelect })
                : props.items.map((item, index) => (
                    <li
                      key={item.key}
                      class={[
                        ns.e('item'),
                        item.disabled && ns.em('item', 'disabled'),
                        item.danger && ns.em('item', 'danger'),
                        item.divided && ns.em('item', 'divided'),
                      ]}
                      role="menuitem"
                      aria-disabled={item.disabled || undefined}
                      tabindex={
                        item.disabled ? -1 : index === props.items.findIndex((entry) => !entry.disabled) ? 0 : -1
                      }
                      onClick={() => onSelect(item)}
                      onKeydown={(e: KeyboardEvent) => onItemKeydown(e, item)}
                    >
                      {item.icon && <i class={[ns.e('icon'), item.icon]} />}
                      <span class={ns.e('label')}>{item.label}</span>
                    </li>
                  ))}
            </ul>
          ),
        }}
      />
    )
  },
})
