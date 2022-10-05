import { defineComponent, toRef, provide, computed } from 'vue';
import {
  CheckBoxGroupProps,
  checkBoxGroupProps,
  checkBoxGroupInjectionKey
} from './check-box-types';
import './check-box-group.scss';
import { useNamespace } from '../../shared/hooks/use-namespace';

export default defineComponent({
  name: 'CCheckBoxGroup',
  props: checkBoxGroupProps,
  emits: ['change', 'update:modelValue'],
  setup(props: CheckBoxGroupProps, { emit, slots }) {
    const ns = useNamespace('check-box-group');

    const valueList = toRef(props, 'modelValue');

    const toggleGroupVal = (val: string) => {
      // 只限制v-model绑定的值是一个数组 数组里有什么不做限制
      // 查找对应元素在数组的下标
      const index = valueList.value.findIndex((item) => item === val);

      // 如果找不到就把元素添加到数组
      if (index === -1) {
        const res = [...valueList.value, val];
        emit('change', res);
        emit('update:modelValue', res);
        return;
      }

      // 如果找到了就删除对应下标的元素并更新数据
      valueList.value.splice(index, 1);
      emit('change', valueList.value);
      emit('update:modelValue', valueList.value);
    };
    const isItemChecked = (val: string) => {
      // 验证数组中是否存在该项 返回boolean
      return valueList.value.includes(val);
    };

    provide(checkBoxGroupInjectionKey, {
      disabled: toRef(props, 'disabled'),
      color: toRef(props, 'color'),
      beforeChange: props.beforeChange,
      toggleGroupVal: toggleGroupVal,
      isItemChecked: isItemChecked
    });

    const directionType = {
      row: 'is-row',
      column: 'is-column'
    };

    const checkBoxGroupClass = computed(() => {
      return `${ns.b()} ${directionType[props.direction]}`;
    });

    return () => {
      return (
        <div class={checkBoxGroupClass.value}>
          {slots.default && slots.default()}
        </div>
      );
    };
  }
});
