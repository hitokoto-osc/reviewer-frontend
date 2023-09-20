<script setup lang="ts">
import { PlusCircleOutlined } from '@ant-design/icons-vue'
import { PollStatus, PolledFilter } from '@/enums/poll'
import type { SearchParams } from '@/components/do/review/Card.vue'
import type { SegmentedOption } from 'ant-design-vue/es/segmented/src/segmented' // TODO: Antdv 的类型定义有问题，这里需要手动指定路径
import type {
  Sentence,
  StructureComment
} from '@/components/SentenceModifyModal.vue'
import { doWebSearch as utilDoWebSearch } from '~/utils/search'
useHead({
  title: '句子审核'
})
// TODO: 临时修复 Masonry 路由切换后绘制错误的问题
// const redrawVueMasonry = inject<(id: string) => void>('redrawVueMasonry')
// const redrawMasonary = () => redrawVueMasonry && redrawVueMasonry('32')
// onMounted(() => {
//   if (!redrawVueMasonry) return
//   setTimeout(redrawMasonary, 600)
// })

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

const onPagniationChange = async (newPage: number, newPageSize: number) => {
  await scrollToTop()
  navigateTo({
    name: route.name || undefined,
    query: {
      page: (newPage || 1).toString(),
      pageSize: newPageSize.toString(),
      polledFilter:
        segmentedValue.value.toString() || PolledFilter.All.toString()
    }
  })
}
// 分段器部分
const segmentOptions = reactive<SegmentedOption[]>([
  {
    title: '全部',
    value: PolledFilter.All
  },
  {
    title: '待审核',
    value: PolledFilter.Unreviewed
  },
  {
    title: '已审核',
    value: PolledFilter.Reviewed
  }
])
const segmentedValue: Ref<PolledFilter> = computed(() => {
  const value = Number(route.query.polledFilter)
  return isNaN(value) ? PolledFilter.All : value
})
const onSegmentChange = (value: number | string) => {
  navigateTo({
    name: route.name || undefined,
    query: {
      page: 1, // 切换分段器时，重置页码
      pageSize: pageSize.value.toString(),
      polledFilter: value.toString()
    }
  })
}

// 获取投票列表
const pollListParams = computed(() => {
  return {
    status_start: PollStatus.Open,
    status_end: PollStatus.Open,
    with_records: true,
    page: page.value,
    page_size: pageSize.value,
    polled_filter: segmentedValue.value
  }
})
const {
  pending,
  data: pollListData,
  error,
  refresh
} = await usePollList(pollListParams, { lazy: true })
watch(
  () => [page.value, pageSize.value, segmentedValue.value],
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
      records: item.records || [],
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
      (page.value * pageSize.value > pollListData.value?.data?.total &&
        cardData.value.length < pageSize.value)
    ) {
      refresh()
    } else {
      // 否则只是更新 total
      if (!pollListData.value) return
      const { data: pollList, error: e } = usePollList({
        status_start: PollStatus.Open,
        status_end: PollStatus.Open,
        with_records: true,
        page: 1,
        page_size: 1,
        polled_filter: segmentedValue.value
      })
      if (e.value != null) throw e.value
      pollListData.value.data.total = pollList.value?.data?.total || 0
    }
  } catch (e) {
    console.error(e)
  } finally {
    getNewPollLoading.value = false
  }
}

// WEB 搜索
const webSearchModal = ref(false)
const searchParams = ref<SearchParams>({
  sentence: '',
  from: '',
  fromWho: ''
})
const doWebSearch = (
  event: PointerEvent | MouseEvent,
  sentence: SearchParams
) => {
  if (event.type === 'click') {
    try {
      const searchType = Number.parseInt(
        localStorage.getItem('webSearchPerference') || ''
      )
      if (!isNaN(searchType)) {
        setTimeout(() => {
          utilDoWebSearch(searchType, sentence.sentence)
        }, 20)
        return
      }
    } catch (e) {}
  }
  searchParams.value = sentence
  webSearchModal.value = true
}

// 本地搜索
const localSearchModal = ref(false)
const doLocalSearch = (sentence: SearchParams) => {
  searchParams.value = sentence
  localSearchModal.value = true
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

  // nextTick(redrawMasonary)
}
const onOperationDone = (event: 'submit' | 'cancel', index: number) => {
  // console.log(event, index)
  refreshPollItem(index, cardData.value[index].poll.id)
}

// 查看评论
// const viewCommentsModal = reactive({
//   open: false,
//   index: 0
// })

// 快捷修改
const swiftModifyModal = reactive({
  open: false,
  initialState: {} as StructureComment,
  onModifyCallback: undefined as
    | ((sentence: StructureComment) => void)
    | undefined
})

const doSwiftModify = (
  state: StructureComment,
  fn: (state: Sentence) => void
) => {
  swiftModifyModal.initialState = { ...state }
  swiftModifyModal.onModifyCallback = fn
  swiftModifyModal.open = true
}

const onModifySentenceFinished = (state: StructureComment) => {
  swiftModifyModal.open = false
  swiftModifyModal.onModifyCallback && swiftModifyModal.onModifyCallback(state)
}
</script>
<template>
  <div class="do-review">
    <DoReviewLocalSearchModal
      v-model:open="localSearchModal"
      :search-params="searchParams"
    />
    <DoReviewWebSearchModal
      v-model:open="webSearchModal"
      :search-params="searchParams"
    />
    <!-- <DoReviewCommentsModal
      v-model:open="viewCommentsModal.open"
      :records="
        pollListData?.data.collection?.[viewCommentsModal.index]?.records || []
      "
    /> -->
    <SentenceModifyModal
      v-model:open="swiftModifyModal.open"
      :initial-state="swiftModifyModal.initialState"
      @finish="onModifySentenceFinished"
    />
    <a-page-header title="句子审核" />
    <div class="toolbar">
      <a-segmented
        v-model:value="segmentedValue"
        :options="segmentOptions"
        @change="onSegmentChange"
      >
        <template #label="props">
          <span>{{ props.title }}</span>
        </template>
      </a-segmented>
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
          <a-button
            type="primary"
            :loading="getNewPollLoading"
            :disabled="getNewPollLoading"
            @click="getNewPoll"
          >
            <template #icon>
              <PlusCircleOutlined />
            </template>
          </a-button>
        </div>
      </div>
    </div>

    <div class="content">
      <!-- TODO: 抽象成组件 -->
      <FetchStatusWarpper
        :pending="pending"
        :error="error"
        :not-empty="cardData.length > 0"
      >
        <ClientOnly>
          <masonry :cols="{ default: 2, 640: 1 }" :gutter="'1rem'">
            <div
              v-for="(card, cardIndex) in cardData"
              :key="card.poll.id"
              class="grid-item"
            >
              <DoReviewCard
                :poll="card.poll"
                :sentence="card.sentence"
                :marks="card.marks"
                :polled-record="card.polledRecord"
                :index="cardIndex"
                :records="card.records"
                @do-web-search="doWebSearch"
                @do-local-search="doLocalSearch"
                @do-swift-modify="doSwiftModify"
                @opeartion-done="onOperationDone"
              />
            </div>
          </masonry>
        </ClientOnly>
        <template #empty>
          <a-empty />
        </template>
      </FetchStatusWarpper>
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
        @change="onPagniationChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grid-item {
  @apply py-2;
}

.do-review {
  @apply w-full flex flex-col;

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
