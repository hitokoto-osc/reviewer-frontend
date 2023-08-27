<script setup lang="ts">
import { useSearchHitokoto } from '~/composables/api'
import type { SearchParams } from './Card.vue'
import type { Hits } from 'meilisearch'
import type { SearchHitokotoResElement } from '@/composables/api'

const props = defineProps<{
  open: boolean
  searchParams: SearchParams
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const total = ref(0)
const currentPage = ref(1)
const paegSizeOptions = ref([5, 10, 20])
const limit = ref(5)
const offset = computed(() => (currentPage.value - 1) * limit.value)

const status = ref<'ok' | 'error' | 'empty' | 'pending'>('ok')
const tips = computed(() => {
  if (total.value) return `共找到 ${total.value} 条结果`
  return ''
})

const records = ref<Hits<SearchHitokotoResElement>>([])

const doLocalSearch = async () => {
  status.value = 'pending'
  try {
    // console.log(offset.value, limit.value, currentPage.value)
    const result = await useSearchHitokoto({
      sentence: props.searchParams.sentence,
      offset: offset.value,
      limit: limit.value
    })
    total.value = result.estimatedTotalHits
    records.value = result.hits
  } catch (e) {
    console.log(e)
    message.error('搜索失败')
    status.value = 'error'
  } finally {
    status.value = 'ok'
  }
}

const resetStatus = (all: boolean) => {
  status.value = 'pending'

  if (all) {
    total.value = 0
    currentPage.value = 1
    records.value = []
  }
}

watch(
  () => [props.open, limit.value, currentPage.value],
  (val, oldVal) => {
    if (typeof val[0] === 'boolean' && !val[0]) return
    resetStatus(val[0] !== oldVal[0])
    doLocalSearch()
  }
)
</script>

<template>
  <a-modal
    title="句子查重"
    :open="props.open"
    wrap-class-name="search-modal"
    ok-text="好了"
    cancel-text="取消"
    @update:open="emit('update:open', $event)"
    @ok="emit('update:open', false)"
    @cancel="emit('update:open', false)"
  >
    <p class="font-noto-serif">{{ props.searchParams.sentence }}</p>
    <a-divider v-if="status === 'ok'">
      {{ tips }}
    </a-divider>
    <a-divider v-else />
    <div v-if="status === 'pending'" class="loading-box">
      <a-spin />
    </div>
    <div v-if="status === 'error'" class="loading-box">
      <a-result status="500" title="500" sub-title="请求错误" />
    </div>
    <template v-else>
      <a-list :data-source="records">
        <template #renderItem="{ item }">
          <a-list-item>
            <DoReviewLocalSearchModalListElement :data="item" />
          </a-list-item>
        </template>
      </a-list>
      <a-divider :style="{ marginTop: 0 }" />
      <a-row type="flex" justify="center" class="mt-s">
        <a-pagination
          v-model:current="currentPage"
          v-model:page-size="limit"
          :total="total"
          :page-size-options="paegSizeOptions"
          show-less-items
        />
      </a-row>
    </template>
  </a-modal>
</template>

<style lang="scss" scoped>
.loading-box {
  @apply flex justify-center items-center h-32;
}
</style>
