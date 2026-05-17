<template>
  <c-modal :visible="open" :ok-loading="loading" hide-footer>
    <p>hello</p>
  </c-modal>
  <CModal :visible="open2" :okLoading="loading2" :hideFooter="true">
    <p>second</p>
  </CModal>
</template>
