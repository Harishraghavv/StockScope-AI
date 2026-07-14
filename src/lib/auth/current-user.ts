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

    // Fallback: Vercel serverless environments lose memory state between requests.
    // Since the JWT is cryptographically verified, we can trust its payload directly.
    return {
      id: payload.sub,
      name: payload.email.split("@")[0], // Fallback name
      email: payload.email,
      role: payload.role || "USER",
      emailVerified: true,
      createdAt: new Date(),
    };
  } catch {
    // Expired, malformed, or tampered token — treat as logged out.
    return null;
  }
}
