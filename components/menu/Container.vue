<script setup lang="ts">
import { Item } from './'
const props = defineProps<{
  items: Item[]
  menuPcClass?: unknown
  menuMobileClass?: unknown
}>()
</script>

<template>
  <div class="menu-container">
    <ClientOnly>
      <MenuPC :items="props.items">
        <div class="pc-menu" :class="props.menuPcClass">
          <slot />
        </div>
      </MenuPC>
    </ClientOnly>
    <MenuMobile :items="props.items">
      <div class="mobile-menu" :class="props.menuMobileClass">
        <slot />
      </div>
    </MenuMobile>
  </div>
</template>

<style lang="scss">
.pc-menu {
  @apply hidden md:flex;
}

.mobile-menu {
  @apply flex md:hidden;
}
</style>
