<script setup lang="ts">
import type { SelectProps } from 'ant-design-vue'
import type { CardPropsSentence } from '@/components/do/review/Card.vue'
import { HitokotoType } from '~/enums/hitokoto'

// Editor
import { MdEditor } from 'md-editor-v3'
import { filterXSS } from 'xss'
import 'md-editor-v3/lib/style.css'

export type Sentence = Omit<CardPropsSentence, 'creator' | 'createdAt'>

export type StructureComment = Required<Sentence & { review: string }>

const props = defineProps<{
  open: boolean
  initialState: StructureComment
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  finish: [sentence: StructureComment]
}>()

const onOK = () => {
  emit('update:open', false)
  const data: StructureComment = { ...formState }
  if (data.fromWho === '') data.fromWho = null
  emit('finish', data)
}

const formState = reactive<StructureComment & { fromWho: string }>({
  uuid: '',
  hitokoto: '',
  type: HitokotoType.Anime,
  fromWho: '',
  from: '',
  review: ''
})
const labelCol = { span: 5 }
const wrapperCol = { span: 13 }

// 重置表单
watch(
  () => props.open,
  (val) => {
    if (!val) return
    formState.uuid = props.initialState.uuid
    formState.hitokoto = props.initialState.hitokoto
    formState.type = props.initialState.type
    formState.fromWho = props.initialState.fromWho || ''
    formState.from = props.initialState.from
    formState.review = props.initialState.review || ''
  }
)

const hitokotoTypeOptions = reactive<
  Exclude<SelectProps['options'], undefined>
>(
  Object.keys(HitokotoType).reduce(
    (acc, key) => {
      const type = HitokotoType[key as keyof typeof HitokotoType]
      return [...acc, { label: convertHitokotoType(type), value: type }]
    },
    [] as Array<{ label: string; value: string }>
  )
)

const colorMode = useColorMode()
</script>

<template>
  <a-modal
    class="!w-98% !md:w-3/8"
    width=""
    :open="props.open"
    :title="`修改句子`"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    @update:open="emit('update:open', $event)"
    @ok="onOK"
  >
    <a-form
      :model="formState"
      name="modify-sentence"
      class="modify-sentence-form"
    >
      <a-form-item label="标识" name="uuid">
        <a-input :value="formState.uuid" disabled />
      </a-form-item>
      <a-form-item label="来源" name="from">
        <a-input v-model:value.trim="formState.from" placeholder="未填写" />
      </a-form-item>
      <a-form-item label="作者" name="fromWho">
        <a-input v-model:value.trim="formState.fromWho" placeholder="未填写" />
      </a-form-item>
      <a-form-item label="分类" name="type">
        <a-select
          v-model:value.trim="formState.type"
          :options="hitokotoTypeOptions"
        />
      </a-form-item>
      <a-form-item label="句子" name="hitokoto">
        <a-textarea v-model:value.trim="formState.hitokoto" />
      </a-form-item>
      <a-form-item label="附言" name="hitokoto">
        <MdEditor
          v-model="formState.review"
          class="rounded-md !h-70"
          editor-id="modify-comment-review-editor"
          :theme="colorMode.value === 'dark' ? 'dark' : 'light'"
          no-mermaid
          no-katex
          no-highlight
          placeholder="如果有需要的话，可以在这里写下你的评论（支持 Markdown 语法和部分 HTML）。"
          :sanitize="filterXSS"
          :preview="false"
          :toolbars-exclude="[
            'github',
            'htmlPreview',
            'catalog',
            'table',
            'mermaid',
            'katex',
            'code',
            'fullscreen',
            'save'
          ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang="scss">
.modify-sentence-form {
  @apply my-10;

  .md-editor {
    --md-border-color: #d9d9d9 !important;
    --md-border-hover-color: #a44aff !important;
    --md-border-active-color: #a44aff !important;
  }

  .md-editor-dark {
    --md-bk-color: #141414 !important;
    --md-border-color: #424242 !important;
  }
}
</style>
