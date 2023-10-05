<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'is-admin'],
  layout: 'admin'
})
// const route = useRoute()
</script>

<template>
  <div class="admin">
    <NuxtPage :keepalive="{}" />
  </div>
</template>

<style lang="scss" scoped>
.admin {
  @apply w-full min-h-full flex flex-col flex-1;
}
</style>
