<script lang="ts" setup>
import { filterXSS } from 'xss'
import dayjs from 'dayjs'
import { PollStatus } from '~/enums/poll'
import { CardPropsSentence } from './do/review/Card.vue'
const props = withDefaults(
  defineProps<{
    open: boolean
    pollId: number
    userMarks?: number[]
    showSentence?: boolean
  }>(),
  { userMarks: () => [], showSentence: false }
)

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

// fetch PollDetail
const pollID = computed(() => props.pollId)
const { data, pending, error, refresh } = usePollDetail(
  pollID,
  {},
  {
    immediate: false
  }
)

watch(
  () => props.open,
  (val) => {
    val && refresh()
  }
)

// sentence
const sentence = computed(() => {
  return {
    uuid: data.value?.data.sentence.uuid,
    hitokoto: data.value?.data.sentence.hitokoto,
    type: data.value?.data.sentence.type,
    fromWho: data.value?.data.sentence.from_who,
    from: data.value?.data.sentence.from,
    creator: data.value?.data.sentence.creator,
    createdAt: data.value?.data.sentence.created_at
  } as CardPropsSentence
})
</script>

<template>
  <a-modal
    :open="props.open"
    :title="`投票详情 #${pollID}`"
    @update:open="emit('update:open', $event)"
    @ok="emit('update:open', false)"
  >
    <div v-if="pending" class="loading">
      <a-spin />
    </div>
    <template v-if="error">
      <p>加载失败</p>
    </template>
    <template v-if="!pending && !error">
      <template v-if="props.showSentence">
        <SentenceContainer :sentence="sentence" />
        <a-divider />
      </template>
      <div class="chart">
        <PollDetailPieChart
          :approve="data?.data.approve || 0"
          :reject="data?.data.reject || 0"
          :need-modify="data?.data.need_edited || 0"
        />
      </div>
      <div class="poll-info-container">
        <p>
          状态：{{ convertPollStatus(data?.data.status as PollStatus) || -1 }}
        </p>
        <p>
          创建于：{{
            dayjs(data?.data.created_at).format('YYYY-MM-DD HH:mm:ss')
          }}
        </p>
        <p>
          更新于：{{
            dayjs(data?.data.updated_at).format('YYYY-MM-DD HH:mm:ss')
          }}
        </p>
      </div>
      <div
        v-show="data?.data.marks && data?.data.marks.length > 0"
        class="marks"
      >
        <span>审核标记：</span>
        <PollMarks
          :marks="data?.data.marks || []"
          :marks-selected-values="props.userMarks || []"
        />
      </div>
      <div
        v-if="data?.data.records && data?.data.records.length > 0"
        class="records"
      >
        <p class="title">审核记录</p>
        <ul>
          <li v-for="record in data?.data.records" :key="record.user.id">
            {{ `${record.user.name}（${record.user.id}）` }}：{{
              convertPollMethod(record.method)
            }}
            {{ record.point }} 票
            <!--eslint-disable vue/no-v-html-->
            <span
              v-if="record.comment"
              class=":uno: underline-offset-2"
              v-html="
                filterXSS(`，评论到：“${formartPollComment(record.comment)}”`)
              "
            />
          </li>
        </ul>
      </div>
    </template>
  </a-modal>
</template>

<style lang="scss" scoped>
.loading {
  @apply w-full flex h-70 items-center justify-center;
}

.chart {
  @apply w-full h-70 mt-5;
}

.poll-info-container {
  @apply mt-5;

  p {
    @apply mb-0.25 mt-0;
  }
}

.records {
  .title {
    @apply font-bold text-base;
  }
}
</style>
