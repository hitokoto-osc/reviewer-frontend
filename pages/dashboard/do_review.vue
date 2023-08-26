<script setup lang="ts">
import { PlusCircleOutlined } from '@ant-design/icons-vue'
import { PollStatus } from '@/enums/poll'
import type { SearchParams } from '@/components/do/review/Card.vue'
useHead({
  title: '句子审核'
})
// TODO: 临时修复 Masonry 路由切换后绘制错误的问题
const redrawVueMasonry = inject<(id: string) => void>('redrawVueMasonry')
const redrawMasonary = () => redrawVueMasonry && redrawVueMasonry('32')
onMounted(() => {
  if (!redrawVueMasonry) return
  setTimeout(redrawMasonary, 600)
})

const route = useRoute()

// 分页部分
const pageSizeOptions = ref<string[]>(['10', '20', '30'])
const page = computed(() => {
  const page = Number(route.query.page)
  return isNaN(page) ? 1 : page
})
const pageSize = computed(() => {
  const pageSize = Number(route.query.pageSize)
  return isNaN(pageSize) || !pageSizeOptions.value.includes(pageSize.toString())
    ? 10
    : pageSize
})

const onChange = async (newPage: number, newPageSize: number) => {
  navigateTo(
    {
      name: route.name || undefined,
      query: {
        page: (newPage || 1).toString(),
        pageSize: newPageSize.toString()
      }
    },
    {
      replace: true
    }
  )
}
// 分段器部分
const segmentOptions = reactive<string[]>(['全部', '待审核', '已审核'])
const segmentedValue = ref(segmentOptions[0])

// 获取投票列表
const {
  pending,
  data: pollListData,
  error,
  refresh
} = usePollList(
  {
    status_start: PollStatus.Open,
    status_end: PollStatus.Open,
    with_records: true,
    page: page.value,
    page_size: pageSize.value
  },
  { lazy: true }
)
watch(
  () => route.query,
  () => refresh()
)

// 卡片部分
const cardData = computed(() => {
  if (!pollListData.value) return []
  return pollListData.value.data.collection.map((item) => {
    return {
      poll: {
        id: item.id,
        approve: item.approve,
        reject: item.reject,
        needModify: item.need_edited,
        createdAt: item.created_at
      },
      sentence: {
        uuid: item.sentence.uuid,
        hitokoto: item.sentence.hitokoto,
        type: item.sentence.type,
        fromWho: item.sentence.from_who,
        from: item.sentence.from,
        creator: item.sentence.creator,
        createdAt: item.sentence.created_at
      },
      marks: item.marks,
      polledRecord: item.polled_data
        ? {
            point: item.polled_data.point,
            method: item.polled_data.method
          }
        : undefined
    }
  })
})

// 获取新投票
const getNewPollLoading = ref(false)
const getNewPoll = async () => {
  getNewPollLoading.value = true
  try {
    const { data, error } = await doCreatePoll()
    if (error.value != null) throw error.value // 正常错误应该被拦截器处理了，此处不处理
    message.info(
      '发起新投票成功！当前待审队列还有 ' +
        data.value?.data.remain_pending +
        ' 条句子。'
    )
    // 如果当前页面是最后一页且不足 pageSize 条，刷新页面
    if (
      !pollListData.value?.data?.total ||
      (page.value * pageSize.value < pollListData.value?.data?.total &&
        cardData.value.length < pageSize.value)
    ) {
      refresh()
    }
  } catch (e) {
    console.error(e)
  } finally {
    getNewPollLoading.value = false
  }
}

// WEB 搜索
const open = ref(false)
const searchParams = ref<SearchParams>({
  sentence: '',
  from: '',
  fromWho: ''
})
const doWebSearch = (sentence: SearchParams) => {
  searchParams.value = sentence
  open.value = true
}

// 当完成投票/撤销操作后，刷新卡片内容
const refreshPollItem = async (index: number, pollID: number) => {
  const { data, error } = await usePollDetail(pollID, {
    with_polled_data: true
  })
  if (error.value != null) {
    message.error(`刷新投票 ${pollID} 失败`)
    return
  }
  if (pollListData.value && data.value)
    pollListData.value.data.collection[index] = data.value.data
  else
    message.error(`刷新投票 ${pollID} 失败，投票数据为空。请刷新页面后重试。`)

  nextTick(redrawMasonary)
}
const onOperationDone = (event: 'submit' | 'cancel', index: number) => {
  // console.log(event, index)
  refreshPollItem(index, cardData.value[index].poll.id)
}

// 刷新 Mark 列表
onMounted(() => {
  useMarksStore().refresh()
})
</script>
<template>
  <div class="do-review">
    <DoReviewWebSearchModal v-model:open="open" :search-params="searchParams" />
    <a-page-header title="句子审核" />
    <div class="toolbar">
      <a-segmented v-model:value="segmentedValue" :options="segmentOptions" />
      <div class="flex-1" />
      <div class="button-group">
        <div class="pc">
          <a-button
            type="primary"
            shape="round"
            :loading="getNewPollLoading"
            :disabled="getNewPollLoading"
            @click="getNewPoll"
          >
            <template #icon>
              <PlusCircleOutlined />
            </template>
            发起新投票
          </a-button>
        </div>
        <div class="mobile">
          <a-button type="primary">
            <template #icon>
              <PlusCircleOutlined />
            </template>
          </a-button>
        </div>
      </div>
    </div>

    <div class="content">
      <!-- TODO: 抽象成组件 -->
      <ClientOnly>
        <div
          v-if="!pending && !error && cardData.length"
          v-masonry="32"
          class="grid"
          transition-duration="0.3s"
          item-selector=".grid-item"
        >
          <template v-for="(card, cardIndex) in cardData" :key="card.poll.id">
            <div v-masonry-tile class="grid-item">
              <DoReviewCard
                :poll="card.poll"
                :sentence="card.sentence"
                :marks="card.marks"
                :polled-record="card.polledRecord"
                :index="cardIndex"
                @do-masonry-repaint="nextTick(redrawMasonary)"
                @do-web-search="doWebSearch"
                @opeartion-done="onOperationDone"
              />
            </div>
          </template>
        </div>
        <div v-else-if="cardData.length === 0" class="flex-1">
          <a-empty class="mt-10" />
        </div>
        <a-result
          v-else-if="error"
          status="500"
          title="500"
          sub-title="服务器错误，请稍后重试。"
        ></a-result>
      </ClientOnly>
    </div>
    <!-- 分页器 -->
    <div v-show="cardData.length !== 0" class="pagination">
      <a-pagination
        :current="page"
        :page-size="pageSize"
        show-quick-jumper
        show-size-changer
        :page-size-options="pageSizeOptions"
        :total="pollListData?.data?.total || 0"
        @change="onChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grid-item {
  @apply w-full md:w-1/2 px-2 py-2;
}

.do-review {
  @apply h-full w-full flex flex-col;

  .ant-page-header {
    @apply mx-0 px-0;
  }

  .toolbar {
    @apply flex;

    .button-group {
      .pc {
        @apply display-none md:block;
      }

      .mobile {
        @apply display-block md:display-none;
      }
    }
  }

  .content {
    @apply flex-1 mt-8 flex flex-col;
  }

  .pagination {
    @apply flex justify-center mt-5;
  }
}
</style>
