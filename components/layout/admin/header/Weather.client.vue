<script setup lang="ts">
// const scriptURL =
//   'https://widget.qweather.net/simple/static/js/he-simple-common.js?v=2.0'
const config = {
  CONFIG: {
    modules: '01234',
    background: '1',
    tmpColor: 'FFFFFF',
    tmpSize: '16',
    cityColor: 'FFFFFF',
    citySize: '16',
    aqiColor: 'FFFFFF',
    aqiSize: '16',
    weatherIconSize: '24',
    alertIconSize: '18',
    padding: '10px 10px 10px 10px',
    shadow: '1',
    language: 'auto',
    borderRadius: '15',
    fixed: 'false',
    vertical: 'top',
    horizontal: 'left',
    key: '1d61fb399b9d407fa576f612c6448e1b'
  }
}
// const divRef = ref<HTMLDivElement | null>(null)

// watch(
//   () => divRef.value,
//   async (div) => {
//     if (div) {

//     }
//   }
// )
useHead({
  script: [
    {
      src: 'https://widget.qweather.net/simple/static/js/he-simple.js?v=1.4.0',
      async: true,
      defer: true
    }
  ],
  link: [
    {
      rel: 'stylesheet',
      href: 'https://widget.qweather.net/simple/static/css/he-simple.css?v=1.4.0'
    }
  ]
})

onMounted(async () => {
  console.log('loading weather script...')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore ts(2339)
  window.WIDGET = config
  // await loadScript(scriptURL)
})

onUnmounted(() => {
  // console.log('unloading weather script...')
  // removeScript(scriptURL)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore ts(2339)
  delete window.WIDGET
})
</script>
<template>
  <div id="he-plugin-simple" ref="divRef"></div>
</template>

<style lang="scss">
#he-plugin-simple,
#weather-view-he {
  @apply z-1000;
}
</style>
