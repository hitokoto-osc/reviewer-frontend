<script lang="ts" setup>
import { Fancybox } from '@fancyapps/ui'
import type { OptionsType } from '@fancyapps/ui/types/Fancybox/options'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

const container = ref<HTMLElement | null>(null)
const props = defineProps<{
  options?: Partial<OptionsType>
}>()

onMounted(() => {
  if (!container.value) return
  Fancybox.bind(container.value, '[data-fancybox]', {
    ...(props.options || {})
  })
})

onUpdated(() => {
  if (!container.value) return
  Fancybox.unbind(container.value)
  Fancybox.close()

  Fancybox.bind(container.value, '[data-fancybox]', {
    ...(props.options || {})
  })
})

onUnmounted(() => {
  if (!container.value) return
  Fancybox.unbind(container.value)
  Fancybox.close()
})
</script>

<template>
  <div ref="container">
    <slot></slot>
  </div>
</template>
