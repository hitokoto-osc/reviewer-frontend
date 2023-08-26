<script lang="ts" setup>
const props = defineProps<{
  title: string
  pollCreatedAt: string
  pollId: number // 为了照顾 Vue 的转换规则，因此这里使用 Id 而不是 ID
}>()
</script>

<template>
  <div class="tooltip-wrapper">
    <a-tooltip placement="topLeft">
      <template #title>
        <div class="tooltip">
          <span>投票标识：{{ props.pollId }}</span>
          <span>发起于：{{ props.pollCreatedAt }}</span>
          <span class="title"> UUID：{{ props.title }} </span>
        </div>
      </template>
      <span class="title">{{ props.title }}</span>
    </a-tooltip>
  </div>
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
