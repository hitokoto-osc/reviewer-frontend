import { VuexModule, Module } from 'vuex-module-decorators'

@Module({
  name: 'localStorage',
  stateFactory: true,
  namespaced: true,
})
export default class localStorage extends VuexModule {}
