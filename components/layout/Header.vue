<script lang="ts" setup></script>
<template>
  <header class="header-container">
    <div class="header-background" />
    <!-- TODO: 先禁止未登录用户使用汉堡包菜单吧，之后改成抽屉内切换 -->
    <LayoutHeaderContent />
  </header>
</template>

<style lang="scss" scoped>
.header-container {
  @apply h-16 w-full flex justify-center border-b-1 shadow-sm shadow-slate-200 shrink-0;
  @apply dark:border-dark-500 dark:shadow-dark-500 dark:text-white dark:text-opacity-85;
  @apply fixed top-0 md:relative z-1000;

  .header-background {
    @apply absolute left-0 top-0 h-16 w-full -z-1000;
    @apply bg-white bg-opacity-70 backdrop-saturate-50 backdrop-blur-8 md:bg-opacity-100;
    @apply dark:bg-dark-700 dark:bg-opacity-70 dark:md:bg-opacity-100;
  }
}
</style>
