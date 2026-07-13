import { getCurrentUser } from "@/lib/auth/current-user";
import { apiSuccess } from "@/lib/api-response";

export async function GET() {
  const user = await getCurrentUser();
  return apiSuccess({ user });
}
