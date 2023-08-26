<script setup lang="ts">
import type { Hit } from 'meilisearch'
import type { SearchHitokotoResElement } from '@/composables/api'
const props = defineProps<{
  data: Hit<SearchHitokotoResElement>
}>()
</script>
<template>
  <a-popover :title="props.data.uuid">
    <template #content>
      <p>
        分类：{{ convertHitokotoType(props.data.type) }} <br />
        提交者：{{ props.data.creator }} <br />
        审核者：{{ formatReviewer(props.data.reviewer) || props.data.reviewer }}
        <br />
        提交时间：{{ formatDateTime(+(props.data.created_at + '000')) }}
      </p>
    </template>
    <div class="sentence-preview-container">
      <p>
        {{ props.data.hitokoto }}
      </p>
      <small>
        —— {{ props.data.from_who || '' }}「{{ props.data.from || '未知' }}」
      </small>
    </div>
  </a-popover>
</template>

<style scoped lang="scss">
.sentence-preview-container {
  width: 100%;

  p,
  small {
    font-family: 'Noto Serif SC', serif;
  }

  small {
    display: block;
    text-align: right;
  }
}
</style>
