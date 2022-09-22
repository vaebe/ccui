# Tabs 选项卡

+ 选项卡切换组件。

## 何时使用

+ 用户需要通过平级的区域将大块内容进行收纳和展现，保持界面整洁。

## Tabs 基本用法

:::demo Tabs 基本用法

```vue

<template>
  <k-tabs v-model="activeTab" class="my-tabs">
    <k-tab label="周一" name="1">疲惫的一天</k-tab>
    <k-tab label="周二" name="2">开心</k-tab>
    <k-tab label="疯狂星期四" name="3">狂吃</k-tab>
  </k-tabs>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {

    const activeTab = ref('1')
    return {
      activeTab
    }
  }
})
</script>

<style lang="scss">
.my-tabs {
  .okUi-tab {
    padding: 20px;
    font-size: 30px;
    font-weight: bold;
  }
}
</style>
```

:::

## Tabs 卡片风格的标签

:::demo Tabs 卡片风格的标签

```vue

<template>
  <k-tabs v-model="activeTab" type="card" class="my-tabs">
    <k-tab label="周一" name="1">疲惫的一天</k-tab>
    <k-tab label="周二" name="2">开心</k-tab>
    <k-tab label="疯狂星期四" name="3">狂吃</k-tab>
  </k-tabs>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {

    const activeTab = ref('1')
    return {
      activeTab
    }
  }
})
</script>

<style lang="scss">
.my-tabs {
  .okUi-tab {
    padding: 20px;
    font-size: 30px;
    font-weight: bold;
  }
}
</style>
```

:::

## Tabs 带有边框的卡片风格

:::demo Tabs 带有边框的卡片风格

```vue

<template>
  <k-tabs v-model="activeTab" type="border-card" class="my-tabs">
    <k-tab label="周一" name="1">疲惫的一天</k-tab>
    <k-tab label="周二" name="2">开心</k-tab>
    <k-tab label="疯狂星期四" name="3">狂吃</k-tab>
  </k-tabs>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {

    const activeTab = ref('1')
    return {
      activeTab
    }
  }
})
</script>

<style lang="scss">
.my-tabs {
  .okUi-tab {
    padding: 20px;
    font-size: 30px;
    font-weight: bold;
  }
}
</style>
```

:::

## Tabs 自定义标签页标题

:::demo Tabs 自定义标签页标题

```vue

<template>
  <k-tabs v-model="activeTab" class="my-tabs">
    <k-tab label="周一" name="1">
      <template v-slot:title>
        周一
      </template>
      疲惫的一天
    </k-tab>
    <k-tab label="周二" name="2">开心</k-tab>
    <k-tab label="疯狂星期四" name="3">狂吃</k-tab>
  </k-tabs>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {

    const activeTab = ref('1')
    return {
      activeTab
    }
  }
})
</script>

<style lang="scss">
.my-tabs {
  .okUi-tab {
    padding: 20px;
    font-size: 30px;
    font-weight: bold;
  }
}
</style>
```

:::

## Tabs 标签位置的设置

:::demo Tabs 标签位置的设置

```vue

<template>
  <k-radio-group v-model="checkedRadio" direction="row">
    <k-radio label="top">top</k-radio>
    <k-radio label="right">right</k-radio>
    <k-radio label="bottom">bottom</k-radio>
    <k-radio label="left">left</k-radio>
  </k-radio-group>

  <k-tabs v-model="activeTab" class="my-tabs" :tab-position="checkedRadio">
    <k-tab label="周一" name="1">疲惫的一天</k-tab>
    <k-tab label="周二" name="2">开心</k-tab>
    <k-tab label="疯狂星期四" name="3">狂吃</k-tab>
  </k-tabs>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {

    const activeTab = ref('1')

    const checkedRadio = ref('top')
    return {
      activeTab,
      checkedRadio
    }
  }
})
</script>

<style lang="scss">
.my-tabs {
  height: 200px;

  .okUi-tab {
    padding: 20px;
    font-size: 30px;
    font-weight: bold;
  }
}
</style>
```

:::

## Tabs 参数

| 参数 | 类型            | 默认  | 说明 |
| ---- |---------------|-----|----|
|  v-model   | string/number | -   |  绑定值，选中选项卡的 name    |
|   type   | card/border-card        | -   |   风格类型 |
|   tab-position   | top/right/bottom/left        | top |   选项卡所在位置 |

## Tabs 事件

| 事件 | 类型 | 说明 |
| ---- | ---- | ---- |
|  change    |      |   activeName 改变时触发   |

## Tabs 插槽

| 插槽名 | 说明 |
|-----|--|
| - | 默认插槽 |

## Tab 参数

| 参数 | 类型            | 默认  | 说明 |
| --- |---------------|-----|---|
|  label  | string/number       | -   | 选项卡标题  |
|   name | string/number | -   |   与选项卡绑定值 value 对应的标识符，表示选项卡别名 |

## Tab 插槽

| 插槽名 | 说明 |
|--|------|
| title | 标签页标题 |
| - | 默认插槽 |

