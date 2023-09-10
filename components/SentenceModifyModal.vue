<script setup lang="ts">
import type { SelectProps } from 'ant-design-vue'
import type { CardPropsSentence } from '@/components/do/review/Card.vue'
import { HitokotoType } from '~/enums/hitokoto'

export type Sentence = Omit<CardPropsSentence, 'creator' | 'createdAt'>

const props = defineProps<{
  open: boolean
  sentence: Sentence
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  finish: [sentence: Sentence]
}>()

const onOK = () => {
  emit('update:open', false)
  const data: Sentence = { ...formState }
  if (data.fromWho === '') data.fromWho = null
  emit('finish', data)
}

const formState = reactive<Sentence & { fromWho: string }>({
  uuid: '',
  hitokoto: '',
  type: HitokotoType.Anime,
  fromWho: '',
  from: ''
})
const labelCol = { span: 5 }
const wrapperCol = { span: 13 }

// 重置表单
watch(
  () => props.open,
  (val) => {
    if (!val) return
    formState.uuid = props.sentence.uuid
    formState.hitokoto = props.sentence.hitokoto
    formState.type = props.sentence.type
    formState.fromWho = props.sentence.fromWho || ''
    formState.from = props.sentence.from
  }
)

const hitokotoTypeOptions = reactive<
  Exclude<SelectProps['options'], undefined>
>([
  {
    label: '动画',
    value: HitokotoType.Anime
  },
  {
    label: '漫画',
    value: HitokotoType.Comic
  },
  {
    label: '游戏',
    value: HitokotoType.Game
  },
  {
    label: '文学',
    value: HitokotoType.Novel
  },
  {
    label: '原创',
    value: HitokotoType.Original
  },
  {
    label: '网络',
    value: HitokotoType.Internet
  },
  {
    label: '其他',
    value: HitokotoType.Other
  },
  {
    label: '影视',
    value: HitokotoType.Movie
  },
  {
    label: '诗词',
    value: HitokotoType.Poem
  },
  {
    label: '网易云',
    value: HitokotoType.NCM
  },
  {
    label: '哲学',
    value: HitokotoType.Philosophy
  },
  {
    label: '抖机灵',
    value: HitokotoType.Joke
  }
])
</script>

<template>
  <a-modal
    :open="props.open"
    :title="`修改句子`"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    @update:open="emit('update:open', $event)"
    @ok="onOK"
  >
    <a-form :model="formState" name="modify-sentence" class="my-10">
      <a-form-item label="标识" name="uuid">
        <a-input :value="formState.uuid" disabled />
      </a-form-item>
      <a-form-item label="来源" name="from">
        <a-input v-model:value="formState.from" />
      </a-form-item>
      <a-form-item label="作者" name="fromWho">
        <a-input v-model:value="formState.fromWho" />
      </a-form-item>
      <a-form-item label="分类" name="type">
        <a-select
          v-model:value="formState.type"
          :options="hitokotoTypeOptions"
        />
      </a-form-item>
      <a-form-item label="句子" name="hitokoto">
        <a-textarea v-model:value="formState.hitokoto" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
