<script lang="ts" setup>
const emits = defineEmits<{
  switchDrawer: []
}>()
</script>

<template>
  <div class="mobile-hamburger-button" @click="emits('switchDrawer')">
    <div class="i-solar-hamburger-menu-outline"></div>
  </div>
</template>
<style lang="scss" scoped>
.mobile-hamburger-button {
  @apply block md:hidden ml-3 p-2;
  @apply absolute left-0 top-1/2 transform -translate-y-1/2;
  @apply cursor-pointer;
  @apply text-gray-500;

  div {
    @apply h-7 w-7;
  }
}
</style>
