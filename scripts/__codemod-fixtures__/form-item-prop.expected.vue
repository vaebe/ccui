<template>
  <c-form-item name="username" label="Username">
    <c-input v-model="form.username" />
  </c-form-item>
  <c-tag variant="filled">draft</c-tag>
  <c-color-picker v-model="color" format="hsb" />
  <c-popconfirm title="Sure?" ok-text="Yes" ok-type="primary" @confirm="onConfirm">
    <c-button>Delete</c-button>
  </c-popconfirm>
</template>
