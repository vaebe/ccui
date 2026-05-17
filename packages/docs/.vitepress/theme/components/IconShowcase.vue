<script setup lang="ts">
import { ref } from 'vue'

interface IconGroup {
  title: string
  icons: string[]
}

defineProps<{ groups: IconGroup[] }>()

const copiedName = ref<string | null>(null)
let copiedTimer: ReturnType<typeof setTimeout> | null = null

async function copy(name: string) {
  try {
    await navigator.clipboard.writeText(name)
    copiedName.value = name
    if (copiedTimer) clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => {
      copiedName.value = null
    }, 1400)
  } catch {
    // 剪贴板不可用时静默失败（HTTP / 部分浏览器）
  }
}
</script>

<template>
  <div class="icon-showcase">
    <section v-for="group in groups" :key="group.title" class="icon-showcase__section">
      <h4 class="icon-showcase__title">
        {{ group.title }}
        <span class="icon-showcase__count">{{ group.icons.length }}</span>
      </h4>

      <div class="icon-showcase__grid">
        <button
          v-for="name in group.icons"
          :key="name"
          type="button"
          class="icon-showcase__card"
          :class="{ 'is-copied': copiedName === name }"
          :title="`点击复制 ${name}`"
          @click="copy(name)"
        >
          <span class="icon-showcase__icon-wrap">
            <c-icon :name="name" :size="26" />
          </span>
          <code class="icon-showcase__name">{{ name }}</code>
          <span v-if="copiedName === name" class="icon-showcase__toast">已复制</span>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.icon-showcase {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.icon-showcase__section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.icon-showcase__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.icon-showcase__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 20px;
  padding: 0 6px;
  font-size: 11px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: var(--vp-c-default-soft);
  border-radius: 10px;
  line-height: 1;
}

.icon-showcase__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(132px, 1fr));
  gap: 10px;
}

.icon-showcase__card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 10px 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  text-align: center;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background-color 0.18s ease,
    box-shadow 0.18s ease;
}

.icon-showcase__card:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.12);
}

.icon-showcase__card:hover .icon-showcase__icon-wrap {
  color: var(--vp-c-brand-1);
}

.icon-showcase__card:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.icon-showcase__card.is-copied {
  border-color: var(--vp-c-success-1, #52c41a);
  background: var(--vp-c-success-soft, rgba(82, 196, 26, 0.08));
}

.icon-showcase__icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border-radius: 8px;
  transition: color 0.18s ease;
}

.icon-showcase__card:hover .icon-showcase__icon-wrap {
  background: var(--vp-c-bg-alt);
}

.icon-showcase__name {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  background: transparent;
  padding: 0;
}

.icon-showcase__toast {
  position: absolute;
  top: 6px;
  right: 8px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 500;
  color: #fff;
  background: var(--vp-c-success-1, #52c41a);
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.dark .icon-showcase__card:hover {
  box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.35);
}
</style>
