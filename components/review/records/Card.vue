<script lang="ts" setup>
import dayjs from 'dayjs'
import { filterXSS } from 'xss'
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
  showPollDetail: [pollID: number, userMarks: number[]]
}>()
</script>

<template>
  <a-card class="review-record-card">
    <ReviewRecordsCardStamp
      v-if="props.userPollLog.sentence.poll_status != PollStatus.Open"
      :poll-status="props.userPollLog.sentence.poll_status"
    />
    <template #title> #{{ props.userPollLog.poll_id }} </template>
    <SentenceContainer :sentence="sentence" />

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
      <div v-show="userPollLog.comment" class="comment-wrapper">
        <p class="comment-label">投票评论：</p>
        <!-- eslint-disable  vue/no-v-text-v-html-on-component vue/no-v-html-->
        <Fancybox
          class="comment"
          v-html="
            renderMarkdown(filterXSS(formatPollComment(userPollLog.comment)))
          "
        ></Fancybox>
      </div>
    </div>
    <div class="actions-container">
      <a-button
        v-show="
          userStore.user?.role === UserRole.Admin ||
          userPollLog.sentence.poll_status != PollStatus.Open
        "
        type="primary"
        @click="
          emit(
            'showPollDetail',
            props.userPollLog.poll_id,
            props.userPollLog.user_marks
          )
        "
      >
        投票详情
      </a-button>
    </div>
  </a-card>
</template>

<style lang="scss" scoped>
.review-record-card {
  @apply relative overflow-hidden;
}

.polled-info-container {
  p {
    @apply mb-1 mt-0;
  }
}

.actions-container {
  @apply flex mt-5 justify-end;
}
</style>

<style lang="scss">
.review-record-card {
  .comment-wrapper {
    @apply flex flex-row;

    .comment-label {
      @apply width-fit;
    }

    .comment {
      @apply underline-offset-2.5 text-sm  flex-1;

      p {
        @apply mt-0 my-1;
      }

      img {
        @apply rounded-md w-fit block mx-auto w-full h-auto my-2 cursor-pointer;
      }
    }
  }
}
</style>
