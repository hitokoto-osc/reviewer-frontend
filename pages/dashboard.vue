<script lang="ts" setup>
definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <div class="dashboard">
    <NuxtPage />
  </div>
</template>
<style lang="scss" scoped>
.dashboard {
  @apply w-full h-full;
}
</style>
