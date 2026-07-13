import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { getCurrentUser } from "@/lib/auth/current-user";
import { saveScreenerSchema } from "@/lib/validation/screener";
import { apiSuccess, apiError, zodErrorToFieldMap } from "@/lib/api-response";

// In-memory saved screeners when Prisma is unavailable
const memoryScreeners = new Map<string, { id: string; userId: string; name: string; filters: any; createdAt: Date }[]>();

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return apiError("Not authenticated.", 401);

  try {
    const { prisma } = await import("@/lib/prisma");
    const saved = await prisma.savedScreener.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess({ saved });
  } catch {
    // Prisma unavailable — use in-memory
    const saved = memoryScreeners.get(user.id) ?? [];
    return apiSuccess({ saved: saved.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return apiError("Not authenticated.", 401);

  try {
    const body = await req.json();
    const { name, filters } = saveScreenerSchema.parse(body);

    try {
      const { prisma } = await import("@/lib/prisma");
      const saved = await prisma.savedScreener.create({
        data: { userId: user.id, name, filters },
      });
      return apiSuccess({ saved }, 201);
    } catch {
      // Prisma unavailable — save in memory
      const id = `screener_${Date.now()}`;
      const saved = { id, userId: user.id, name, filters, createdAt: new Date() };
      const existing = memoryScreeners.get(user.id) ?? [];
      existing.push(saved);
      memoryScreeners.set(user.id, existing);
      return apiSuccess({ saved }, 201);
    }
  } catch (err) {
    if (err instanceof ZodError) {
      return apiError("Please fix the highlighted fields.", 422, zodErrorToFieldMap(err));
    }
    console.error("Save screener error:", err);
    return apiError("Something went wrong. Please try again.", 500);
  }
}
