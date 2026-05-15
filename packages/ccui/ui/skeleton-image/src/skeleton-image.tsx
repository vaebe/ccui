import type { SkeletonImageProps } from './skeleton-image-types'
import { computed, defineComponent, h } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { skeletonImageProps } from './skeleton-image-types'
import './skeleton-image.scss'

// 内置图片图标：96×96 灰色占位 + 中央山形 SVG（对齐 ant 视觉）。
function pictureIcon() {
  return h(
    'svg',
    {
      viewBox: '0 0 1098 1024',
      width: '48',
      height: '48',
      'aria-hidden': 'true',
      class: 'ccui-skeleton-image__svg',
    },
    h('path', {
      fill: 'currentColor',
      d: 'M365.714 329.143q0 45.714-32.286 78t-78 32.286-78-32.286-32.286-78 32.286-78 78-32.286 78 32.286 32.286 78zM950.857 548.571v256h-804.571v-109.714l182.857-182.857 91.429 91.429 292.571-292.571zM1005.714 146.286h-914.286q-7.429 0-12.857 5.429t-5.429 12.857v694.857q0 7.429 5.429 12.857t12.857 5.429h914.286q7.429 0 12.857-5.429t5.429-12.857v-694.857q0-7.429-5.429-12.857t-12.857-5.429zM1097.143 164.571v694.857q0 37.714-26.857 64.571t-64.571 26.857h-914.286q-37.714 0-64.571-26.857t-26.857-64.571v-694.857q0-37.714 26.857-64.571t64.571-26.857h914.286q37.714 0 64.571 26.857t26.857 64.571z',
    }),
  )
}

export default defineComponent({
  name: 'CSkeletonImage',
  props: skeletonImageProps,
  setup(props: SkeletonImageProps) {
    const ns = useNamespace('skeleton-image')
    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m('active')]: props.active,
    }))
    return () => h('span', { class: cls.value, 'aria-busy': 'true', 'aria-hidden': 'true' }, pictureIcon())
  },
})
