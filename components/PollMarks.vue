<script setup lang="ts">
const props = defineProps<{
  marks: number[]
}>()

const emit = defineEmits<{
  onMarkClick: [markID: number]
}>()

const marksStore = useMarksStore()
</script>

<template>
  <a-tag
    v-for="mark in props.marks"
    :key="mark"
    :color="marksStore.markColorMap[mark]?.color || 'yellow'"
    @click="emit('onMarkClick', mark)"
  >
    {{ marksStore.markColorMap[mark]?.text || '未知' }}
  </a-tag>
</template>

<style lang="scss" scoped>
.ant-tag {
  @apply mx-1 mb-2;
}
</style>
