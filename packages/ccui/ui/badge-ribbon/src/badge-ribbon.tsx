import type { BadgeRibbonProps } from './badge-ribbon-types'
import { computed, defineComponent, h } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { badgeRibbonProps, isRibbonPresetColor } from './badge-ribbon-types'
import './badge-ribbon.scss'

export default defineComponent({
  name: 'CBadgeRibbon',
  props: badgeRibbonProps,
  setup(props: BadgeRibbonProps, { slots }) {
    const ns = useNamespace('badge-ribbon')

    const isPreset = computed(() => !!props.color && isRibbonPresetColor(props.color))
    const customColor = computed(() => (!!props.color && !isPreset.value ? props.color : ''))

    const ribbonCls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.placement)]: true,
      [ns.m(`color-${props.color}`)]: isPreset.value,
    }))

    return () =>
      h('div', { class: ns.e('wrapper') }, [
        slots.default?.(),
        h(
          'div',
          {
            class: ribbonCls.value,
            style: customColor.value ? { backgroundColor: customColor.value } : undefined,
          },
          [
            h('span', { class: ns.e('text') }, slots.text ? slots.text() : props.text),
            h('div', {
              class: ns.e('corner'),
              style: customColor.value ? { color: customColor.value } : undefined,
            }),
          ],
        ),
      ])
  },
})
