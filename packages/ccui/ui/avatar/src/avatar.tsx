import { defineComponent, ref, toRefs, watch } from 'vue';
import { avatarProps, AvatarProps } from './avatar-types';
import './avatar.scss';
import useGetDisplayName from './composables/use-get-display-name';
import useGetBackgroundColor from './composables/use-get-background-color';
import { IconBody } from './components/icon-body';
import { IconImgError } from './components/icon-img-error';

export default defineComponent({
  name: 'KAvatar',
  props: avatarProps,
  emits: [],
  setup(props: AvatarProps, ctx) {
    const { name, width, height, customText, gender, imgSrc, isRound, fit } =
      toRefs(props);

    // 头像图片加载是否有错误
    const isErrorImg = ref<boolean>(false);
    const fontSize = ref<number>(12);
    const isNobody = ref<boolean>(true);
    const nameDisplay = ref<string>('');
    const BgColorCode = ref<number>(1);

    // 计算数据
    const calcValues = () => {
      const minNum = ref<number>(Math.min(width.value, height.value));

      // 获取展示名称
      nameDisplay.value = useGetDisplayName(
        name.value,
        customText.value,
        minNum.value
      );

      // 计算展示文本的字体大小
      fontSize.value = minNum.value / 4 + 3;

      // 传入的name不存在 且不等于 '' 时
      isNobody.value = !!name.value && name.value === '';

      // 计算背景颜色code
      BgColorCode.value = useGetBackgroundColor(
        gender.value,
        nameDisplay.value.substring(0, 1)
      );
    };

    watch(
      [name, width, height, customText, gender, isRound],
      () => {
        calcValues();
      },
      { immediate: true }
    );

    const showErrorAvatar = () => {
      isErrorImg.value = true;
    };

    const imgElement = (
      <img
        src={imgSrc.value}
        alt=''
        onError={showErrorAvatar}
        style={{
          width: `${width.value}px`,
          height: `${height.value}px`,
          verticalAlign: 'middle',
          objectFit: fit.value,
          borderRadius: isRound.value ? '100%' : '0'
        }}
      />
    );

    const imgSrcErrElement = (
      <span
        class={`okUi-avatar-style`}
        style={{ borderRadius: isRound.value ? '100%' : '0' }}
      >
        <IconImgError width={width.value} height={height.value} />
      </span>
    );

    const hasImgElement = () => {
      if (imgSrc.value && !isErrorImg.value) {
        return imgElement;
      }

      if (imgSrc.value !== '' && isErrorImg.value) {
        return imgSrcErrElement;
      }

      return null;
    };

    const nameElement = (
      <span
        class={`okUi-avatar-style okUi-avatar-background-${BgColorCode.value}`}
        style={{
          height: `${height.value}px`,
          width: `${width.value}px`,
          lineHeight: `${height.value}px`,
          fontSize: `${fontSize.value}px`,
          borderRadius: isRound.value ? '100%' : '0'
        }}
      >
        {nameDisplay.value}
      </span>
    );

    const noNameElement = (
      <span
        class={`okUi-avatar-style`}
        style={{ borderRadius: isRound.value ? '100%' : '0' }}
      >
        <IconBody width={width.value} height={height.value} />
      </span>
    );

    const hasNameElement = () => {
      if (imgSrc.value) {
        return null;
      }

      if (!isNobody.value && nameDisplay.value?.length !== 0) {
        return nameElement;
      } else {
        return noNameElement;
      }
    };

    return () => {
      return (
        <div class='okUi-avatar'>
          {hasImgElement()}
          {hasNameElement()}
        </div>
      );
    };
  }
});
