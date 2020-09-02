import axios from 'axios'
import { Context } from '@nuxt/types'
export default async function ({ app, store, redirect }: Context) {
  let token
  if (process.server) {
    token = app.$cookies.get('token')
  } else {
    token = store.state.token.token || app.$cookies.get('token') || ''
  }
  if (!token || token.length !== 40) {
    // console.log('無 token')
    return redirect('/')
  }

  const response = await axios.get('https://poll.hitokoto.cn/v1/user/' + token)
  if (response.data.Code !== 200) {
    // console.log('令牌失效')
    store.commit('token/unset')
    return redirect('/')
  }
  store.commit('token/set', token)
  app.$cookies.set('token', token, {
    maxAge: 60 * 60 * 24 * 30,
  })
}
