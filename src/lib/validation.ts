import { z } from "zod";

export const purchaseModeSchema = z.enum(["one_time", "subscription"]);
export const subscriptionIntervalSchema = z.enum(["two_weeks", "one_month"]);
export const grindSchema = z.enum(["beans", "ground"]);
export const diagnosisTasteSchema = z.enum(["bright", "balanced", "deep"]);
export const diagnosisGrindSchema = z.enum(["beans", "ground", "not_sure"]);
export const diagnosisVolumeSchema = z.enum(["light", "medium", "heavy"]);

export const checkoutItemSchema = z.object({
  productSlug: z.string().min(1),
  variantSlug: z.string().min(1),
  quantity: z.number().int().positive().default(1),
});

export const checkoutRequestSchema = z.object({
  mode: purchaseModeSchema,
  interval: subscriptionIntervalSchema.optional(),
  items: z.array(checkoutItemSchema).min(1),
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  source: z.string().optional(),
});

export const diagnosisRequestSchema = z.object({
  answers: z.object({
    taste: diagnosisTasteSchema,
    grind: diagnosisGrindSchema,
    volume: diagnosisVolumeSchema,
  }),
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  source: z.string().optional(),
});

export const leadSignupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
  source: z.string().optional(),
  interest: z.string().optional(),
});

export const adminLoginSchema = z.object({
  secret: z.string().min(1),
});

export const shipOrderSchema = z.object({
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
});

