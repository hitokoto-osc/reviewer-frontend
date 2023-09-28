<script setup lang="ts">
import { HitokotoStatus, HitokotoType } from '~/enums/hitokoto'

const initialSearchState = {
  uuid: undefined as string | undefined,
  keywords: undefined as string | undefined,
  type: undefined as HitokotoType | undefined,
  from: undefined as string | undefined,
  fromWho: undefined as string | undefined
}

// Pagination
const route = useRoute()
const page = computed({
  get: () => {
    const query = route.query
    return query.page ? Number(query.page) : 1
  },
  set: (val: number) => {
    navigateTo({
      query: {
        ...route.query,
        page: val
      }
    })
  }
})
const pageSize = computed({
  get: () => {
    const query = route.query
    return query.pageSize ? Number(query.pageSize) : 10
  },
  set: (val: number) => {
    navigateTo({
      query: {
        ...route.query,
        pageSize: val
      }
    })
  }
})

const state = reactive({
  order: 'desc' as 'desc' | 'asc',
  searchParams: { ...initialSearchState }
})

const status = computed<HitokotoStatus | 'all'>({
  get: () => {
    const value = String(route.query.statusFilter)
    return !!value ? (value as HitokotoStatus) : 'all'
  },
  set: (val: string) => {
    navigateTo({
      query: {
        ...route.query,
        statusFilter: val
      }
    })
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resetSearchParams = () => {
  for (const [key, value] of Object.entries(initialSearchState)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    state.searchParams[key] = value
  }
}

// 请求相关
const requestParams = computed<HitokotoAdminListReq>(() => ({
  page: page.value,
  page_size: pageSize.value,
  order: state.order,
  status: status.value === 'all' ? undefined : status.value,
  ...state.searchParams
}))

const { data, pending, error } = await useAdminHitokotoList(requestParams)
const cardData = computed(() => data.value?.data.collection ?? [])

// segments
const segmentOptions = [
  {
    title: '全部',
    value: 'all'
  },
  {
    title: '通过',
    value: HitokotoStatus.Approved
  },
  {
    title: '驳回',
    value: HitokotoStatus.Rejected
  },
  {
    title: '待审',
    value: HitokotoStatus.Pending
  }
]
</script>

<template>
  <div class=":uno: bg-white px-8 py-6 rounded-xl">
    <h1 class="text-2xl pt-0 mt-0">句子管理</h1>
    <div class="actions gap-3 flex">
      <ASegmented v-model:value="status" :options="segmentOptions">
        <template #label="props">
          <span>{{ props.title }}</span>
        </template>
      </ASegmented>
      <div class="flex-1"></div>
      <AButton type="primary">搜索模板</AButton>
      <AButton>添加句子</AButton>
    </div>

    <div class=":uno: mt-5">
      <FetchStatusWrapper
        :pending="pending"
        :error="error"
        :not-empty="cardData.length > 0"
      >
        <ClientOnly>
          <masonry :cols="{ default: 4, 640: 1 }" :gutter="'1rem'">
            <div
              v-for="card in cardData"
              :key="card.uuid"
              class="grid-item mb-4"
            >
              <a-card>
                <template #title>
                  <span class="font-mono">{{ card.uuid }}</span>
                </template>
                <SentenceContainer
                  :sentence="{
                    uuid: card.uuid,
                    hitokoto: card.hitokoto,
                    from: card.from,
                    fromWho: card.from_who,
                    type: card.type,
                    creator: card.creator,
                    createdAt: card.created_at
                  }"
                />
                <div class="card-panel">
                  <ul>
                    <li>
                      提交者：{{ card.creator }}（{{ card.creator_uid }}）
                    </li>
                    <li>状态：{{ convertHitokotoStatus(card.status) }}</li>
                    <li>分类：{{ convertHitokotoType(card.type) }}</li>
                    <li v-show="card.status !== HitokotoStatus.Pending">
                      审核员：{{ formatReviewer(card.reviewer) }}
                    </li>
                    <li>投票状态：{{ convertPollStatus(card.poll_status) }}</li>
                    <li>提交方式：{{ card.commit_from }}</li>
                    <li>
                      提交时间：{{ formatDateTime(+(card.created_at + '000')) }}
                    </li>
                  </ul>
                </div>
                <div class="mt-5 flex gap-2">
                  <a-button type="primary"> 删除 </a-button>
                  <a-button> 修改 </a-button>
                  <a-button> 移动 </a-button>
                  <div class="flex-1"></div>
                  <a-button>工具</a-button>
                </div>
              </a-card>
            </div>
          </masonry>
        </ClientOnly>
        <template #empty>
          <a-empty />
        </template>
      </FetchStatusWrapper>

      <div class=":uno: w-full flex justify-center mt-5">
        <a-pagination
          v-model:current="page"
          v-model:page-size="pageSize"
          class=""
          :total="data?.data.total ?? 0"
          :show-total="(total) => `共 ${total} 条`"
          show-quick-jumper
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-panel {
  @apply mt-3 bg-zinc-50 -mx-6 px-6 py-2;

  ul {
    @apply list-none ml-0 pl-0;

    li {
      @apply flex ml-0 pl-0 items-center;
    }
  }
}
</style>
