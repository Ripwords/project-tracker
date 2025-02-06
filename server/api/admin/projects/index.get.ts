export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  const skip = (page - 1) * limit

  try {
    const [projects, total] = await prisma.$transaction([
      prisma.project.findMany({
        skip,
        take: limit,
      }),
      prisma.project.count(),
    ])

    return {
      projects,
      total,
    }
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch projects",
    })
  }
})
