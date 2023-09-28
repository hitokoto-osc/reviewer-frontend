<script setup lang="ts">
import { type AdminContext } from './Provider.vue'

const ctx = inject<AdminContext>('adminCtx')
if (!ctx) throw new Error('adminCtx is not provided')
const navigateToByKey =
  inject<(key: string) => Promise<void>>('navigateToByKey')!

const menuItems = useAdminMenuItems()
const active = computed({
  get: () => ctx.active,
  set: (val) => {
    navigateToByKey(val!)
  }
})
</script>

<template>
  <div class="banner">
    <NuxtImg
      src="/img/logo.svg"
      alt="logo"
      draggable="false"
      class="w-11 h-11"
    />
    <span class="text-lg font-bold ml-2">一言审核后台</span>
  </div>
  <div class="menu">
    <LayoutMenu v-model:active="active" :items="menuItems" />
  </div>
</template>

<style lang="scss" scoped>
.banner {
  @apply w-full h-16 flex items-center justify-center;
}

.menu {
  @apply mt-0.5 px-0.5;
}
</style>
