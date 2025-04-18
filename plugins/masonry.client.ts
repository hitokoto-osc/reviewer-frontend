// @ts-expect-error lib misconfigure pkg
import Masonry from 'vue-next-masonry'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Masonry, null)
})
