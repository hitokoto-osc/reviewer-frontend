<script setup lang="ts">
import type { AdminRouteItem } from '@/composables/routes/admin'
const routes = useAdminRoutes()

export interface AdminContext {
  active: string | null
  routes: AdminRouteItem[]
}
const route = useRoute()
// console.log(route, routes);
const adminCtx = reactive<AdminContext>({
  active: null,
  routes: routes
})

provide('adminCtx', readonly(adminCtx))
provide('navigateToByKey', async (key: string | null) => {
  const item = routes.find((item) => item.key === key)
  if (item) {
    await navigateTo(item.route)
  }
})

watch(
  () => route.path,
  (val) => {
    const item = routes.find(
      (item) => trimEnd(item.route, '/') === trimEnd(val, '/')
    )
    if (item) {
      adminCtx.active = item.key
    }
  },
  {
    immediate: true
  }
)

watch(
  () => adminCtx.active,
  (val) => {
    if (val) {
      navigateTo(routes.find((item) => item.key === val)!.route)
    }
  }
)
</script>

<template>
  <slot />
</template>
