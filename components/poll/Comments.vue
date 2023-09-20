<script setup lang="ts">
import dayjs from 'dayjs'

// FilterXSS
import { filterXSS } from 'xss'
import type { PollDetailRes } from '@/composables/api'
import { getAvatarURLByHash } from '~/utils/avatar'
import { PollMethod } from '~/enums/poll'
const props = withDefaults(
  defineProps<{
    records: PollDetailRes['records']
    withPoints?: boolean
  }>(),
  {
    withPoints: false
  }
)
const records = computed(() =>
  props.withPoints ? props.records : props.records.filter((v) => v.comment)
)

const render = (record: PollDetailRes['records'][0]): string => {
  let tpl = ''
  if (
    props.withPoints &&
    record.point > 0 &&
    record.method !== PollMethod.NeedCommonUserPoll
  ) {
    tpl += `投了 <u>**${convertPollMethod(record.method)}**</u> ${
      record.point
    } 票。`
  }
  if (record.comment) {
    tpl += `  \n${filterXSS(formatPollComment(record.comment))}`
  }
  return renderMarkdown(tpl)
}
// watch(records, (val) => console.log(val))
</script>
<template>
  <div class="poll-comments-container">
    <div v-if="records && records.length > 0" class="comments">
      <template v-for="record in records" :key="record.user.id">
        <div class="comment">
          <div class="avatar">
            <img
              :src="getAvatarURLByHash(record.user.email_hash)"
              :draggable="false"
            />
          </div>
          <div class=":uno: flex-1 flex flex-col justify-center">
            <div class=":uno: flex justify-between">
              <span class=":uno: text-xs">{{ record.user.name }}</span>
              <span class=":uno: text-xs">
                {{ dayjs(record.created_at).format('YYYY-MM-DD HH:mm:ss') }}
              </span>
            </div>
            <!-- eslint-disable vue/no-v-html vue/no-v-text-v-html-on-component-->
            <Fancybox class="content" v-html="render(record)"> </Fancybox>
          </div>
        </div>
        <!-- <a-divider v-if="index < records.length - 1" class=":uno: !my-3" /> -->
      </template>
    </div>
    <a-empty v-else />
  </div>
</template>

<style lang="scss" scoped>
.poll-comments-container {
  // @apply my-8;

  .comments {
    .comment {
      @apply flex my-4;

      .avatar {
        @apply w-fit h-fit mr-3 flex;

        img {
          @apply rounded-full w-9.5 h-9.5 border-1 border-solid border-gray-200 mt-0;
          @apply select-none;
        }
      }

      .content {
        @apply text-sm underline-offset-2.5 w-full;

        img {
          @apply rounded-lg w-full h-auto;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.poll-comments-container {
  .comments {
    .comment {
      .content {
        @apply underline-offset-2.5;

        p {
          @apply mt-0 my-1;
        }

        img {
          @apply rounded-md w-fit block mx-auto w-full h-auto my-2 cursor-pointer;
        }
      }
    }
  }
}
</style>
