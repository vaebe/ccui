import type { Slots, VNode } from 'vue'
import type {
  CopyableConfig,
  EditableConfig,
  EllipsisConfig,
  LinkProps,
  TextProps,
  TitleProps,
} from './typography-types'
import { computed, defineComponent, h, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { renderIconNode } from '../../shared/hooks/use-icon'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { linkProps, paragraphProps, textProps, titleProps } from './typography-types'
import './typography.scss'

const ns = useNamespace('typography')

function buildModifierClasses(props: TextProps) {
  return {
    [ns.b()]: true,
    [ns.m(props.type as string)]: !!props.type,
    [ns.m('disabled')]: props.disabled,
  }
}

function wrapWithDecorations(node: VNode | string, props: TextProps): VNode | string {
  let result: VNode | string = node
  if (props.code) {
    result = h('code', null, [result])
  }
  if (props.keyboard) {
    result = h('kbd', null, [result])
  }
  if (props.mark) {
    result = h('mark', null, [result])
  }
  if (props.underline) {
    result = h('u', null, [result])
  }
  if (props.delete) {
    result = h('del', null, [result])
  }
  if (props.strong) {
    result = h('strong', null, [result])
  }
  if (props.italic) {
    result = h('i', null, [result])
  }
  return result
}

function renderInner(slots: Slots, props: TextProps): VNode[] | VNode | string {
  const children = slots.default?.() ?? []
  if (children.length === 0) {
    return ''
  }
  if (children.length === 1) {
    return wrapWithDecorations(children[0], props) as VNode | string
  }
  return children.map((c) => wrapWithDecorations(c, props)) as VNode[]
}

// ── L-3.7 共享子能力：复制 / 编辑 / 截断 ───────────────────────────

function resolveConfig<T>(value: boolean | T | undefined, fallback: T): T | null {
  if (value === false || value === undefined) return null
  if (value === true) return fallback
  return value
}

function getSlotText(slots: Slots): string {
  const children = slots.default?.() ?? []
  return children
    .map((c) => {
      if (typeof c === 'string') return c
      if (typeof c.children === 'string') return c.children
      return ''
    })
    .join('')
}

// ─── Typography 主组件们 ────────────────────────────────────

// L-3.7：通用 Typography setup 工厂，复用 copy / edit / ellipsis 全部逻辑
// eslint-disable-next-line ts/explicit-function-return-type
function createTypographyComponent(
  name: string,
  propsDef: Record<string, unknown>,
  tag: (props: TextProps) => string,
  extraClass?: (props: TextProps) => Record<string, boolean>,
) {
  return defineComponent({
    name,
    // eslint-disable-next-line ts/no-explicit-any
    props: propsDef as any,
    emits: ['update:editable-text'],
    // eslint-disable-next-line ts/no-explicit-any
    setup(rawProps: any, { slots, emit }: any) {
      const props = rawProps as TextProps
      // copyable
      const copyConfig = computed<CopyableConfig | null>(() => resolveConfig(props.copyable, {} as CopyableConfig))
      const copied = ref(false)
      let copyResetTimer: number | null = null
      const triggerCopy = async () => {
        const cfg = copyConfig.value
        if (!cfg) return
        const text = cfg.text ?? getSlotText(slots)
        try {
          if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text)
          }
          copied.value = true
          cfg.onCopy?.(text)
          const delay = cfg.copyableDelay ?? 3000
          if (copyResetTimer !== null) clearTimeout(copyResetTimer)
          copyResetTimer = window.setTimeout(() => {
            copied.value = false
            copyResetTimer = null
          }, delay)
        } catch {}
      }

      // editable
      const editConfig = computed<EditableConfig | null>(() => resolveConfig(props.editable, {} as EditableConfig))
      const editing = ref(false)
      const editValue = ref('')
      const textareaRef = ref<HTMLTextAreaElement | null>(null)

      watch(
        () => editConfig.value?.editing,
        (v) => {
          if (typeof v === 'boolean') editing.value = v
        },
      )

      const startEdit = () => {
        const cfg = editConfig.value
        if (!cfg) return
        editValue.value = cfg.text ?? getSlotText(slots)
        editing.value = true
        cfg.onStart?.()
        nextTick(() => {
          textareaRef.value?.focus()
        })
      }
      const finishEdit = () => {
        const cfg = editConfig.value
        if (!cfg) return
        editing.value = false
        cfg.onChange?.(editValue.value)
        cfg.onEnd?.()
        emit('update:editable-text', editValue.value)
      }
      const cancelEdit = () => {
        editing.value = false
        editConfig.value?.onCancel?.()
      }
      const onTextareaInput = (e: Event) => {
        editValue.value = (e.target as HTMLTextAreaElement).value
      }
      const onTextareaKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          cancelEdit()
          return
        }
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          finishEdit()
        }
      }

      // ellipsis
      const ellipsisConfig = computed<EllipsisConfig | null>(() => resolveConfig(props.ellipsis, {} as EllipsisConfig))
      const internalExpanded = ref(false)
      const expanded = computed(() => {
        const cfg = ellipsisConfig.value
        if (cfg && typeof cfg.expanded === 'boolean') return cfg.expanded
        return internalExpanded.value
      })
      const ellipsisRows = computed(() => ellipsisConfig.value?.rows ?? 1)
      const ellipsisExpandable = computed(() => {
        const cfg = ellipsisConfig.value
        if (!cfg) return false
        return cfg.expandable === true || cfg.expandable === 'collapsible'
      })
      const toggleExpand = () => {
        const cfg = ellipsisConfig.value
        if (!cfg) return
        const next = !expanded.value
        if (typeof cfg.expanded !== 'boolean') {
          internalExpanded.value = next
        }
        cfg.onExpand?.(next)
      }

      onBeforeUnmount(() => {
        if (copyResetTimer !== null) clearTimeout(copyResetTimer)
      })

      const cls = computed(() => ({
        ...buildModifierClasses(props as TextProps),
        ...(extraClass ? extraClass(props) : {}),
        [ns.m('ellipsis')]: !!ellipsisConfig.value && !expanded.value,
        [ns.m(`ellipsis-${ellipsisRows.value}`)]: !!ellipsisConfig.value && !expanded.value && ellipsisRows.value > 1,
      }))

      const renderCopyBtn = (): VNode | null => {
        const cfg = copyConfig.value
        if (!cfg) return null
        const tooltips = cfg.tooltips === false ? null : (cfg.tooltips ?? ['复制', '已复制'])
        const titleAttr = tooltips ? (copied.value ? tooltips[1] : tooltips[0]) : undefined
        if (slots['copy-icon']) {
          return (
            <span
              class={[ns.e('copy'), copied.value && ns.is('copied')]}
              role="button"
              title={titleAttr}
              onClick={triggerCopy}
            >
              {slots['copy-icon']({ copied: copied.value })}
            </span>
          )
        }
        return (
          <span
            class={[ns.e('copy'), copied.value && ns.is('copied')]}
            role="button"
            title={titleAttr}
            onClick={triggerCopy}
          >
            {copied.value ? renderIconNode('mdi:check') : renderIconNode('mdi:content-copy')}
          </span>
        )
      }

      const renderEditBtn = (): VNode | null => {
        const cfg = editConfig.value
        if (!cfg) return null
        const triggerTypes = cfg.triggerType ?? ['icon']
        if (!triggerTypes.includes('icon')) return null
        if (slots['edit-icon']) {
          return (
            <span class={ns.e('edit')} role="button" title={cfg.tooltip || undefined} onClick={startEdit}>
              {slots['edit-icon']()}
            </span>
          )
        }
        return (
          <span class={ns.e('edit')} role="button" title={cfg.tooltip || undefined} onClick={startEdit}>
            ✎
          </span>
        )
      }

      const renderExpandBtn = (): VNode | null => {
        if (!ellipsisExpandable.value) return null
        const cfg = ellipsisConfig.value!
        if (expanded.value) {
          // collapsible 模式下展示收起；普通 expandable 展开后不再返回
          if (cfg.expandable !== 'collapsible' && cfg.expandable !== true) return null
          return (
            <span class={ns.e('collapse')} role="button" onClick={toggleExpand}>
              {slots['collapse-text'] ? slots['collapse-text']() : '收起'}
            </span>
          )
        }
        return (
          <span class={ns.e('expand')} role="button" onClick={toggleExpand}>
            {slots['expand-text'] ? slots['expand-text']() : '展开'}
          </span>
        )
      }

      const renderEditingInput = (): VNode => {
        const cfg = editConfig.value!
        return (
          <textarea
            ref={(el: Element | null) => {
              textareaRef.value = el as HTMLTextAreaElement | null
            }}
            class={ns.e('edit-input')}
            value={editValue.value}
            maxlength={cfg.maxLength}
            onInput={onTextareaInput}
            onKeydown={onTextareaKeydown}
            onBlur={finishEdit}
          />
        )
      }

      const onTextClick = () => {
        const cfg = editConfig.value
        if (!cfg) return
        if ((cfg.triggerType ?? ['icon']).includes('text')) startEdit()
      }

      return () => {
        const tagName = tag(props)
        const ellipsisTitle = (() => {
          const cfg = ellipsisConfig.value
          if (!cfg || !cfg.tooltip || expanded.value) return undefined
          return typeof cfg.tooltip === 'string' ? cfg.tooltip : getSlotText(slots)
        })()

        if (editing.value) {
          return h(tagName, { class: cls.value }, [renderEditingInput()])
        }

        const tagAttrs: Record<string, unknown> = {
          class: cls.value,
          title: ellipsisTitle,
          'data-ellipsis-rows': ellipsisConfig.value ? ellipsisRows.value : undefined,
        }
        if (editConfig.value && (editConfig.value.triggerType ?? ['icon']).includes('text')) {
          tagAttrs.onClick = onTextClick
        }
        if (tagName === 'a') {
          tagAttrs.href = (props as unknown as LinkProps).href
          tagAttrs.target = (props as unknown as LinkProps).target
        }

        const children: (VNode | string)[] = []
        const inner = renderInner(slots, props as TextProps)
        if (Array.isArray(inner)) children.push(...inner)
        else children.push(inner)

        const editBtn = renderEditBtn()
        const copyBtn = renderCopyBtn()
        const expandBtn = renderExpandBtn()
        if (expandBtn) children.push(expandBtn)
        if (editBtn) children.push(editBtn)
        if (copyBtn) children.push(copyBtn)

        return h(tagName, tagAttrs, children)
      }
    },
  })
}

export const Text = createTypographyComponent(
  'CTypographyText',
  textProps as unknown as Record<string, unknown>,
  () => 'span',
  () => ({ [ns.m('text')]: true }),
)

export const Paragraph = createTypographyComponent(
  'CTypographyParagraph',
  paragraphProps as unknown as Record<string, unknown>,
  () => 'div',
  () => ({ [ns.m('paragraph')]: true }),
)

export const Title = createTypographyComponent(
  'CTypographyTitle',
  titleProps as unknown as Record<string, unknown>,
  (props) => `h${(props as unknown as TitleProps).level}`,
  (props) => ({
    [ns.m('title')]: true,
    [ns.m(`title-${(props as unknown as TitleProps).level}`)]: true,
  }),
)

export const Link = createTypographyComponent(
  'CTypographyLink',
  linkProps as unknown as Record<string, unknown>,
  () => 'a',
  () => ({ [ns.m('link')]: true }),
)

export const Typography = defineComponent({
  name: 'CTypography',
  setup(_, { slots }) {
    return () => h('article', { class: ns.b() }, slots.default?.())
  },
})
