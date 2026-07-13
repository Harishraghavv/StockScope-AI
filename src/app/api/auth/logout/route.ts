import { clearAuthCookie } from "@/lib/auth/cookies";
import { apiSuccess } from "@/lib/api-response";

import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  clearAuthCookie();
  return apiSuccess({ loggedOut: true });
}

export async function GET(req: NextRequest) {
  clearAuthCookie();
  return NextResponse.redirect(new URL("/login", req.url));
}
