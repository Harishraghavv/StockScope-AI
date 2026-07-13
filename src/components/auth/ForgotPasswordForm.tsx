"use client";

import { useState, FormEvent } from "react";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import { useToastStore } from "@/lib/stores/toast-store";

export default function ForgotPasswordForm() {
  const push = useToastStore((s) => s.push);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();

      if (!res.ok) {
        if (json.error?.details?.email) setError(json.error.details.email);
        else push(json.error?.message ?? "Something went wrong.", "error");
        return;
      }

      setSubmitted(true);
    } catch {
      push("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-brand-500/25 bg-brand-50 px-4 py-4 text-sm text-brand-800">
        If an account exists for <strong>{email}</strong>, a reset link is on
        its way. Check your inbox in the next few minutes.
      </div>
    );
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
        error={error}
        required
      />
      <Button type="submit" loading={loading} className="mt-1 w-full">
        Send reset link
      </Button>
    </form>
  );
}
