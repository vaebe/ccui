import type { ListItemMetaProps } from './list-item-meta-types'
import { defineComponent, h } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { listItemMetaProps } from './list-item-meta-types'

export default defineComponent({
  name: 'CListItemMeta',
  props: listItemMetaProps,
  setup(props: ListItemMetaProps, { slots }) {
    // 复用 list 命名空间，DOM 结构与 ListItem 内嵌 meta 完全一致，
    // 这样 List 的 SCSS 不需要复制一份。
    const ns = useNamespace('list')

    return () => {
      const avatar = slots.avatar ? h('div', { class: ns.e('item-avatar') }, slots.avatar()) : null

      const title = slots.title ? slots.title() : props.title
      const description = slots.description ? slots.description() : props.description

      const meta =
        title || description
          ? h('div', { class: ns.e('item-meta') }, [
              title ? h('h4', { class: ns.e('item-title') }, title) : null,
              description ? h('div', { class: ns.e('item-desc') }, description) : null,
            ])
          : null

      return h('div', { class: ns.e('item-inner') }, [
        avatar,
        h('div', { class: ns.e('item-main') }, [meta, slots.default ? slots.default() : null]),
      ])
    }
  },
})
