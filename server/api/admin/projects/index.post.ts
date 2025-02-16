import { z } from "zod"

const bodySchema = z.object({
  name: z.string(),
})

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  const { name } = await readValidatedBody(event, bodySchema.parse)

  try {
    await prisma.$transaction(async (tx) => {
      const existingProject = await tx.project.findUnique({
        where: {
          name,
        },
      })

      if (existingProject) {
        throw createError({
          statusCode: 400,
          statusMessage: "Project already exists",
        })
      }

      await tx.project.create({
        data: {
          name,
        },
      })
    })
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create project",
    })
  }
})
