<script setup lang="ts">
import { Empty } from 'ant-design-vue'

useHead({
  title: '通知消息'
})
</script>

<template>
  <div class="review-records">
    <a-page-header title="通知消息" :image="Empty.PRESENTED_IMAGE_SIMPLE" />
    <ClientOnly>
      <div class="w-full h-50 mt-10 flex justify-center items-center">
        <a-empty />
      </div>
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
.review-records {
  @apply w-full;
}
</style>
