<script setup lang="ts"></script>

<template>
  <div class="layout">
    <LayoutHeader />

    <main class="main">
      <div class="sidebar">
        <ClientOnly>
          <LayoutMenu />
        </ClientOnly>
      </div>
      <div class="content">
        <slot />
      </div>
    </main>

    <footer></footer>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  @apply min-h-100vh h-auto w-full flex flex-col shrink-0 bg-slate-100;
}

.main {
  @apply mt-3 md:mt-15 mx-auto w-full md:w-90% lg:w-80% xl:w-70%  bg-white md:rounded-t-4 border-2 shadow-sm shadow-slate-100;
  @apply flex-1 flex shrink-0;

  .sidebar {
    @apply w-0 display-none md:block md:w-1/4 lg:w-1/5 rounded-l-4;
  }

  .content {
    @apply flex-1 py-5 px-10;
  }
}
</style>
