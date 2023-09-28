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
    <div class="flex-1 items-center flex">
      <div class="weather-wrapper w-30 ml-5">
        <LayoutAdminHeaderWeather />
      </div>
    </div>
    <div class=":uno: h-full flex items-center z-1">
      <MenuContainer :items="items">
        <LayoutHeaderAccountInfo class="cursor-pointer z-1" />
      </MenuContainer>
    </div>
  </header>
</template>

<style lang="scss" scoped>
header {
  @apply fixed top-0 h-16 md:w-5/6 lg:w-6/7 bg-white dark:bg-dark-700 border-0 border-b-1 border-solid border-#f0f0f0 flex z-2;
}
</style>
