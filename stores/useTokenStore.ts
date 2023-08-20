import dayjs from 'dayjs'

export const useTokenStore = defineStore('token', {
  state: () => {
    return {
      token: '',
      expiredAt: 0
    }
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
