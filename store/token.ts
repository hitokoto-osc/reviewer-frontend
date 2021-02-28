import moment from 'moment'
export const state = () => ({
  token: '',
  expired_at: 0,
})

export interface Token {
  token: string
  // eslint-disable-next-line camelcase
  expired_at: number
}

export const mutations = {
  set(state: Token, token: string) {
    state.token = token
    state.expired_at = moment().add(1, 'months').valueOf()
  },
  unset(state: Token) {
    state.token = ''
    state.expired_at = 0
  },
}
