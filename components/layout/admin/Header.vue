<script setup lang="ts">
import type { Item } from '~/components/menu'

const items: Item[] = reactive([
  {
    text: '返回前台',
    onClick: () => {
      navigateTo('/dashboard')
    }
  }
])
</script>

<template>
  <header>
    <div class="flex-1"></div>
    <div class=":uno: h-full flex items-center">
      <MenuContainer :items="items">
        <LayoutHeaderAccountInfo />
      </MenuContainer>
    </div>
  </header>
</template>

<style lang="scss" scoped>
header {
  @apply h-16 w-full bg-white dark:bg-dark-700 border-0 border-b-1 border-solid border-#f0f0f0 flex;
}
</style>
