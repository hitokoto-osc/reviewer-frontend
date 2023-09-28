<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'is-admin'],
  layout: 'admin'
})
</script>

<template>
  <div class="admin">
    <NuxtPage :page-key="(route) => route.fullPath" />
  </div>
</template>

<style lang="scss" scoped>
.admin {
  @apply w-full min-h-full flex flex-col flex-1;
}
</style>
