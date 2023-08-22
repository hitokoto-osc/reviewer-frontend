<script setup lang="ts">
const props = defineProps<{
  marks: number[]
}>()
const marksStore = useMarksStore()
</script>

<template>
  <div class="marks-container">
    <span class="tips">此句被标记为：</span>
    <a-tag
      v-for="mark in props.marks"
      :key="mark"
      :color="marksStore.markColorMap[mark]?.color || 'yellow'"
    >
      {{ marksStore.markColorMap[mark]?.text || '未知' }}
    </a-tag>
  </div>
</template>

<style lang="scss" scoped>
.marks-container {
  @apply mt-3;

  .tips {
    @apply block mb-2;
  }

  .ant-tag {
    @apply mx-1 mb-2;
  }
}
</style>
