<script lang="ts" setup>
const mobileMenuDrawerShow = ref(false)
const userStore = useUserStore()
</script>
<template>
  <header class="header-container">
    <div class="header-background" />
    <!-- TODO: 先禁止未登录用户使用汉堡包菜单吧，之后改成抽屉内切换 -->
    <MobileMenuHamburgerButton
      v-if="!userStore.isExpired"
      @switch-drawer="mobileMenuDrawerShow = !mobileMenuDrawerShow"
    />
    <div class="header">
      <div class="logo-container" @click="navigateTo('/')">
        <img src="~assets/img/logo.svg" draggable="false" class="logo" />
        <span class="name"> 审核员中心 </span>
      </div>
      <div class="menu">
        <div class="menu-item">
          <a href="https://hitokoto.cn" target="_blank">主站</a>
        </div>
        <div class="menu-item">
          <a href="https://support.qq.com/products/120638/" target="_blank">
            反馈
          </a>
        </div>
        <div class="menu-item">
          <a href="https://github.com/hitokoto-osc" target="_blank"> Github </a>
        </div>
      </div>
      <LayoutHeaderAccountContainer />
    </div>
    <MobileMenuDrawer v-model:show="mobileMenuDrawerShow" />
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

  .header {
    @apply flex h-full w-full md:w-80% lg:w-70%;
    @apply justify-center md:jusitfy-start;

    .logo-container {
      @apply h-full w-fit flex items-center justify-center cursor-pointer;

      .logo {
        @apply h-10 w-10;

        -webkit-user-drag: none;
      }

      .name {
        @apply ml-2 text-xl font-bold select-none;
      }
    }

    .menu {
      @apply pl-5 flex-1 display-none md:flex h-full items-center;
    }

    .menu-item {
      @apply text-sm mx-3;

      a {
        @apply no-underline text-current py-3 px-5 cursor-pointer hover:bg-gray-100 rounded-2 select-none;
        @apply dark:hover:bg-dark-200;
      }
    }
  }
}
</style>
