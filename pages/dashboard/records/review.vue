<script setup lang="ts">
import { UserPollLogsReq, useUserPollLogs } from '~/composables/api'
useHead({
  title: '审核记录'
})

const showPollDetailModal = ref(false)
const showPollDetailModalPollId = ref(0)
const showPollDetail = (pollID: number) => {
  showPollDetailModal.value = true
  showPollDetailModalPollId.value = pollID
}

// 审核记录
const route = useRoute()
const pageSizeOptions = ref<string[]>(['10', '20', '30'])
const page = computed(() => {
  return Number(route.query.page) || 1
})
const pageSize = computed(() => {
  return Number(route.query.pageSize) || Number(pageSizeOptions.value[0])
})
const onPagniationChange = (page: number, pageSize: number) => {
  navigateTo({
    name: route.name || undefined,
    query: {
      page: page.toString(),
      pageSize: pageSize.toString()
    }
  })
}

// 请求数据
const userPollLogsParams = computed(() => {
  return {
    page: page.value,
    pageSize: pageSize.value,
    order: 'desc'
  } as UserPollLogsReq
})
const {
  data: userPollLogsData,
  pending: userPollLogsPending,
  error: userPollLogsError,
  refresh: refreshUserPollLogs
} = await useUserPollLogs(userPollLogsParams, {
  lazy: true
})
watch([page, pageSize], () => {
  refreshUserPollLogs()
})
</script>

<template>
  <div class="review-records">
    <a-page-header title="审核记录" />
    <ReviewRecordsPollDetailModal
      v-model:open="showPollDetailModal"
      :poll-id="showPollDetailModalPollId"
    />
    <div class="main">
      <div v-if="userPollLogsPending" class="status">
        <a-spin />
      </div>
      <div v-if="userPollLogsError" class="status">
        <p>加载失败</p>
      </div>
      <div
        v-if="!userPollLogsPending && !userPollLogsError"
        class="records-container"
      >
        <ClientOnly>
          <masonry
            class="records"
            :cols="{ default: 2, 640: 1 }"
            :gutter="'1rem'"
          >
            <template
              v-if="userPollLogsData && userPollLogsData.data.total > 0"
            >
              <div
                v-for="userPollLog in userPollLogsData.data.collection"
                :key="userPollLog.poll_id"
                class="py-2"
              >
                <ReviewRecordsCard
                  :user-poll-log="userPollLog"
                  @show-poll-detail="showPollDetail"
                />
              </div>
            </template>
            <div v-else class="status">
              <a-empty />
            </div>
          </masonry>
        </ClientOnly>
        <!-- 分页器 -->
        <div
          v-show="userPollLogsData && userPollLogsData.data.total > 0"
          class="pagination"
        >
          <a-pagination
            :current="page"
            :page-size="pageSize"
            show-quick-jumper
            show-size-changer
            :page-size-options="pageSizeOptions"
            :total="userPollLogsData?.data?.total || 0"
            @change="onPagniationChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.status {
  @apply w-full h-70 flex items-center justify-center;
}

.review-records {
  @apply w-full flex flex-col;

  .main {
    @apply w-full flex-1 flex flex-col;

    .records-container {
      @apply w-full flex-1 flex flex-col;

      .records {
        @apply w-full flex-1;
        // @apply grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4;
      }
    }
  }

  .ant-page-header {
    @apply mx-0 px-0;
  }

  .pagination {
    @apply mt-10 flex justify-center;
  }
}
</style>
