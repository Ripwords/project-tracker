import prisma from "~~/lib/prisma"

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)

  if (!user?.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    })
  }

  try {
    const users = await prisma.user.findMany({
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
    })
    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    return {
      success: false,
      message: "Failed to fetch users",
    }
  }
})
