# Upload 上传

文件上传控件。提供文件选择、拖拽接收、文件列表、删除四个核心能力。**80% 切片下不内置 HTTP 上传请求** —— 业务侧通过 `update:fileList` 拿到文件后自行发请求并回写状态，组件只负责 UI 与状态同步。

## 基本用法

`v-model:fileList` 绑定文件列表，点击按钮选择文件。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const list = ref<Array<{ uid: string; name: string; status?: string }>>([])
</script>

<template>
  <c-upload v-model:fileList="list" />
  <pre style="margin-top: 12px; font-size: 12px">{{ list }}</pre>
</template>
```

:::

## 拖拽上传

`drag` 把按钮替换成拖拽区，支持点击 / 拖拽两种触发。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const list = ref<Array<{ uid: string; name: string }>>([])
</script>

<template>
  <c-upload v-model:fileList="list" drag />
</template>
```

:::

## 多选 + 类型限制

`multiple` 允许多选；`accept` 直接传给 native `<input>`，浏览器会根据 MIME 过滤。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const list = ref<Array<{ uid: string; name: string }>>([])
</script>

<template>
  <c-upload v-model:fileList="list" multiple accept="image/*" />
</template>
```

:::

## 数量与大小限制

- `max-count` 限制总数，超出的文件被丢弃 + 触发 `reject(file, 'maxCount')`
- `max-size` 限制单文件字节数，超出 + 触发 `reject(file, 'maxSize')`
- `before-upload` 同步过滤函数，返回 `false` 拒收 + 触发 `reject(file, 'beforeUpload')`

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const list = ref<Array<{ uid: string; name: string }>>([])

function onReject(file: File, reason: string) {
  alert(`拒绝 ${file.name}: ${reason}`)
}

function checkExt(file: File) {
  return file.name.endsWith('.txt')
}
</script>

<template>
  <c-upload
    v-model:fileList="list"
    multiple
    :max-count="3"
    :max-size="1024 * 1024"
    :before-upload="checkExt"
    @reject="onReject"
  />
</template>
```

:::

## 持续上传中状态

`default-status="uploading"` 让每个新文件初始为 uploading 状态。业务发完真实请求后，自己改为 `done` / `error`。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const list = ref<Array<{ uid: string; name: string; status: string; percent: number }>>([])

function onChange(file: { uid: string }, next: typeof list.value) {
  list.value = next
  // 模拟一个 1.5s 的上传
  const target = list.value.find((f) => f.uid === file.uid)
  if (target && target.status === 'uploading') {
    setTimeout(() => {
      target.percent = 100
      target.status = 'done'
    }, 1500)
  }
}
</script>

<template>
  <c-upload :fileList="list" default-status="uploading" @change="onChange" />
</template>
```

:::

## 自定义触发器

default slot 替换默认按钮（拖拽模式下 default slot 不生效）。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const list = ref<Array<{ uid: string; name: string }>>([])
</script>

<template>
  <c-upload v-model:fileList="list">
    <c-button type="primary">📤 上传文件</c-button>
  </c-upload>
</template>
```

:::

## 自定义列表项

`itemRender` slot 完全自渲列表，参数 `{ item, remove }`。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const list = ref<Array<{ uid: string; name: string }>>([])
</script>

<template>
  <c-upload v-model:fileList="list" multiple>
    <template #itemRender="{ item, remove }">
      <li
        style="display:flex;align-items:center;gap:8px;padding:6px;background:#fff;border:1px solid #eee;border-radius:4px;margin-top:6px"
      >
        <span>📄</span>
        <span style="flex:1">{{ item.name }}</span>
        <c-button size="small" @click="remove">移除</c-button>
      </li>
    </template>
  </c-upload>
</template>
```

:::

## 禁用

`disabled` 关掉点击 / 拖拽 / 列表项的 ✕ 按钮。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const list = ref([{ uid: '1', name: 'preset.txt', status: 'done' }])
</script>

<template>
  <c-upload :fileList="list" disabled />
</template>
```

:::

## API

### Props

| 参数            | 类型                                                            | 默认值                       | 说明                                                               |
| --------------- | --------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------ |
| fileList        | `UploadFile[]`                                                  | --                           | 受控文件列表，支持 `v-model:fileList`                              |
| defaultFileList | `UploadFile[]`                                                  | `[]`                         | 非受控初始列表                                                     |
| accept          | string                                                          | `''`                         | 接受的文件类型（传给 native input.accept）                         |
| multiple        | boolean                                                         | `false`                      | 是否允许多选                                                       |
| disabled        | boolean                                                         | `false`                      | 是否禁用                                                           |
| maxCount        | number                                                          | `0`                          | 最大文件数；`0` 表示不限                                           |
| maxSize         | number                                                          | `0`                          | 单文件最大字节数；`0` 表示不限                                     |
| beforeUpload    | `(file: File, fileList: File[]) => boolean \| Promise<boolean>` | --                           | 过滤函数（同步/异步）；返回 false 拒收                             |
| drag            | boolean                                                         | `false`                      | 是否渲染拖拽区域代替按钮                                           |
| showUploadList  | boolean                                                         | `true`                       | 是否渲染文件列表                                                   |
| listType        | `'text' \| 'picture'`                                           | `'text'`                     | 列表展示形态；`picture` 显示缩略图（thumbUrl/url）                 |
| defaultStatus   | `'uploading' \| 'done' \| 'error'`                              | `'done'`                     | 新加文件的初始 status；业务可改为 'uploading' 让组件持续显示加载态 |
| triggerText     | string                                                          | `点击上传`                   | 默认按钮文案                                                       |
| dragText        | string                                                          | `点击或拖拽文件到此区域上传` | 拖拽区文案                                                         |
| removeText      | string                                                          | `删除`                       | 列表项 × 按钮的 aria-label                                         |
| customRequest   | `(options: CustomRequestOptions) => void`                       | --                           | 自定义上传函数（onProgress/onSuccess/onError）                     |
| action          | string                                                          | `''`                         | 上传地址；未传 customRequest 时用默认 XHR POST                     |

### UploadFile

| 字段     | 类型                                            | 说明                         |
| -------- | ----------------------------------------------- | ---------------------------- |
| uid      | string                                          | 唯一标识；组件生成时自动给   |
| name     | string                                          | 文件名                       |
| size     | number                                          | 字节数                       |
| type     | string                                          | MIME                         |
| status   | `'uploading' \| 'done' \| 'error' \| 'removed'` | 状态                         |
| percent  | number                                          | 上传进度（0-100）            |
| url      | string                                          | 已上传的远端 URL（业务回写） |
| response | unknown                                         | 后端响应（业务回写）         |
| raw      | File                                            | 原始 File 对象               |

### Events

| 事件名          | 回调签名                                                          | 触发时机                   |
| --------------- | ----------------------------------------------------------------- | -------------------------- |
| update:fileList | `(list: UploadFile[])`                                            | 列表变化                   |
| change          | `(file: UploadFile, list: UploadFile[])`                          | 单文件添加 / 移除时        |
| remove          | `(file: UploadFile)`                                              | 用户点 × 移除              |
| reject          | `(file: File, reason: 'maxSize' \| 'maxCount' \| 'beforeUpload')` | 文件被拒收                 |
| drop            | `(e: DragEvent)`                                                  | 拖拽放下（仅 `drag=true`） |
| preview         | `(file: UploadFile)`                                              | 点击文件名时触发           |

### Slots

| 名称       | 参数                                       | 说明                               |
| ---------- | ------------------------------------------ | ---------------------------------- |
| default    | --                                         | 自定义触发器（drag=true 时不生效） |
| itemRender | `{ item: UploadFile, remove: () => void }` | 自定义单项渲染                     |

## 已知限制（未交付）

- **picture-card 样式**：`listType='picture'` 已支持缩略图，但 picture-card 卡片网格布局留后续。
- **进度条**：`percent` 字段已支持渲染百分比文字，但没有彩色进度条 UI；后续接入 `c-progress`。
- **chunk 分片上传 / 断点续传**：复杂场景，留长尾。
- **directory 目录选择**：input.webkitdirectory 暂未透传。
