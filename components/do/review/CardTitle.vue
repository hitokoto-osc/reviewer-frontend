<script lang="ts" setup>
const props = defineProps<{
  title: string
  pollCreatedAt: string
}>()
</script>

<template>
  <a-tooltip placement="topLeft">
    <template #title>
      <div class="tooltip">
        <span>发起于：{{ props.pollCreatedAt }}</span>
        <span class="title"> UUID：{{ props.title }} </span>
      </div>
    </template>
    <span class="title">{{ props.title }}</span>
  </a-tooltip>
</template>

<style lang="scss" scoped>
.tooltip {
  span {
    @apply block;
  }
}

.title {
  @apply text-sm font-mono;
}
</style>
