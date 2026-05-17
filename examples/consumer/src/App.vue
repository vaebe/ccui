<script setup lang="ts">
// Path 1 — root import + tree-shake
import { Button as MainButton, Modal as MainModal } from '@vaebe/ccui'
import '@vaebe/ccui/style.css'

// Path 2 — subpath import
import { Button as SubpathButton } from '@vaebe/ccui/button'
import '@vaebe/ccui/button/style.css'

import { ref } from 'vue'

const open = ref(false)

// Path 3 (`<c-button>` in template below) is wired up by the
// `Vue3CCUIResolver({ importStyle: 'css' })` in `vite.config.ts` — no explicit
// component or style import is needed for it.
</script>

<template>
  <main style="padding: 24px; display: flex; flex-direction: column; gap: 24px">
    <section>
      <h2>Path 1 — main + tree-shake</h2>
      <MainButton type="primary" @click="open = true">open modal</MainButton>
      <MainModal v-model:open="open" title="hi from main bundle">
        <p>Tree-shaken from `@vaebe/ccui`.</p>
      </MainModal>
    </section>

    <section>
      <h2>Path 2 — subpath</h2>
      <SubpathButton type="dashed">subpath button</SubpathButton>
    </section>

    <section>
      <h2>Path 3 — resolver auto-import</h2>
      <!-- `<c-button>` is resolved + styled by Vue3CCUIResolver. -->
      <c-button type="primary">resolver button</c-button>
    </section>
  </main>
</template>
