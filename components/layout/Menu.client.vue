<script setup lang="ts">
import type { VueElement } from 'vue'
import type { ItemType } from 'ant-design-vue/es'
import IconDashboard from '~icons/solar/widget-linear'
import IconDoReview from '~icons/solar/document-add-linear'
import IconRules from '~icons/solar/bookmark-circle-linear'
import IconMessage from '~icons/solar/chat-round-dots-linear'
import IconPollRecords from '~icons/solar/documents-linear'
import IconScore from '~icons/solar/bolt-circle-linear'
import IconApply from '~icons/solar/crown-linear'
import { UserRole } from '@/enums/user'
const userStore = useUserStore()

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
  getItem('概览', 'dashboard', () => h(IconDashboard)),
  userStore.user?.role === UserRole.Reviewer ||
  userStore.user?.role === UserRole.Admin
    ? getItem('句子审核', 'do_review', () => h(IconDoReview))
    : null,
  getItem('审核准则', 'review_rules', () => h(IconRules)),
  getItem('通知消息', 'messages', () => h(IconMessage)),
  getItem('投票记录', 'poll_records', () => h(IconPollRecords)),
  getItem('积分记录', 'score_records', () => h(IconScore)),
  userStore.user?.role === UserRole.User
    ? getItem('申请权限', 'apply_reviewer', () => h(IconApply))
    : null
  // getItem('Navigation Two', 'sub2', () => h(AppstoreOutlined)),
  // getItem('Navigation Two', 'sub2', () => h(AppstoreOutlined))
  // getItem('Navigation Two', 'sub2', () => h(AppstoreOutlined), [
  //   getItem('Option 5', '5'),
  //   getItem('Option 6', '6'),
  //   getItem('Submenu', 'sub3', null, [
  //     getItem('Option 7', '7'),
  //     getItem('Option 8', '8')
  //   ])
  // ]),

  // { type: 'divider' },

  // getItem('Navigation Three', 'sub4', () => h(SettingOutlined), [
  //   getItem('Option 9', '9'),
  //   getItem('Option 10', '10'),
  //   getItem('Option 11', '11'),
  //   getItem('Option 12', '12')
  // ]),

  // getItem(
  //   'Group',
  //   'grp',
  //   null,
  //   [getItem('Option 13', '13'), getItem('Option 14', '14')],
  //   'group'
  // )
])
console.log(items)

const selectedKeys = ref<string[]>(['1'])
const openKeys = ref<string[]>(['messages'])

// 路由部分
const route = useRoute()
const keyRouteMap = new Map<string, string>()
keyRouteMap.set('dashboard', '/dashboard')
keyRouteMap.set('do_review', '/dashboard/do_review')
keyRouteMap.set('review_rules', 'https://www.yuque.com/freejishu/rfoxeq/xz3u2x')
// keyRouteMap.set('messages', '/dashboard/messages')
keyRouteMap.set('messages', '/dashboard/messages')
keyRouteMap.set('poll_records', '/dashboard/records/review')
keyRouteMap.set('score_records', '/dashboard/records/score')
keyRouteMap.set('apply_reviewer', '/dashboard/apply_reviewer')
const getKeyByRoute = (route: string) => {
  for (const [key, value] of keyRouteMap) {
    if (value === route) return key
  }
  return ''
}
watchEffect(() => {
  const key = getKeyByRoute(route.path)
  if (key) {
    selectedKeys.value = [key]
  }
})
watch(selectedKeys, (val, old) => {
  const key = val[0]
  if (key) {
    const target = keyRouteMap.get(key)
    if (target && target.startsWith('/')) {
      if (target !== route.path) navigateTo(target)
    } else {
      // reset selectedKeys
      selectedKeys.value = old
      window.open(target, '_blank')
    }
  }
})

// watch(openKeys, (val) => {
//   console.log('openKeys', val)
// })
</script>
<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    class="menu"
    mode="inline"
    :items="items"
  ></a-menu>
</template>

<style lang="scss" scoped>
.menu {
  @apply h-full w-full rounded-l-4;
}
</style>
