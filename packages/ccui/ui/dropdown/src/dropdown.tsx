import type { DropdownItem, DropdownProps } from './dropdown-types'
import { computed, defineComponent, ref, watch } from 'vue'
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

    const onSelect = (item: DropdownItem) => {
      if (item.disabled) {
        return
      }
      emit('select', item)
      if (props.hideOnClick) {
        if (!isControlled.value) {
          innerVisible.value = false
        }
        emit('update:visible', false)
        emit('visible-change', false)
        popoverRef.value?.hide?.()
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
          if (!isControlled.value) {
            innerVisible.value = val
          }
          emit('update:visible', val)
          emit('visible-change', val)
        }}
        v-slots={{
          default: () => slots.default?.(),
          content: () => (
            <ul class={ns.e('menu')}>
              {slots.menu
                ? slots.menu({ select: onSelect })
                : props.items.map((item) => (
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
                      tabindex={item.disabled ? undefined : 0}
                      onClick={() => onSelect(item)}
                      onKeydown={(e: KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onSelect(item)
                        }
                      }}
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
