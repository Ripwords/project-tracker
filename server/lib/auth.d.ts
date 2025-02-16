import type * as Prisma from "@prisma/client"

// auth.d.ts
declare module "#auth-utils" {
  interface User
    extends Partial<
      Pick<Prisma.User, "discordId" | "username" | "email" | "role" | "id">
    > {
    isAdmin?: boolean
  }

  interface UserSession {
    // Add your own fields
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export {}
