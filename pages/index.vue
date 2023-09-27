<script setup lang="ts">
definePageMeta({
  layout: 'index'
})
useHead({
  title: '一言审核员中心'
})
</script>
<template>
  <div class="tips">
    <div class="banner">一言审核员中心</div>
    <div class="tip">
      <div class="i-ic-round-construction inline-block"></div>
      首页施工中……
    </div>
    <a-button
      class="button"
      type="primary"
      size="large"
      @click="navigateTo('/dashboard')"
    >
      进入控制台
    </a-button>
  </div>
</template>

<style lang="scss" scoped>
.tips {
  @apply w-full flex mt-15 md:mt-20 items-center flex-col;

  .banner {
    @apply bg-clip-text bg-gradient-to-r from-cyan-400 from-10% via-purple-400 via-50% to-fuchsia-300 to-90% font-bold text-5xl text-transparent select-none;
  }

  .tip {
    @apply text-2xl mt-10 inline-flex items-center;

    div {
      @apply mr-2 w-10 h-10;
    }
  }

  .button {
    @apply mt-5;
  }
}
</style>
