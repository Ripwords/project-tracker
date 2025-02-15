import { z } from "zod"

const updateUsersSchema = z.object({
  userIds: z.array(z.string()),
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

  const projectId = getRouterParam(event, "projectId")
  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: "Project ID is required",
    })
  }

  // Validate request body
  const body = await readBody(event)
  const { userIds } = updateUsersSchema.parse(body)

  // Update project users
  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      users: {
        set: userIds.map((id) => ({ id })),
      },
      updatedAt: new Date(),
    },
    include: {
      users: true,
    },
  })

  return project
})
