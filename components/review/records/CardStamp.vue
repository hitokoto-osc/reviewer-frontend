<script setup lang="ts">
import { PollStatus } from '@/enums/poll'
const props = defineProps<{
  pollStatus: PollStatus
}>()
</script>
<template>
  <div class="stamp">
    <div
      class="icon"
      :class="{
        approve: props.pollStatus === PollStatus.Approved,
        reject: props.pollStatus === PollStatus.Rejected,
        'need-modify': props.pollStatus === PollStatus.NeedModify
      }"
    ></div>
  </div>
</template>
<style lang="scss" scoped>
.stamp {
  @apply flex items-center justify-center  absolute -right-10 -top-15;

  .icon {
    @apply h-38 w-38 z-1 opacity-25;
  }
}

.approve {
  @apply i-solar-check-circle-bold bg-green-500;
}

.reject {
  @apply i-solar-close-circle-bold bg-red-500;
}

.need-modify {
  @apply i-solar-text-circle-bold bg-yellow-500;
}
</style>
