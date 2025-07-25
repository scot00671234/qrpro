import {
  users,
  qrCodes,
  qrScans,
  type User,
  type UpsertUser,
  type QrCode,
  type InsertQrCode,
  type UpdateQrCode,
  type InsertQrScan,
  type QrScan,
  type QrCodeWithAnalytics,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import crypto from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: { email: string; password: string; firstName: string; lastName: string }): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId?: string): Promise<User>;
  updateUserSubscription(userId: string, plan: string, status: string): Promise<User>;
  // Note: Subscription features enabled for Railway deployment
  updatePasswordResetToken(userId: string, token: string, expiry: Date): Promise<void>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  
  // QR Code operations
  createQrCode(qrCode: InsertQrCode): Promise<QrCode>;
  getUserQrCodes(userId: string): Promise<QrCode[]>;
  getQrCode(id: number, userId: string): Promise<QrCode | undefined>;

  updateQrCode(id: number, userId: string, updates: UpdateQrCode): Promise<QrCode | undefined>;
  deleteQrCode(id: number, userId: string): Promise<boolean>;
  incrementQrCodeScans(id: number): Promise<void>;
  getUserQrCodeCount(userId: string): Promise<number>;
  getUserMonthlyScans(userId: string): Promise<number>;
  resetUserMonthlyScans(userId: string): Promise<void>;
  incrementUserMonthlyScans(userId: string): Promise<void>;
  
  // Analytics operations
  recordQrScan(scanData: InsertQrScan): Promise<void>;
  getQrCodeAnalytics(qrCodeId: number, userId: string): Promise<QrCodeWithAnalytics | undefined>;
  getUserAnalyticsSummary(userId: string): Promise<{
    totalScans: number;
    topPerformingQr: QrCode | null;
    recentScans: QrScan[];
  }>;
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

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(userData: { email: string; password: string; firstName: string; lastName: string }): Promise<User> {
    try {
      console.log('Creating user with data:', { ...userData, password: '[REDACTED]' });
      const userId = crypto.randomUUID();
      
      console.log('Inserting user into database with ID:', userId);
      const [user] = await db
        .insert(users)
        .values({
          id: userId,
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
        })
        .returning();
      
      console.log('Database insert successful, user created:', user.email);
      return user;
    } catch (error) {
      console.error('Database error creating user:', error);
      console.error('Database error code:', (error as any).code);
      console.error('Database error detail:', (error as any).detail);
      console.error('User data that failed:', { ...userData, password: '[REDACTED]' });
      throw error;
    }
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

  async updateUserSubscription(userId: string, plan: string, status: string, endsAt?: Date): Promise<User> {
    const updateData: any = {
      subscriptionPlan: plan,
      subscriptionStatus: status,
      updatedAt: new Date(),
    };
    
    if (endsAt) {
      updateData.subscriptionEndsAt = endsAt;
    }
    
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Subscription features enabled for Railway deployment

  // QR Code operations - simplified for Railway
  async createQrCode(qrCodeData: InsertQrCode): Promise<QrCode> {
    try {
      console.log('Creating QR code with data:', qrCodeData);
      const [qrCode] = await db
        .insert(qrCodes)
        .values({
          userId: qrCodeData.userId,
          name: qrCodeData.name,
          content: qrCodeData.content,
          size: qrCodeData.size || 200,
          format: qrCodeData.format || 'png'
        })
        .returning();
      console.log('QR code created successfully:', qrCode.id);
      return qrCode;
    } catch (error) {
      console.error('Error creating QR code:', error);
      throw error;
    }
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
      } as any)
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

  async getUserMonthlyScans(userId: string): Promise<number> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return 0;
    
    // Check if we need to reset monthly scans
    const now = new Date();
    const scanResetDate = user.scanResetDate || new Date();
    const daysSinceReset = Math.floor((now.getTime() - scanResetDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceReset >= 30) {
      await this.resetUserMonthlyScans(userId);
      return 0;
    }
    
    return user.monthlyScansUsed || 0;
  }

  async resetUserMonthlyScans(userId: string): Promise<void> {
    await db
      .update(users)
      .set({
        monthlyScansUsed: 0,
        scanResetDate: new Date()
      })
      .where(eq(users.id, userId));
  }

  async incrementUserMonthlyScans(userId: string): Promise<void> {
    // First check if we need to reset monthly scans
    await this.getUserMonthlyScans(userId); // This will reset if needed
    
    await db
      .update(users)
      .set({
        monthlyScansUsed: sql`${users.monthlyScansUsed} + 1`,
      })
      .where(eq(users.id, userId));
  }

  async recordQrScan(scanData: InsertQrScan): Promise<void> {
    await db.insert(qrScans).values(scanData);
  }

  async getQrCodeAnalytics(qrCodeId: number, userId: string): Promise<QrCodeWithAnalytics | undefined> {
    const qrCode = await this.getQrCode(qrCodeId, userId);
    if (!qrCode) return undefined;

    // Get recent scans (last 30 days)
    const recentScans = await db
      .select()
      .from(qrScans)
      .where(and(
        eq(qrScans.qrCodeId, qrCodeId),
        sql`${qrScans.scannedAt} >= NOW() - INTERVAL '30 days'`
      ))
      .orderBy(desc(qrScans.scannedAt))
      .limit(100);

    // Get country breakdown
    const countryData = await db
      .select({
        country: qrScans.country,
        count: sql<number>`count(*)`.as('count')
      })
      .from(qrScans)
      .where(eq(qrScans.qrCodeId, qrCodeId))
      .groupBy(qrScans.country)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    // Get device breakdown
    const deviceData = await db
      .select({
        deviceType: qrScans.deviceType,
        count: sql<number>`count(*)`.as('count')
      })
      .from(qrScans)
      .where(eq(qrScans.qrCodeId, qrCodeId))
      .groupBy(qrScans.deviceType)
      .orderBy(desc(sql`count(*)`));

    return {
      ...qrCode,
      totalScans: qrCode.scans || 0,
      recentScans,
      topCountries: countryData.map(item => ({
        country: item.country || 'Unknown',
        count: item.count
      })),
      deviceBreakdown: deviceData.map(item => ({
        deviceType: item.deviceType || 'Unknown',
        count: item.count
      }))
    };
  }

  async getUserAnalyticsSummary(userId: string): Promise<{
    totalScans: number;
    topPerformingQr: QrCode | null;
    recentScans: QrScan[];
  }> {
    // Get user's QR codes
    const userQrCodes = await this.getUserQrCodes(userId);
    
    if (userQrCodes.length === 0) {
      return {
        totalScans: 0,
        topPerformingQr: null,
        recentScans: []
      };
    }

    // Calculate total scans
    const totalScans = userQrCodes.reduce((sum, qr) => sum + (qr.scans || 0), 0);
    
    // Find top performing QR
    const topPerformingQr = userQrCodes.reduce((top, current) => 
      (current.scans || 0) > (top.scans || 0) ? current : top
    );

    // Get recent scans across all user QRs
    const qrCodeIds = userQrCodes.map(qr => qr.id);
    const recentScans = await db
      .select()
      .from(qrScans)
      .where(sql`${qrScans.qrCodeId} = ANY(${qrCodeIds})`)
      .orderBy(desc(qrScans.scannedAt))
      .limit(20);

    return {
      totalScans,
      topPerformingQr,
      recentScans
    };
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

  async deleteUser(userId: string): Promise<void> {
    // Hard delete user and cascade delete their QR codes
    await db.delete(users).where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
