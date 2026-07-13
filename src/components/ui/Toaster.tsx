"use client";

import { useToastStore } from "@/lib/stores/toast-store";

const VARIANT_STYLES = {
  success: "border-brand-500/30 bg-brand-50 text-brand-800",
  error: "border-fall/30 bg-red-50 text-fall",
  info: "border-ink/15 bg-white text-ink",
};

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`pointer-events-auto flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-card ${VARIANT_STYLES[toast.variant]}`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => dismiss(toast.id)}
            className="text-current/50 hover:text-current"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
