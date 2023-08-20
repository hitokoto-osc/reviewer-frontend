import axios from 'axios'

export default defineNuxtRouteMiddleware(async () => {
  const tokenStore = useTokenStore()
  if (tokenStore.isExpired) {
    return navigateTo('/')
  }

  const response = await axios.get(
    'https://poll.hitokoto.cn/v1/user/' + tokenStore.token
  )

  if (response.data.Code !== 200) {
    // console.log('令牌失效')
    tokenStore.clear()
    return navigateTo('/')
  }

  tokenStore.renew()
})
