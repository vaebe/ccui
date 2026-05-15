import type { CSSProperties } from 'vue'
import type {
  FormColAttrs,
  FormItemContext,
  FormItemProps,
  FormNamePath,
  FormRule,
  FormValidateTrigger,
} from './form-types'
import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watch,
} from 'vue'
import { isPropExplicit, warnDeprecatedProp } from '../../shared/hooks/use-deprecation-warning'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { formInjectionKey, formItemInjectionKey, formItemProps, formListInjectionKey } from './form-types'

// 把 FormColAttrs（24 栅格）转成 CSS 样式
function colToStyle(col: FormColAttrs | undefined): CSSProperties {
  if (!col) return {}
  const style: CSSProperties = {}
  if (col.flex !== undefined) {
    style.flex = typeof col.flex === 'number' ? `${col.flex} ${col.flex} auto` : col.flex
  }
  if (col.span !== undefined) {
    style.width = `${(col.span / 24) * 100}%`
  }
  if (col.offset !== undefined && col.offset > 0) {
    style.marginInlineStart = `${(col.offset / 24) * 100}%`
  }
  return style
}
import {
  cloneValue,
  deleteValueByPath,
  getPathKey,
  getTriggeredRules,
  getValueByPath,
  normalizeNamePath,
  normalizeRules,
  setValueByPath,
  validateRule,
} from './utils'
import './form.scss'

export default defineComponent({
  name: 'CFormItem',
  props: formItemProps,
  setup(props: FormItemProps, { expose, slots }) {
    const ns = useNamespace('form-item')

    // M-A5：旧 prop 一次性 deprecation warn（全局 per-key 一次）
    const rawProps = getCurrentInstance()?.vnode.props as Record<string, unknown> | undefined
    if (isPropExplicit(rawProps, 'prop', 'prop')) {
      warnDeprecatedProp('FormItem', 'prop', 'name')
    }

    const form = inject(formInjectionKey, null)
    const formList = inject(formListInjectionKey, null)
    const validateState = ref<'validating' | 'success' | 'error' | ''>('')
    const validateMessage = ref('')
    const warningState = ref(false)
    const itemRef = ref<HTMLElement | null>(null)
    const rawName = computed<FormNamePath | undefined>(() => props.name ?? props.prop)
    const fieldName = computed<FormNamePath | undefined>(() => {
      const raw = rawName.value
      if (!formList) {
        return raw
      }
      const prefix = formList.prefixName.value
      if (raw === undefined || raw === null || raw === '') {
        return prefix.length ? [...prefix] : undefined
      }
      return [...prefix, ...normalizeNamePath(raw)]
    })
    const fieldKey = computed(() => getPathKey(fieldName.value))
    const labelText = computed(() => props.label || fieldKey.value)
    const initialValue = ref()

    const getInitialValue = () => {
      if (props.initialValue !== undefined) {
        return props.initialValue
      }
      const formInitialValue = form ? getValueByPath(form.initialValues.value, fieldName.value) : undefined
      if (formInitialValue !== undefined) {
        return formInitialValue
      }
      return form ? getValueByPath(form.model.value, fieldName.value) : undefined
    }

    // rules 解析：支持函数式 (model) => Rule | Rule[]（Ant Design v5+）
    const resolveItemRules = (): FormRule | FormRule[] | undefined => {
      const raw = props.rules
      if (typeof raw === 'function') {
        return raw(form?.model.value ?? {})
      }
      return raw
    }

    const mergedRules = computed<FormRule[]>(() => {
      const rules = [...normalizeRules(form?.rules.value?.[fieldKey.value]), ...normalizeRules(resolveItemRules())]

      if (props.required && !rules.some((rule) => rule.required)) {
        rules.unshift({ required: true })
      }

      return rules
    })

    const isRequired = computed(() => props.required || mergedRules.value.some((rule) => rule.required))
    const currentStatus = computed(() => {
      if (props.validateStatus) return props.validateStatus
      if (warningState.value) return 'warning' as const
      return validateState.value
    })
    const currentMessage = computed(() => validateMessage.value || props.help)
    const shouldShowOptional = computed(() => !isRequired.value && form?.requiredMark.value === 'optional')
    const shouldShowRequiredMark = computed(() => isRequired.value && form?.requiredMark.value !== false)
    const mergedColon = computed(() => props.colon ?? form?.colon.value ?? true)

    // hasFeedback：FormItem 显式 > Form 级 > 默认 false
    const effectiveHasFeedback = computed(() =>
      props.hasFeedback !== undefined ? props.hasFeedback : !!form?.hasFeedback.value,
    )

    // 栅格 labelCol / wrapperCol：FormItem 显式 > Form 级
    const effectiveLabelCol = computed<FormColAttrs | undefined>(() => props.labelCol ?? form?.labelCol.value)
    const effectiveWrapperCol = computed<FormColAttrs | undefined>(() => props.wrapperCol ?? form?.wrapperCol.value)

    const labelStyle = computed<CSSProperties>(() => {
      // labelCol 栅格优先于 labelWidth
      if (effectiveLabelCol.value) {
        return colToStyle(effectiveLabelCol.value)
      }
      if (!form?.labelWidth.value || form.labelPosition.value === 'top' || form.layout.value === 'vertical') {
        return {}
      }
      const width = typeof form.labelWidth.value === 'number' ? `${form.labelWidth.value}px` : form.labelWidth.value
      return { width }
    })

    const wrapperStyle = computed<CSSProperties>(() => colToStyle(effectiveWrapperCol.value))

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(currentStatus.value)]: !!currentStatus.value,
      [ns.m('required')]: shouldShowRequiredMark.value,
      [ns.m('optional')]: shouldShowOptional.value,
      [ns.m('no-style')]: props.noStyle,
      [ns.m('hidden')]: props.hidden,
      [ns.m('top')]: form?.labelPosition.value === 'top' || form?.layout.value === 'vertical',
    }))

    const clearValidate = () => {
      validateState.value = ''
      validateMessage.value = ''
      warningState.value = false
    }

    let validateTimer: ReturnType<typeof setTimeout> | null = null

    const doValidate = async (trigger?: FormValidateTrigger) => {
      if (!fieldKey.value || !form) {
        return true
      }

      const rules = getTriggeredRules(mergedRules.value, trigger)
      if (rules.length === 0) {
        clearValidate()
        return true
      }

      validateState.value = 'validating'
      const value = getValueByPath(form.model.value, fieldName.value)

      // warningOnly 规则：失败时降级为 warning，不阻塞 submit
      let warningMessage = ''
      for (const rule of rules) {
        const error = await validateRule(
          rule,
          value,
          form.model.value,
          fieldKey.value,
          labelText.value,
          form.validateMessages.value,
        )
        if (error) {
          if (rule.warningOnly) {
            warningMessage = error.message
            // 继续校验其它规则，不立即返回
            continue
          }
          validateState.value = 'error'
          validateMessage.value = error.message
          form.emitValidate(fieldKey.value, false, error.message)
          return false
        }
      }

      if (warningMessage) {
        // 仅 warning：状态降级（保留 success 类型签名，CSS 走 --warning class）
        validateState.value = 'success' as any
        validateMessage.value = warningMessage
        // 由 currentStatus 注入 warning 类（见下方 mergedItemStatus）
        warningState.value = true
        form.emitValidate(fieldKey.value, true, warningMessage)
        return true
      }

      warningState.value = false
      validateState.value = 'success'
      validateMessage.value = ''
      form.emitValidate(fieldKey.value, true, '')
      return true
    }

    const validate = async (trigger?: FormValidateTrigger) => {
      if (props.validateDebounce > 0) {
        if (validateTimer) clearTimeout(validateTimer)
        return new Promise<boolean>((resolve) => {
          validateTimer = setTimeout(() => {
            doValidate(trigger).then(resolve)
          }, props.validateDebounce)
        })
      }
      return doValidate(trigger)
    }

    const resetField = () => {
      if (fieldKey.value && form) {
        setValueByPath(form.model.value, fieldName.value!, cloneValue(initialValue.value))
      }
      clearValidate()
    }

    const fieldContext: FormItemContext = {
      get prop() {
        return fieldName.value
      },
      get field() {
        return fieldKey.value
      },
      get dependencies() {
        return props.dependencies
      },
      validate,
      resetField,
      clearValidate,
      getValidateMessage: () => validateMessage.value,
      getElement: () => itemRef.value,
    } as FormItemContext

    const onChangeCapture = (event: Event) => {
      if (props.normalize && form && fieldName.value !== undefined) {
        const curValue = getValueByPath(form.model.value, fieldName.value)
        const prevValue = cloneValue(curValue)
        const normalized = props.normalize(curValue, prevValue, form.model.value)
        if (normalized !== curValue) {
          setValueByPath(form.model.value, fieldName.value!, normalized)
        }
      }
      void validate('change')
      if (form && fieldName.value !== undefined) {
        const next = getValueByPath(form.model.value, fieldName.value)
        form.notifyFieldChange(fieldName.value, next)
        void event
      }
    }

    const onFocusoutCapture = () => {
      void validate('blur')
    }

    onMounted(() => {
      initialValue.value = cloneValue(getInitialValue())
      if (fieldName.value && form && getValueByPath(form.model.value, fieldName.value) === undefined) {
        const value = getInitialValue()
        if (value !== undefined) {
          setValueByPath(form.model.value, fieldName.value, cloneValue(value))
        }
      }
      form?.addField(fieldContext)
    })

    onUnmounted(() => {
      form?.removeField(fieldContext)
      const itemPreserve = props.preserve
      const formPreserve = form?.preserve.value ?? true
      const shouldPreserve = itemPreserve === undefined ? formPreserve : itemPreserve
      if (!shouldPreserve && form && fieldName.value !== undefined) {
        deleteValueByPath(form.model.value, fieldName.value)
      }
    })

    expose({
      validate,
      resetField,
      clearValidate,
    })

    provide(formItemInjectionKey, {
      validateStatus: currentStatus,
      isInsideForm: !!form,
      validate,
    })

    let prevModelSnapshot: any = undefined

    watch(
      () => form?.model.value,
      (cur) => {
        // shouldUpdate 控制是否在 model 变化时触发校验
        if (props.shouldUpdate !== undefined) {
          if (typeof props.shouldUpdate === 'function') {
            if (!props.shouldUpdate(prevModelSnapshot, cur)) {
              prevModelSnapshot = cloneValue(cur)
              return
            }
          } else if (!props.shouldUpdate) {
            prevModelSnapshot = cloneValue(cur)
            return
          }
        }
        prevModelSnapshot = cloneValue(cur)

        if (props.dependencies.length > 0) {
          void validate()
        }
      },
      { deep: true },
    )

    const renderLabel = () => {
      if (!props.label && !slots.label) {
        return null
      }

      const content = [
        slots.label?.() || props.label,
        shouldShowOptional.value ? h('span', { class: ns.e('optional') }, ' (optional)') : null,
      ]

      return h(
        'label',
        {
          class: [ns.e('label'), mergedColon.value && ns.em('label', 'colon')],
          style: labelStyle.value,
          for: props.htmlFor || undefined,
        },
        content,
      )
    }

    // hasFeedback 状态图标：根据 currentStatus 渲染对应符号
    const renderFeedbackIcon = () => {
      if (!effectiveHasFeedback.value) return null
      const status = currentStatus.value
      if (!status) return null
      const symbol =
        status === 'success'
          ? '✓'
          : status === 'error'
            ? '✕'
            : status === 'warning'
              ? '!'
              : status === 'validating'
                ? '◌'
                : ''
      if (!symbol) return null
      return h(
        'span',
        {
          class: [ns.e('feedback'), ns.em('feedback', status)],
          'aria-hidden': 'true',
        },
        symbol,
      )
    }

    const renderContent = () =>
      h('div', { class: ns.e('content'), style: wrapperStyle.value }, [
        h('div', { class: [ns.e('control'), effectiveHasFeedback.value && ns.em('control', 'has-feedback')] }, [
          slots.default?.(),
          renderFeedbackIcon(),
        ]),
        currentMessage.value ? h('div', { class: ns.e('message'), role: 'alert' }, currentMessage.value) : null,
        props.extra ? h('div', { class: ns.e('extra') }, props.extra) : null,
      ])

    return () =>
      props.noStyle
        ? h(
            'div',
            {
              ref: itemRef,
              class: cls.value,
              'data-field': fieldKey.value || undefined,
              onChangeCapture,
              onFocusoutCapture,
            },
            slots.default?.(),
          )
        : h(
            'div',
            {
              ref: itemRef,
              class: cls.value,
              'data-field': fieldKey.value || undefined,
              'aria-invalid': currentStatus.value === 'error' ? 'true' : undefined,
              onChangeCapture,
              onFocusoutCapture,
            },
            [renderLabel(), renderContent()],
          )
  },
})
