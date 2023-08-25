<script setup lang="ts">
// 登出部分
const userStore = useUserStore()
// TODO: 使用组合式 API 的 Message 接口
// const [messageAPI, ContextHolder] = message.useMessage()
const doLogout = () => {
  message.info('您已登出，即将跳转到首页')
  userStore.clear()
  setTimeout(() => {
    navigateTo('/')
  }, 1500)
}

// 账户设置菜单
export interface AccountMenuItem {
  icon?: string | VNode
  text: string
  onClick?: () => void
  to?: string
  href?: string
}
const items: AccountMenuItem[] = [
  {
    text: '控制台',
    to: '/dashboard'
  },
  {
    text: '设置',
    href: 'https://hitokoto.cn/dashboard/#/user/settings'
  },
  {
    text: '登出',
    onClick: () => {
      doLogout()
    }
  }
]
</script>

<template>
  <div class="account-container">
    <template v-if="userStore.user && !userStore.isExpired">
      <ClientOnly>
        <a-dropdown>
          <template #overlay>
            <LayoutHeaderAccountPCMenu :items="items" />
          </template>
          <LayoutHeaderAccountInfo class="account-pc-menu" />
        </a-dropdown>
      </ClientOnly>
      <LayoutHeaderAccountMobileMenu :items="items" />
    </template>
    <div v-else class="menu-item">
      <NuxtLink to="/auth/login">登录</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 从 Header 里偷的，这里一定注意
.menu-item {
  @apply text-sm mx-3;

  a {
    @apply no-underline text-current py-3 px-5 cursor-pointer hover:bg-gray-100 rounded-2 select-none;
  }
}

.account-container {
  @apply h-full flex w-fit items-center justify-center cursor-pointer;
  @apply absolute right-0 top-1/2 transform -translate-y-1/2;
  @apply md:static md:transform-none md:top-0 md:bottom-0;

  .account-pc-menu {
    @apply hidden md:flex;
  }
}
</style>
