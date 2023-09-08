<script setup lang="ts">
import type { Item } from '@/components/menu'
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
const items: Item[] = [
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
    <MenuContainer
      v-if="userStore.user && !userStore.isExpired"
      :items="items"
      class=":uno: flex items-center justify-center"
    >
      <LayoutHeaderAccountInfo />
    </MenuContainer>
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
}
</style>
