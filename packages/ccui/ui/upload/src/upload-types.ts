import type { ExtractPropTypes, PropType } from 'vue'

export type UploadStatus = 'uploading' | 'done' | 'error' | 'removed'
export type UploadListType = 'text' | 'picture'

export interface UploadFile {
  uid: string
  name: string
  size?: number
  type?: string
  status?: UploadStatus
  percent?: number
  url?: string
  response?: unknown
  thumbUrl?: string
  raw?: File
  // 业务自定义字段
  [extra: string]: unknown
}

export type BeforeUpload = (file: File, fileList: File[]) => boolean | undefined

export const uploadProps = {
  // 受控文件列表，支持 v-model:fileList
  fileList: {
    type: Array as PropType<UploadFile[]>,
    default: undefined,
  },
  defaultFileList: {
    type: Array as PropType<UploadFile[]>,
    default: () => [],
  },
  // 接受的文件类型，传给 input 的 accept 属性
  accept: {
    type: String,
    default: '',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  // 最大文件数；超出时新文件被丢弃
  maxCount: {
    type: Number,
    default: 0, // 0 = 不限
  },
  // 单文件最大字节数；超出时被 beforeUpload 之前过滤掉并 emit reject
  maxSize: {
    type: Number,
    default: 0, // 0 = 不限
  },
  beforeUpload: {
    type: Function as PropType<BeforeUpload>,
    default: undefined,
  },
  // 是否支持拖拽区域
  drag: {
    type: Boolean,
    default: false,
  },
  showUploadList: {
    type: Boolean,
    default: true,
  },
  listType: {
    type: String as PropType<UploadListType>,
    default: 'text',
  },
  // 选择文件后默认 status；业务可改为 'uploading' 让组件持续显示加载态，等业务回写为 'done'
  defaultStatus: {
    type: String as PropType<UploadStatus>,
    default: 'done',
  },
  removeText: {
    type: String,
    default: '删除',
  },
  triggerText: {
    type: String,
    default: '点击上传',
  },
  dragText: {
    type: String,
    default: '点击或拖拽文件到此区域上传',
  },
} as const

export type UploadProps = ExtractPropTypes<typeof uploadProps>

let uidSeed = 0
export function genUid(): string {
  uidSeed += 1
  return `ccui-upload-${Date.now()}-${uidSeed}`
}

export function fileToUploadFile(file: File, status: UploadStatus = 'done'): UploadFile {
  return {
    uid: genUid(),
    name: file.name,
    size: file.size,
    type: file.type,
    status,
    percent: status === 'done' ? 100 : 0,
    raw: file,
  }
}
