<script setup lang="ts">
import { PlusCircleOutlined } from '@ant-design/icons-vue'
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
watch(
  () => route.query,
  (val) => console.log(val, route)
)

// 分页部分
const page = ref<number>(
  route.query.page && typeof route.query.page === 'string'
    ? Number.parseInt(route.query.page) ?? 1
    : 1
)

const pageSizeOptions = ref<string[]>(['10', '20', '30'])
const pageSize = ref<number>(
  route.query.pageSize &&
    typeof route.query.pageSize === 'string' &&
    pageSizeOptions.value.includes(route.query.pageSize)
    ? Number.parseInt(route.query.pageSize) ?? 10
    : 10
)

const onChange = async (newPage: number, newPageSize: number) => {
  page.value = newPage
  pageSize.value = newPageSize
  navigateTo(
    {
      name: route.name || undefined,
      query: {
        page: newPage.toString(),
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

// 卡片部分
const cardData = reactive([
  {
    poll: {
      id: 123,
      approve: 30,
      reject: 123,
      needModify: 123,
      createdAt: new Date().toISOString()
    },
    sentence: {
      uuid: '80d3bb1f-3c35-4261-8ae6-56a5bfcdb940',
      hitokoto:
        '听风雪喧嚷，看流星在飞翔； 我的心向我呼唤：去动荡的远方……听风雪喧嚷，看流星在飞翔； 我的心向我呼唤：去动荡的远方……听风雪喧嚷，看流星在飞翔； 我的心向我呼唤：去动荡的远方……听风雪喧嚷，看流星在飞翔； 我的心向我呼唤：去动荡的远方……听风雪喧嚷，看流星在飞翔； 我的心向我呼唤：去动荡的远方……',
      type: 'i',
      fromWho: '亚历山德拉·尼·巴赫慕托娃',
      from: '歌唱动荡的青春',
      creator: 'SomeyaMako',
      createdAt: '1606403131'
    },
    marks: [1, 2, 3]
  },
  {
    poll: {
      id: 123,
      approve: 30,
      reject: 123,
      needModify: 123,
      createdAt: new Date().toISOString()
    },
    sentence: {
      uuid: '80d3bb1f-3c35-4261-8ae6-56a5bfcdb940',
      hitokoto:
        '听风雪喧嚷，看流星在飞翔； 我的心向我呼唤：去动荡的远方……听风雪喧嚷，看流星在飞翔； 我的心向我呼唤：去动荡的远方……',
      type: 'i',
      fromWho: '亚历山德拉·尼·巴赫慕托娃',
      from: '歌唱动荡的青春',
      creator: 'SomeyaMako',
      createdAt: '1606403131'
    },
    marks: [1, 2, 3]
  },
  {
    poll: {
      id: 123,
      approve: 30,
      reject: 123,
      needModify: 123,
      createdAt: new Date().toISOString()
    },
    sentence: {
      uuid: '80d3bb1f-3c35-4261-8ae6-56a5bfcdb940',
      hitokoto: '听风雪喧嚷，看流星在飞翔； 我的心向我呼唤：去动荡的远方……',
      type: 'i',
      fromWho: '亚历山德拉·尼·巴赫慕托娃',
      from: '歌唱动荡的青春',
      creator: 'SomeyaMako',
      createdAt: '1606403131'
    },
    marks: [1, 2, 3]
  },
  {
    poll: {
      id: 123,
      approve: 30,
      reject: 123,
      needModify: 123,
      createdAt: new Date().toISOString()
    },
    sentence: {
      uuid: '80d3bb1f-3c35-4261-8ae6-56a5bfcdb940',
      hitokoto: '听风雪喧嚷，看流星在飞翔； 我的心向我呼唤：去动荡的远方……',
      type: 'i',
      fromWho: '亚历山德拉·尼·巴赫慕托娃',
      from: '歌唱动荡的青春',
      creator: 'SomeyaMako',
      createdAt: '1606403131'
    },
    marks: [1, 2, 3]
  }
])
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
              />
            </div>
          </template>
        </div>
      </ClientOnly>
    </div>
    <!-- 分页器 -->
    <div class="pagination">
      <a-pagination
        :current="page"
        :page-size="pageSize"
        show-quick-jumper
        show-less-items
        :page-size-options="pageSizeOptions"
        :total="500"
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
