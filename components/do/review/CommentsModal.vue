<script setup lang="ts">
import type { PollDetailRes } from '@/composables/api'
const props = defineProps<{
  records: PollDetailRes['records']
  open: boolean
}>()
const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <a-modal
    title="查看评论"
    :open="props.open"
    wrap-class-name="poll-comments-modal"
    ok-text="好了"
    @ok="() => emit('update:open', false)"
  >
    <PollComments :records="props.records" />
  </a-modal>
</template>
