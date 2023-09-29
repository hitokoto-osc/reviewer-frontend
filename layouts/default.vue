<script setup lang="ts"></script>

<template>
  <div class="layout">
    <div class="header-placeholder block md:hidden" />
    <LayoutHeader />

    <main class="main">
      <div class="sidebar">
        <ClientOnly>
          <LayoutDashboardMenu />
        </ClientOnly>
      </div>
      <div class="content">
        <slot />
      </div>
    </main>
    <div class="actions">
      <BackToTop class="absolute bottom-5 left-5" />
    </div>
    <footer></footer>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  @apply min-h-100vh h-auto w-full flex flex-col shrink-0 bg-slate-100;
  @apply dark:bg-black;

  .header-placeholder {
    @apply h-16 w-full bg-white dark:bg-dark-700;
  }

  .actions {
    @apply fixed right-0 hidden md:block;
    @apply h-100vh  md:w-5% lg:w-10% xl:w-15%;
  }

  .main {
    @apply mt-3 md:mt-15 mx-auto w-full md:w-90% lg:w-80% xl:w-70%  bg-white md:rounded-t-4 border-2 shadow-sm shadow-slate-100;
    @apply dark:bg-#141414 dark:shadow-sm dark:shadow-dark-100 dark:text-white dark:text-opacity-85;
    @apply flex-1 flex shrink-0;

    .sidebar {
      @apply w-0 hidden md:block md:w-1/4 lg:w-1/5 rounded-l-4 border-0 border-r-1 border-solid border-#f0f0f0;
      @apply dark:border-#303030;
    }

    .content {
      @apply w-full flex-1 py-5 px-10;
    }
  }
}
</style>
