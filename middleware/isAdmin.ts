import { useUserStore } from '@/stores/user'
import { UserRole } from '~/enums/user'

export default defineNuxtRouteMiddleware(async () => {
  const user = useUserStore()
  if (user.user?.role !== UserRole.Admin) {
    return await navigateTo('/')
  }
})
