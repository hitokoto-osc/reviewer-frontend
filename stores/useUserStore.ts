import { UserInfoRes } from 'composables/api'
import dayjs from 'dayjs'

export interface UserState {
  user?: UserInfoRes
  token: string
  expiredAt: number
}

const userRoleFormatter: Record<string, string> = {
  admin: '管理员',
  reviewer: '审核员',
  user: '普通用户'
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
    },
    role: (state) => {
      return state.user?.role
        ? userRoleFormatter[state.user.role] || state.user.role
        : '游客'
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
