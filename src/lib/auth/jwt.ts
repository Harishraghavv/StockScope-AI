import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "stockscope-ai-demo-fallback-secret-key-32-bytes";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface AuthTokenPayload extends JWTPayload {
  sub: string; // user id
  email: string;
  role: "USER" | "ADMIN";
}

/**
 * Signs a short-lived access token containing the minimum claims needed
 * to identify and authorize a user on each request.
 */
export async function signAccessToken(payload: AuthTokenPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secretKey);
}

/**
 * Verifies and decodes an access token. Throws if invalid or expired —
 * callers should catch and treat as "unauthenticated".
 */
export async function verifyAccessToken(token: string): Promise<AuthTokenPayload> {
  const { payload } = await jwtVerify<AuthTokenPayload>(token, secretKey);
  return payload;
}

/**
 * Generates a cryptographically random opaque token, used for refresh
 * sessions, email verification links, and password-reset links.
 */
export function generateOpaqueToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
