import { z } from "zod"

const paramsSchema = z.object({
  id: z.string(),
})

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  if (!session || !session.user || !session.user.id) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  const { id } = await getValidatedRouterParams(event, paramsSchema.parse)

  try {
    await prisma.$transaction(async (tx) => {
      const timeEntry = await tx.timeEntry.findUnique({
        where: { id },
        include: {
          project: {
            select: {
              id: true,
              projectHours: true,
            },
          },
        },
      })

      if (!timeEntry) {
        throw createError({
          statusCode: 404,
          statusMessage: "Time entry not found",
        })
      }

      // Only allow users to delete their own entries
      if (timeEntry.userId !== session.user?.id) {
        throw createError({
          statusCode: 403,
          statusMessage: "Forbidden",
        })
      }

      // Delete the time entry
      await tx.timeEntry.delete({
        where: { id },
      })

      // Update project hours
      await tx.project.update({
        where: { id: timeEntry.projectId },
        data: {
          projectHours: timeEntry.project.projectHours - timeEntry.duration,
          updatedAt: new Date(),
        },
      })
    })

    return { success: true }
  } catch (error) {
    console.error("Error deleting time entry:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    })
  }
})
