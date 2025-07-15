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

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionStatus: varchar("subscription_status").default("free"), // free, active, canceled, past_due
  subscriptionEndsAt: timestamp("subscription_ends_at"),
  passwordResetToken: varchar("password_reset_token"),
  passwordResetExpiry: timestamp("password_reset_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// QR Codes table
export const qrCodes = pgTable("qr_codes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  content: text("content").notNull(),
  size: integer("size").default(200),
  format: varchar("format").default("png"), // png, svg, pdf
  customization: jsonb("customization"), // for future customization options
  scans: integer("scans").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  qrCodes: many(qrCodes),
}));

export const qrCodesRelations = relations(qrCodes, ({ one }) => ({
  user: one(users, {
    fields: [qrCodes.userId],
    references: [users.id],
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

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertQrCode = z.infer<typeof insertQrCodeSchema>;
export type UpdateQrCode = z.infer<typeof updateQrCodeSchema>;
export type QrCode = typeof qrCodes.$inferSelect;
