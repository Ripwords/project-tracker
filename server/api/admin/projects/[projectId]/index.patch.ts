import { z } from "zod"

const bodySchema = z.object({
  name: z.string(),
})

const paramsSchema = z.object({
  projectId: z.string(),
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session || !session.user?.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    })
  }

  const { projectId } = await getValidatedRouterParams(
    event,
    paramsSchema.parse
  )
  const { name } = await readValidatedBody(event, bodySchema.parse)

  try {
    await prisma.$transaction(async (tx) => {
      const existingProject = await tx.project.findUnique({
        where: {
          name,
          NOT: {
            id: projectId,
          },
        },
      })

      if (existingProject) {
        throw createError({
          statusCode: 400,
          statusMessage: "Project name already exists",
        })
      }

      await tx.project.update({
        where: {
          id: projectId,
        },
        data: {
          name,
          updatedAt: new Date(),
        },
      })
    })
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update project",
    })
  }
})
