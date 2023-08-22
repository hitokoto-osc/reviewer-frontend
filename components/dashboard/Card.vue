<script setup lang="ts">
const props = defineProps<{
  icon: string
  color: string
  rotate?: string
}>()
const classes = computed(() => {
  return [props.rotate ? props.rotate : 'rotate-225', props.icon, props.color]
})
</script>
<template>
  <div class="card">
    <div class="icon" :class="classes" />
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.card {
  @apply h-30 relative flex items-center border-1 border-neutral-100 border-solid rounded-3 px-6 overflow-hidden mb-6;

  .icon {
    @apply absolute w-30 h-30 -right-8 -top-8;
  }
}
</style>
