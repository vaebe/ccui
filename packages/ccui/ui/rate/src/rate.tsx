import { defineComponent, computed, ref } from 'vue';
import { rateProps, RateProps } from './rate-types';
import iconDefault from './components/icon-default';
import './rate.scss';
import { useNamespace } from '../../shared/hooks/use-namespace';

export default defineComponent({
  name: 'CRate',
  props: rateProps,
  emits: ['change', 'update:modelValue'],
  setup(props: RateProps, { emit, slots }) {
    const ns = useNamespace('rate');

    // 选中的数值
    const selectedQuantity = ref(props.modelValue);

    // 默认初始化icon状态的数组
    const iconStateList = ref(new Array(props.count).fill({ width: '0%' }));

    const setIconState = (end: number) => {
      const isHalfChoice = end % 1 > 0;
      // 最大选中icon的下标
      // 是半选 减0.5 否则 减1 对应下边加上的
      const maxCheckedNum = isHalfChoice ? end - 0.5 : end - 1;

      iconStateList.value.map((item, index) => {
        // 小于选中值全部设为选中
        if (maxCheckedNum >= index) {
          // 计算宽度 最后一个是半选 等于 50% 否则 100%
          iconStateList.value[index] = {
            width: isHalfChoice && maxCheckedNum === index ? '50%' : '100%'
          };
        } else {
          iconStateList.value[index] = { width: 0 };
        }
      });
    };

    setIconState(selectedQuantity.value);

    // 当前元素是否是半选
    const isSemiSelected = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      return props.allowHalf && e.offsetX * 2 <= target.clientWidth;
    };

    const iconOnMousemove = (e: MouseEvent, index: number) => {
      // 只读模式不更新数据
      if (props.readOnly) {
        return;
      }

      index = isSemiSelected(e) ? index + 0.5 : index + 1;
      setIconState(index);
    };

    const iconOnClick = (e: MouseEvent, index: number) => {
      // 只读模式不更新数据
      if (props.readOnly) {
        return;
      }

      index = isSemiSelected(e) ? index + 0.5 : index + 1;
      setIconState(index);

      selectedQuantity.value = index;
      emit('update:modelValue', index);
      emit('change', index);
    };

    const rateItem = computed(() => {
      return slots.default ? slots.default() : iconDefault();
    });

    const iconList = () => {
      return iconStateList.value.map((item, index) => {
        return (
          <div
            class={ns.e('icon')}
            onMousemove={(e) => {
              iconOnMousemove(e, index);
            }}
            onClick={(e) => {
              iconOnClick(e, index);
            }}
          >
            <span>{rateItem.value}</span>
            <span
              class={ns.m('active')}
              style={{
                width: item.width,
                color: props.color,
                fill: props.color
              }}
            >
              {rateItem.value}
            </span>
          </div>
        );
      });
    };

    const rateCls = computed(() => {
      return {
        [ns.b()]: true,
        [ns.m('read-only')]: props.readOnly
      };
    });

    return () => {
      return (
        <div
          class={rateCls.value}
          onMouseleave={() => {
            setIconState(selectedQuantity.value);
          }}
        >
          {iconList()}
          <div class={ns.e('info')}>
            {slots.info && slots.info(selectedQuantity.value)}
          </div>
        </div>
      );
    };
  }
});
