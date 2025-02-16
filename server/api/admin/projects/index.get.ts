import { z } from "zod"

const querySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
})

export default defineEventHandler(async (event) => {
  const { page, limit } = await getValidatedQuery(event, querySchema.parse)
  const skip = (page - 1) * limit

  try {
    const [projects, total] = await prisma.$transaction([
      prisma.project.findMany({
        skip,
        take: limit,
      }),
      prisma.project.count(),
    ])

    return {
      projects,
      total,
    }
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch projects",
    })
  }
})
