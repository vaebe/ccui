import type { Slots, VNode } from 'vue'
import type { LinkProps, TextProps, TitleProps } from './typography-types'
import { computed, defineComponent, h } from 'vue'
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
  return children.map(c => wrapWithDecorations(c, props)) as VNode[]
}

export const Text = defineComponent({
  name: 'CTypographyText',
  props: textProps,
  setup(props, { slots }) {
    const cls = computed(() => ({
      ...buildModifierClasses(props as TextProps),
      [ns.m('text')]: true,
    }))
    return () => h('span', { class: cls.value }, renderInner(slots, props as TextProps))
  },
})

export const Paragraph = defineComponent({
  name: 'CTypographyParagraph',
  props: paragraphProps,
  setup(props, { slots }) {
    const cls = computed(() => ({
      ...buildModifierClasses(props as TextProps),
      [ns.m('paragraph')]: true,
    }))
    return () => h('div', { class: cls.value }, renderInner(slots, props as TextProps))
  },
})

export const Title = defineComponent({
  name: 'CTypographyTitle',
  props: titleProps,
  setup(props, { slots }) {
    const cls = computed(() => ({
      ...buildModifierClasses(props as unknown as TextProps),
      [ns.m('title')]: true,
      [ns.m(`title-${props.level}`)]: true,
    }))
    return () => h(
      `h${(props as TitleProps).level}`,
      { class: cls.value },
      renderInner(slots, props as unknown as TextProps),
    )
  },
})

export const Link = defineComponent({
  name: 'CTypographyLink',
  props: linkProps,
  setup(props, { slots }) {
    const cls = computed(() => ({
      ...buildModifierClasses(props as TextProps),
      [ns.m('link')]: true,
    }))
    return () => h(
      'a',
      {
        class: cls.value,
        href: (props as LinkProps).href,
        target: (props as LinkProps).target,
      },
      renderInner(slots, props as TextProps),
    )
  },
})

export const Typography = defineComponent({
  name: 'CTypography',
  setup(_, { slots }) {
    return () => h('article', { class: ns.b() }, slots.default?.())
  },
})
