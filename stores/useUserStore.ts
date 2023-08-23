import { UserInfoRes } from 'composables/api'
import dayjs from 'dayjs'

export interface UserState {
  user?: UserInfoRes
  token: string
  expiredAt: number
}

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: {},
      token: '',
      expiredAt: 0
    } as UserState
  },
  getters: {
    isExpired: (state) => {
      return (
        !state.token ||
        state.token.length !== 40 ||
        dayjs().isAfter(dayjs(state.expiredAt))
      )
    }
  },
  actions: {
    setUser(user: UserInfoRes) {
      this.user = user
    },
    setToken(token: string) {
      this.token = token
      this.expiredAt = dayjs().add(1, 'month').valueOf()
    },

    clear() {
      this.token = ''
      this.expiredAt = 0
    },

    renew() {
      this.expiredAt = dayjs().add(1, 'month').valueOf()
    }
  },
  persist: true
})
