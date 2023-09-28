import { VNode } from 'nuxt/dist/app/compat/capi'
import IconUsers from '~icons/solar/users-group-two-rounded-bold'
import IconDashboard from '~icons/solar/pie-chart-2-bold'
import IconTag from '~icons/solar/tag-bold'
import IconPoll from '~icons/solar/ticket-bold'
import IconSentence from '~icons/solar/hashtag-circle-bold'
import { ItemType } from 'ant-design-vue'

export interface AdminRouteItem {
  name: string
  route: string
  key: string
  closeable?: boolean
  icon?: VNode | (() => VNode)
  children?: AdminRouteItem[]
}

const adminRoutes: AdminRouteItem[] = [
  {
    name: '仪表盘',
    route: '/admin/dashboard',
    key: 'admin_dashboard',
    closeable: false,
    icon: () => h(IconDashboard)
  },
  {
    name: '用户管理',
    route: '/admin/users',
    key: 'admin_users',
    icon: () => h(IconUsers)
  },
  {
    name: '标记管理',
    route: '/admin/marks',
    key: 'admin_marks',
    icon: () => h(IconTag)
  },
  {
    name: '投票管理',
    route: '/admin/polls',
    key: 'admin_polls',
    icon: () => h(IconPoll)
  },
  {
    name: '句子管理',
    route: '/admin/sentences',
    key: 'admin_sentences',
    icon: () => h(IconSentence)
  }
]

export function useAdminRoutes(): AdminRouteItem[] {
  const toPlainRoutes = (routes: AdminRouteItem[]): AdminRouteItem[] => {
    const res: AdminRouteItem[] = []
    routes.forEach((route) => {
      res.push(route)
      if (route.children) {
        res.push(...toPlainRoutes(route.children))
      }
    })
    return res
  }
  return toPlainRoutes(adminRoutes)
}

export function useAdminMenuItems(): ItemType[] {
  const toMenuItems = (routes: AdminRouteItem[]): ItemType[] => {
    const res: ItemType[] = []
    routes.forEach((route) => {
      res.push({
        key: route.key,
        label: route.name,
        icon: route.icon,
        children: route.children ? toMenuItems(route.children) : undefined
      })
    })
    return res
  }
  return toMenuItems(adminRoutes)
}
