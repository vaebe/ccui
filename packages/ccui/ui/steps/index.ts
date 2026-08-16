import type { App } from 'vue'
import Steps from './src/steps'

// Keep the types documented for Steps available from the same public entry as the component.
export type { StepItem, StepsDirection, StepsProps, StepsSize, StepsType, StepStatus } from './src/steps-types'

Steps.install = function (app: App): void {
  app.component(Steps.name!, Steps)
}

export { Steps }

export default {
  title: 'Steps 步骤条',
  category: '导航',
  status: '100%',
  install(app: App): void {
    app.component(Steps.name!, Steps)
  },
}
