import { VuexModule, Module, Mutation } from 'vuex-module-decorators'
import moment from 'moment'

@Module({
  name: 'token',
  stateFactory: true,
  namespaced: true,
})
export default class Token extends VuexModule {
  token = ''
  expiredAt = 0

  @Mutation
  set(token: string) {
    this.token = token
    this.expiredAt = moment().add(1, 'months').valueOf()
  }

  @Mutation
  unset() {
    this.token = ''
    this.expiredAt = 0
  }
}
export interface TokenStruct {
  token: string
  // eslint-disable-next-line camelcase
  expiredAt: number
}
