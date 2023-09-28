<script setup lang="ts">
import type { ItemType } from 'ant-design-vue'

const route = useRoute()

const props = withDefaults(
  defineProps<{
    items: ItemType[]
    routesMap?: Map<string, string>
    active?: string | null
    defaultSelectedKeys?: string[]
    defaultOpenKeys?: string[]
  }>(),
  {
    active: undefined,
    routesMap: undefined,
    defaultSelectedKeys: () => [],
    defaultOpenKeys: () => []
  }
)

const emit = defineEmits<{
  'update:active': [key: string] // Only if the routesMap is not set and active is set
}>()

const state = reactive({
  selectedKeys: [] as string[],
  openKeys: [] as string[]
})
state.selectedKeys = toRaw(props.defaultSelectedKeys)
state.openKeys = toRaw(props.defaultOpenKeys)
if (props.active !== undefined) {
  state.selectedKeys = props.active ? [props.active] : []
}

watch(
  () => props.active,
  (val) => {
    if (val !== undefined) {
      state.selectedKeys = val ? [val] : []
    }
  }
)

const getKeyByRoute = (route: string) => {
  for (const [key, value] of props.routesMap!) {
    if (value === route) return key
  }
  return ''
}

watchEffect(() => {
  if (!props.routesMap) return
  const key = getKeyByRoute(route.path)
  if (key) {
    state.selectedKeys = [key]
  }
})

watch(
  () => state.selectedKeys,
  async (val, old) => {
    const key = val[0]
    if (key && props.routesMap) {
      const target = props.routesMap.get(key)
      if (target && target.startsWith('/')) {
        if (target !== route.path) await navigateTo(target)
      } else {
        // reset selectedKeys
        state.selectedKeys = old
        window.open(target, '_blank')
      }
    } else {
      emit('update:active', key)
    }
  }
)

// watch(openKeys, (val) => {
//   console.log('openKeys', val)
// })
</script>
<template>
  <a-menu
    v-model:openKeys="state.openKeys"
    v-model:selectedKeys="state.selectedKeys"
    class="menu !border-e-0"
    mode="inline"
    :items="items"
    force-sub-menu-render
  ></a-menu>
</template>

<style lang="scss" scoped>
.menu {
  @apply h-full w-full rounded-l-4;
}
</style>
