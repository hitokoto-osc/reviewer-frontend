<script setup lang="ts">
import type { AdminRouteItem } from '@/composables/routes/admin'
import { cloneDeep } from 'lodash-es'
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

const cachedRoutes = useState<AdminRouteItem[]>('admin_routes', () =>
  cloneDeep(routes)
)
provide('adminCtx', readonly(adminCtx))
provide('navigateToByKey', async (key: string | null) => {
  const item = cachedRoutes.value.find((item) => item.key === key)
  // console.log(item)
  if (item) {
    await navigateTo(item.route)
  }
})

watch(
  () => route.fullPath,
  (val) => {
    // console.log(val, route.path)
    const index = routes.findIndex(
      (item) => trimEnd(item.route, '/') === trimEnd(route.path, '/')
    )
    // console.log(index, routes)
    if (index > -1) {
      adminCtx.active = cachedRoutes.value[index].key
      cachedRoutes.value[index].route = val // update route
      // console.log(val)
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
