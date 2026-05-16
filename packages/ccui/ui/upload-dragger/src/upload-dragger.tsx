import { defineComponent, h } from 'vue'
import Upload from '../../upload/src/upload'
import { uploadProps } from '../../upload/src/upload-types'
import './upload-dragger.scss'

// UploadDragger 是 Upload 的视觉封装：默认开启 drag 模式 + 大尺寸 dropzone 占位区。
// 实现走平铺顶层组件（`<c-upload-dragger>`），不挂 `Upload.Dragger` 静态属性。
export default defineComponent({
  name: 'CUploadDragger',
  props: uploadProps,
  emits: ['update:fileList', 'change', 'remove', 'preview', 'reject'],
  setup(props, { emit, slots, attrs }) {
    return () =>
      h(
        Upload,
        {
          ...attrs,
          ...props,
          drag: true,
          'onUpdate:fileList': (v: unknown) => emit('update:fileList', v as never),
          onChange: (v: unknown) => emit('change', v as never),
          onRemove: (v: unknown) => emit('remove', v as never),
          onPreview: (v: unknown) => emit('preview', v as never),
          onReject: (v: unknown) => emit('reject', v as never),
        },
        slots,
      )
  },
})
