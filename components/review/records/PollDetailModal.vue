<script lang="ts" setup>
import dayjs from 'dayjs'
import { PollStatus } from '~/enums/poll'
const props = defineProps<{
  open: boolean
  pollId: number
  userMarks?: number[]
}>()

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
      <div class="chart">
        <ReviewRecordsPollPointsPieChart
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
          <li v-for="record in data?.data.records" :key="record.user_id">
            {{ record.user_id }}：{{ convertPollMethod(record.method) }}
            {{ record.point }} 票
            {{ record.comment && `，评论到：“${record.comment}”` }}
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
