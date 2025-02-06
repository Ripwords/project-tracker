import prisma from "~~/lib/prisma"

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()
  const adminUser = config.adminUser
  const adminPassword = config.adminPassword

  if (adminUser && adminPassword) {
    const user = await prisma.user.findUnique({
      where: { email: adminUser },
    })

    if (!user) {
      await prisma.user.create({
        data: { email: adminUser, hash: await hashPassword(adminPassword) },
      })
    }
  }
})
