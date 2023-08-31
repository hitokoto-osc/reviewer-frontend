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
const page = computed(() => {
  return Number(route.query.page) || 1
})
const pageSize = computed(() => {
  return Number(route.query.pageSize) || 10
})
const userPollLogsParams = computed(() => {
  return {
    page: page.value,
    pageSize: pageSize.value,
    order: 'desc'
  } as UserPollLogsReq
})
const { data: userPollLogsData, refresh: refreshUserPollLogs } =
  await useUserPollLogs(userPollLogsParams, {
    lazy: true
  })
watch([page, pageSize], () => {
  refreshUserPollLogs()
})
</script>

<template>
  <div class="review-records w-full">
    <a-page-header title="审核记录" />
    <ReviewRecordsPollDetailModal
      v-model:open="showPollDetailModal"
      :poll-id="showPollDetailModalPollId"
    />
    <div class="mt-10 w-full">
      <div
        v-if="userPollLogsData && userPollLogsData.data.collection.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4"
      >
        <ReviewRecordsCard
          v-for="userPollLog in userPollLogsData.data.collection"
          :key="userPollLog.poll_id"
          :user-poll-log="userPollLog"
          @show-poll-detail="showPollDetail"
        />
      </div>
    </div>
  </div>
</template>
