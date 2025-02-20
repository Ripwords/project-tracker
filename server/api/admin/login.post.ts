import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, loginSchema.parse)

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid email or password",
    })
  }

  const isPasswordValid = await verifyPassword(user.hash!, password)

  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid email or password",
    })
  }

  await setUserSession(event, {
    user: {
      username: user.username,
      email: user.email,
      role: user.role,
      isAdmin: true,
    },
  })

  return sendRedirect(event, "/")
})
