<script setup lang="ts">
import { theme } from 'ant-design-vue'
import locale from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

const appConfig = useAppConfig()
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${appConfig.title}` : appConfig.title
  }
})

// 框架配置相关
const colorMode = useColorMode()
const AntdConfig = reactive({
  locale,
  theme: {
    ...theme.defaultConfig,
    token: {
      colorPrimary: '#8921ff'
    },
    algorithm: theme.darkAlgorithm
  }
})
const VantConfig = reactive<{
  theme: 'light' | 'dark'
}>({
  theme: 'light'
})
watchEffect(() => {
  if (colorMode.value === 'dark') {
    AntdConfig.theme.algorithm = theme.darkAlgorithm
    VantConfig.theme = 'dark'
  } else {
    AntdConfig.theme.algorithm = theme.defaultAlgorithm
    VantConfig.theme = 'light'
  }
})

// 切换 明亮/暗黑 模式
const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

const isDark = computed(() => colorMode.value === 'dark')

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions())
    colorMode.preference = isDark.value ? 'light' : 'dark'

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`
  ]

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore:ts(2339)
  await document.startViewTransition(async () => {
    colorMode.preference = isDark.value ? 'light' : 'dark'
    await nextTick()
    console.log(colorMode.preference, colorMode.value)
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 400,
      easing: 'ease-in',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
    }
  )
})
</script>

<template>
  <div class="app">
    <a-style-provider hash-priority="high">
      <a-config-provider v-bind="AntdConfig">
        <VanConfigProvider :theme="VantConfig.theme">
          <VitePwaManifest />
          <!-- <PwaPrompt /> -->
          <NuxtLayout>
            <NuxtLoadingIndicator />
            <NuxtPage />
          </NuxtLayout>
        </VanConfigProvider>
      </a-config-provider>
    </a-style-provider>
  </div>
</template>

<style lang="scss">
/* stylelint-disable-next-line selector-id-pattern */
.app {
  @apply w-full min-h-100vh;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  filter: blur(1rem);
  opacity: 0;
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}

.layout-enter-from,
.layout-leave-to {
  filter: grayscale(1);
}

/* dark/light radial transition */
::view-transition-old(root),
::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: none;
}

::view-transition-old(root),
.dark-mode::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark-mode::view-transition-old(root) {
  z-index: 9999;
}
</style>
