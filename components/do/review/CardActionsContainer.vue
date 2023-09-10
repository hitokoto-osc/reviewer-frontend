<script setup lang="ts">
import PinyinMatch from 'pinyin-match'
import { snakeCase } from 'lodash-es'
import { PollMethod } from '@/enums/poll'
import type { PollReq } from '@/composables/api'
import type { Sentence } from '@/components/SentenceModifyModal.vue'
import type { DefaultOptionType } from 'ant-design-vue/es/select'
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
  doSwiftModify: [
    onModifyFinished: (sentence: Sentence) => void,
    currentState: Partial<Sentence>
  ]
  operationDone: [event: 'submit' | 'cancel']
}>()

// 标记列表
const marksStore = useMarksStore()
const marksSelected = ref<number[]>([])
const options = computed(() =>
  marksStore.marks
    .filter((v) => v.deprecated_at === null)
    .map((v) => ({ label: v.text, value: v.id }))
)
const filterOptions = (
  inputValue: string,
  option?: DefaultOptionType
): boolean =>
  !!option && Array.isArray(PinyinMatch.match(option.label, inputValue))
const appendMarkByLabel = (label: string) => {
  const mark = marksStore.marks.find((v) => v.text === label)
  if (!mark) return
  !marksSelected.value.includes(mark.id) && marksSelected.value.push(mark.id)
}
watch(
  () => marksSelected.value,
  (val) => {
    emit('update:marksSelectedValues', val)
    nextTick(() => emit('doMasonryRepaint'))
  }
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
const keyCastToLabel = (key: keyof SnakeSentence) => {
  switch (key) {
    case 'type':
      return '分类有误'
    case 'hitokoto':
      return '句子存在错误'
    case 'from_who':
      return '作者错误或误用'
    case 'from':
      return '来源错误或误用'
    default:
      throw new Error('未知的 key')
  }
}
const onSwiftModify = (camel: Sentence) => {
  const snake: SnakeSentence = (
    Object.keys(camel) as Array<keyof Sentence>
  ).reduce((acc, cur) => {
    if (camel[cur] === sentence[cur]) return acc
    const key = snakeCase(cur) as keyof SnakeSentence
    appendMarkByLabel(keyCastToLabel(key))
    acc[key] = camel[cur] as never
    return acc
  }, {} as SnakeSentence)
  if (Object.keys(snake).length === 0) return
  comment.value = JSON.stringify(snake)
}
const doSwiftModify = () => {
  try {
    const initialState = objToCamel<Partial<Sentence>>(
      JSON.parse(comment.value || '{}') as Record<string, never>
    )
    emit('doSwiftModify', onSwiftModify, initialState)
  } catch (e) {
    emit('doSwiftModify', onSwiftModify, {} as Partial<Sentence>)
  }
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
        :options="options"
        :filter-option="filterOptions"
        placeholder="请选择您对此句的看法，部分选项会展示给其他审核员以辅助审核（选填，若选择“需要修改”则为必填）"
      >
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
          <a-button-group>
            <a-button
              :loading="onSubmitLoading"
              :disabled="onSubmitLoading"
              class="!mr-0"
              @click="onSubmitPoll(PollMethod.NeedModify)"
            >
              需要更改
            </a-button>
            <a-button
              class="px-1.75 inline-flex items-center"
              @click="doSwiftModify"
            >
              <div class="i-solar-pen-2-bold inline-block w-4 h-4" />
            </a-button>
          </a-button-group>
        </div>
        <div class="md:flex-1"></div>
        <div class="tool-actions">
          <DoReviewCardActionsToolsContainer
            @switch-comment-input="onSwitchComment"
            @do-local-search="emit('doLocalSearch')"
            @do-web-search="emit('doWebSearch')"
            @view-comments="emit('viewComments')"
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
