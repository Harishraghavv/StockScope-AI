import { z } from "zod";

export const saveScreenerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60, "Name is too long"),
  filters: z.record(z.unknown()),
});

export type SaveScreenerInput = z.infer<typeof saveScreenerSchema>;
