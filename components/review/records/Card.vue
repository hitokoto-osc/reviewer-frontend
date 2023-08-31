<script lang="ts" setup>
import dayjs from 'dayjs'
import { UserRole } from '@/enums/user'
import { PollStatus } from '@/enums/poll'
import type { UserPollLogsRes } from '@/composables/api'

const userStore = useUserStore()

const props = defineProps<{
  userPollLog: UserPollLogsRes['collection'][0]
}>()

const sentence = computed(() => {
  return {
    uuid: props.userPollLog.sentence.uuid,
    hitokoto: props.userPollLog.sentence.hitokoto,
    type: props.userPollLog.sentence.type,
    fromWho: props.userPollLog.sentence.from_who,
    from: props.userPollLog.sentence.from,
    creator: props.userPollLog.sentence.creator,
    createdAt: props.userPollLog.sentence.created_at
  }
})

const emit = defineEmits<{
  showPollDetail: [pollID: number]
}>()
</script>

<template>
  <a-card class="review-record-card">
    <template #title> #{{ props.userPollLog.poll_id }} </template>
    <ReviewRecordsCardSentence :sentence="sentence" />
    <a-divider />

    <div class="polled-info-container">
      <p class="tips">
        操作时间：{{
          dayjs(userPollLog.created_at).format('YYYY-MM-DD HH:mm:ss')
        }}
      </p>
      <p class="poll-info">
        投票类型：<b>{{ convertPollMethod(userPollLog.type) }}</b>
        {{ userPollLog.point }} 票
      </p>
      <div
        v-show="userPollLog.user_marks && userPollLog.user_marks.length > 0"
        class="user-marks"
      >
        审核标记：<PollMarks :marks="userPollLog.user_marks" />
      </div>
      <p v-show="userPollLog.comment" class="comment">
        投票评论：{{ userPollLog.comment }}
      </p>
    </div>
    <div class="actions-container flex justify-end mt-5">
      <a-button
        v-show="
          userStore.user?.role === UserRole.Admin ||
          userPollLog.sentence.poll_status != PollStatus.Open
        "
        type="primary"
        @click="emit('showPollDetail', props.userPollLog.poll_id)"
      >
        投票详情
      </a-button>
    </div>
  </a-card>
</template>

<style lang="scss" scoped>
.polled-info-container {
  p {
    @apply mb-1 mt-0;
  }
}
</style>
