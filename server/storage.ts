import {
  users,
  qrCodes,
  type User,
  type UpsertUser,
  type QrCode,
  type InsertQrCode,
  type UpdateQrCode,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User>;
  updateUserSubscription(userId: string, status: string, endsAt?: Date): Promise<User>;
  updatePasswordResetToken(userId: string, token: string, expiry: Date): Promise<void>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  
  // QR Code operations
  createQrCode(qrCode: InsertQrCode): Promise<QrCode>;
  getUserQrCodes(userId: string): Promise<QrCode[]>;
  getQrCode(id: number, userId: string): Promise<QrCode | undefined>;
  updateQrCode(id: number, userId: string, updates: UpdateQrCode): Promise<QrCode | undefined>;
  deleteQrCode(id: number, userId: string): Promise<boolean>;
  incrementQrCodeScans(id: number): Promise<void>;
  getUserQrCodeCount(userId: string): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.passwordResetToken, token));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserSubscription(userId: string, status: string, endsAt?: Date): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        subscriptionStatus: status,
        subscriptionEndsAt: endsAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // QR Code operations
  async createQrCode(qrCodeData: InsertQrCode): Promise<QrCode> {
    const [qrCode] = await db
      .insert(qrCodes)
      .values(qrCodeData)
      .returning();
    return qrCode;
  }

  async getUserQrCodes(userId: string): Promise<QrCode[]> {
    return await db
      .select()
      .from(qrCodes)
      .where(and(eq(qrCodes.userId, userId), eq(qrCodes.isActive, true)))
      .orderBy(desc(qrCodes.createdAt));
  }

  async getQrCode(id: number, userId: string): Promise<QrCode | undefined> {
    const [qrCode] = await db
      .select()
      .from(qrCodes)
      .where(and(eq(qrCodes.id, id), eq(qrCodes.userId, userId), eq(qrCodes.isActive, true)));
    return qrCode;
  }

  async updateQrCode(id: number, userId: string, updates: UpdateQrCode): Promise<QrCode | undefined> {
    const [qrCode] = await db
      .update(qrCodes)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(eq(qrCodes.id, id), eq(qrCodes.userId, userId)))
      .returning();
    return qrCode;
  }

  async deleteQrCode(id: number, userId: string): Promise<boolean> {
    const [result] = await db
      .update(qrCodes)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(and(eq(qrCodes.id, id), eq(qrCodes.userId, userId)))
      .returning();
    return !!result;
  }

  async incrementQrCodeScans(id: number): Promise<void> {
    await db
      .update(qrCodes)
      .set({
        scans: sql`${qrCodes.scans} + 1`,
      })
      .where(eq(qrCodes.id, id));
  }

  async getUserQrCodeCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: qrCodes.id })
      .from(qrCodes)
      .where(and(eq(qrCodes.userId, userId), eq(qrCodes.isActive, true)));
    return result.length;
  }

  async updatePasswordResetToken(userId: string, token: string, expiry: Date): Promise<void> {
    await db
      .update(users)
      .set({ 
        passwordResetToken: token, 
        passwordResetExpiry: expiry,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
