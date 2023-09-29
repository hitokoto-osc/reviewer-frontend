<script setup lang="ts">
import type { SelectProps } from 'ant-design-vue'
import { HitokotoStatus } from '~/enums/hitokoto'

const props = defineProps<{
  open: boolean
  initialState: {
    status: HitokotoStatus
  }
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  finish: [status: HitokotoStatus]
}>()

const onOK = () => {
  emit('update:open', false)
  emit('finish', formState.value.status)
}

const formState = ref({} as { status: HitokotoStatus })
watch(
  () => props.open,
  (val) => {
    if (!val) return
    formState.value.status = props.initialState.status
  }
)

const hitokotoStatusOptions = reactive<
  Exclude<SelectProps['options'], undefined>
>(
  Object.keys(HitokotoStatus).reduce(
    (acc, key) => {
      const type = HitokotoStatus[key as keyof typeof HitokotoStatus]
      return [...acc, { label: convertHitokotoStatus(type), value: type }]
    },
    [] as Array<{ label: string; value: string }>
  )
)
</script>

<template>
  <a-modal
    :open="props.open"
    :title="`目标状态`"
    @update:open="emit('update:open', $event)"
    @ok="onOK"
  >
    <a-form
      :model="formState"
      name="move-sentence"
      class="move-sentence-form"
      layout="vertical"
    >
      <a-form-item label="目标状态" name="type">
        <a-select
          v-model:value="formState.status"
          :options="hitokotoStatusOptions"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
