import type { App } from 'vue'
import BorderBeam from './src/border-beam'

BorderBeam.install = function (app: App): void {
  app.component(BorderBeam.name!, BorderBeam)
}

export { BorderBeam }
export { borderBeamPresetKeys, borderBeamPresets } from './src/border-beam-presets'
export type { BorderBeamPreset } from './src/border-beam-presets'

export default {
  title: 'BorderBeam 边框流光',
  category: '通用',
  status: '100%',
  install(app: App): void {
    app.component(BorderBeam.name!, BorderBeam)
  },
}
