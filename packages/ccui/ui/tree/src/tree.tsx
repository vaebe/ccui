import type { TreeItem, TreeProps } from './tree-types'
import { computed, defineComponent, toRefs } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import IconClose from './components/icon-close'
import IconOpen from './components/icon-open'
import useToggle from './composables/use-toggle'
import { treeProps } from './tree-types'
import './tree.scss'

export default defineComponent({
  name: 'CTree',
  props: treeProps,
  setup(props: TreeProps) {
    const ns = useNamespace('tree')
    const { data } = toRefs(props)
    const { openedData, toggle } = useToggle(data)

    const Indent = () => <span class={ns.e('indent')} />

    const renderNode = (item: TreeItem) => {
      const itemLevel = item.level ?? 0
      const hasChildren = Boolean(item.children)

      return (
        <div
          class={[ns.e('node'), item.open && ns.em('node', 'open')]}
          style={{ paddingLeft: `${24 * (itemLevel - 1)}px` }}
        >
          <div class={ns.e('node-content')}>
            <div class={ns.e('value-wrapper')}>
              {hasChildren
                ? (
                    item.open
                      ? (
                          <IconOpen
                            class={ns.e('icon')}
                            onClick={(e: Event) => toggle(e, item)}
                          />
                        )
                      : (
                          <IconClose
                            class={ns.e('icon')}
                            onClick={(e: Event) => toggle(e, item)}
                          />
                        )
                  )
                : (
                    <Indent />
                  )}
              <span class={ns.e('title')}>{item.label}</span>
            </div>
          </div>
        </div>
      )
    }

    const treeNodes = computed(() =>
      openedData.value.map(renderNode),
    )

    return () => <div class={ns.b()}>{treeNodes.value}</div>
  },
})
