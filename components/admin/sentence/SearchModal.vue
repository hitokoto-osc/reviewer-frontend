<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs'
import { HitokotoType } from '~/enums/hitokoto'

export interface State {
  uuid?: string
  keywords?: string
  type?: HitokotoType
  from?: string
  fromWho?: string
  start?: string
  end?: string
}

const props = defineProps<{
  open: boolean
  initialState: State
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  ok: [state: State]
}>()

const formState = ref<State>({})
const dateRange = reactive({
  start: computed<Dayjs | undefined>({
    get() {
      return formState.value.start ? dayjs(formState.value.start) : undefined
    },
    set(val) {
      formState.value.start = val?.format()
    }
  }),
  end: computed<Dayjs | undefined>({
    get() {
      return formState.value.end ? dayjs(formState.value.end) : undefined
    },
    set(val) {
      formState.value.end = val?.format()
    }
  })
})

const resetFormState = () => {
  formState.value = {}
}

const sentenceTypeOptions = Object.keys(HitokotoType).reduce(
  (acc, key) => {
    return [...acc, { label: convertHitokotoType(key), value: key }]
  },
  [] as Array<{ label: string; value: string }>
)

// Modal
watch(
  () => props.open,
  (value) => {
    if (value) {
      formState.value = deepToRaw(props.initialState)
    }
  }
)
const handleOk = async () => {
  emit('update:open', false)
  emit('ok', formState.value)
}
const handleCancel = () => {
  emit('update:open', false)
}
</script>

<template>
  <a-modal
    :open="props.open"
    title="搜索模板"
    ok-text="确认"
    cancel-text="取消"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <template #footer>
      <a-button key="back" @click="resetFormState">重置</a-button>
      <a-button key="submit" type="primary" @click="handleOk">确认</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
      name="form_in_modal"
    >
      <a-form-item name="uuid" label="UUID">
        <a-input v-model:value="formState.uuid" placeholder="单一 UUID" />
      </a-form-item>
      <a-form-item name="keywords" label="关键字">
        <a-input v-model:value="formState.keywords" placeholder="句子关键字" />
      </a-form-item>
      <a-form-item name="type" label="分类">
        <a-select
          v-model:value.trim="formState.type"
          :options="sentenceTypeOptions"
          placeholder="分类"
        />
      </a-form-item>
      <a-form-item name="from" label="来源">
        <a-input v-model:value="formState.from" placeholder="来源" />
      </a-form-item>
      <a-form-item name="from" label="作者">
        <a-input v-model:value="formState.fromWho" placeholder="作者" />
      </a-form-item>
      <a-form-item name="range" label="时间范围">
        <div class="flex gap-3">
          <a-date-picker
            v-model:value="dateRange.start"
            class="block w-1/2"
            placeholder="开始时间"
          />
          <a-date-picker
            v-model:value="dateRange.end"
            class="block w-1/2"
            placeholder="结束时间"
          />
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
