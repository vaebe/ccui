# Steps 步骤条

引导用户按照流程完成任务的导航条。

## 基本使用

:::demo

```vue
<template>
  <c-steps
    :current="1"
    :items="[
      { title: '已完成', description: '第一步' },
      { title: '进行中', description: '第二步' },
      { title: '待处理', description: '第三步' },
    ]"
  />
</template>
```

:::

## 状态：error

:::demo

```vue
<template>
  <c-steps
    :current="1"
    status="error"
    :items="[
      { title: '完成' },
      { title: '失败' },
      { title: '未开始' },
    ]"
  />
</template>
```

:::

## 纵向

:::demo

```vue
<template>
  <c-steps
    :current="1"
    direction="vertical"
    :items="[
      { title: 'Step 1', description: '完成' },
      { title: 'Step 2', description: '进行中' },
      { title: 'Step 3', description: '待处理' },
    ]"
  />
</template>
```

:::
