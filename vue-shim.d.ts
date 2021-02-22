/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NuxtCookies } from 'cookie-universal-nuxt'
import Vue from 'vue'

declare module '*.vue' {
  export default Vue
}

declare module 'vue/types/vue' {
  interface Vue {
    $cookies: NuxtCookies
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $cookies: NuxtCookies
  }
}

// Nuxt.js component options
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    layout?: string
    auth?: boolean
  }
}
