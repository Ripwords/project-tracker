export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const projects = await prisma.project.findMany({
    where: {
      users: {
        some: { id: user.id },
      },
    },
    select: {
      id: true,
      name: true,
      TimeEntry: {
        where: {
          userId: user.id,
        },
        select: {
          duration: true,
          date: true,
        },
      },
    },
  })

  return projects
})
