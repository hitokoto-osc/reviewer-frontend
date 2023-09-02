<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    marks: number[]
    marksSelectedValues?: number[]
    checkable?: boolean
  }>(),
  {
    marksSelectedValues: () => [],
    checkable: false
  }
)

const emit = defineEmits<{
  'update:marksSelectedValues': [value: number[]]
}>()

const marksStore = useMarksStore()
</script>

<template>
  <a-tag
    v-for="mark in props.marks"
    :key="mark"
    class="cursor-pointer"
    :class="{
      'pointer-events-none': !props.checkable
    }"
    :color="
      (marksStore.markColorMap[mark]?.color || 'yellow') +
      (props.marksSelectedValues.includes(mark) ? '-inverse' : '')
    "
    @click="
      emit(
        'update:marksSelectedValues',
        props.marksSelectedValues.includes(mark)
          ? props.marksSelectedValues.filter((it) => it != mark)
          : props.marksSelectedValues.concat([mark])
      )
    "
  >
    {{ marksStore.markColorMap[mark]?.text || '未知' }}
  </a-tag>
</template>

<style lang="scss" scoped>
.ant-tag {
  @apply mx-1 mb-2;
}
</style>
