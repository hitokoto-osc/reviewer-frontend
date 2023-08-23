<script lang="ts" setup>
const mobileMenuDrawerShow = ref(false)
</script>
<template>
  <header class="header-container">
    <MobileMenuHamburgerButton
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
  </header>
  <MobileMenuDrawer v-model:show="mobileMenuDrawerShow" />
</template>

<style lang="scss" scoped>
.header-container {
  @apply h-16 w-full bg-white flex justify-center border-b-1 shadow-sm shadow-slate-200 relative;

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
      }
    }
  }
}
</style>
