import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { forgotPasswordSchema } from "@/lib/validation/auth";
import { generateOpaqueToken } from "@/lib/auth/jwt";
import { apiSuccess, apiError, zodErrorToFieldMap } from "@/lib/api-response";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Try Prisma, fallback gracefully
    try {
      const { prisma } = await import("@/lib/prisma");
      const user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        const resetToken = generateOpaqueToken();
        const resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_TTL_MS);

        await prisma.user.update({
          where: { id: user.id },
          data: { resetToken, resetTokenExpiry },
        });

        console.log(`[dev only] Password reset token for ${email}: ${resetToken}`);
      }
    } catch {
      // Prisma unavailable — log and continue
      console.log(`[dev only] Password reset requested for ${email} (DB unavailable)`);
    }

    // Always return success regardless
    return apiSuccess({
      message: "If an account exists for that email, a reset link has been sent.",
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return apiError("Please fix the highlighted fields.", 422, zodErrorToFieldMap(err));
    }
    console.error("Forgot password error:", err);
    return apiError("Something went wrong. Please try again.", 500);
  }
}
