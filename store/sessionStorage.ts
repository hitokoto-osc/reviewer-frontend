import { VuexModule, Module } from 'vuex-module-decorators'

@Module({
  name: 'sessionStorage',
  stateFactory: true,
  namespaced: true,
})
export default class sessionStorage extends VuexModule {}
