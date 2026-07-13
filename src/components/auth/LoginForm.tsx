"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useToastStore } from "@/lib/stores/toast-store";

type FieldErrors = Record<string, string>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const push = useToastStore((s) => s.push);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (!res.ok) {
        if (json.error?.details) setErrors(json.error.details);
        else push(json.error?.message ?? "Login failed.", "error");
        return;
      }

      setUser(json.data.user);
      push(`Welcome back, ${json.data.user.name.split(" ")[0]}.`, "success");
      router.push(searchParams.get("next") || "/dashboard");
      router.refresh();
    } catch {
      push("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        required
      />
      <div>
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />
        <div className="mt-2 text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-brand-600 hover:underline dark:text-brand-400"
          >
            Forgot password?
          </Link>
        </div>
      </div>
      <Button type="submit" loading={loading} className="mt-1 w-full">
        Sign in
      </Button>
    </form>
  );
}
