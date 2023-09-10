<script setup lang="ts">
import type { Item } from './'
const props = defineProps<{
  items: Item[]
}>()
</script>
<template>
  <div class="pc-menu-wrapper">
    <a-dropdown>
      <template #overlay>
        <a-menu :selectable="false">
          <a-menu-item
            v-for="(item, index) in props.items"
            :key="index"
            :icon="item.icon"
          >
            <a
              v-if="item.href || item.onClick"
              :href="item.href || undefined"
              @click="item.onClick"
            >
              {{ item.text }}
            </a>
            <NuxtLink v-else :to="item.to">
              {{ item.text }}
            </NuxtLink>
          </a-menu-item>
        </a-menu>
      </template>
      <slot />
    </a-dropdown>
  </div>
</template>
