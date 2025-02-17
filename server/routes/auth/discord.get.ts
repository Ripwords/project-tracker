import type { DiscordOAuthSuccessResponse } from "#shared/types"

export default defineOAuthDiscordEventHandler({
  config: {
    scope: ["email", "identify"],
  },
  async onSuccess(event, { user }) {
    const discordUser = user as DiscordOAuthSuccessResponse["user"]

    const { newUser } = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findFirst({
        where: {
          discordId: discordUser.id,
        },
      })

      if (!existingUser) {
        await tx.user.create({
          data: {
            discordId: discordUser.id,
            username: discordUser.username,
            email: discordUser.email,
          },
        })
      }

      const newUser = await tx.user.findUnique({
        where: {
          email: discordUser.email,
        },
      })

      return {
        newUser,
      }
    })

    await setUserSession(event, {
      user: {
        id: newUser?.id,
        discordId: discordUser.id,
        username: discordUser.username,
      },
    })

    return sendRedirect(event, "/")
  },
  onError(event, error) {
    console.error(error)
    clearUserSession(event)
    return sendRedirect(event, "/")
  },
})
