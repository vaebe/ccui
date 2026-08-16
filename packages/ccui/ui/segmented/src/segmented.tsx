import type { SegmentedOption, SegmentedProps } from './segmented-types'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import { computed, defineComponent, inject, useId } from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { normalizeOptions, segmentedProps } from './segmented-types'
import './segmented.scss'

export default defineComponent({
  name: 'CSegmented',
  inheritAttrs: false,
  props: segmentedProps,
  emits: ['update:modelValue', 'change'],
  setup(props: SegmentedProps, { attrs, emit, slots }) {
    const ns = useNamespace('segmented')
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)
    // 每个实例使用独立 name，让原生 radio 的方向键行为只作用于当前分段组。
    const inputName = `ccui-segmented-${useId()}`

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
      void formItem?.validate('change')
    }

    /**
     * label 直接被点击时由组件提交；点击其中的 input 时交给其 change 事件，避免重复提交。
     * @param event 发生在选项标签上的点击事件。
     * @param option 对应的分段选项。
     */
    const onItemClick = (event: MouseEvent, option: SegmentedOption) => {
      if (event.target === event.currentTarget) onSelect(option)
    }

    /**
     * 按 WAI-ARIA 单选组约定处理首尾和方向键，并跳过不可选项。
     * @param event 当前组内 radio 触发的键盘事件。
     */
    const onKeydown = (event: KeyboardEvent) => {
      const enabledOptions = list.value.filter((option) => !props.disabled && !option.disabled)
      if (!enabledOptions.length) return

      const currentIndex = enabledOptions.findIndex((option) => option.value === props.modelValue)
      const isPrevious = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
      const isNext = event.key === 'ArrowRight' || event.key === 'ArrowDown'
      let target: SegmentedOption | undefined

      if (event.key === 'Home') target = enabledOptions[0]
      if (event.key === 'End') target = enabledOptions.at(-1)
      if (isPrevious || isNext) {
        const startIndex = currentIndex < 0 ? 0 : currentIndex
        const offset = isPrevious ? -1 : 1
        target = enabledOptions[(startIndex + offset + enabledOptions.length) % enabledOptions.length]
      }
      if (!target) return

      event.preventDefault()
      const targetIndex = list.value.indexOf(target)
      // 焦点与值同步移动，避免 Home/End 只改变焦点而没有改变当前视图。
      const inputs = (event.currentTarget as HTMLElement).querySelectorAll(`input[name="${inputName}"]`)
      const input = inputs[targetIndex] as HTMLInputElement | undefined
      input?.focus()
      onSelect(target)
    }

    /** 仅当焦点离开整个控件时通知 FormItem，避免组内切换重复触发 blur 校验。 */
    const onFocusout = (event: FocusEvent) => {
      const root = event.currentTarget as HTMLElement
      if (!root.contains(event.relatedTarget as Node | null)) {
        void formItem?.validate('blur')
      }
    }

    return () => {
      const { class: rootClass, style: rootStyle, 'aria-describedby': describedBy } = attrs
      const descriptionIds = [describedBy, formItem?.messageId?.value]
        .filter((id): id is string => typeof id === 'string' && !!id)
        .flatMap((id) => id.split(/\s+/))
      const ariaDescribedBy = [...new Set(descriptionIds)].join(' ') || undefined
      // 只将未被组件接管的属性透传，避免重复应用 class、style 和 aria 描述。
      const nativeAttrs = Object.fromEntries(
        Object.entries(attrs).filter(([name]) => !['class', 'style', 'aria-describedby'].includes(name)),
      )
      nativeAttrs['aria-describedby'] = ariaDescribedBy

      return (
        <div
          {...nativeAttrs}
          class={[cls.value, rootClass]}
          style={rootStyle}
          role="radiogroup"
          aria-disabled={props.disabled ? true : undefined}
          aria-invalid={formItem?.validateStatus.value === 'error' ? true : undefined}
          onKeydown={onKeydown}
          onFocusout={onFocusout}
        >
          <div class={ns.e('group')}>
            {list.value.map((opt) => (
              <label
                key={String(opt.value)}
                class={[
                  ns.e('item'),
                  opt.value === props.modelValue && ns.em('item', 'selected'),
                  opt.disabled && ns.em('item', 'disabled'),
                ]}
                onClick={(event: MouseEvent) => onItemClick(event, opt)}
              >
                <input
                  type="radio"
                  class={ns.e('input')}
                  name={inputName}
                  value={opt.value}
                  checked={opt.value === props.modelValue}
                  disabled={props.disabled || opt.disabled}
                  onChange={() => onSelect(opt)}
                />
                <div class={ns.e('label')}>
                  {slots.default ? (
                    slots.default({ option: opt })
                  ) : (
                    <>
                      {opt.icon && <i class={[ns.e('icon'), opt.icon]} aria-hidden="true" />}
                      <span>{opt.label}</span>
                    </>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      )
    }
  },
})
