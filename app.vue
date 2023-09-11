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
</style>
