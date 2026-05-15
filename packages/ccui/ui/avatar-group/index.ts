import type { App } from 'vue'
import AvatarGroup from './src/avatar-group'

AvatarGroup.install = function (app: App): void {
  app.component(AvatarGroup.name!, AvatarGroup)
}

export { AvatarGroup }

export type {
  AvatarGroupContext,
  AvatarGroupPlacement,
  AvatarGroupProps,
  AvatarGroupShape,
  AvatarGroupSize,
  AvatarGroupTrigger,
} from './src/avatar-group-types'

export { avatarGroupInjectionKey, resolveAvatarSize } from './src/avatar-group-types'

export default {
  title: 'AvatarGroup 头像组',
  category: '数据展示',
  status: '80%',
  install(app: App): void {
    app.component(AvatarGroup.name!, AvatarGroup)
  },
}
