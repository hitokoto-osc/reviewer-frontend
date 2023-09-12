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
  @apply h-16 w-full flex justify-center  shrink-0;
  @apply dark:text-white dark:text-opacity-85;
  @apply relative;

  .header-background {
    @apply absolute left-0 top-0 h-16 w-full -z-1000;
    @apply bg-transparent;
  }
}
</style>
