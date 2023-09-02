<script setup lang="ts">
const props = defineProps<{
  marks: number[]
  marksSelectedValues: number[]
  checkable: boolean
}>()

const emit = defineEmits<{
  onSelectChange: [marksSelectedValues: number[]]
}>()

const marksStore = useMarksStore()
</script>

<template>
  <a-tag
    v-for="mark in props.marks"
    :key="mark"
    :style="
      'cursor: pointer; -webkit-user-select: none; user-select: none;' +
      (!props.checkable ? ' pointer-events: none;' : '')
    "
    :color="
      (marksStore.markColorMap[mark]?.color || 'yellow') +
      (props.marksSelectedValues.includes(mark) ? '-inverse' : '')
    "
    @click="
      props.marksSelectedValues.includes(mark)
        ? emit(
            'onSelectChange',
            props.marksSelectedValues.filter((it) => it != mark)
          )
        : emit('onSelectChange', props.marksSelectedValues.concat([mark]))
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
