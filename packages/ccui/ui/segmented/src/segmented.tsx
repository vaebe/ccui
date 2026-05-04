import type { SegmentedOption, SegmentedProps } from './segmented-types'
import { computed, defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { normalizeOptions, segmentedProps } from './segmented-types'
import './segmented.scss'

export default defineComponent({
  name: 'CSegmented',
  props: segmentedProps,
  emits: ['update:modelValue', 'change'],
  setup(props: SegmentedProps, { emit, slots }) {
    const ns = useNamespace('segmented')

    const list = computed(() => normalizeOptions(props.options))

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m('block')]: props.block,
      [ns.m('disabled')]: props.disabled,
      [ns.m(props.size)]: true,
    }))

    const onSelect = (opt: SegmentedOption) => {
      if (props.disabled || opt.disabled || opt.value === props.modelValue) {
        return
      }
      emit('update:modelValue', opt.value)
      emit('change', opt.value)
    }

    return () => (
      <div class={cls.value} role="listbox">
        <div class={ns.e('group')}>
          {list.value.map(opt => (
            <label
              key={String(opt.value)}
              class={[
                ns.e('item'),
                opt.value === props.modelValue && ns.em('item', 'selected'),
                opt.disabled && ns.em('item', 'disabled'),
              ]}
              onClick={() => onSelect(opt)}
            >
              <input
                type="radio"
                class={ns.e('input')}
                value={opt.value}
                checked={opt.value === props.modelValue}
                disabled={props.disabled || opt.disabled}
              />
              <div class={ns.e('label')}>
                {slots.default
                  ? slots.default({ option: opt })
                  : (
                      <>
                        {opt.icon && <i class={[ns.e('icon'), opt.icon]} />}
                        <span>{opt.label}</span>
                      </>
                    )}
              </div>
            </label>
          ))}
        </div>
      </div>
    )
  },
})
