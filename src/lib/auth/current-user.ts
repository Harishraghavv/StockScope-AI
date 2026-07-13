import { getAuthCookie } from "@/lib/auth/cookies";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { findUserById } from "@/lib/auth/memory-users";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  emailVerified: boolean;
  createdAt: Date;
}

/**
 * Resolves the current user from the auth cookie. Tries Prisma first,
 * falls back to the in-memory user store when the database is unavailable.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = getAuthCookie();
  if (!token) return null;

  try {
    const payload = await verifyAccessToken(token);

    // Try Prisma first
    try {
      const { prisma } = await import("@/lib/prisma");
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true,
        },
      });
      if (user) return user;
    } catch {
      // Prisma unavailable — fall through to memory store
    }

    // Fallback: in-memory user store
    const memUser = await findUserById(payload.sub);
    if (memUser) {
      return {
        id: memUser.id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
        emailVerified: memUser.emailVerified,
        createdAt: memUser.createdAt,
      };
    }

    return null;
  } catch {
    // Expired, malformed, or tampered token — treat as logged out.
    return null;
  }
}
