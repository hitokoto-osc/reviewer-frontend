<script setup lang="ts">
import type { SelectProps } from 'ant-design-vue'
import { HitokotoType } from '~/enums/hitokoto'

// Editor

export type Sentence = Omit<HitokotoWithPoll, 'from_who'> & {
  from_who?: string
}

const props = defineProps<{
  open: boolean
  initialState: HitokotoWithPoll
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  finish: [sentence: HitokotoWithPoll]
}>()

const onOK = async () => {
  const tmp = { ...formState.value }
  if (!tmp.from_who) (tmp as HitokotoWithPoll).from_who = null
  const data: HitokotoWithPoll = tmp as HitokotoWithPoll
  // 更新请求
  const params: Partial<typeof tmp> = { ...tmp }
  ;(Object.keys(params) as Array<keyof HitokotoWithPoll>).forEach((key) => {
    if (params[key] === props.initialState[key]) {
      delete params[key]
    }
  })
  const { error } = await doAdminUpdateHitokoto(tmp.uuid, params, {
    immediate: true
  })
  if (error.value) return // 中断后面
  message.success('修改句子成功！')
  emit('update:open', false)
  emit('finish', data)
}

const formState = ref<Sentence>({} as Sentence)

// 重置表单
watch(
  () => props.open,
  (val) => {
    if (!val) return
    const state = deepToRaw(props.initialState)
    if (!state.from_who) (state as Sentence).from_who = undefined
    formState.value = state as Sentence
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
</script>

<template>
  <a-modal
    class="!w-98% !md:w-3/8"
    width=""
    :open="props.open"
    :title="`修改句子`"
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
        <a-input
          v-model:value="formState.from"
          placeholder="未填写"
          @blur="formState.from = formState.from.trim()"
        />
      </a-form-item>
      <a-form-item label="作者" name="fromWho">
        <a-input
          v-model:value="formState.from_who"
          placeholder="未填写"
          @blur="
            () => {
              if (formState.from_who) {
                formState.from_who = formState.from_who.trim()
              }
            }
          "
        />
      </a-form-item>
      <a-form-item label="分类" name="type">
        <a-select
          v-model:value="formState.type"
          :options="hitokotoTypeOptions"
        />
      </a-form-item>
      <a-form-item label="句子" name="hitokoto">
        <a-textarea
          v-model:value="formState.hitokoto"
          @blur="formState.hitokoto = formState.hitokoto.trim()"
        />
      </a-form-item>
      <a-form-item label="创建者（昵称）" name="creator">
        <a-input v-model:value.trim="formState.creator" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
