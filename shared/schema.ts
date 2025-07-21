import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - minimal schema compatible with Railway
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionPlan: varchar("subscription_plan").default("free"), // free, pro, business
  subscriptionStatus: varchar("subscription_status").default("inactive"), // active, inactive
  monthlyScansUsed: integer("monthly_scans_used").default(0),
  scanResetDate: timestamp("scan_reset_date").defaultNow(),
  passwordResetToken: varchar("password_reset_token"),
  passwordResetExpiry: timestamp("password_reset_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// QR Codes table - simplified for Railway compatibility
export const qrCodes = pgTable("qr_codes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  content: text("content").notNull(), // The QR code content/URL
  size: integer("size").default(200),
  format: varchar("format").default("png"), // png, svg, pdf
  scans: integer("scans").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// QR Scan Analytics table
export const qrScans = pgTable("qr_scans", {
  id: serial("id").primaryKey(),
  qrCodeId: integer("qr_code_id").notNull().references(() => qrCodes.id, { onDelete: "cascade" }),
  scannedAt: timestamp("scanned_at").defaultNow(),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address"),
  country: varchar("country"),
  city: varchar("city"),
  deviceType: varchar("device_type"), // mobile, tablet, desktop
  referrer: text("referrer"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  qrCodes: many(qrCodes),
}));

export const qrCodesRelations = relations(qrCodes, ({ one, many }) => ({
  user: one(users, {
    fields: [qrCodes.userId],
    references: [users.id],
  }),
  scans: many(qrScans),
}));

export const qrScansRelations = relations(qrScans, ({ one }) => ({
  qrCode: one(qrCodes, {
    fields: [qrScans.qrCodeId],
    references: [qrCodes.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQrCodeSchema = createInsertSchema(qrCodes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  scans: true,
});

export const updateQrCodeSchema = createInsertSchema(qrCodes).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  scans: true,
}).partial();

export const insertQrScanSchema = createInsertSchema(qrScans).omit({
  id: true,
  scannedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertQrCode = z.infer<typeof insertQrCodeSchema>;
export type UpdateQrCode = z.infer<typeof updateQrCodeSchema>;
export type QrCode = typeof qrCodes.$inferSelect;
export type InsertQrScan = z.infer<typeof insertQrScanSchema>;
export type QrScan = typeof qrScans.$inferSelect;

// Analytics types
export type QrCodeWithAnalytics = QrCode & {
  totalScans: number;
  recentScans: QrScan[];
  topCountries: Array<{ country: string; count: number }>;
  deviceBreakdown: Array<{ deviceType: string; count: number }>;
};
