<script lang="ts" setup>
import xss from 'xss'
import dayjs from 'dayjs'
import type { PollMethod } from '@/enums/poll'
import type { HitokotoType } from '~/enums/hitokoto'
import type {
  Sentence,
  StructureComment
} from '@/components/SentenceModifyModal.vue'

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
  fromWho: string | null
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
  records: PollDetailRes['records']
  polledRecord?: CardPropsPolledRecord
  index: number // Item 在列表中的索引
}>()

const comments = computed(() => {
  return props.records.filter((item) => item.comment)
})

// Emits 定义
export interface SearchParams {
  sentence: string
  from: string
  fromWho: string | null
}

const emit = defineEmits<{
  doWebSearch: [event: PointerEvent | MouseEvent, sentence: SearchParams]
  doLocalSearch: [sentence: SearchParams]
  doMasonryRepaint: [] // 传递此事件只是为了让父组件重绘制
  viewComments: [index: number]
  doSwiftModify: [
    sentence: StructureComment,
    onModifyFinished: (sentence: StructureComment) => void
  ]
  opeartionDone: [event: 'submit' | 'cancel', index: number]
}>()

const onOperationDone = (event: 'submit' | 'cancel') => {
  // console.log(event)
  emit('opeartionDone', event, props.index)
}

const userStore = useUserStore()

const marksSelectedValues = ref<number[]>([])

provide('sentence', props.sentence) // 提供句子数据给子组件
// 快捷修改
const doSwiftModify = (
  fn: (sentence: StructureComment) => void,
  initialState: Partial<StructureComment>
) => {
  emit(
    'doSwiftModify',
    { ...(props.sentence as Sentence), ...{ review: '' }, ...initialState },
    fn
  )
}
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
        <li>
          作者：
          <template v-if="!!props.sentence.fromWho">
            {{ props.sentence.fromWho }}
          </template>
          <template v-else>
            <strike class="line-through decoration-1.5"> 未填写 </strike>
            <a-tooltip>
              <template #title
                ><b>未填写</b> 指
                <u class="underline underline-offset-2.5">未填写任何内容</u>，即
                <code>null</code></template
              >
              <sup>
                <div
                  class="i-solar-question-circle-bold inline-block ml-1 text-sm hover:cursor-help"
                />
              </sup>
            </a-tooltip>
          </template>
        </li>
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
    <div v-if="props.marks" class="marks-container">
      <span v-show="props.marks && props.marks.length" class="tips">
        此句被标记为：
      </span>
      <PollMarks
        v-if="props.marks"
        v-model:marks-selected-values="marksSelectedValues"
        :marks="props.marks"
        :checkable="!props.polledRecord"
      />
    </div>
    <div v-if="props.polledRecord" class="review-record">
      <span>
        您投了
        <u class="underline-offset-3">
          <b>{{ convertPollMethod(props.polledRecord.method) }}</b>
        </u>
        {{ props.polledRecord.point }}
        票。
      </span>
      <span v-if="userStore.user?.role == 'admin'">
        当前投票：赞同 {{ props.poll.approve }} 票，驳回
        {{ props.poll.reject }} 票，需要更改 {{ props.poll.needModify }} 票。
      </span>
    </div>
    <div v-if="comments.length > 0" class="comments">
      <a-divider class="!mb-3 !mt-0">评论</a-divider>
      <PollComments :records="comments" />
    </div>
    <DoReviewCardActionsContainer
      v-model:marks-selected-values="marksSelectedValues"
      :is-polled="!!props.polledRecord"
      :poll-id="props.poll.id"
      @do-web-search="
        emit('doWebSearch', $event, {
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
      @view-comments="emit('viewComments', props.index)"
      @do-swift-modify="doSwiftModify"
    />
  </a-card>
</template>

<style lang="scss" scoped>
.marks-container {
  @apply mt-3;

  .tips {
    @apply block mb-2;
  }
}

.hitokoto-sentence {
  @apply text-lg font-noto-serif font-600;
}

.hitokoto-info-container {
  @apply mt-3 bg-zinc-50 -mx-6 px-6 py-2;
  @apply dark:bg-dark-700;

  ul {
    @apply list-none ml-0 pl-0;

    li {
      @apply flex ml-0 pl-0 items-center;
    }
  }
}

.comments {
  @apply border-0 border-b border-solid border-#f0f0f0 my-0 pb-2 pt-1 dark:border-#303030;
}

.review-record {
  @apply mt-3;

  span {
    @apply block;
  }
}
</style>
