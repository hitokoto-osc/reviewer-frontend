<script setup lang="ts">
import { snakeCase } from 'lodash-es'
import { PollMethod } from '@/enums/poll'
import type { PollReq } from '@/composables/api'
import type { Sentence } from '@/components/SentenceModifyModal.vue'
import { SnakeSentence } from '~/utils/formatter'
const props = defineProps<{
  marksSelectedValues?: number[]
  isPolled: boolean
  pollId: number // 为了照顾 Vue 的转换规则，因此这里使用 Id 而不是 ID
}>()

const emit = defineEmits<{
  'update:marksSelectedValues': [values: number[]]
  doMasonryRepaint: [] // 此事件完全只是为了让父组件重绘制
  doWebSearch: []
  doLocalSearch: []
  viewComments: []
  doSwiftModify: [onModifyFinished: (sentence: Sentence) => void]
  operationDone: [event: 'submit' | 'cancel']
}>()

// 标记列表
const marksStore = useMarksStore()
const marks = computed(() =>
  marksStore.marks.filter((v) => v.deprecated_at === null)
)
const marksSelected = ref<number[]>([])
watch(
  () => marksSelected.value,
  () => nextTick(() => emit('doMasonryRepaint'))
)

watch(
  () => props.marksSelectedValues,
  (val) => {
    if (!val) return
    marksSelected.value = val
  }
)

// 评论框
const isExpandCommentInput = ref(false)
const comment = ref('')

const onSwitchComment = () => {
  isExpandCommentInput.value = !isExpandCommentInput.value
  emit('doMasonryRepaint')
}

// 提交投票
const onSubmitLoading = ref(false)
const onSubmitPoll = async (method: PollMethod) => {
  onSubmitLoading.value = true
  try {
    const req: PollReq = {
      method
    }
    if (marksSelected.value.length > 0) {
      req.mark_ids = marksSelected.value
    }
    if (comment.value) {
      req.comment = comment.value
    }
    const { data, error } = await doPoll(props.pollId, req)
    if (error.value) throw error.value
    if (data.value?.code === 0) {
      message.success(`提交投票 ${props.pollId} 成功！`)
      emit('operationDone', 'submit')
    }
  } catch (e) {
    console.error(e)
  } finally {
    onSubmitLoading.value = false
  }
}
// 取消投票
const onCancelPoll = async () => {
  onSubmitLoading.value = true
  try {
    const { data, error } = await doCancelPoll(props.pollId)
    if (error.value) throw error.value
    if (data.value?.code === 0) {
      message.success(`撤回投票 ${props.pollId} 成功！`)
      emit('operationDone', 'cancel')
    }
  } catch (e) {
    console.error(e)
  } finally {
    onSubmitLoading.value = false
  }
}

// 快捷修改
const sentence = inject<Sentence>('sentence') as Sentence
const onSwiftModify = (camel: Sentence) => {
  const snake: SnakeSentence = (
    Object.keys(camel) as Array<keyof Sentence>
  ).reduce((acc, cur) => {
    if (camel[cur] === sentence[cur]) return acc
    const key = snakeCase(cur) as keyof SnakeSentence
    acc[key] = camel[cur] as never
    return acc
  }, {} as SnakeSentence)
  if (Object.keys(snake).length === 0) return
  comment.value = JSON.stringify(snake)
}
</script>
<template>
  <div class="actions-container">
    <template v-if="!props.isPolled">
      <p class="tips">在考察此句的内容、情感、结构后，请您对此句做出判断：</p>
      <!-- 标记选择框 -->
      <a-select
        v-model:value="marksSelected"
        mode="multiple"
        :style="{ width: '100%' }"
        placeholder="请选择您对此句的看法，部分选项会展示给其他审核员以辅助审核（选填，若选择“需要修改”则为必填）"
        @change="emit('update:marksSelectedValues', marksSelected)"
      >
        <a-select-option v-for="i in marks" :key="i.id">
          {{ i.text }}
        </a-select-option>
      </a-select>
      <!-- 评论框 -->
      <a-textarea
        v-show="isExpandCommentInput"
        v-model:value="comment"
        placeholder="请输入您对于此句子的看法或建议，不超过 1000 字。（选填，若选择“需要更改”则为必填）"
        :rows="2"
        class="mb-xxs"
      />
      <div class="actions">
        <div class="main-actions">
          <a-button
            type="primary"
            :loading="onSubmitLoading"
            :disabled="onSubmitLoading"
            @click="onSubmitPoll(PollMethod.Approve)"
          >
            批准
          </a-button>
          <a-button
            :loading="onSubmitLoading"
            :disabled="onSubmitLoading"
            @click="onSubmitPoll(PollMethod.Reject)"
          >
            驳回
          </a-button>
          <a-button
            :loading="onSubmitLoading"
            :disabled="onSubmitLoading"
            @click="onSubmitPoll(PollMethod.NeedModify)"
          >
            需要更改
          </a-button>
        </div>
        <div class="md:flex-1"></div>
        <div class="tool-actions">
          <DoReviewCardActionsToolsContainer
            @switch-comment-input="onSwitchComment"
            @do-local-search="emit('doLocalSearch')"
            @do-web-search="emit('doWebSearch')"
            @view-comments="emit('viewComments')"
            @do-swift-modify="emit('doSwiftModify', onSwiftModify)"
          />
        </div>
      </div>
    </template>
    <template v-else>
      <p class="tips">您已对此句做出评判，但您可以：</p>
      <a-button
        type="primary"
        :loading="onSubmitLoading"
        :disabled="onSubmitLoading"
        @click="onCancelPoll"
      >
        撤回意见
      </a-button>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.actions-container {
  @apply mt-3;

  .tips {
    @apply text-base text-cyan-500;
  }

  .ant-select {
    @apply mb-3;
  }

  .actions {
    @apply block md:flex mt-2;

    .main-actions {
      @apply flex justify-between md:block;

      button.ant-btn {
        @apply mr-2 my-1;
      }
    }

    .tool-actions {
      @apply flex justify-end md:block;

      button.ant-btn {
        @apply mt-3  mx-1 md:my-1;
      }
    }
  }
}
</style>
