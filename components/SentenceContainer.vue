<script lang="ts" setup>
import type { CardPropsSentence } from '@/components/do/review/Card.vue'
import dayjs from 'dayjs'
import { filterXSS } from 'xss'

const props = defineProps<{
  sentence: CardPropsSentence
}>()
</script>

<template>
  <a-popover placement="top">
    <template #content>
      <ul>
        <li>分类：{{ convertHitokotoType(props.sentence.type) }}</li>
        <li>提交者：{{ props.sentence.creator }}</li>
        <li>
          提交于:
          {{
            dayjs(+props.sentence.createdAt * 1000).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          }}
        </li>
      </ul>
    </template>
    <template #title>
      <span class="font-mono">{{ props.sentence.uuid }}</span>
    </template>
    <div class="hitokoto">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p class="sentence" v-html="filterXSS(props.sentence.hitokoto)"></p>
      <p class="author">
        —— {{ props.sentence.fromWho || '' }}『{{ props.sentence.from }}』
      </p>
    </div>
  </a-popover>
</template>

<style lang="scss" scoped>
.hitokoto {
  @apply w-full font-noto-serif;

  .sentence {
    @apply text-lg w-full font-600;
  }

  .author {
    @apply text-sm w-full text-right;
  }
}
</style>
