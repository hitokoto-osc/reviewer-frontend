<script lang="ts" setup>
definePageMeta({
  middleware: ['auth']
})
// 刷新 Mark 列表
const marksStore = useMarksStore()
const {
  error: fetchMarksError,
  data: marksData,
  execute
} = usePollMarks({
  lazy: true,
  immediate: false
})
watch(
  () => [fetchMarksError.value, marksData.value],
  (val) => {
    if (val[0] != null) {
      message.error('刷新 Mark 列表失败')
      return
    }
    if (val[1] == null) return
    marksStore.$setMarks(marksData.value?.data || [])
  }
)
if (marksStore.isExpried) {
  execute()
}
</script>

<template>
  <div class="dashboard">
    <NuxtPage />
  </div>
</template>
<style lang="scss" scoped>
.dashboard {
  @apply w-full min-h-full flex;
}
</style>
