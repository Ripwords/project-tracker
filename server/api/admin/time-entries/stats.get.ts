export default defineEventHandler(async (event) => {
  // Check authentication and admin role
  const session = await getUserSession(event)
  if (!session || !session.user?.isAdmin) {
    throw createError({
      statusCode: 403,
      message: "Forbidden",
    })
  }

  // Get query parameters for date range
  const query = getQuery(event)
  const startDate = query.startDate
    ? new Date(query.startDate as string)
    : new Date(new Date().setMonth(new Date().getMonth() - 1))
  const endDate = query.endDate ? new Date(query.endDate as string) : new Date()

  // Get project stats
  const projectStats = await prisma.timeEntry.groupBy({
    by: ["projectId"],
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      duration: true,
    },
  })

  // Get project names and calculate hours
  const projects = await prisma.project.findMany({
    where: {
      id: {
        in: projectStats.map((stat) => stat.projectId),
      },
    },
  })

  const stats = projectStats.map((stat) => {
    const project = projects.find((p) => p.id === stat.projectId)
    return {
      projectName: project?.name || "Unknown",
      totalHours: Math.round(((stat._sum.duration || 0) / 60) * 10) / 10, // Convert minutes to hours with 1 decimal
    }
  })

  return {
    stats,
    dateRange: {
      start: startDate,
      end: endDate,
    },
  }
})
