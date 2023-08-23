<script lang="ts" setup>
const userStore = useUserStore()
const [messageAPI] = message.useMessage()
const doLogout = () => {
  userStore.clear()
  messageAPI.info('您已登出，即将跳转到首页')
  setTimeout(() => {
    navigateTo('/')
  }, 3000)
}
</script>
<template>
  <header class="header-container">
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
      <div class="account-container">
        <template v-if="userStore.user && !userStore.isExpired">
          <ClientOnly>
            <a-dropdown>
              <div class="account">
                <span class="username"> {{ userStore.user?.name }} </span>
                <div class="avatar-wrapper">
                  <img
                    :src="getAvatarURL(userStore.user?.email || '')"
                    draggable="false"
                    class="avatar"
                  />
                </div>
              </div>

              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a
                      href="https://hitokoto.cn/dashboard/#/user/settings"
                      target="_blank"
                    >
                      设置
                    </a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="doLogout">登出</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </ClientOnly>
        </template>
        <div v-else class="menu-item">
          <NuxtLink to="/auth/login">登录</NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header-container {
  @apply h-16 w-full bg-white flex justify-center border-b-1 shadow-sm shadow-slate-200;

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
    }

    .menu-item {
      @apply text-sm mx-3;

      a {
        @apply no-underline text-current py-3 px-5 cursor-pointer hover:bg-gray-100 rounded-2 select-none;
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
