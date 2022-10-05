import { defineComponent, computed, inject } from 'vue';
import {
  checkBoxProps,
  CheckBoxProps,
  checkBoxGroupInjectionKey
} from './check-box-types';
import IconActive from './components/icon-active';
import IconDefault from './components/icon-default';
import './check-box.scss';
import { useNamespace } from '../../shared/hooks/use-namespace';

export default defineComponent({
  name: 'CCheckBox',
  props: checkBoxProps,
  emits: ['change', 'update:modelValue'],
  setup(props: CheckBoxProps, { emit, slots }) {
    return () => {
      const ns = useNamespace('check-box');

      const checkBoxGroupInject = inject(checkBoxGroupInjectionKey, null);

      const isDisabled = computed(() => {
        return checkBoxGroupInject?.disabled.value || props.disabled;
      });

      const isChecked = computed(() => {
        return (
          checkBoxGroupInject?.isItemChecked(props.label) || props.modelValue
        );
      });

      // 计算组件样式
      const labelClass = computed(() => {
        return `${ns.b()} ${isChecked.value ? 'active' : ''} ${
          isDisabled.value ? 'disabled' : ''
        }`;
      });

      const iconColor = computed(() => {
        const color = checkBoxGroupInject?.color.value || props.color;
        return color ? `fill: ${color}` : '';
      });

      // todo 带测试逻辑
      const judgeCanChange = (hasChecked: boolean, value: string) => {
        // 禁用状态不能切换
        if (isDisabled.value) {
          return Promise.resolve(false);
        }

        const beforeChange =
          checkBoxGroupInject?.beforeChange || props.beforeChange;

        // 判断beforeChange事件是否存在
        if (beforeChange) {
          const res = beforeChange(hasChecked, value);
          // 存在boolean 返回对应的值，否则直接返回
          if (typeof res === 'boolean') {
            return Promise.resolve(res);
          }
          return res;
        }

        return Promise.resolve(true);
      };

      const handleChange = async () => {
        const curStatus = !isChecked.value;

        judgeCanChange(curStatus, props.label).then((res) => {
          if (res) {
            // 更新选中的数组
            checkBoxGroupInject?.toggleGroupVal(props.label);
            emit('change', curStatus);
            emit('update:modelValue', curStatus);
          }
        });
      };

      return (
        <label class={labelClass.value}>
          <input
            type='checkbox'
            class={ns.e('input')}
            onChange={handleChange}
            name={props.name}
            value={props.label}
            disabled={isDisabled.value}
            checked={isChecked.value}
          />
          {/* 判断展示那种icon */}
          <span class={ns.e('icon')} style={iconColor.value}>
            {isChecked.value ? <IconActive /> : <IconDefault />}
          </span>

          {/* 默认插槽 存在展示默认插槽的数据 否则展示label */}
          {slots.default ? slots.default() : props.label}
        </label>
      );
    };
  }
});
