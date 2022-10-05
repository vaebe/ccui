# Tabs 选项卡

+ 选项卡切换组件。

## 何时使用

+ 用户需要通过平级的区域将大块内容进行收纳和展现，保持界面整洁。

## Tabs基本用法

:::demo Tabs 基本用法

```vue

<template>
  <c-tabs v-model="activeTab" class="my-tabs">
    <c-tab label="周一" name="1">
      我们终将远行，和过去稚嫩的自己告别。这是一个流行告别的时代，陪你颠沛流离的人越来越少，直至没有。我们也要习惯昔日好友的渐行渐远，因为我们终将长大，长大到可以独自一人抵挡风雨。
    </c-tab>
    <c-tab label="周二" name="2">
      人生就是一辆开往坟墓的列车，路途上会有很多站，很难有人可以自始至终地陪你走完。当陪你的人要下车时，即使不舍也该心存感激，然后挥手道别。人生就是如此，没有谁会一直陪伴谁，我们应该怀着感恩之心，和过去的好友告别。毕竟曾经在我们人生某一个艰难的时刻，她们的确给过我们温暖。
    </c-tab>
    <c-tab label="疯狂星期四" name="3">V我50</c-tab>
  </c-tabs>
</template>

<script>
import {defineComponent, ref} from 'vue'

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

## Tabs卡片风格的标签

:::demo Tabs 卡片风格的标签

```vue

<template>
  <c-tabs v-model="activeTab" type="card" class="my-tabs">
    <c-tab label="周一" name="1">
      我们终将远行，和过去稚嫩的自己告别。这是一个流行告别的时代，陪你颠沛流离的人越来越少，直至没有。我们也要习惯昔日好友的渐行渐远，因为我们终将长大，长大到可以独自一人抵挡风雨。
    </c-tab>
    <c-tab label="周二" name="2">
      人生就是一辆开往坟墓的列车，路途上会有很多站，很难有人可以自始至终地陪你走完。当陪你的人要下车时，即使不舍也该心存感激，然后挥手道别。人生就是如此，没有谁会一直陪伴谁，我们应该怀着感恩之心，和过去的好友告别。毕竟曾经在我们人生某一个艰难的时刻，她们的确给过我们温暖。
    </c-tab>
    <c-tab label="疯狂星期四" name="3">V我100别问为什么，问就是有中间商</c-tab>
  </c-tabs>
</template>

<script>
import {defineComponent, ref} from 'vue'

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

## Tabs带有边框的卡片风格

:::demo Tabs 带有边框的卡片风格

```vue

<template>
  <c-tabs v-model="activeTab" type="border-card" class="my-tabs">
    <c-tab label="周一" name="1">
      我们终将远行，和过去稚嫩的自己告别。这是一个流行告别的时代，陪你颠沛流离的人越来越少，直至没有。我们也要习惯昔日好友的渐行渐远，因为我们终将长大，长大到可以独自一人抵挡风雨。
    </c-tab>
    <c-tab label="周二" name="2">
      人生就是一辆开往坟墓的列车，路途上会有很多站，很难有人可以自始至终地陪你走完。当陪你的人要下车时，即使不舍也该心存感激，然后挥手道别。人生就是如此，没有谁会一直陪伴谁，我们应该怀着感恩之心，和过去的好友告别。毕竟曾经在我们人生某一个艰难的时刻，她们的确给过我们温暖。
    </c-tab>
    <c-tab label="疯狂星期四" name="3">
      工厂模式其实就是将创建对象的过程单独封装：比如说点一份西红柿炒蛋，我们不用关心西红柿怎么切、怎么打鸡蛋这些菜品制作过程中的问题，我们只关心摆上桌那道菜。在工厂模式里，我传参这个过程就是点菜，工厂函数里面运转的逻辑就相当于炒菜的厨师和上桌的服务员做掉的那部分工作——这部分工作我们同样不用关心，我们只要能拿到工厂交付给我们的实例结果就行了。
    </c-tab>
  </c-tabs>
</template>

<script>
import {defineComponent, ref} from 'vue'

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

## Tabs自定义标签页标题

:::demo Tabs 自定义标签页标题

```vue

<template>
  <c-tabs v-model="activeTab" class="my-tabs">
    <c-tab label="周一" name="1">
      <template v-slot:title>
        周一
      </template>
      我们终将远行，和过去稚嫩的自己告别。这是一个流行告别的时代，陪你颠沛流离的人越来越少，直至没有。我们也要习惯昔日好友的渐行渐远，因为我们终将长大，长大到可以独自一人抵挡风雨。
    </c-tab>
    <c-tab label="周二" name="2">
      人生就是一辆开往坟墓的列车，路途上会有很多站，很难有人可以自始至终地陪你走完。当陪你的人要下车时，即使不舍也该心存感激，然后挥手道别。人生就是如此，没有谁会一直陪伴谁，我们应该怀着感恩之心，和过去的好友告别。毕竟曾经在我们人生某一个艰难的时刻，她们的确给过我们温暖。
    </c-tab>
    <c-tab label="疯狂星期四" name="3">
      保证一个类仅有一个实例，并提供一个访问它的全局访问点，这样的模式就叫做单例模式。
    </c-tab>
  </c-tabs>
</template>

<script>
import {defineComponent, ref} from 'vue'

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

## Tabs标签位置的设置

:::demo Tabs 标签位置的设置

```vue

<template>
  <c-radio-group v-model="checkedRadio" direction="row">
    <c-radio label="top">top</c-radio>
    <c-radio label="right">right</c-radio>
    <c-radio label="bottom">bottom</c-radio>
    <c-radio label="left">left</c-radio>
  </c-radio-group>

  <c-tabs v-model="activeTab" class="my-tabs" :tab-position="checkedRadio">
    <c-tab label="周一" name="1">疲惫的一天</c-tab>
    <c-tab label="周二" name="2">开心</c-tab>
    <c-tab label="疯狂星期四" name="3">狂吃</c-tab>
  </c-tabs>
</template>

<script>
import {defineComponent, ref} from 'vue'

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

## Tabs参数

| 参数 | 类型                                    | 默认  | 说明 |
| ---- |---------------------------------------|-----|----|
|  v-model   | [ModelValueType](#modelvaluetype)     | -   |  绑定值，选中选项卡的 name    |
|   type   | [TabsType](#itabstype)                | -   |   风格类型 |
|   tab-position   | [ITabPositionType](#itabpositiontype) | top |   选项卡所在位置 |

## Tabs事件

| 事件 | 类型                                    | 说明 |
| ---- |---------------------------------------| ---- |
|  change    | [BeforeChangeType](#beforechangetype) |   activeName 改变时触发   |

## tabs类型定义

### ModelValueType

```ts
export type ModelValueType = string | number;
```

### ITabsType

```ts
export type ITabsType = '' | 'card' | 'border-card';
```

### ITabPositionType

```ts
export type ITabPositionType = 'top' | 'right' | 'bottom' | 'left';
```

### BeforeChangeType

```ts
export type Active = string | number | null;
export type BeforeChangeType = (id: Active) => boolean;
```

## Tabs插槽

默认插槽

## Tab参数

| 参数 | 类型                      | 默认  | 说明 |
| --- |-------------------------|-----|---|
|  label  | [LabelType](#labeltype) | -   | 选项卡标题  |
|   name | [NameType](#nametype)   | -   |   与选项卡绑定值 value 对应的标识符，表示选项卡别名 |

## tab类型定义

### LabelType

```ts
export type LabelType = string | number;
```

### NameType

```ts
export type NameType = string | number;
```

## Tab插槽

| 插槽名 | 说明 |
|--|------|
| title | 标签页标题 |
| - | 默认插槽 |

