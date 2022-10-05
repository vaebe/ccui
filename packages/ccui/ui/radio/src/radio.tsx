import { defineComponent, inject, computed } from 'vue';
import { radioProps, RadioProps, radioGroupInjectionKey } from './radio-types';
import IconActive from './components/icon-active';
import IconCircle from './components/icon-circle';
import './radio.scss';
import { useNamespace } from '../../shared/hooks/use-namespace';

export default defineComponent({
  name: 'CRadio',
  props: radioProps,
  emits: ['change', 'update:modelValue'],
  setup(props: RadioProps, { emit, slots }) {
    const ns = useNamespace('radio');

    const radioGroupInject = inject(radioGroupInjectionKey, null);

    // 是否可以切换
    const isDisabled = computed(() => {
      return radioGroupInject?.disabled.value || props.disabled;
    });

    // 是否激活
    const isActive = computed(() => {
      const value = radioGroupInject
        ? radioGroupInject.modelValue.value
        : props.modelValue;
      return value === props.label;
    });

    // 计算组件样式
    const labelClass = computed(() => {
      return `${ns.b()} ${isActive.value ? 'active' : ''} ${
        isDisabled.value ? 'disabled' : ''
      }`;
    });

    const judgeCanChange = (value: string) => {
      // 禁用状态不能切换
      if (isDisabled.value) {
        return Promise.resolve(false);
      }

      const beforeChange = radioGroupInject?.beforeChange || props.beforeChange;

      // 判断beforeChange事件是否存在
      if (beforeChange) {
        const res = beforeChange(value);

        if (typeof res === 'boolean') {
          return Promise.resolve(res);
        }

        return res;
      }

      return Promise.resolve(true);
    };

    const handleChange = async (event: Event) => {
      const _label = props.label + '';
      judgeCanChange(_label).then((res) => {
        if (res) {
          // 触发 radioGroup 的 emitChangeValue 事件更新数据
          radioGroupInject && radioGroupInject.emitChangeValue(_label);

          // 更新双向绑定的数据
          emit('update:modelValue', _label);
          // 触发change事件
          emit('change', _label);
        }
      });
    };

    return () => {
      return (
        <label class={labelClass.value}>
          <input
            class={ns.e('input')}
            onChange={handleChange}
            type='radio'
            name={props.name}
            value={props.label}
            disabled={isDisabled.value}
            checked={isActive.value}
          />
          {/* 判断展示那种icon */}
          <span class={ns.e('icon')}>
            {isActive.value ? <IconActive /> : <IconCircle />}
          </span>

          {/* 默认插槽 存在展示默认插槽的数据 否则展示label */}
          {slots.default ? slots.default() : props.label}
        </label>
      );
    };
  }
});
