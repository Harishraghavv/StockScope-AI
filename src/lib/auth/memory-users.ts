// In-memory user store — replaces Prisma for local development when
// the database is unavailable (Node 26 / Prisma incompatibility).
// Users persist only for the lifetime of the server process.

import { hashPassword, verifyPassword } from "@/lib/auth/password";

export interface MemoryUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "USER" | "ADMIN";
  emailVerified: boolean;
  createdAt: Date;
}

const users = new Map<string, MemoryUser>();

// Pre-seed the demo users from prisma/seed.ts
let seeded = false;
async function ensureSeeded() {
  if (seeded) return;
  seeded = true;

  const adminHash = await hashPassword("Demo1234");
  const demoHash = await hashPassword("Demo1234");

  users.set("admin-id", {
    id: "admin-id",
    name: "Admin User",
    email: "admin@stockscope.ai",
    passwordHash: adminHash,
    role: "ADMIN",
    emailVerified: true,
    createdAt: new Date(),
  });

  users.set("demo-id", {
    id: "demo-id",
    name: "Demo User",
    email: "demo@stockscope.ai",
    passwordHash: demoHash,
    role: "USER",
    emailVerified: true,
    createdAt: new Date(),
  });
}

function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function findUserByEmail(email: string): Promise<MemoryUser | null> {
  await ensureSeeded();
  for (const user of users.values()) {
    if (user.email.toLowerCase() === email.toLowerCase()) return user;
  }
  return null;
}

export async function findUserById(id: string): Promise<MemoryUser | null> {
  await ensureSeeded();
  return users.get(id) ?? null;
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<MemoryUser> {
  await ensureSeeded();
  const id = generateId();
  const user: MemoryUser = {
    id,
    name: data.name,
    email: data.email,
    passwordHash: data.passwordHash,
    role: "USER",
    emailVerified: false,
    createdAt: new Date(),
  };
  users.set(id, user);
  return user;
}

export async function emailExists(email: string): Promise<boolean> {
  const user = await findUserByEmail(email);
  return user !== null;
}
