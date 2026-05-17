<template>
  <c-form-item prop="username" label="Username">
    <c-input v-model="form.username" />
  </c-form-item>
  <c-tag :bordered="false">draft</c-tag>
  <c-color-picker v-model="color" format="hsv" />
  <c-popconfirm title="Sure?" confirm-text="Yes" confirm-type="primary" @confirm="onConfirm">
    <c-button>Delete</c-button>
  </c-popconfirm>
</template>
