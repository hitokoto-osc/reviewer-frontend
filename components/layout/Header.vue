<template>
  <header class="header-container">
    <div class="header">
      <div class="logo-container">
        <img src="~assets/img/logo.svg" draggable="false" class="logo" />
        <span class="name"> 审核员中心 </span>
      </div>
      <div class="menu">
        <div class="menu-item">主站</div>
        <div class="menu-item">反馈</div>
        <div class="menu-item">Github</div>
      </div>
      <div class="account-container">
        <ClientOnly>
          <a-dropdown>
            <div class="account">
              <span class="username"> a632079 </span>
              <div class="avatar-wrapper">
                <img
                  src="https://cravatar.cn/avatar/eccf8110b225c1ee784ba603e11213b5?d=mm&s=500"
                  draggable="false"
                  class="avatar"
                />
              </div>
            </div>

            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:;">设置</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">登出</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header-container {
  @apply h-16 w-full bg-white flex justify-center border-b-1;

  .header {
    @apply flex h-full w-full md:w-80% lg:w-70%;

    .logo-container {
      @apply h-full w-full lg:w-fit flex items-center justify-center cursor-pointer;

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

      .menu-item {
        @apply text-sm mx-3 py-3 px-5 cursor-pointer hover:bg-gray-100 rounded-2 select-none;
      }
    }

    .account-container {
      @apply h-full display-none md:flex w-fit items-center justify-center cursor-pointer;

      .account {
        @apply flex w-fit items-center px-3 py-1 hover:bg-gray-100 rounded-2;

        .username {
          @apply text-sm mr-3;
        }

        .avatar-wrapper {
          @apply h-11 h-11 p-0.5 flex items-center justify-center rounded-full border-gray-200 border-1 border-solid;

          .avatar {
            @apply h-full w-full rounded-full;

            -webkit-user-drag: none;
          }
        }
      }
    }
  }
}
</style>
