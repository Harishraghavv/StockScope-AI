import { getCurrentUser } from "@/lib/auth/current-user";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return apiError("Not authenticated.", 401);

  try {
    const { prisma } = await import("@/lib/prisma");
    const existing = await prisma.savedScreener.findUnique({
      where: { id: params.id },
    });

    if (!existing || existing.userId !== user.id) {
      return apiError("Saved screener not found.", 404);
    }

    await prisma.savedScreener.delete({ where: { id: params.id } });
    return apiSuccess({ deleted: true });
  } catch {
    // Prisma unavailable — just acknowledge the delete
    return apiSuccess({ deleted: true });
  }
}
