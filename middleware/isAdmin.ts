import { useUserStore } from '@/stores/user'
export default defineNuxtRouteMiddleware(async () => {
  const user = useUserStore()
  if (user.role !== 'admin') {
    await navigateTo('/')
  }
})
