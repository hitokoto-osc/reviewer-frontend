<script setup lang="ts">
const props = defineProps<{
  open: boolean
  initialState: PollMarkRes[0]
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  updated: []
}>()

const formState = ref<PollMarkRes[0]>({} as PollMarkRes[0])
watch(
  () => props.open,
  (value) => {
    if (value) {
      formState.value = deepToRaw(props.initialState)
    }
  }
)
const onOk = async () => {
  await doUpdateMark(
    formState.value.id,
    {
      ...formState.value
    },
    { immediate: true }
  )
  message.success('更新成功')
  emit('update:open', false)
  emit('updated')
}
</script>

<template>
  <a-modal
    :open="props.open"
    title="修改标签"
    ok-text="更新"
    cancel-text="取消"
    @cancel="emit('update:open', false)"
    @ok="onOk"
  >
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
      name="form_in_modal"
    >
      <a-form-item name="text" label="内容">
        <a-input v-model:value="formState.text" />
      </a-form-item>
      <a-form-item name="property" label="类别">
        <a-select v-model:value="formState.property">
          <a-select-option :value="1">赞同</a-select-option>
          <a-select-option :value="2">驳回</a-select-option>
          <a-select-option :value="3">需要修改</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="property" label="程度">
        <a-select v-model:value="formState.level">
          <a-select-option value="info">提示</a-select-option>
          <a-select-option value="warning">警告</a-select-option>
          <a-select-option value="danger">严重</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
