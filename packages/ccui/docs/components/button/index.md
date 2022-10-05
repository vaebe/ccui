# Button 按钮

+ 常用的操作按钮。

## 何时使用

+ 按钮用于开始一个即时操作。

## 基本用法

:::demo Button 示例

```vue

<template>
  <p>基本使用</p>
  <div>
    <c-button>北京</c-button>
    <c-button type='primary'>上海</c-button>
    <c-button type='success'>深圳</c-button>
    <c-button type='warning'>河南</c-button>
    <c-button type='danger'>合肥</c-button>
    <c-button type='info'>河北</c-button>
    <c-button type='text'>安徽</c-button>
  </div>

  <p>大小 size</p>
  <div>
    <c-button type='success' size='large'>北京</c-button>
    <c-button type='warning'>上海</c-button>
    <c-button type='danger' size='small'>广东</c-button>
  </div>

  <p>禁用</p>
  <div>
    <c-button type='success' disabled>北京</c-button>
  </div>

  <p>圆角按钮</p>
  <div>
    <c-button type='success' round>北京</c-button>
    <c-button type='danger' size='small' round>广东</c-button>
  </div>

  <p>圆形按钮 与 icon 插槽</p>
  <div>
    <c-button type='success' circle>北</c-button>

    <c-button type='primary' circle>
      <template #icon>
        <svg t='1649322922975' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg'
             p-id='3628' width='16' height='16'>
          <path
              d='M943.273421 506.259252C906.84065 320.247768 724.900901 185.233772 510.685052 185.233772c-214.228129 0-396.154575 135.01502-432.589392 321.025481-0.529049 2.765997-0.529049 5.611811 0 8.376785C114.530476 700.66901 296.457946 835.685054 510.685052 835.685054c84.754313 0 166.926824-21.296025 237.682307-61.551868 10.854209-6.196119 14.542204-19.829628 8.197706-30.479175-6.341429-10.599406-20.225647-14.158465-31.172977-8.006348-63.754023 36.307927-138.010237 55.516408-214.709083 55.516408-190.771905 0-352.71932-117.805056-386.970402-280.715403 34.250058-162.89909 196.22101-280.690844 386.970402-280.690844 190.771905 0 352.71932 117.791753 386.969379 280.690844-12.098549 57.384965-41.084721 111.433952-84.026742 156.599617-8.574283 8.997931-8.032954 23.089881 1.174756 31.464619 9.184173 8.356318 23.608697 7.872295 32.207539-1.147126 49.846268-52.396347 83.111906-115.577319 96.265484-182.739974C943.813726 511.859807 943.813726 509.026272 943.273421 506.259252z'
              p-id='3629' fill='#ffffff'></path>
          <path
              d='M328.909032 515.482311c0 100.308567 81.792864 181.669596 182.689832 181.669596 100.872409 0 182.665273-81.362053 182.665273-181.669596 0.001023-100.307543-81.791841-181.634804-182.665273-181.634804l0 0C410.701896 333.847507 328.909032 415.174768 328.909032 515.482311zM648.616494 515.482311c0 75.237565-61.337997 136.257314-137.01763 136.257314l0 0c-75.67861 0-137.042189-61.018725-137.042189-136.257314 0-75.211982 61.362556-136.231731 137.042189-136.231731C587.277474 379.25058 648.616494 440.270329 648.616494 515.482311z'
              p-id='3630' fill='#ffffff'></path>
        </svg>
      </template>
    </c-button>
  </div>

  <p>朴素按钮</p>
  <div>
    <c-button type='primary' plain>上海</c-button>
    <c-button type='success' plain>深圳</c-button>
    <c-button type='warning' plain>河南</c-button>
    <c-button type='danger' plain>合肥</c-button>
    <c-button type='info' plain>河北</c-button>
  </div>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  setup() {
    return {
      msg: 'Button 按钮'
    }
  }
})
</script>

<style>
.ccui-button {
  margin-right: 10px;
}
</style>
```

:::

## Button参数

| 参数 | 类型                                    | 默认 | 说明 |
| ---- |---------------------------------------| ---- | ---- |
| size | [ButtonSizeType](#buttonsizetype)     | -- | 尺寸 |
| type | [ButtonType](#buttontype)             | -- | 类型 |
| plain | boolean                               | false | 是否为朴素按钮 |
| round | boolean                               | false | 是否为圆角按钮 |
| circle | boolean                               | false | 是否为圆形按钮 |
| disabled | boolean                               | false | 是否为禁用状态 |
| autofocus | boolean                               | false | 原生 autofocus 属性 |
| native-type | [ButtonNativeType](#buttonnativetype) | button | 原生 type 属性 |

## Button类型定义

### ButtonType

```ts
export type ButtonType =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'text';
```

### ButtonSizeType

```ts
export type ButtonSizeType = 'large' | 'default' | 'small';
```

### ButtonNativeType

```ts
export type ButtonSizeType = 'large' | 'default' | 'small';
```

## Button插槽

| 插槽名 | 说明 |
| ---- | ---- |
| icon | 自定义图标组件 |

