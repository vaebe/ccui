import type { DropdownItem } from '../../dropdown/src/dropdown-types'
import type { DropdownButtonProps } from './dropdown-button-types'
import { computed, defineComponent, h } from 'vue'
import Button from '../../button/src/button'
import Dropdown from '../../dropdown/src/dropdown'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { dropdownButtonProps } from './dropdown-button-types'
import './dropdown-button.scss'

export default defineComponent({
  name: 'CDropdownButton',
  props: dropdownButtonProps,
  emits: ['click', 'select', 'update:visible', 'visible-change'],
  setup(props: DropdownButtonProps, { emit, slots }) {
    const ns = useNamespace('dropdown-button')

    const wrapperCls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.size)]: props.size && props.size !== 'default',
      [ns.m('disabled')]: props.disabled,
    }))

    const handleMainClick = (event: MouseEvent) => {
      if (props.disabled || props.loading) return
      emit('click', event)
    }

    const handleSelect = (item: DropdownItem) => {
      emit('select', item)
    }

    const handleVisibleChange = (visible: boolean) => {
      emit('update:visible', visible)
      emit('visible-change', visible)
    }

    const renderMainButton = () => {
      const content = slots.default ? slots.default() : props.label
      return h(
        Button,
        {
          class: ns.e('main'),
          type: props.type,
          size: props.size,
          disabled: props.disabled,
          danger: props.danger,
          loading: props.loading,
          htmlType: props.htmlType,
          href: props.href || undefined,
          onClick: handleMainClick,
        },
        { default: () => content },
      )
    }

    const renderTriggerIcon = () => {
      if (slots.icon) return slots.icon()
      if (props.icon) {
        // 同 ccui Button 风格：图标字符串走 i class
        return h('i', { class: props.icon })
      }
      // 默认箭头：纯 CSS 绘制小三角，避免引入 svg 依赖
      return h('span', { class: ns.e('arrow'), 'aria-hidden': 'true' })
    }

    const renderTriggerButton = () => {
      return h(
        Button,
        {
          class: ns.e('trigger'),
          type: props.type,
          size: props.size,
          disabled: props.disabled,
          danger: props.danger,
          htmlType: 'button',
          'aria-label': 'Open menu',
          'aria-haspopup': 'menu',
        },
        { default: () => renderTriggerIcon() },
      )
    }

    return () =>
      h('div', { class: wrapperCls.value, role: 'group' }, [
        renderMainButton(),
        h(
          Dropdown,
          {
            items: props.items,
            trigger: props.trigger,
            placement: props.placement,
            disabled: props.disabled,
            visible: props.visible,
            hideOnClick: props.hideOnClick,
            width: props.width,
            'onUpdate:visible': handleVisibleChange,
            onSelect: handleSelect,
          },
          {
            default: () => renderTriggerButton(),
            // 把 menu slot 透传给底层 Dropdown
            menu: slots.menu ? (scope: { select: (item: DropdownItem) => void }) => slots.menu!(scope) : undefined,
          },
        ),
      ])
  },
})
