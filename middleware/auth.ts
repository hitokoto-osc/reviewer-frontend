import axios from 'axios'
import { useUserStore } from 'stores/useUserStore'

export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore()
  if (userStore.isExpired) {
    return navigateTo('/')
  }

  const response = await axios.get(
    'https://poll.hitokoto.cn/v1/user/' + userStore.token
  )

  if (response.data.Code !== 200) {
    // console.log('令牌失效')
    userStore.clear()
    return navigateTo('/')
  }

  userStore.renew()
})
