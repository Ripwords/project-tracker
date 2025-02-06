export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession()
  if (!loggedIn.value) {
    if (to.path.startsWith("/admin")) {
      return navigateTo("/admin/login")
    }
    return navigateTo("/login")
  }

  if (to.path.startsWith("/admin") && !user.value?.isAdmin) {
    return navigateTo("/auth/logout", {
      external: true,
    })
  }
})
