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
