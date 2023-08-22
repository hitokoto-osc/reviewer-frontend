<script setup lang="ts">
import type { VueElement } from 'vue'
import type { ItemType, MenuProps } from 'ant-design-vue/es'
import {
  MailOutlined,
  ContainerOutlined,
  VerifiedOutlined,
  BarChartOutlined,
  AuditOutlined
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
  getItem('概览', 'dashboard', () => h(BarChartOutlined)),
  getItem('句子审核', 'do_review', () => h(AuditOutlined)),
  getItem('审核准则', 'review_rules', () => h(ContainerOutlined)),
  getItem('消息与记录', 'messages', () => h(MailOutlined), [
    getItem('通知', 'notifications'),
    getItem('投票记录', 'poll_records'),
    getItem('积分记录', 'score_records')
  ]),
  getItem('申请权限', 'apply_reviewer', () => h(VerifiedOutlined))
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

const selectedKeys = ref<string[]>(['1'])
const openKeys = ref<string[]>(['sub1'])

const handleClick: MenuProps['onClick'] = (e) => {
  console.log('click', e)
}

watch(openKeys, (val) => {
  console.log('openKeys', val)
})
</script>
<template>
  <a-menu
    id="dddddd"
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    class="menu"
    mode="inline"
    :items="items"
    @click="handleClick"
  ></a-menu>
</template>

<style lang="scss" scoped>
.menu {
  @apply h-full w-full rounded-l-4;
}
</style>
