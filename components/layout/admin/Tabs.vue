<script lang="ts" setup>
import type { AdminContext } from './Provider.vue'
import { Sortable } from 'sortablejs-vue3'
import type { SortableOptions } from 'sortablejs'
export interface Tab {
  key: string
  name: string
  icon?: VNode | (() => VNode)
  closeable?: boolean
}

const ctx = inject<AdminContext>('adminCtx')
if (!ctx) throw new Error('adminCtx is not provided')
const navigateToByKey =
  inject<(key: string) => Promise<void>>('navigateToByKey')!

const state = reactive({
  active: null as string | null,
  tabs: [] as Tab[]
})

watch(
  () => ctx.active,
  (val) => {
    state.active = val
  },
  {
    immediate: true
  }
)

watch(
  () => state.active,
  (val) => {
    console.log(val)
    if (!state.tabs.find((item) => item.key === val)) {
      const item = ctx.routes.find((item) => item.key === val)
      if (item) {
        state.tabs.push({
          key: item.key,
          name: item.name,
          icon: item.icon,
          closeable: item.closeable === undefined ? true : item.closeable
        })
      }
    }
    if (val) navigateToByKey(val)
  },
  {
    immediate: true
  }
)

// watchEffect(() => console.log(state.tabs))

const onClose = (tab: Tab) => {
  const index = state.tabs.findIndex((item) => item.key === tab.key)
  if (tab.key === state.active) {
    if (index > 0) {
      state.active = state.tabs[index - 1].key
    } else if (index === 0 && state.tabs.length > 1) {
      state.active = state.tabs[index + 1].key
    } else {
      state.active = null
    }
  }
  state.tabs = state.tabs.filter((item) => item.key !== tab.key)
}

const onClick = (tab: Tab) => {
  state.active = tab.key
}

// Sortable Tabs
const moveItem = <T,>(array: T[], from: number, to: number) => {
  const item = array.splice(from, 1)[0]
  array.splice(to, 0, item)
}
const sortableOptions: SortableOptions = reactive({
  onEnd(event) {
    moveItem(state.tabs, event.oldIndex!, event.newIndex!)
  }
})

// refresh
const refreshing = ref(false)
const refreshAll = async () => {
  refreshing.value = true
  try {
    await refreshNuxtData()
  } finally {
    refreshing.value = false
  }
}
</script>

<template>
  <div class="tabs">
    <Sortable
      :list="state.tabs"
      item-key="key"
      :options="sortableOptions"
      class=":uno: flex-1 h-full pt-2"
    >
      <template #item="{ element: tab }">
        <LayoutAdminTabsElement
          :key="tab.key"
          :active="state.active === tab.key"
          :closeable="tab.closeable"
          @click="onClick(tab)"
          @close="onClose(tab)"
        >
          <template v-if="tab.icon" #icon>
            <component :is="tab.icon" />
          </template>
          {{ tab.name }}
        </LayoutAdminTabsElement>
      </template>
    </Sortable>

    <div class="refresh-action">
      <div class="icon-wrapper group" @click="refreshAll">
        <div
          :class="[
            'icon group-hover:animate-spin',
            { 'animate-spin': refreshing }
          ]"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tabs {
  @apply flex h-11  bg-white border-0 border-b-1 border-solid border-#f0f0f0 px-2 z-0 transition-all duration-300;
  @apply dark:border-#303030 dark:bg-#141414;

  .refresh-action {
    @apply h-full mr-1.5 inline-flex items-center;

    .icon-wrapper {
      @apply p-1.5 hover:bg-gray-100 rounded-md cursor-pointer transition-all duration-300 ease-in-out;

      .icon {
        @apply i-ic-round-refresh w-5.5 h-5.5;
      }
    }
  }
}
</style>
