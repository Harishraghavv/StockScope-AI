import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { registerSchema } from "@/lib/validation/auth";
import { hashPassword } from "@/lib/auth/password";
import { signAccessToken } from "@/lib/auth/jwt";
import { setAuthCookie } from "@/lib/auth/cookies";
import { apiSuccess, apiError, zodErrorToFieldMap } from "@/lib/api-response";
import { emailExists, createUser } from "@/lib/auth/memory-users";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    // Try Prisma first, fallback to memory store
    let user: { id: string; name: string; email: string; role: "USER" | "ADMIN" };

    try {
      const { prisma } = await import("@/lib/prisma");
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return apiError("An account with this email already exists.", 409);
      }
      const passwordHash = await hashPassword(password);
      const dbUser = await prisma.user.create({
        data: { name, email, passwordHash },
        select: { id: true, name: true, email: true, role: true },
      });
      await prisma.auditLog.create({
        data: {
          userId: dbUser.id,
          action: "USER_REGISTERED",
          ipAddress: req.headers.get("x-forwarded-for") ?? undefined,
        },
      });
      user = dbUser;
    } catch {
      // Prisma unavailable — use in-memory store
      const exists = await emailExists(email);
      if (exists) {
        return apiError("An account with this email already exists.", 409);
      }
      const passwordHash = await hashPassword(password);
      const memUser = await createUser({ name, email, passwordHash });
      user = { id: memUser.id, name: memUser.name, email: memUser.email, role: memUser.role };
    }

    const token = await signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    setAuthCookie(token);

    return apiSuccess({ user }, 201);
  } catch (err) {
    if (err instanceof ZodError) {
      return apiError("Please fix the highlighted fields.", 422, zodErrorToFieldMap(err));
    }
    console.error("Register error:", err);
    return apiError("Something went wrong. Please try again.", 500);
  }
}
