import { defineComponent, toRefs, toRaw } from 'vue';
import { treeProps, TreeProps, TreeItem } from './tree-types';
import IconOpen from './components/icon-open';
import IconClose from './components/icon-close';
import useToggle from './composables/use-toggle';
import './tree.scss';

export default defineComponent({
  name: 'KTree',
  props: treeProps,
  emits: [],
  setup(props: TreeProps) {
    const { data } = toRefs(props);
    const { openedData, toggle } = useToggle(data);

    // 增加缩进的展位元素
    const Indent = () => {
      return <span style='display: inline-block; width: 16px; height: 16px;' />;
    };

    const renderNode = (item: TreeItem) => {
      const itemLevel = item.level ? item.level : 0;
      return (
        <div
          class={['okUi-tree-node', item.open && 'okUi-tree-node__open']}
          style={{ paddingLeft: `${24 * (itemLevel - 1)}px` }}
        >
          <div class='okUi-tree-node__content'>
            <div class='okUi-tree-node__content--value-wrapper'>
              {item.children ? (
                item.open ? (
                  <IconOpen
                    class='mr-xs'
                    onClick={(e: Event) => toggle(e, item)}
                  /> // 给节点绑定点击事件
                ) : (
                  <IconClose
                    class='mr-xs'
                    onClick={(e: Event) => toggle(e, item)}
                  />
                ) // 给节点绑定点击事件
              ) : (
                <Indent />
              )}
              <span class='okUi-tree-node__title'>{item.label}</span>
            </div>
          </div>
        </div>
      );
    };

    return () => {
      return (
        <div class='okUi-tree'>
          {openedData.value.map((item: TreeItem) => renderNode(item))}
        </div>
      );
    };
  }
});
