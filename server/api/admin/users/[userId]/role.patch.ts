import { z } from "zod"
import { Role } from "@prisma/client"

const paramsSchema = z.object({
  userId: z.string(),
})

const bodySchema = z.object({
  role: z.nativeEnum(Role),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  if (!user?.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    })
  }

  const { userId } = await getValidatedRouterParams(event, paramsSchema.parse)
  const { role } = await readValidatedBody(event, bodySchema.parse)

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    })
    return { success: true }
  } catch (error) {
    console.error("Error updating user role:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    })
  }
})
