import { z } from "zod"
import { Role } from "@prisma/client"
import { PAGE_SIZE } from "#shared/constants"

const querySchema = z.object({
  role: z.nativeEnum(Role).optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
})

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)

  const {
    role,
    page = 1,
    limit = PAGE_SIZE,
  } = await getValidatedQuery(event, querySchema.parse)

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
            ...(role ? [{ role: { in: [role] } }] : []),
          ],
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
            ...(role ? [{ role: { in: [role] } }] : []),
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
