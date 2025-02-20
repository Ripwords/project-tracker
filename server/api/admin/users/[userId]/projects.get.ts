import { z } from "zod"

const paramsSchema = z.object({
  userId: z.string(),
})

export default defineEventHandler(async (event) => {
  const { userId } = await getValidatedRouterParams(event, paramsSchema.parse)

  const [user, projects] = await prisma.$transaction([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
      },
    }),
    prisma.project.findMany({
      where: {
        users: {
          some: { id: userId },
        },
      },
      select: {
        id: true,
        name: true,
        TimeEntry: {
          where: {
            userId,
          },
          select: {
            duration: true,
            date: true,
          },
        },
      },
    }),
  ])

  return {
    projects,
    user,
  }
})
