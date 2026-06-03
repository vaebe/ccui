import { camelCase } from 'lodash-es'
import { UI_NAMESPACE, CSS_CLASS_PREFIX } from '../shared/constant.js'
import { bigCamelCase } from '../shared/utils.js'

// 创建组件模板
export const createComponentTemplate = ({ styleName, componentName, typesName }) => `\
import { defineComponent } from 'vue'
import { ${camelCase(componentName)}Props, ${bigCamelCase(componentName)}Props } from './${typesName}'
import './${styleName}.scss'

export default defineComponent({
  name: '${bigCamelCase(UI_NAMESPACE)}${bigCamelCase(componentName)}',
  props: ${camelCase(componentName)}Props,
  emits: [],
  setup(props: ${bigCamelCase(componentName)}Props, ctx) {
    return () => {
      return (<div class="${CSS_CLASS_PREFIX}-${componentName}"></div>)
    }
  }
})
`

// 创建类型声明模板
export const createTypesTemplate = ({ componentName }) => `\
import type { PropType, ExtractPropTypes } from 'vue'

export const ${camelCase(componentName)}Props = {
  /* test: {
    type: Object as PropType<{ xxx: xxx }>
  } */
} as const

export type ${bigCamelCase(componentName)}Props = ExtractPropTypes<typeof ${camelCase(componentName)}Props>
`

// 创建指令模板
export const createDirectiveTemplate = () => `\
// can export function.
export default {
  created() { },
  beforeMount() { },
  mounted() { },
  beforeUpdate() { },
  updated() { },
  beforeUnmount() { },
  unmounted() { }
}
`
// 创建server模板
export const createServiceTemplate = ({ componentName, typesName, serviceName }) => `\
import { ${bigCamelCase(componentName)}Props } from './${typesName}'

const ${bigCamelCase(serviceName)} = {
  // open(props: ${bigCamelCase(componentName)}Props) { }
}

export default ${bigCamelCase(serviceName)}
`

// 创建scss模板
export const createStyleTemplate = ({ componentName }) => `\
.${CSS_CLASS_PREFIX}-${componentName} {
  //
}
`

// 创建index模板
export const createIndexTemplate = ({
  title,
  category,
  hasComponent,
  hasDirective,
  hasService,
  componentName,
  directiveName,
  serviceName,
}) => {
  const Comp = bigCamelCase(componentName)
  const Dir = bigCamelCase(directiveName)
  const Svc = bigCamelCase(serviceName)

  // 先按"开关"列出所有要生成的部件，再统一渲染各 section（imports / exports / installs）
  const parts = []
  if (hasComponent) {
    parts.push({
      symbol: Comp,
      file: componentName,
      install: `app.component(${Comp}.name, ${Comp})`,
    })
  }
  if (hasDirective) {
    parts.push({
      symbol: Dir,
      file: directiveName,
      install: `app.directive('${Comp}', ${Dir})`,
    })
  }
  if (hasService) {
    parts.push({
      symbol: Svc,
      file: serviceName,
      install: `app.config.globalProperties.$${camelCase(serviceName)} = ${Svc}`,
    })
  }

  const importsBlock = parts.map((p) => `import ${p.symbol} from './src/${p.file}'`).join('\n')
  const exportsBlock = parts.map((p) => p.symbol).join(', ')
  const installBlock = parts.map((p) => `    ${p.install}`).join('\n')

  // hasComponent 时给组件类挂一个独立 install 函数（兼容直接 import 单个组件 + app.use 的用法）
  const componentInstallSection = hasComponent
    ? `${Comp}.install = function(app: App): void {\n  app.component(${Comp}.name, ${Comp})\n}\n\n`
    : ''

  return `\
import type { App } from 'vue'
${importsBlock}

${componentInstallSection}export { ${exportsBlock} }

export default {
  title: '${Comp} ${title}',
  category: '${category}',
  status: undefined, // TODO: 组件若开发完成则填入"100%"，并删除该注释
  install(app: App): void {
${installBlock}
  }
}
`
}

// 创建测试模板
export const createTestsTemplate = ({
  componentName,
  directiveName,
  serviceName,
  hasComponent,
  hasDirective,
  hasService,
}) => `\
import { shallowMount } from '@vue/test-utils';
import { expect, test, it } from 'vitest';
import { useNamespace } from '../../shared/hooks/use-namespace';

import { ${[
  hasComponent ? bigCamelCase(componentName) : null,
  hasDirective ? bigCamelCase(directiveName) : null,
  hasService ? bigCamelCase(serviceName) : null,
]
  .filter((p) => p !== null)
  .join(', ')} } from '../index';

test('${componentName} test', () => {
  const wrapper = shallowMount(${bigCamelCase(componentName)}, {
    props: {}
  });

  it('${componentName} demo has created successfully', async () => {
    expect(wrapper).toBeTruthy();
  });
});
`

// 创建文档模板
export const createDocumentTemplate = ({ componentName, title }) => `\
# ${bigCamelCase(componentName)} ${title}

// todo 组件描述

### 何时使用

// todo 使用时机描述


### 基本用法
// todo 用法描述
:::demo

\`\`\`vue
<template>
  <div>{{ msg }}</div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      msg: '${bigCamelCase(componentName)} ${title} 组件文档示例'
    }
  }
})
</script>

<style>

</style>
\`\`\`

:::

### ${UI_NAMESPACE}-${componentName}

${UI_NAMESPACE}-${componentName} 参数

| 参数 | 类型 | 默认 | 说明 |
| ---- | ---- | ---- | ---- |
|      |      |      |      |
|      |      |      |      |
|      |      |      |      |

${UI_NAMESPACE}-${componentName} 事件

| 事件 | 类型 | 说明 |
| ---- | ---- | ---- |
|      |      |      |
|      |      |      |
|      |      |      |

${UI_NAMESPACE}-${componentName} 插槽

| 插槽名 | 说明 |
| ---- | ---- |
|      |      |
|      |      |
|      |      |

`
