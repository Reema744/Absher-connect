import { pgTable, serial, varchar, text, timestamp, boolean, integer, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  nationalId: varchar("national_id", { length: 10 }).notNull().unique(),
  password: varchar("password", { length: 100 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const passports = pgTable("passports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  passportNumber: varchar("passport_number", { length: 20 }).notNull(),
  expiryDate: date("expiry_date").notNull(),
  issueDate: date("issue_date").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"),
});

export const nationalIds = pgTable("national_ids", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  idNumber: varchar("id_number", { length: 10 }).notNull(),
  expiryDate: date("expiry_date").notNull(),
  issueDate: date("issue_date").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"),
});

export const drivingLicenses = pgTable("driving_licenses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  licenseNumber: varchar("license_number", { length: 20 }).notNull(),
  expiryDate: date("expiry_date").notNull(),
  issueDate: date("issue_date").notNull(),
  licenseType: varchar("license_type", { length: 20 }).notNull().default("private"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
});

export const violations = pgTable("violations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  violationNumber: varchar("violation_number", { length: 20 }).notNull(),
  violationType: varchar("violation_type", { length: 100 }).notNull(),
  amount: integer("amount").notNull(),
  discountAmount: integer("discount_amount"),
  discountExpiry: timestamp("discount_expiry"),
  location: varchar("location", { length: 200 }),
  violationDate: timestamp("violation_date").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("unpaid"),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  appointmentType: varchar("appointment_type", { length: 50 }).notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  location: varchar("location", { length: 200 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("scheduled"),
  notes: text("notes"),
});

export const delegations = pgTable("delegations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  delegationType: varchar("delegation_type", { length: 50 }).notNull(),
  delegateNationalId: varchar("delegate_national_id", { length: 10 }).notNull(),
  delegateName: varchar("delegate_name", { length: 100 }).notNull(),
  startDate: date("start_date").notNull(),
  expiryDate: date("expiry_date").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"),
});

export const hajjStatus = pgTable("hajj_status", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  eligible: boolean("eligible").notNull().default(false),
  lastHajjYear: integer("last_hajj_year"),
  registrationStatus: varchar("registration_status", { length: 20 }).default("not_registered"),
  registrationYear: integer("registration_year"),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  passports: many(passports),
  nationalIds: many(nationalIds),
  drivingLicenses: many(drivingLicenses),
  violations: many(violations),
  appointments: many(appointments),
  delegations: many(delegations),
  hajjStatus: one(hajjStatus),
}));

export const passportsRelations = relations(passports, ({ one }) => ({
  user: one(users, { fields: [passports.userId], references: [users.id] }),
}));

export const nationalIdsRelations = relations(nationalIds, ({ one }) => ({
  user: one(users, { fields: [nationalIds.userId], references: [users.id] }),
}));

export const drivingLicensesRelations = relations(drivingLicenses, ({ one }) => ({
  user: one(users, { fields: [drivingLicenses.userId], references: [users.id] }),
}));

export const violationsRelations = relations(violations, ({ one }) => ({
  user: one(users, { fields: [violations.userId], references: [users.id] }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, { fields: [appointments.userId], references: [users.id] }),
}));

export const delegationsRelations = relations(delegations, ({ one }) => ({
  user: one(users, { fields: [delegations.userId], references: [users.id] }),
}));

export const hajjStatusRelations = relations(hajjStatus, ({ one }) => ({
  user: one(users, { fields: [hajjStatus.userId], references: [users.id] }),
}));

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertPassportSchema = createInsertSchema(passports).omit({ id: true });
export const insertNationalIdSchema = createInsertSchema(nationalIds).omit({ id: true });
export const insertDrivingLicenseSchema = createInsertSchema(drivingLicenses).omit({ id: true });
export const insertViolationSchema = createInsertSchema(violations).omit({ id: true });
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true });
export const insertDelegationSchema = createInsertSchema(delegations).omit({ id: true });
export const insertHajjStatusSchema = createInsertSchema(hajjStatus).omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPassport = z.infer<typeof insertPassportSchema>;
export type Passport = typeof passports.$inferSelect;
export type InsertNationalId = z.infer<typeof insertNationalIdSchema>;
export type NationalId = typeof nationalIds.$inferSelect;
export type InsertDrivingLicense = z.infer<typeof insertDrivingLicenseSchema>;
export type DrivingLicense = typeof drivingLicenses.$inferSelect;
export type InsertViolation = z.infer<typeof insertViolationSchema>;
export type Violation = typeof violations.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertDelegation = z.infer<typeof insertDelegationSchema>;
export type Delegation = typeof delegations.$inferSelect;
export type InsertHajjStatus = z.infer<typeof insertHajjStatusSchema>;
export type HajjStatus = typeof hajjStatus.$inferSelect;

export const loginSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export const suggestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  actionUrl: z.string(),
  expiryDate: z.string().optional(),
  type: z.enum(["document", "violation", "appointment", "delegation", "hajj"]),
  priority: z.enum(["high", "medium", "low"]),
  serviceId: z.number().optional(),
});

export type Suggestion = z.infer<typeof suggestionSchema>;

export const configSchema = z.object({
  expiryThresholdDays: z.number(),
  appointmentReminderHours: z.number(),
  violationDiscountThresholdHours: z.number(),
  delegationExpiryDays: z.number(),
});

export type Config = z.infer<typeof configSchema>;
