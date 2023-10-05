<script setup lang="ts">
import { HitokotoStatus } from '~/enums/hitokoto'
import { PollStatus } from '~/enums/poll'
import type { State } from '@/components/admin/sentence/SearchModal.vue'
const initialSearchState: State = {}

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
    switch (value) {
      case HitokotoStatus.Approved:
        return HitokotoStatus.Approved
      case HitokotoStatus.Rejected:
        return HitokotoStatus.Rejected
      case HitokotoStatus.Pending:
        return HitokotoStatus.Pending
      default:
        return 'all'
    }
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

const {
  data: hitokotoListRes,
  pending,
  error,
  refresh
} = await useAdminHitokotoList(requestParams)
const cardData = computed(() => hitokotoListRes.value?.data.collection ?? [])

watch(
  () => error.value,
  async () => {
    console.log(error.value)
  }
)

// segments
const statusFilterOptions = [
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
const orderFilterOptions = [
  {
    title: '从新到旧',
    value: 'desc'
  },
  {
    title: '从旧到新',
    value: 'asc'
  }
]

// search modal
const searchModalState = reactive({
  open: false
})
const onSearchModalOk = (newState: State) => {
  state.searchParams = newState
  searchModalState.open = false
}

// 句子多选管理
const selectedSentencesState = reactive({
  sentences: reactive([] as HitokotoWithPoll[]),
  moveSentencesModal: {
    open: false,
    initialState: {
      status: HitokotoStatus.Rejected
    }
  },
  operations: {
    loading: false,
    options: [
      {
        text: '移动句子',
        onClick: () => {
          selectedSentencesState.moveSentencesModal.open = true
        }
      },
      {
        text: '删除句子',
        onClick: async () => {
          selectedSentencesState.operations.loading = true
          try {
            const uuids = selectedSentencesState.sentences.reduce(
              (acc, cur) => {
                return [...acc, cur.uuid]
              },
              [] as string[]
            )
            const { error } = await doAdminDeleteHitokoto(
              {
                uuids
              },
              {
                immediate: true
              }
            )
            if (error.value) return
            message.success('删除句子成功！')
            await refresh()
          } finally {
            selectedSentencesState.operations.loading = false
          }
        }
      }
    ]
  }
})
const sentenceCheckedState = (sentence: HitokotoWithPoll) => ({
  value: selectedSentencesState.sentences.includes(sentence),
  set(val: boolean) {
    if (val) {
      selectedSentencesState.sentences.push(sentence)
    } else {
      selectedSentencesState.sentences.splice(
        selectedSentencesState.sentences.indexOf(sentence),
        1
      )
    }
  }
})
const onMoveSentencesModalOk = async (status: HitokotoStatus) => {
  selectedSentencesState.moveSentencesModal.open = false
  selectedSentencesState.operations.loading = true
  try {
    const uuids = selectedSentencesState.sentences.reduce((acc, cur) => {
      return [...acc, cur.uuid]
    }, [] as string[])
    const { error, data } = await doAdminMoveHitokoto(
      {
        uuids,
        target: status
      },
      {
        immediate: true
      }
    )
    if (error.value) return

    if (data.value?.data.is_success) {
      message.success('移动句子成功！')
      return
    }
    Modal.error({
      title: '移动句子没有完全成功！',
      content: h('div', null, [
        h('p', null, '以下句子移动失败：'),
        h(
          'ul',
          null,
          data.value?.data.failed_uuids.map((uuid: string) => {
            return h(
              'li',
              null,
              `${uuid}: ${data.value?.data.failed_desc[uuid]}`
            )
          })
        )
      ])
    })
  } finally {
    await refresh()
    selectedSentencesState.operations.loading = false
  }
}

// 修改句子
const modifySentenceModalState = reactive({
  open: false,
  initialState: {} as HitokotoWithPoll
})
const openModifySentenceModal = (sentence: HitokotoWithPoll) => {
  modifySentenceModalState.initialState = sentence
  modifySentenceModalState.open = true
}
const onModifySentenceFinished = async (sentence: HitokotoWithPoll) => {
  const { data, error } = await useHitokotoOne(sentence.uuid, {
    immediate: true
  })
  const index = cardData.value.findIndex((o) => o.uuid === sentence.uuid)
  if (hitokotoListRes.value && !error.value) {
    hitokotoListRes.value.data.collection[index] = data.value!.data
  }
}

// 查看句子投票
const viewPollDetailState = reactive({
  open: false,
  pollId: 0,
  loading: false
})
const openViewPollDetail = async (sentence: HitokotoWithPoll) => {
  viewPollDetailState.loading = true
  try {
    const { data, error } = await usePollsBySentenceUUID(
      sentence.uuid,
      {},
      {
        immediate: true
      }
    )
    if (error.value) return
    if (data.value!.data.total === 0) {
      message.info('该句子没有投票')
      return
    }
    viewPollDetailState.pollId = data.value!.data.collection[0].id // TODO: 有多个投票的情况
    viewPollDetailState.open = true
  } finally {
    viewPollDetailState.loading = false
  }
}
</script>

<template>
  <div class=":uno: bg-white px-8 py-6 rounded-xl">
    <AdminSentenceConfirmTargetStatusModal
      v-model:open="selectedSentencesState.moveSentencesModal.open"
      :initial-state="selectedSentencesState.moveSentencesModal.initialState"
      @finish="onMoveSentencesModalOk"
    />
    <AdminSentenceModifySentenceModal
      v-model:open="modifySentenceModalState.open"
      :initial-state="modifySentenceModalState.initialState"
      @finish="onModifySentenceFinished"
    />
    <AdminSentenceSearchModal
      v-model:open="searchModalState.open"
      :initial-state="state.searchParams"
      @ok="onSearchModalOk"
    />
    <PollDetailModal
      v-model:open="viewPollDetailState.open"
      :poll-id="viewPollDetailState.pollId"
    />
    <h1 class="text-2xl pt-0 mt-0">句子管理</h1>
    <div class="actions gap-3 flex">
      <ASegmented v-model:value="status" :options="statusFilterOptions">
        <template #label="props">
          <span>{{ props.title }}</span>
        </template>
      </ASegmented>
      <ASegmented v-model:value="state.order" :options="orderFilterOptions">
        <template #label="props">
          <span>{{ props.title }}</span>
        </template>
      </ASegmented>
      <div class="flex-1"></div>
      <div
        v-show="selectedSentencesState.sentences.length > 0"
        class="inline-flex gap-3 items-center"
      >
        <span class="text-sm font-bold mr-5">
          选中 {{ selectedSentencesState.sentences.length }} 条
        </span>
        <MenuContainer :items="selectedSentencesState.operations.options">
          <AButton
            class=":uno: !inline-flex items-center justify-center"
            :loading="selectedSentencesState.operations.loading"
            :disabled="selectedSentencesState.operations.loading"
          >
            操作
            <div
              class=":uno: i-solar-menu-dots-bold inline-block ml-2 h-4 w-4"
            />
          </AButton>
        </MenuContainer>
      </div>

      <AButton>添加句子</AButton>
      <AButton type="primary" @click="searchModalState.open = true">
        搜索模板
      </AButton>
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
                  <span class="font-mono text-sm">{{ card.uuid }}</span>
                </template>
                <template #extra>
                  <a-checkbox
                    :checked="sentenceCheckedState(card).value"
                    @update:checked="sentenceCheckedState(card).set($event)"
                  />
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
                <div class="mt-8 flex gap-3">
                  <a-button
                    type="primary"
                    :loading="viewPollDetailState.loading"
                    :disabled="
                      card.poll_status === PollStatus.NotOpen ||
                      viewPollDetailState.loading
                    "
                    @click="openViewPollDetail(card)"
                  >
                    查看投票
                  </a-button>
                  <a-button @click="() => openModifySentenceModal(card)">
                    修改
                  </a-button>
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
          v-show="hitokotoListRes?.data && hitokotoListRes.data.total > 0"
          v-model:current="page"
          v-model:page-size="pageSize"
          :total="hitokotoListRes?.data.total ?? 0"
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
