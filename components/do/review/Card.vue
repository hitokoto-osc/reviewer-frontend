<script lang="ts" setup>
import xss from 'xss'
import dayjs from 'dayjs'

export type CardPropsPoll = {
  id: number
  approve: number
  reject: number
  needModify: number
  createdAt: string
}

export type CardPropsSentence = {
  uuid: string
  hitokoto: string
  type: string
  fromWho?: string
  from: string
  creator: string
  createdAt: string
}

export type CardPropsPolledRecord = {
  point: number
  type: number
}

const props = defineProps<{
  poll: CardPropsPoll
  sentence: CardPropsSentence
  marks?: number[]
  polledRecord?: CardPropsPolledRecord
}>()

const userStore = useUserStore()
</script>

<template>
  <a-card class="review-info-card" bordered>
    <template #title>
      <DoReviewCardTitle
        :title="props.sentence.uuid"
        :poll-created-at="
          dayjs(props.poll.createdAt).format('YYYY-MM-DD HH:mm:ss')
        "
      />
    </template>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="hitokoto-sentence" v-html="xss(props.sentence.hitokoto)"></div>
    <div class="hitokoto-info-container">
      <ul>
        <li>分类：{{ convertHitokotoType(props.sentence.type) }}</li>
        <li>来源：{{ props.sentence.from || '未知来源' }}</li>
        <li>作者：{{ props.sentence.fromWho || '未填写' }}</li>
        <li>提交者：{{ props.sentence.creator }}</li>
        <li>
          创建于：{{
            dayjs(Number.parseInt(props.sentence.createdAt) * 1000).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          }}
        </li>
      </ul>
    </div>
    <DoReviewCardMarksContainer v-if="props.marks" :marks="props.marks" />
    <div v-if="props.polledRecord" class="review-record">
      <span>
        您投了 <b>{{ convertPollMethod(props.polledRecord.type) }}</b>
        <i>{{ props.polledRecord.point }}</i> 票。
      </span>
      <span v-if="userStore.user?.role == 'admin'">
        当前投票：批准 {{ props.poll.approve }} 票，驳回
        {{ props.poll.reject }} 票，需要更改 {{ props.poll.needModify }} 票。
      </span>
    </div>
    <DoReviewCardActionsContainer :is-polled="!!props.polledRecord" />
  </a-card>
</template>

<style lang="scss" scoped>
.hitokoto-sentence {
  @apply text-lg font-noto-serif font-600;
}

.hitokoto-info-container {
  @apply mt-3 bg-zinc-50 -mx-6 px-6 py-2;

  ul {
    @apply list-none ml-0 pl-0;

    li {
      @apply block ml-0 pl-0;
    }
  }
}

.review-record {
  @apply mt-3;

  span {
    @apply block;
  }
}
</style>
