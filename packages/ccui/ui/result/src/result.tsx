import type { ResultProps, ResultStatus } from './result-types'
import { computed, defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { resultProps } from './result-types'
import './result.scss'

const STATUS_ICON: Record<string, string> = {
  success:
    'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z',
  error:
    'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z',
  info: 'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z',
  warning:
    'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z',
}

const ICON_COLOR: Record<ResultStatus, string> = {
  success: '#52c41a',
  error: '#ff4d4f',
  info: '#1677ff',
  warning: '#faad14',
  404: '#1677ff',
  403: '#1677ff',
  500: '#1677ff',
}

const STATUS_TEXT: Record<string, { title: string; subTitle: string }> = {
  404: { title: '404', subTitle: 'Sorry, the page you visited does not exist.' },
  403: { title: '403', subTitle: 'Sorry, you are not authorized to access this page.' },
  500: { title: '500', subTitle: 'Sorry, something went wrong.' },
}

export default defineComponent({
  name: 'CResult',
  props: resultProps,
  setup(props: ResultProps, { slots }) {
    const ns = useNamespace('result')

    const isHttp = computed(() => props.status === '404' || props.status === '403' || props.status === '500')

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.status)]: true,
    }))

    const renderIcon = () => {
      if (slots.icon) {
        return slots.icon()
      }
      const path = STATUS_ICON[props.status] || STATUS_ICON.info
      const color = ICON_COLOR[props.status] || 'currentColor'
      return (
        <svg viewBox="64 64 896 896" width="72" height="72" fill={color}>
          <path d={path} />
        </svg>
      )
    }

    const titleText = computed(() => {
      if (props.title) {
        return props.title
      }
      if (isHttp.value) {
        return STATUS_TEXT[props.status]?.title
      }
      return ''
    })

    const subTitleText = computed(() => {
      if (props.subTitle) {
        return props.subTitle
      }
      if (isHttp.value) {
        return STATUS_TEXT[props.status]?.subTitle
      }
      return ''
    })

    return () => (
      <div class={cls.value}>
        <div class={ns.e('icon')}>{renderIcon()}</div>
        {titleText.value && <div class={ns.e('title')}>{titleText.value}</div>}
        {subTitleText.value && <div class={ns.e('subtitle')}>{subTitleText.value}</div>}
        {slots.extra && <div class={ns.e('extra')}>{slots.extra()}</div>}
        {slots.default && <div class={ns.e('content')}>{slots.default()}</div>}
      </div>
    )
  },
})
