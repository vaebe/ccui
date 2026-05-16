# UploadDragger 拖拽上传

`<c-upload-dragger>` 是 `<c-upload>` 的视觉封装，默认开启 `drag` 模式 + 大尺寸 dropzone 占位区。所有 props / events 与 `<c-upload>` 一致，详细 API 请见 [Upload](/components/upload/)。

业务侧用 `<c-upload-dragger>` 取代「自己写 `<c-upload drag>` + 容器」，强调上传操作的视觉权重，常用于批量素材 / 知识库导入 / 富媒体场景。

## 基本用法

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const list = ref<Array<{ uid: string; name: string }>>([])
</script>

<template>
  <c-upload-dragger v-model:fileList="list" />
</template>
```

:::

## 多选 + 类型限制

`accept` / `multiple` 等限制 prop 与 Upload 完全一致，组件内部透传。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const list = ref<Array<{ uid: string; name: string }>>([])
</script>

<template>
  <c-upload-dragger v-model:fileList="list" multiple accept=".png,.jpg" drag-text="点击或拖拽图片到此处" />
</template>
```

:::

## 自定义请求

`custom-request` 函数用于自定义上传逻辑（如签名、分片、CDN 直传等）。与 Upload 用法一致。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const list = ref<Array<{ uid: string; name: string }>>([])

function customRequest({
  file,
  onProgress,
  onSuccess,
}: {
  file: File
  onProgress: (p: number) => void
  onSuccess: (r?: unknown) => void
}) {
  let p = 0
  const timer = setInterval(() => {
    p += 20
    onProgress(p)
    if (p >= 100) {
      clearInterval(timer)
      onSuccess({ ok: true, name: file.name })
    }
  }, 200)
  return { abort: () => clearInterval(timer) }
}
</script>

<template>
  <c-upload-dragger v-model:fileList="list" :custom-request="customRequest" />
</template>
```

:::

## 写在 Form 内

与 Upload 一样可放进 `<c-form-item>` 接管校验状态。

:::demo

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({ attachments: [] as Array<{ uid: string; name: string }> })
const formRef = ref<{ validate: () => Promise<boolean> } | null>(null)
const rules = {
  attachments: [
    {
      required: true,
      message: '请至少上传一份附件',
      validator: (_: unknown, v: unknown[]) => Array.isArray(v) && v.length > 0,
    },
  ],
}
</script>

<template>
  <c-form ref="formRef" :model="form" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
    <c-form-item name="attachments" label="附件" prop="attachments">
      <c-upload-dragger v-model:fileList="form.attachments" multiple drag-text="支持多文件批量上传" />
    </c-form-item>
    <c-form-item :wrapper-col="{ span: 24 }">
      <c-button type="primary" @click="formRef?.validate()"> 提交 </c-button>
    </c-form-item>
  </c-form>
</template>
```

:::

## API

完整 props / events 见 [Upload API](/components/upload/#api)。`<c-upload-dragger>` 仅对外强制 `drag=true`，其余 prop 默认值与 `<c-upload>` 保持一致。
