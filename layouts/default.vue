<script setup lang="ts">
import type { VueElement } from 'vue'
import type { ItemType } from 'ant-design-vue/es'
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'

function getItem(
  label: VueElement | string,
  key: string,
  icon?: unknown,
  children?: ItemType[],
  type?: 'group'
): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type
  } as ItemType
}

const items: ItemType[] = reactive([
  getItem('Navigation One', 'sub1', () => h(MailOutlined), [
    getItem(
      'Item 1',
      'g1',
      null,
      [getItem('Option 1', '1'), getItem('Option 2', '2')],
      'group'
    ),
    getItem(
      'Item 2',
      'g2',
      null,
      [getItem('Option 3', '3'), getItem('Option 4', '4')],
      'group'
    )
  ]),

  getItem('Navigation Two', 'sub2', () => h(AppstoreOutlined), [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [
      getItem('Option 7', '7'),
      getItem('Option 8', '8')
    ])
  ]),

  { type: 'divider' },

  getItem('Navigation Three', 'sub4', () => h(SettingOutlined), [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Option 11', '11'),
    getItem('Option 12', '12')
  ]),

  getItem(
    'Group',
    'grp',
    null,
    [getItem('Option 13', '13'), getItem('Option 14', '14')],
    'group'
  )
])
</script>

<template>
  <div class="layout">
    <LayoutHeader />

    <main class="main">
      <div class="sidebar">
        <ClientOnly>
          <a-menu class="menu" mode="inline" :items="items"></a-menu>
        </ClientOnly>
      </div>
      <div class="content">
        <slot />
      </div>
    </main>

    <footer></footer>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  @apply h-full w-full flex flex-col bg-slate-100;
}

.main {
  @apply mt-3 md:mt-15 mx-auto w-full md:w-80% lg:w-70% flex-1 flex bg-white md:rounded-t-4 border-2 shadow-sm;

  .sidebar {
    @apply h-full w-0 md:w-1/4 lg:w-1/5 rounded-l-4;

    .menu {
      @apply h-full w-full rounded-l-4;
    }
  }

  .content {
    @apply h-full w-full md:w-3/4;
  }
}
</style>
