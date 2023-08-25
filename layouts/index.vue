<script setup lang="ts"></script>

<template>
  <div class="layout">
    <LayoutHeader />

    <main class="main">
      <slot />
    </main>

    <footer></footer>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  @apply h-full w-full flex flex-col bg-slate-100 shrink-0;
}

.main {
  @apply mt-3 md:mt-15 mx-auto w-full md:w-80% lg:w-70% flex-1 flex shrink-0;

  .content {
    @apply min-h-full flex-1 py-5 px-10;
  }
}
</style>
