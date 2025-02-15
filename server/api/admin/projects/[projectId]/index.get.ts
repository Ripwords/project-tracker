import { z } from "zod"

const paramsSchema = z.object({
  projectId: z.string(),
})

export default defineEventHandler(async (event) => {
  // Check authentication and admin role
  const session = await getUserSession(event)
  if (!session?.user?.isAdmin) {
    throw createError({
      statusCode: 403,
      message: "Forbidden",
    })
  }

  const { projectId } = await getValidatedRouterParams(
    event,
    paramsSchema.parse
  )
  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: "Project ID is required",
    })
  }

  // Get project with users
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      users: {
        omit: {
          hash: true,
        },
      },
    },
  })

  if (!project) {
    throw createError({
      statusCode: 404,
      message: "Project not found",
    })
  }

  return project
})
