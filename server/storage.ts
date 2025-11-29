import { 
  users, passports, nationalIds, drivingLicenses, violations, 
  appointments, delegations, hajjStatus,
  type User, type InsertUser, type Passport, type InsertPassport,
  type NationalId, type InsertNationalId, type DrivingLicense, type InsertDrivingLicense,
  type Violation, type InsertViolation, type Appointment, type InsertAppointment,
  type Delegation, type InsertDelegation, type HajjStatus, type InsertHajjStatus
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByNationalId(nationalId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  getPassportByUserId(userId: number): Promise<Passport | undefined>;
  createPassport(passport: InsertPassport): Promise<Passport>;
  
  getNationalIdByUserId(userId: number): Promise<NationalId | undefined>;
  createNationalId(nationalId: InsertNationalId): Promise<NationalId>;
  
  getDrivingLicenseByUserId(userId: number): Promise<DrivingLicense | undefined>;
  createDrivingLicense(license: InsertDrivingLicense): Promise<DrivingLicense>;
  
  getViolationsByUserId(userId: number): Promise<Violation[]>;
  createViolation(violation: InsertViolation): Promise<Violation>;
  getViolationById(id: number): Promise<Violation | undefined>;
  
  getAppointmentsByUserId(userId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointmentById(id: number): Promise<Appointment | undefined>;
  
  getDelegationsByUserId(userId: number): Promise<Delegation[]>;
  createDelegation(delegation: InsertDelegation): Promise<Delegation>;
  getDelegationById(id: number): Promise<Delegation | undefined>;
  
  getHajjStatusByUserId(userId: number): Promise<HajjStatus | undefined>;
  createHajjStatus(status: InsertHajjStatus): Promise<HajjStatus>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByNationalId(nationalId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.nationalId, nationalId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getPassportByUserId(userId: number): Promise<Passport | undefined> {
    const [passport] = await db.select().from(passports).where(eq(passports.userId, userId));
    return passport || undefined;
  }

  async createPassport(passport: InsertPassport): Promise<Passport> {
    const [result] = await db.insert(passports).values(passport).returning();
    return result;
  }

  async getNationalIdByUserId(userId: number): Promise<NationalId | undefined> {
    const [nationalId] = await db.select().from(nationalIds).where(eq(nationalIds.userId, userId));
    return nationalId || undefined;
  }

  async createNationalId(nationalId: InsertNationalId): Promise<NationalId> {
    const [result] = await db.insert(nationalIds).values(nationalId).returning();
    return result;
  }

  async getDrivingLicenseByUserId(userId: number): Promise<DrivingLicense | undefined> {
    const [license] = await db.select().from(drivingLicenses).where(eq(drivingLicenses.userId, userId));
    return license || undefined;
  }

  async createDrivingLicense(license: InsertDrivingLicense): Promise<DrivingLicense> {
    const [result] = await db.insert(drivingLicenses).values(license).returning();
    return result;
  }

  async getViolationsByUserId(userId: number): Promise<Violation[]> {
    return await db.select().from(violations).where(eq(violations.userId, userId));
  }

  async createViolation(violation: InsertViolation): Promise<Violation> {
    const [result] = await db.insert(violations).values(violation).returning();
    return result;
  }

  async getViolationById(id: number): Promise<Violation | undefined> {
    const [violation] = await db.select().from(violations).where(eq(violations.id, id));
    return violation || undefined;
  }

  async getAppointmentsByUserId(userId: number): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.userId, userId));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [result] = await db.insert(appointments).values(appointment).returning();
    return result;
  }

  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async getDelegationsByUserId(userId: number): Promise<Delegation[]> {
    return await db.select().from(delegations).where(eq(delegations.userId, userId));
  }

  async createDelegation(delegation: InsertDelegation): Promise<Delegation> {
    const [result] = await db.insert(delegations).values(delegation).returning();
    return result;
  }

  async getDelegationById(id: number): Promise<Delegation | undefined> {
    const [delegation] = await db.select().from(delegations).where(eq(delegations.id, id));
    return delegation || undefined;
  }

  async getHajjStatusByUserId(userId: number): Promise<HajjStatus | undefined> {
    const [status] = await db.select().from(hajjStatus).where(eq(hajjStatus.userId, userId));
    return status || undefined;
  }

  async createHajjStatus(status: InsertHajjStatus): Promise<HajjStatus> {
    const [result] = await db.insert(hajjStatus).values(status).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
