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
  @apply h-full w-full flex flex-col shrink-0 bg-slate-100;
}

.main {
  @apply mt-3 md:mt-15 mx-auto w-full md:w-80% lg:w-70% flex-1 flex bg-white md:rounded-t-4 border-2 shadow-sm shadow-slate-100 h-full shrink-0;

  .sidebar {
    @apply h-full w-0 display-none md:block md:w-1/4 lg:w-1/5 rounded-l-4;
  }

  .content {
    @apply h-full flex-1 py-5 px-10;
  }
}
</style>
