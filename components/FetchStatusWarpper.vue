<script lang="ts" setup>
const slots = useSlots()
const props = withDefaults(
  defineProps<{
    pending: boolean
    error: unknown | null
    notEmpty?: boolean
  }>(),
  {}
)
</script>

<template>
  <div class="status-wrapper">
    <div v-if="props.pending" class="status">
      <a-spin />
    </div>
    <div v-else-if="props.error" class="status">
      <a-result status="500" title="500" sub-title="请求错误"> </a-result>
    </div>
    <template v-else>
      <div v-if="!!slots['empty'] && !props.notEmpty" class="status">
        <slot name="empty" />
      </div>
      <slot v-else />
    </template>
  </div>
</template>
<style lang="scss" scoped>
.status-wrapper {
  @apply flex-1 w-full;
}

.status {
  @apply w-full h-70 flex items-center justify-center;
}
</style>
