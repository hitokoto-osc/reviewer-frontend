<script setup lang="ts">
import { useSearchHitokoto } from '~/composables/api'
import type { SearchParams } from './Card.vue'

const props = defineProps<{
  open: boolean
  searchParams: SearchParams
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const currentPage = ref(1)
const paegSizeOptions = ref([5, 10, 20])
const limit = ref(5)
const offset = computed(() => (currentPage.value - 1) * limit.value)

const params = reactive({
  sentence: computed(() => props.searchParams.sentence),
  offset,
  limit
})
const { pending, error, data, refresh } = await useSearchHitokoto(params, {
  lazy: true,
  immediate: false
})

watch(error, (val) => {
  if (val) console.error(val)
})

const total = computed(() => data.value?.estimatedTotalHits || 0)
const tips = computed(() => {
  if (total.value) return `共找到 ${total.value} 条结果`
  return ''
})

const resetStatus = () => {
  currentPage.value = 1
}

watch(
  () => props.open,
  (val) => {
    val && (currentPage.value === 1 ? refresh() : resetStatus())
  }
)
watch(
  () => [limit.value, currentPage.value],
  () => refresh()
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
    <p class="font-noto-serif font-bold text-center">
      {{ props.searchParams.sentence }}
    </p>
    <a-divider v-if="!pending && !error">
      {{ tips }}
    </a-divider>
    <a-divider v-else />
    <FetchStatusWarpper
      :pending="pending"
      :error="error"
      :not-empty="!!data && data.hits.length > 0"
    >
      <a-list v-if="!!data" :data-source="data.hits">
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
      <template #empty>
        <a-empty />
      </template>
    </FetchStatusWarpper>
  </a-modal>
</template>

<style lang="scss" scoped>
.loading-box {
  @apply flex justify-center items-center h-32;
}
</style>
