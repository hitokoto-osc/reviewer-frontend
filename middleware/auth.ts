import { useUserStore } from '@/stores/useUserStore'
import { useUserInfoReq } from '@/composables/api'
// import { message } from 'ant-design-vue'

export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore()
  // const [messageAPI] = message.useMessage()
  if (userStore.isExpired) {
    return navigateTo('/auth/login')
  }

  const { data } = await useUserInfoReq()
  if (!data.value || data.value?.code != 0) {
    userStore.clear()
    return navigateTo('/auth/login')
  }
  userStore.setUser(data.value.data)
  userStore.renew()
})
