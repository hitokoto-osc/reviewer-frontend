import { use } from 'echarts/core';
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
import IconShied from '~icons/solar/shield-linear'
import { UserRole } from '@/enums/user'
const userStore = useUserStore()

function getItem(
  label: VueElement | string,
  key: string,
  icon?: unknown,
  children?: ItemType[],
  type?: 'group',
  role?: UserRole
): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
    role
  } as ItemType
}

const rawItems: ItemType[] = [
  getItem('概览', 'dashboard', () => h(IconDashboard)),

  getItem(
    '句子审核',
    'do_review',
    () => h(IconDoReview),
    undefined,
    undefined,
    UserRole.Reviewer
  ),

  getItem('审核准则', 'review_rules', () => h(IconRules)),
  getItem('通知消息', 'messages', () => h(IconMessage)),
  getItem('投票记录', 'poll_records', () => h(IconPollRecords)),
  getItem('积分记录', 'score_records', () => h(IconScore)),
  getItem(
    '申请权限',
    'apply_reviewer',
    () => h(IconApply),
    undefined,
    undefined,
    UserRole.User
  ),
  getItem(
    '管理面板',
    'admin_panel',
    () => h(IconShied),
    undefined,
    undefined,
    UserRole.Admin
  )
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
]
const items = computed(() => {
  const role = userStore.user?.role || UserRole.Guest
  return rawItems.filter((item: ItemType) => {
    const v = item as ItemType & { role: UserRole }
    role === userStore.user?.role || UserRole.Guest
    switch (v.role) {
      case undefined:
        return true
        break
      case UserRole.Guest:
        return true
        break
      case UserRole.User:
        return (
          // 目前由于只有普通用户可以申请审核员，所以这里只有普通用户可以看到申请审核员的按钮
          role === UserRole.User // || role === UserRole.Reviewer || role === UserRole.Admin
        )
        break
      case UserRole.Reviewer:
        return role === UserRole.Reviewer || role === UserRole.Admin
        break
      case UserRole.Admin:
        return role === UserRole.Admin
        break
      default:
        return false
        break
    }
  })
})

const keyRouteMap = new Map<string, string>()
keyRouteMap.set('dashboard', '/dashboard')
keyRouteMap.set('do_review', '/dashboard/do_review')
keyRouteMap.set('review_rules', 'https://www.yuque.com/freejishu/rfoxeq/xz3u2x')
// keyRouteMap.set('messages', '/dashboard/messages')
keyRouteMap.set('messages', '/dashboard/messages')
keyRouteMap.set('poll_records', '/dashboard/records/review')
keyRouteMap.set('score_records', '/dashboard/records/score')
keyRouteMap.set('apply_reviewer', '/dashboard/apply_reviewer')
keyRouteMap.set('admin_panel', '/admin/dashboard')
</script>
<template>
  <LayoutMenu
    :items="items"
    :routes-map="keyRouteMap"
    :default-selected-keys="['dashboard']"
  />
</template>

<style lang="scss" scoped>
.menu {
  @apply h-full w-full rounded-l-4;
}
</style>
