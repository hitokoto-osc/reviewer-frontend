<script setup lang="ts">
import type { AccountMenuItem } from './Container.vue'
const props = defineProps<{
  items: AccountMenuItem[]
}>()
</script>
<template>
  <div class="pc-menu-wrapper">
    <a-menu :selectable="false">
      <a-menu-item
        v-for="item in props.items"
        :key="item.text"
        :icon="item.icon"
      >
        <a
          v-if="item.href || item.onClick"
          :href="item.href || 'javascript:void(0)'"
          @click="item.onClick"
        >
          {{ item.text }}
        </a>
        <NuxtLink v-else :to="item.to">
          {{ item.text }}
        </NuxtLink>
      </a-menu-item>
    </a-menu>
  </div>
</template>
