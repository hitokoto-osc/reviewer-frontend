<script setup lang="ts">
import { Button } from 'ant-design-vue'
const { $pwa } = useNuxtApp()
onMounted(() => {
  if ($pwa.offlineReady) {
    message.info('应用已准备好在离线状态下工作。')
  }
})
watch(
  () => $pwa.needRefresh,
  (val) => {
    if (!val) return
    const key = 'pwa-update-prompt'
    notification.open({
      message: '应用存在更新',
      description: '新内容可用，请点击重新加载按钮以更新',
      btn: () =>
        h(
          Button,
          {
            type: 'primary',
            size: 'small',
            onClick: () => {
              $pwa.updateServiceWorker()
              notification.close(key)
            }
          },
          { default: () => '重新加载' }
        ),
      key: key,
      duration: null,
      onClose: close
    })
  }
)
</script>
<template>
  <div />
</template>
