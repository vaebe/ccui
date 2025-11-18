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
    const inputRef = ref<HTMLInputElement | null>(null)
    const inputValue = ref(props.value)
    const isFocused = ref(false)
    const isPasswordVisible = ref(false)

    // 计算属性
    const showPasswordVisible = computed(() => props.type === 'password' && props.showPassword)

    const currentType = computed(() => {
      if (props.type === 'password' && showPasswordVisible.value && isPasswordVisible.value) {
        return 'text'
      }
      return props.type
    })

    // 为测试兼容性，保持一致的类名结构
    const getBaseClass = computed(() => {
      const hasInteractiveSuffix = !props.disabled && !props.readonly
        && (props.clearable || showPasswordVisible.value)
      const hasSuffix = hasInteractiveSuffix || !!slots.suffix

      return {
        [ns.b()]: true, // 基础类
        [ns.m(props.size)]: !!props.size, // 尺寸类
        [ns.m('disabled')]: props.disabled, // 禁用类
        [ns.m('readonly')]: props.readonly, // 只读类
        [ns.m('clearable')]: props.clearable,
        [ns.m('suffix')]: hasSuffix,
        [ns.m('prefix')]: !!slots.prefix,
      }
    })

    const getWrapperClass = computed(() => {
      return {
        [ns.e('wrapper')]: true, // wrapper类
        [ns.em('wrapper', props.size)]: !!props.size, // wrapper尺寸类
        [ns.em('wrapper', 'disabled')]: props.disabled, // wrapper禁用类
      }
    })

    const inputClass = computed(() => ({
      [ns.e('inner')]: true,
      [ns.m(props.size)]: !!props.size,
      [ns.m('disabled')]: props.disabled,
      [ns.m('readonly')]: props.readonly,
    }))

    // 事件处理
    const updateValue = (value: string) => {
      inputValue.value = value
      emit('update:value', value)
      emit('input', value)
    }

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      updateValue(target.value)
    }

    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      emit('change', target.value)
    }

    const handleFocus = (e: FocusEvent) => {
      isFocused.value = true
      emit('focus', e)
    }

    const handleBlur = (e: FocusEvent) => {
      isFocused.value = false
      emit('blur', e)
    }

    const clearInput = () => {
      updateValue('')
      emit('clear')
    }

    const togglePasswordVisible = () => {
      isPasswordVisible.value = !isPasswordVisible.value
    }

    // 监听 value 属性变化
    watch(() => props.value, (newVal) => {
      if (newVal !== inputValue.value) {
        inputValue.value = newVal
      }
    })

    // 渲染函数
    const renderPrepend = () => {
      if (!props.prepend && !slots.prepend)
        return null
      return (
        <div class={ns.e('prepend')}>
          {slots.prepend ? slots.prepend() : <span>{props.prepend}</span>}
        </div>
      )
    }

    const renderAppend = () => {
      if (!props.append && !slots.append)
        return null
      return (
        <div class={ns.e('append')}>
          {slots.append ? slots.append() : <span>{props.append}</span>}
        </div>
      )
    }

    const renderSuffixIcons = () => {
      const isInteractive = !props.disabled && !props.readonly
      const hasClear = isInteractive && props.clearable && inputValue.value
      const hasPasswordToggle = isInteractive && showPasswordVisible.value
      const hasSuffixSlot = !!slots.suffix

      if (!hasClear && !hasPasswordToggle && !hasSuffixSlot)
        return null

      return (
        <div class={ns.e('suffix')}>
          {hasClear && (
            <i class={ns.e('clear')} onClick={clearInput}></i>
          )}
          {hasPasswordToggle && (
            <i
              class={isPasswordVisible.value ? ns.e('password-visible') : ns.e('password-hidden')}
              onClick={togglePasswordVisible}
            />
          )}
          {hasSuffixSlot && slots.suffix!()}
        </div>
      )
    }

    const getInputAttrs = () => ({
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
    })

    // 渲染主体
    return () => {
      const prependContent = renderPrepend()
      const appendContent = renderAppend()

      const inputElement = <input {...getInputAttrs()} type={currentType.value} />

      const mainContent = (
        <>
          {slots.prefix && <div class={ns.e('prefix')}>{slots.prefix()}</div>}
          {inputElement}
          {renderSuffixIcons()}
        </>
      )

      // 统一结构：始终确保基础类和wrapper类都正确应用
      if (prependContent || appendContent) {
        // 有 prepend 或 append 时，基础类在顶层容器，wrapper类在内部容器
        return (
          <div class={getBaseClass.value}>
            {prependContent}
            <div class={getWrapperClass.value}>
              {mainContent}
            </div>
            {appendContent}
          </div>
        )
      }
      else {
        // 没有 prepend 或 append 时，将基础类和wrapper类合并到同一个元素
        const combinedClass = {
          ...getBaseClass.value,
          ...getWrapperClass.value,
        }

        return (
          <div class={combinedClass}>
            {mainContent}
          </div>
        )
      }
    }
  },
})
