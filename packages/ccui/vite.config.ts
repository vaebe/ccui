/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [vue(),vueJsx()],
  test: {
    globals: true,
    environment: 'jsdom',
    // transformMode: {
    //   web: [/.[tj]sx$/]
    // }
  }
});
