import { z } from "zod"

const bodySchema = z.object({
  duration: z.coerce.number(),
  description: z.string(),
})

const paramsSchema = z.object({
  projectId: z.string(),
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  const { projectId } = await getValidatedRouterParams(
    event,
    paramsSchema.parse
  )
  const { duration, description } = await readValidatedBody(
    event,
    bodySchema.parse
  )

  try {
    await prisma.$transaction(async (tx) => {
      const project = await tx.project.findUnique({
        where: {
          id: projectId,
        },
      })

      if (!project) {
        throw createError({
          statusCode: 404,
          statusMessage: "Project not found",
        })
      }

      if (!session.user?.discordId) {
        throw createError({
          statusCode: 401,
          statusMessage: "Unauthorized",
        })
      }

      const user = await tx.user.findUnique({
        where: {
          discordId: session.user.discordId,
        },
      })

      if (!user) {
        throw createError({
          statusCode: 404,
          statusMessage: "User not found",
        })
      }

      await tx.timeEntry.upsert({
        where: {
          projectId_userId_date: {
            projectId,
            userId: user.id,
            date: new Date(),
          },
        },
        update: {
          duration,
          description,
        },
        create: {
          projectId,
          userId: user.id,
          duration,
          description,
          date: new Date(),
        },
      })
    })
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create time entry",
    })
  }
})
