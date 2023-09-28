import Icon from '@ant-design/icons-vue/lib/components/Icon';
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    active: boolean
    closeable?: boolean
  }>(),
  {
    closeable: true
  }
)

defineSlots<{
  default(): never
  icon(): never
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div :class="['tab-container', { active: props.active }]">
    <div :class="['bg']">
      <LayoutAdminTabsChromeBg />
    </div>
    <div :class="['inner', { 'no-closeable': !props.closeable }]">
      <div v-if="!!$slots['icon']" class="icon"><slot name="icon" /></div>
      <slot />
    </div>
    <div
      v-if="props.closeable"
      class="closeable"
      @click="
        (e) => {
          e.stopPropagation()
          emit('close')
        }
      "
    >
      <div class="icon" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tab-container {
  @apply -mr-18px h-full relative inline-flex z-0 cursor-pointer;

  .bg {
    @apply absolute w-full h-full left-0 top-0 -z-1 color-transparent;
  }

  &:hover {
    .bg {
      @apply color-slate-200;
    }
  }

  .inner {
    @apply relative h-full w-auto flex items-center text-sm pl-11 pr-13;

    &.no-closeable {
      @apply pr-10;
    }

    .icon {
      @apply absolute left-4.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center;
    }
  }

  .closeable {
    @apply inline-flex absolute h-5 w-5 right-3.6 top-1/2 -translate-y-1/2 cursor-pointer;
    @apply items-center justify-center rounded-full;

    .icon {
      @apply i-ic-round-close h-4 w-4;
    }

    &:hover {
      @apply bg-slate-300 rounded-full;
    }
  }

  &.active {
    .bg {
      @apply color-purple-50 -z-1;
    }

    &:hover .bg {
      @apply color-purple-50;
    }

    .inner {
      @apply text-purple-900  font-bold rounded-t-3;
    }

    .closeable {
      @apply text-purple-900;

      &:hover {
        @apply bg-purple-200 rounded-full;
      }
    }
  }
}
</style>
