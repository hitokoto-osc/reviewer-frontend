<script lang="ts" setup>
// 拉取必应图片
const { pending, error, data } = useBingImage()
const background = ref('')
watchEffect(() => {
  if (data.value) {
    background.value = `url(https://cn.bing.com/${
      data.value.images[Math.floor(Math.random() * data.value.images.length)]
        .url
    }) no-repeat center / cover`
  }
})
</script>
<template>
  <div
    class="w-full h-100vh flex"
    :class="{
      'bg-slate-50 dark:bg-black': pending || error
    }"
    :style="{
      background: background
    }"
  >
    <div
      class="flex"
      shadow="md:2xl"
      bg="white/55 dark:dark-500/55"
      rounded="md:r-3xl"
      w="full md:1/3 lg:1/5"
      p="x-8 y-12"
      flex="col"
      :class="{
        'backdrop-blur-xl': background
      }"
    >
      <header class="flex items-center justify-center w-full">
        <div class="logo-container">
          <div
            :class="{
              'logo-bg': !background
            }"
          ></div>
          <img
            src="~assets/img/logo.svg"
            draggable="false"
            class="logo w-18 h-18"
          />
        </div>

        <span class="name"> 一言 </span>
      </header>
      <div class="flex-1 mt-15">
        <slot />
      </div>
      <footer
        class="text-center text-current text-inherit text-sm dark:text-white dark:text-opacity-80"
      >
        <div
          class="i-solar-heart-bold inline-block text-2xl text-red-600 animate__animated animate__heartBeat animate__infinite"
        ></div>
        <br />
        <a
          class="no-underline dark:text-purple-500"
          href="https://beian.miit.gov.cn/"
        >
          沪ICP备16031287号-1
        </a>
        <br />
        2023 &copy; MoeTeam All Rights Reserved.
      </footer>
    </div>
  </div>
</template>

<style scoped lang="scss">
.logo-container {
  @apply w-20 h-20 relative;

  .logo-bg {
    @apply w-full h-full rounded-full bg-gradient-135 from-cyan-500 via-purple-500 to-fuchsia-500 blur-2xl;
  }

  .logo {
    user-select: none;
    -webkit-user-drag: none;
    transform: translate(-50%, -50%);

    @apply absolute top-1/2 left-1/2;
  }
}

.name {
  @apply bg-clip-text bg-gradient-45 from-violet-400 via-purple-500 to-fuchsia-400 font-bold text-4xl text-transparent pl-4 select-none;
}
</style>
