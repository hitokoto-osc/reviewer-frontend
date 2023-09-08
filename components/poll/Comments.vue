<script setup lang="ts">
import dayjs from 'dayjs'
import type { PollDetailRes } from '@/composables/api'
import { getAvatarURLByHash } from '~/utils/avatar'
const props = defineProps<{
  records: PollDetailRes['records']
}>()
const records = computed(() => props.records.filter((v) => v.comment))
watch(records, (val) => console.log(val))
</script>
<template>
  <div class="poll-comments-container">
    <div v-if="records && records.length > 0" class="comments">
      <template v-for="(record, index) in records" :key="record.user.id">
        <div class="comment">
          <div class="avatar">
            <img
              :src="getAvatarURLByHash(record.user.email_hash)"
              :draggable="false"
            />
          </div>
          <div class=":uno: flex-1 flex flex-col justify-center">
            <div class=":uno: flex justify-between">
              <span class=":uno: text-xs">{{ record.user.name }}</span>
              <span class=":uno: text-xs">
                {{ dayjs(record.created_at).format('YYYY-MM-DD HH:mm:ss') }}
              </span>
            </div>
            <div class=":uno: text-sm">
              {{ record.comment }}
            </div>
          </div>
        </div>
        <a-divider v-if="index < records.length - 1" class=":uno: my-3" />
      </template>
    </div>
    <a-empty v-else />
  </div>
</template>

<style lang="scss" scoped>
.poll-comments-container {
  @apply my-8;

  .comments {
    .comment {
      @apply flex my-2 items-center;

      .avatar {
        @apply w-fit h-fit mr-3 flex;

        img {
          @apply rounded-full w-10 h-10 border-1 border-solid border-gray-200;
          @apply select-none;
        }
      }
    }
  }
}
</style>
