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

        <div class="content">
          <slot />
        </div>
      </div>
    </LayoutAdminProvider>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  @apply min-h-100vh h-auto w-full flex shrink-0 bg-slate-100;
  @apply dark:bg-black;

  .sidebar {
    @apply md:w-1/6 lg:w-1/7 z-1 bg-white shadow-md;
  }

  .main {
    @apply flex-1;
  }
}
</style>
