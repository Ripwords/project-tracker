import { z } from "zod"
import { PAGE_SIZE } from "#shared/constants"

const querySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
})

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)

  const { page = 1, limit = PAGE_SIZE } = await getValidatedQuery(
    event,
    querySchema.parse
  )

  if (!user?.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    })
  }

  try {
    const [users, totalUsers] = await prisma.$transaction([
      prisma.user.findMany({
        where: {
          OR: [
            {
              role: {
                not: "ADMIN",
              },
            },
            {
              role: {
                isSet: false,
              },
            },
          ],
        },
        omit: {
          hash: true,
        },
      }),
      prisma.user.count({
        where: {
          OR: [
            {
              role: {
                not: "ADMIN",
              },
            },
            {
              role: {
                isSet: false,
              },
            },
          ],
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    return {
      users,
      total: totalUsers,
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    })
  }
})
