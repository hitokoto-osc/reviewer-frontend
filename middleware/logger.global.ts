export default defineNuxtRouteMiddleware(async () => {
  const route = useRoute()
  console.log(route.matched, route.fullPath, route.name)
})
