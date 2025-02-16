import { z } from "zod"

const paramsSchema = z.object({
  projectId: z.string(),
})

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  if (!session.user.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    })
  }

  const { projectId } = await getValidatedRouterParams(
    event,
    paramsSchema.parse
  )

  try {
    await prisma.project.delete({
      where: { id: projectId },
    })
    return { success: true }
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete project",
    })
  }
})
