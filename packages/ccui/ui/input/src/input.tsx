import type { InputProps } from './input-types'
import { computed, defineComponent, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { inputProps } from './input-types'
import './input.scss'

export default defineComponent({
  name: 'CInput',
  props: inputProps,
  emits: ['update:value', 'input', 'change', 'focus', 'blur', 'clear'],
  setup(props: InputProps, { emit, slots }) {
    const ns = useNamespace('input')
    const inputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)

    // 输入框的值
    const inputValue = ref(props.value)

    // 是否显示密码切换图标
    const showPasswordVisible = computed(() => props.type === 'password' && props.showPassword)

    // 密码是否可见
    const isPasswordVisible = ref(false)

    // 当前输入框类型
    const currentType = computed(() => {
      if (props.type === 'password' && showPasswordVisible.value && isPasswordVisible.value) {
        return 'text'
      }
      return props.type
    })

    // 输入框类名
    const inputClass = computed(() => ({
      [ns.b()]: true,
      [ns.e('inner')]: true,
      [ns.m(props.size)]: !!props.size,
      [ns.m('disabled')]: props.disabled,
      [ns.m('readonly')]: props.readonly,
      [ns.m('clearable')]: props.clearable,
      [ns.m('suffix')]: props.clearable || showPasswordVisible.value || slots.suffix,
      [ns.m('prefix')]: slots.prefix,
    }))

    // 是否聚焦
    const isFocused = ref(false)

    // 包装器类名
    const wrapperClass = computed(() => ({
      [ns.e('wrapper')]: true,
      [ns.em('wrapper', props.size)]: !!props.size,
      [ns.em('wrapper', 'disabled')]: props.disabled,
    }))

    // 更新输入框的值
    const updateValue = (value: string) => {
      inputValue.value = value
      emit('update:value', value)
      emit('input', value)
    }

    // 处理输入事件
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      updateValue(target.value)
    }

    // 处理变化事件
    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      emit('change', target.value)
    }

    // 处理焦点事件
    const handleFocus = (e: FocusEvent) => {
      isFocused.value = true
      emit('focus', e)
    }

    // 处理失去焦点事件
    const handleBlur = (e: FocusEvent) => {
      isFocused.value = false
      emit('blur', e)
    }

    // 清空输入框
    const clearInput = () => {
      updateValue('')
      emit('clear')
    }

    // 切换密码可见性
    const togglePasswordVisible = () => {
      isPasswordVisible.value = !isPasswordVisible.value
    }

    // 监听 value 属性变化
    watch(() => props.value, (newVal) => {
      if (newVal !== inputValue.value) {
        inputValue.value = newVal
      }
    })

    return () => {
      // 前置内容
      const prependContent = props.prepend || slots.prepend
        ? (
            <div class={ns.e('prepend')}>
              {slots.prepend ? slots.prepend() : <span>{props.prepend}</span>}
            </div>
          )
        : null

      // 后置内容
      const appendContent = props.append || slots.append
        ? (
            <div class={ns.e('append')}>
              {slots.append ? slots.append() : <span>{props.append}</span>}
            </div>
          )
        : null

      // 后缀图标内容
      const suffixIconContent = props.clearable || showPasswordVisible.value || slots.suffix
        ? (
            <div class={ns.e('suffix')}>
              {props.clearable && inputValue.value && (
                <i class={ns.e('clear')} onClick={clearInput}></i>
              )}
              {showPasswordVisible.value && (
                <i
                  class={isPasswordVisible.value ? ns.e('password-visible') : ns.e('password-hidden')}
                  onClick={togglePasswordVisible}
                >
                </i>
              )}
              {slots.suffix && slots.suffix()}
            </div>
          )
        : null

      // 输入框属性
      const baseInputAttrs = {
        ref: inputRef,
        class: inputClass.value,
        placeholder: props.placeholder,
        disabled: props.disabled,
        readonly: props.readonly,
        value: inputValue.value,
        onInput: handleInput,
        onChange: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
      }

      // 输入框元素
      const inputElement = props.type === 'textarea'
        ? (
            <textarea {...baseInputAttrs} />
          )
        : (
            <input
              {...baseInputAttrs}
              type={currentType.value}
            />
          )

      // 主体内容
      const mainContent = (
        <>
          {slots.prefix && <div class={ns.e('prefix')}>{slots.prefix()}</div>}
          {inputElement}
          {suffixIconContent}
        </>
      )

      // 如果有前置或后置内容，则需要包装一层
      return prependContent || appendContent
        ? (
            <div class={wrapperClass.value}>
              {prependContent}
              <div class={ns.e('main')}>{mainContent}</div>
              {appendContent}
            </div>
          )
        : (
            <div class={wrapperClass.value}>
              {mainContent}
            </div>
          )
    }
  },
})
