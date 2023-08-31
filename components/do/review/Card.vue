<script lang="ts" setup>
import xss from 'xss'
import dayjs from 'dayjs'
import type { PollMethod } from '@/enums/poll'
import type { HitokotoType } from '~/enums/hitokoto'

// Props 定义
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
  type: HitokotoType
  fromWho?: string
  from: string
  creator: string
  createdAt: string
}

export type CardPropsPolledRecord = {
  point: number
  method: PollMethod
}

const props = defineProps<{
  poll: CardPropsPoll
  sentence: CardPropsSentence
  marks?: number[]
  polledRecord?: CardPropsPolledRecord
  index: number // Item 在列表中的索引
}>()

// Emits 定义
export interface SearchParams {
  sentence: string
  from: string
  fromWho?: string
}

const emit = defineEmits<{
  doWebSearch: [sentence: SearchParams]
  doLocalSearch: [sentence: SearchParams]
  doMasonryRepaint: [] // 传递此事件只是为了让父组件重绘制
  opeartionDone: [event: 'submit' | 'cancel', index: number]
}>()

const onOperationDone = (event: 'submit' | 'cancel') => {
  // console.log(event)
  emit('opeartionDone', event, props.index)
}

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
        :poll-id="props.poll.id"
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
        您投了 <b>{{ convertPollMethod(props.polledRecord.method) }}</b>
        <i>{{ props.polledRecord.point }}</i> 票。
      </span>
      <span v-if="userStore.user?.role == 'admin'">
        当前投票：批准 {{ props.poll.approve }} 票，驳回
        {{ props.poll.reject }} 票，需要更改 {{ props.poll.needModify }} 票。
      </span>
    </div>
    <DoReviewCardActionsContainer
      :is-polled="!!props.polledRecord"
      :poll-id="props.poll.id"
      @do-web-search="
        emit('doWebSearch', {
          sentence: props.sentence.hitokoto,
          from: props.sentence.from,
          fromWho: props.sentence.fromWho
        })
      "
      @do-local-search="
        emit('doLocalSearch', {
          sentence: props.sentence.hitokoto,
          from: props.sentence.from,
          fromWho: props.sentence.fromWho
        })
      "
      @do-masonry-repaint="emit('doMasonryRepaint')"
      @operation-done="onOperationDone"
    />
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
