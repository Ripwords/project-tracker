export default defineEventHandler(async (event) => {
  const includedPaths = ["/api"]
  const excludedPaths = ["/auth", "/api/_auth/session", "/api/admin/login"]
  if (
    !includedPaths.some((path) => event.path.includes(path)) ||
    excludedPaths.some((path) => event.path.includes(path))
  ) {
    return
  }

  const { user } = await requireUserSession(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  if (event.path.includes("/api/admin")) {
    if (!user.isAdmin) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      })
    }
  }

  event.context.auth = { user }
})
