import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { loginSchema } from "@/lib/validation/auth";
import { verifyPassword } from "@/lib/auth/password";
import { signAccessToken } from "@/lib/auth/jwt";
import { setAuthCookie } from "@/lib/auth/cookies";
import { apiSuccess, apiError, zodErrorToFieldMap } from "@/lib/api-response";
import { findUserByEmail } from "@/lib/auth/memory-users";

// Simple in-memory rate limiting per IP for this route.
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const record = attempts.get(key);
  if (!record || now > record.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  record.count += 1;
  return record.count > MAX_ATTEMPTS;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  if (isRateLimited(ip)) {
    return apiError("Too many login attempts. Try again in 15 minutes.", 429);
  }

  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const invalidCredentials = () => apiError("Invalid email or password.", 401);

    // Try Prisma first, fallback to memory store
    let user: { id: string; name: string; email: string; role: string; passwordHash: string } | null = null;

    try {
      const { prisma } = await import("@/lib/prisma");
      const dbUser = await prisma.user.findUnique({ where: { email } });
      if (dbUser) {
        user = { id: dbUser.id, name: dbUser.name, email: dbUser.email, role: dbUser.role, passwordHash: dbUser.passwordHash };
      }
    } catch {
      // Prisma unavailable — use in-memory store
    }

    if (!user) {
      const memUser = await findUserByEmail(email);
      if (memUser) {
        user = { id: memUser.id, name: memUser.name, email: memUser.email, role: memUser.role, passwordHash: memUser.passwordHash };
      }
    }

    if (!user) return invalidCredentials();

    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) return invalidCredentials();

    const token = await signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    setAuthCookie(token);

    // Try to log audit event (non-critical, ignore failures)
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.auditLog.create({
        data: { userId: user.id, action: "USER_LOGIN", ipAddress: ip },
      });
    } catch {}

    return apiSuccess({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return apiError("Please fix the highlighted fields.", 422, zodErrorToFieldMap(err));
    }
    console.error("Login error:", err);
    return apiError("Something went wrong. Please try again.", 500);
  }
}
