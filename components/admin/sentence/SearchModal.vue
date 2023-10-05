<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs'
import { HitokotoType } from '~/enums/hitokoto'

export interface State {
  uuids?: string[]
  keywords?: string
  type?: HitokotoType
  from?: string
  fromWho?: string
  creator?: string
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
const uuid = computed({
  get() {
    return formState.value.uuids?.join('\n')
  },
  set(val) {
    formState.value.uuids = val
      ? val.split('\n').map((v) => v.replace(/\n|\t|\r/g, '').trim())
      : undefined
  }
})

const resetFormState = () => {
  formState.value = {}
}

const sentenceTypeOptions = Object.keys(HitokotoType).reduce(
  (acc, key) => {
    const type = HitokotoType[key as keyof typeof HitokotoType]
    return [...acc, { label: convertHitokotoType(type), value: type }]
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
  console.log(formState.value)
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
    <a-form :model="formState" layout="vertical" name="search-sentences">
      <a-form-item name="uuids" label="UUIDs">
        <a-textarea v-model:value="uuid" placeholder="UUIDs 用回车分割" />
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
      <a-form-item name="from" label="提交者">
        <a-input
          v-model:value="formState.creator"
          placeholder="提交者（UID 或者名字）"
        />
      </a-form-item>
      <a-form-item name="start_time" label="开始时间">
        <a-date-picker
          v-model:value="dateRange.start"
          class="block w-full"
          placeholder="开始时间"
        />
      </a-form-item>
      <a-form-item name="end_time" label="结束时间">
        <a-date-picker
          v-model:value="dateRange.end"
          class="block w-full"
          placeholder="结束时间"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
