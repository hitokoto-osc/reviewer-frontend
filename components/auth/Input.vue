<script lang="ts" setup>
const props = defineProps<{
  iconClass: string | undefined
  modelValue: string
  type: string
  name?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
}>()

const classNames = computed(() => {
  return [props.iconClass]
})
</script>

<template>
  <div class="input-group">
    <div class="icon">
      <div
        class="w-7 h-7 inline-block text-current dark:text-white dark:text-opacity-80"
        :class="classNames"
      ></div>
    </div>
    <input
      :value="props.modelValue"
      :name="props.name"
      class="input"
      :type="props.type"
      :placeholder="props.placeholder"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement)?.value)
      "
      @blur="emit('blur', $event)"
    />
    <label class="input-border" />
  </div>
</template>

<style lang="scss" scoped>
.icon {
  @apply w-7 h-7 absolute left-0 top-1/2 transform -translate-y-1/2;
}

.input-group {
  @apply relative;
}

.input-border {
  @apply absolute bottom-0 w-0 bg-white transition-all duration-300 ease-in-out left-1/2;
  @apply dark:bg-dark;

  height: 1px;
}

.input {
  @apply h-12 w-full bg-transparent outline-none border-0 border-b-1 border-gray-200 pl-10 text-current rounded-0;
  @apply dark:border-dark-900 dark:text-white dark:text-opacity-80;

  &:focus {
    + .input-border {
      @apply w-full bg-purple-500 left-0;
    }
  }
}
</style>
