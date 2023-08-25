<script setup lang="ts">
import { PlusCircleOutlined } from '@ant-design/icons-vue'
import { PollStatus } from '@/enums/poll'
useHead({
  title: '句子审核'
})
// TODO: 临时修复 Masonry 路由切换后绘制错误的问题
const redrawVueMasonry = inject<(id: string) => void>('redrawVueMasonry')
onMounted(() => {
  if (!redrawVueMasonry) return
  setTimeout(() => {
    redrawVueMasonry('32')
  }, 600)
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
const { pending, data, error, refresh } = await usePollList({
  status_start: PollStatus.Open,
  status_end: PollStatus.Open,
  with_records: true,
  page: page.value,
  page_size: pageSize.value
})
console.log(error)
watch(
  () => route.query,
  () => refresh()
)

// 卡片部分
const cardData = computed(() => {
  if (!data.value) return []
  return data.value.data.collection.map((item) => {
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
</script>
<template>
  <div class="do-review">
    <a-page-header title="句子审核" />
    <div class="toolbar">
      <a-segmented v-model:value="segmentedValue" :options="segmentOptions" />
      <div class="flex-1" />
      <div class="button-group">
        <div class="pc">
          <a-button type="primary" shape="round">
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
          <template v-for="card in cardData" :key="card.poll.id">
            <div v-masonry-tile class="grid-item">
              <DoReviewCard
                :poll="card.poll"
                :sentence="card.sentence"
                :marks="card.marks"
                :polled-record="card.polledRecord"
              />
            </div>
          </template>
        </div>
        <div v-else-if="cardData.length === 0" class="h-full">
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
        show-less-items
        :page-size-options="pageSizeOptions"
        :total="data?.data?.total || 0"
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
    @apply flex-1 mt-8;
  }

  .pagination {
    @apply flex justify-center mt-5;
  }
}
</style>
