import type { ExtractPropTypes, PropType } from 'vue'

export type UploadStatus = 'uploading' | 'done' | 'error' | 'removed'
/** 新选文件允许使用的初始状态；`removed` 仅用于删除事件快照。 */
export type UploadDefaultStatus = Exclude<UploadStatus, 'removed'>
export type UploadListType = 'text' | 'picture' | 'picture-card'
/** 文件被组件拒收时的稳定原因码。 */
export type UploadRejectReason = 'accept' | 'beforeUpload' | 'maxCount' | 'maxSize' | 'multiple'

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

export type BeforeUpload = (file: File, fileList: File[]) => boolean | undefined | Promise<boolean | undefined>

export interface CustomRequestOptions {
  file: File
  onProgress: (percent: number) => void
  onSuccess: (response?: unknown) => void
  onError: (error: Error) => void
}

export interface UploadRequestHandle {
  /** 取消仍在进行的上传请求。 */
  abort: () => void
}

/** 自定义请求可同步或异步返回取消句柄；Promise rejection 会转换为文件 error 状态。 */
export type CustomRequest = (
  options: CustomRequestOptions,
) => UploadRequestHandle | void | Promise<UploadRequestHandle | void>

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
  // 原生文件输入的表单字段名
  name: {
    type: String,
    default: undefined,
  },
  // 移动端原生文件输入的采集来源提示
  capture: {
    type: String as PropType<'environment' | 'user'>,
    default: undefined,
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
    type: String as PropType<UploadDefaultStatus>,
    default: 'done',
    validator: (value: UploadDefaultStatus) => value === 'uploading' || value === 'done' || value === 'error',
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
  // 自定义上传请求函数
  customRequest: {
    type: Function as PropType<CustomRequest>,
    default: undefined,
  },
  // 上传地址（customRequest 未传时使用）
  action: {
    type: String,
    default: '',
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
