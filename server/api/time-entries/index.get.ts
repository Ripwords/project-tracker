export default defineEventHandler(async (event) => {
  // Check authentication
  const session = await getUserSession(event)
  if (!session || !session.user || !session.user.discordId) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    })
  }

  // Get query parameters
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const skip = (page - 1) * limit

  // Fetch time entries
  const [timeEntries, total] = await Promise.all([
    event.context.prisma.timeEntry.findMany({
      where: {
        userId: session.user.discordId,
      },
      include: {
        project: true,
      },
      orderBy: {
        date: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.timeEntry.count({
      where: {
        userId: session.user.discordId,
      },
    }),
  ])

  return {
    items: timeEntries,
    total,
    page,
    pageCount: Math.ceil(total / limit),
  }
})
