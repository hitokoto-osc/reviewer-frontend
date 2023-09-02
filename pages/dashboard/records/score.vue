<script setup lang="ts">
import dayjs from 'dayjs'
import { UserScoreRecordType } from '@/enums/user'
import type { ColumnsType } from 'ant-design-vue/es/table'
import type { UserScoreRecordsReq } from '@/composables/api'

useHead({
  title: '积分记录'
})
// 分页
const route = useRoute()
const page = computed(() => (route.query.page ? Number(route.query.page) : 1))
const pageSize = computed(() =>
  route.query.pageSize ? Number(route.query.pageSize) : 10
)
const pageSizeOptions = ref([5, 10, 20])

const params = reactive({
  page,
  pageSize,
  order: 'desc'
}) as UserScoreRecordsReq

const { data, pending, refresh } = await useUserScoreRecords(params, {
  lazy: true
})
// watch(error, (val) => {
//   if (val) {
//     console.error(val)
//     message.error('获取积分记录失败！')
//   }
// })
const records = computed(() => {
  return data.value && data.value.data.total > 0
    ? data.value.data.collection.map((v) => {
        console.log(v)
        return {
          ...v,
          reason: v.reason || '无',
          score:
            v.type === UserScoreRecordType.Increment ? `+${v.score}` : v.score,
          created_at: dayjs(v.created_at).format('YYYY-MM-DD HH:mm:ss')
        }
      })
    : []
})
watch(
  () => [page.value, pageSize.value],
  () => refresh()
)
const onPaginationChange = async (page: number, pageSize: number) => {
  // await scrollToTop()
  navigateTo({
    path: route.path,
    query: {
      page,
      pageSize
    }
  })
  await refresh()
}

const columns: ColumnsType = [
  {
    title: '投票标识',
    dataIndex: 'poll_id',
    key: 'poll_id',
    width: '10%',
    align: 'center'
  },
  {
    title: '积分',
    dataIndex: 'score',
    key: 'score',
    width: '10%',
    align: 'center'
  },
  {
    title: '理由',
    dataIndex: 'reason',
    key: 'reason',
    align: 'center'
  },
  {
    title: '触发时间',
    dataIndex: 'created_at',
    key: 'created_at',
    width: '20%',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'operation',
    fixed: 'right',
    width: '10%',
    align: 'center'
  }
]
// 投票详情模态框
const pollDetailModalParams = reactive({
  show: false,
  pollID: 0
})
const showPollDetail = (pollID: number) => {
  pollDetailModalParams.show = true
  pollDetailModalParams.pollID = pollID
}
</script>

<template>
  <div class="score-records">
    <PollDetailModal
      v-model:open="pollDetailModalParams.show"
      :poll-id="pollDetailModalParams.pollID"
      show-sentence
    />
    <a-page-header title="积分记录" />
    <a-table
      class="main"
      :columns="columns"
      :data-source="records"
      :loading="pending"
      :row-class-name="
        (_record, index) => (index % 2 === 1 ? 'table-striped' : undefined)
      "
      :pagination="{
        current: page,
        pageSize,
        total: data?.data.total || 0,
        pageSizeOptions,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: onPaginationChange,
        position: ['bottomCenter']
      }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button type="link" @click="showPollDetail(record['poll_id'] || 0)">
            投票详情
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style lang="scss" scoped>
/* stylelint-disable selector-pseudo-class-no-unknown */
[data-doc-theme='light'] .ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}

[data-doc-theme='dark'] .ant-table-striped :deep(.table-striped) td {
  background-color: rgb(29 29 29 / 100%);
}

.score-records {
  @apply w-full flex flex-col;

  .main {
    @apply w-full flex-1 flex flex-col;
  }

  .ant-page-header {
    @apply mx-0 px-0;
  }

  .pagination {
    @apply mt-10 flex justify-center;
  }
}
</style>
