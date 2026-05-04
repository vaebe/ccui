import { defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'

export default defineComponent({
  name: 'CListItem',
  setup(_props, { slots }) {
    const ns = useNamespace('list')
    return () => (
      <div class={ns.e('item-inner')}>
        {slots.avatar && <div class={ns.e('item-avatar')}>{slots.avatar()}</div>}
        <div class={ns.e('item-main')}>
          {(slots.title || slots.description) && (
            <div class={ns.e('item-meta')}>
              {slots.title && <h4 class={ns.e('item-title')}>{slots.title()}</h4>}
              {slots.description && <div class={ns.e('item-desc')}>{slots.description()}</div>}
            </div>
          )}
          {slots.default && <div class={ns.e('item-content')}>{slots.default()}</div>}
        </div>
        {slots.actions && <div class={ns.e('item-actions')}>{slots.actions()}</div>}
        {slots.extra && <div class={ns.e('item-extra')}>{slots.extra()}</div>}
      </div>
    )
  },
})
