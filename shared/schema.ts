import { z } from "zod";

export const violationSchema = z.object({
  id: z.string(),
  discountExpiry: z.string(),
});

export const appointmentSchema = z.object({
  id: z.string(),
  date: z.string(),
});

export const delegationSchema = z.object({
  id: z.string(),
  expires: z.string(),
});

export const absherUserSchema = z.object({
  id: z.string(),
  passportExpiry: z.string(),
  nationalIdExpiry: z.string(),
  drivingLicenseExpiry: z.string(),
  violations: z.array(violationSchema),
  appointments: z.array(appointmentSchema),
  delegations: z.array(delegationSchema),
  hajjEligible: z.boolean(),
});

export const configSchema = z.object({
  expiryThresholdDays: z.number(),
  appointmentReminderHours: z.number(),
  violationDiscountThresholdHours: z.number(),
  delegationExpiryDays: z.number(),
});

export const suggestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  actionUrl: z.string(),
  expiryDate: z.string().optional(),
  type: z.enum(["document", "violation", "appointment", "delegation", "hajj"]),
  priority: z.enum(["high", "medium", "low"]),
});

export type Violation = z.infer<typeof violationSchema>;
export type Appointment = z.infer<typeof appointmentSchema>;
export type Delegation = z.infer<typeof delegationSchema>;
export type AbsherUser = z.infer<typeof absherUserSchema>;
export type Config = z.infer<typeof configSchema>;
export type Suggestion = z.infer<typeof suggestionSchema>;

export const users = {} as any;
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = { id: string; username: string; password: string };
