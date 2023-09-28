import { useUserStore } from '@/stores/user'
import { useUserInfoReq } from '@/composables/api'
// import { message } from 'ant-design-vue'

export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore()
  const nuxtApp = useNuxtApp()
  // const [messageAPI] = message.useMessage()
  if (userStore.isExpired) {
    if (process.client && !nuxtApp.isHydrating) {
      message.error('登录已过期，请重新登录')
    }
    await sleep(3000)
    return await navigateTo('/auth/login')
  }

  const { data } = await useUserInfoReq()
  if (!data.value || data.value?.code != 0) {
    if (process.client && !nuxtApp.isHydrating) {
      message.error('登录已过期，请重新登录')
    }
    userStore.clear()
    await sleep(3000)
    return await navigateTo('/auth/login')
  }
  userStore.setUser(data.value.data)
  userStore.renew()
})
