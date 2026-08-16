import type { AvatarProps } from './avatar-types'
import { computed, defineComponent, h, ref, toRefs, useAttrs, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { avatarProps } from './avatar-types'
import { IconBody } from './components/icon-body'
import useGetBackgroundColor from './composables/use-get-background-color'
import useGetDisplayName from './composables/use-get-display-name'
import './avatar.scss'

export default defineComponent({
  name: 'CAvatar',
  inheritAttrs: false,
  props: avatarProps,
  emits: [],
  setup(props: AvatarProps) {
    const attrs = useAttrs()
    const { name, width, height, customText, gender, imgSrc, isRound, fit } = toRefs(props)

    // 头像图片加载是否有错误
    const isErrorImg = ref<boolean>(false)
    const fontSize = ref<number>(12)
    const isNobody = ref<boolean>(true)
    const nameDisplay = ref<string>('')
    const BgColorCode = ref<number>(1)

    // 计算数据
    const calcValues = () => {
      const minNum = ref<number>(Math.min(width.value, height.value))

      // 获取展示名称
      nameDisplay.value = useGetDisplayName(name.value, customText.value, minNum.value)

      // 计算展示文本的字体大小
      fontSize.value = minNum.value / 4 + 3

      // customText 与 name 都为空才展示纯装饰性默认图标。
      isNobody.value = !nameDisplay.value

      // 计算背景颜色code
      BgColorCode.value = useGetBackgroundColor(gender.value, nameDisplay.value.substring(0, 1))
    }

    watch(
      [name, width, height, customText, gender, isRound],
      () => {
        calcValues()
      },
      { immediate: true },
    )

    /** 图片加载失败后移除无效图片，展示与无图片时相同的文字或占位回退。 */
    const showErrorAvatar = () => {
      isErrorImg.value = true
    }

    const ns = useNamespace('avatar')
    const styleNs = ns.e('style')

    /** 根据最新图片地址渲染图片；地址变化时重置失败状态，避免旧错误遮蔽新图片。 */
    const renderImage = () => {
      if (imgSrc.value && !isErrorImg.value) {
        return h('img', {
          src: imgSrc.value,
          alt: customText.value || name.value || '',
          onError: showErrorAvatar,
          class: props.classNames?.image,
          style: [
            {
              width: `${width.value}px`,
              height: `${height.value}px`,
              verticalAlign: 'middle',
              objectFit: fit.value,
              borderRadius: isRound.value ? '100%' : '0',
            },
            props.styles?.image,
          ],
        })
      }
      return null
    }

    // 新的 src 必须获得独立的加载机会；空 src 同样清理错误状态以便后续回填图片。
    watch(imgSrc, () => {
      isErrorImg.value = false
    })

    const backgroundNs = computed(() => {
      return ns.m(`background-${BgColorCode.value}`)
    })

    /** 在没有可用图片时，始终复用文本或默认占位，保持文档承诺的错误回退。 */
    const renderFallback = () => {
      if (imgSrc.value && !isErrorImg.value) {
        return null
      }

      if (!isNobody.value && nameDisplay.value?.length !== 0) {
        return h(
          'span',
          {
            class: [styleNs, backgroundNs.value, props.classNames?.text],
            style: [
              {
                height: `${height.value}px`,
                width: `${width.value}px`,
                lineHeight: `${height.value}px`,
                fontSize: `${fontSize.value}px`,
                borderRadius: isRound.value ? '100%' : '0',
              },
              props.styles?.text,
            ],
          },
          nameDisplay.value,
        )
      }

      return h(
        'span',
        { class: styleNs, style: { borderRadius: isRound.value ? '100%' : '0' }, 'aria-hidden': 'true' },
        h(IconBody, { width: width.value, height: height.value }),
      )
    }

    return () => {
      return h(
        'div',
        { ...attrs, class: [ns.b(), attrs.class, props.classNames?.root], style: [attrs.style, props.styles?.root] },
        [renderImage(), renderFallback()],
      )
    }
  },
})
