<script setup></script>
<template>
  <div class="layout">
    <LayoutAdminProvider>
      <div class="sidebar">
        <LayoutAdminMenu />
      </div>
      <div class="main">
        <LayoutAdminHeader />
        <LayoutAdminTabs />

        <div class=":uno: mt-27 px-4 pt-4 flex flex-col flex-1">
          <slot />
        </div>
      </div>
    </LayoutAdminProvider>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  @apply min-h-100vh h-auto w-full bg-slate-100 relative;
  @apply dark:bg-black;

  .sidebar {
    @apply fixed left:0 h-100vh md:w-1/6 lg:w-1/7 z-3 bg-white shadow-md;
  }

  .main {
    @apply md:w-5/6 md:ml-1/6 lg:w-6/7 lg:ml-1/7 flex flex-col pb-4;
  }
}
</style>
