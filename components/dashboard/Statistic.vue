<script lang="ts" setup>
import CountUp from 'vue-countup-v3'
const slots = defineSlots<{
  prefix?: () => VNode | (() => VNode)
  suffix?: () => VNode | (() => VNode)
}>()
const props = withDefaults(
  defineProps<{
    title: string
    value: number | string
    // CountUp
    useCountUp?: boolean

    decimalPlaces?: number
    startVal?: number
  }>(),
  {
    useCountUp: false,
    decimalPlaces: 0,
    startVal: 0
  }
)
</script>

<template>
  <div class="statistic">
    <div class="title">{{ props.title }}</div>
    <div class="content">
      <template v-if="props.useCountUp">
        <CountUp
          :start-val="props.startVal"
          :end-val="props.value"
          :decimal-places="props.decimalPlaces"
        >
          {{ props.value }}
          <template v-if="slots.prefix" #prefix>
            <span class="prefix">
              <slot name="prefix" />
            </span>
          </template>
          <template v-if="slots.suffix" #suffix>
            <span class="suffix">
              <slot name="suffix" />
            </span>
          </template>
        </CountUp>
      </template>
      <span v-else class="value">
        {{ props.value }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.statistic {
  @apply leading-normal;

  .title {
    @apply text-14px mb-4px text-black text-opacity-45;
  }

  .content {
    .value,
    .countup-wrap {
      @apply text-24px text-black text-opacity-88;

      .suffix {
        @apply ms-4px inline-block;
      }

      .prefix {
        @apply me-4px inline-block;
      }
    }
  }
}
</style>
