<script lang="ts" setup>
import { debounce } from 'lodash-es'
const scrollTop = ref(0)
const props = withDefaults(
  defineProps<{
    threshold?: number
  }>(),
  {
    threshold: 100
  }
)
const getScrollTop = () => {
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  )
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  scrollTop.value = 0
}

const show = computed(() => scrollTop.value > props.threshold)

onMounted(() => {
  scrollTop.value = getScrollTop()
  window.addEventListener(
    'scroll',
    debounce(() => {
      scrollTop.value = getScrollTop()
    }, 10)
  )
})

// 环形进度条
const pageViewedPercent = computed(() => {
  const clientHeight =
    document.documentElement.clientHeight || document.body.clientHeight
  const scrollHeight = document.documentElement.scrollHeight
  return (scrollTop.value / (scrollHeight - clientHeight)) * 100
})
const getClipPathByPercent = (percent: number) => {
  /* 百分比与角度的关系
   * 100%对应360度->1%=3.6deg
   * 角度与周长的关系
   * 360度对应长度为800->0.45deg=1px
   * 百分比与周长的关系
   * 100%对应周长800->0.125%=1px
   * ----->1%=8px
   * 45deg=100px(角度对应的周长)=50%(clip-path中的百分比)
   * ------->100%(百分比值)=400%(clip-path中的百分比)
   */

  percent = percent * 4

  const k1 = 'polygon(50% 50%,50% 0%,'
  const k2 = k1 + '100% 0%,'
  const k3 = k2 + '100% 100%,'
  const k4 = k3 + '0% 100%,'
  const k5 = k4 + '0% 0%,'
  if (percent <= 50) {
    percent += 50
    return k1 + percent + '% 0%)'
  } else if (percent > 50 && percent <= 150) {
    percent -= 50
    return k2 + '100% ' + percent + '%)'
  } else if (percent > 150 && percent <= 250) {
    percent = 250 - percent
    return k3 + percent + '% 100%)'
  } else if (percent > 250 && percent <= 350) {
    percent = 350 - percent
    return k4 + '0% ' + percent + '%)'
  } else if (percent > 350 && percent <= 400) {
    percent -= 350
    return k5 + percent + '% 0%)'
  }
  return ''
}
const clipPath = computed(() => {
  return getClipPathByPercent(pageViewedPercent.value)
})
</script>
<template>
  <Transition
    name="fade"
    enter-active-class="animate__animated animate__bounceInUp"
    leave-active-class="animate__animated animate__bounceOutDown"
  >
    <div v-show="show" class="back-to-top" @click="scrollToTop">
      <div
        class="circular-progress"
        :style="{
          'clip-path': clipPath,
          '-webkit-clip-path': clipPath
        }"
      />
      <div class="i-solar-alt-arrow-up-linear"></div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.back-to-top {
  @apply z-50 cursor-pointer;
  @apply w-12 h-12 rounded-full bg-white flex items-center justify-center;
  @apply shadow-sm shadow-slate-200;

  .circular-progress {
    @apply absolute top-0 left-0;
    @apply w-12 h-12 rounded-full border-3 border-solid border-zinc-300;

    // clip-path: polygon(50% 0%, 50% 50%, 100% 50%, 100% 0%);
  }
}
</style>
