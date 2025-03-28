import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, json, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  profileImage: text("profile_image"),
  bio: text("bio"),
  phone: text("phone"),
  isAdmin: boolean("is_admin").default(false),
  stripeCustomerId: text("stripe_customer_id")
});

// Teams table
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  captainId: integer("captain_id").references(() => users.id, { onDelete: "set null" }),
  goalAmount: doublePrecision("goal_amount").notNull().default(1000),
  raisedAmount: doublePrecision("raised_amount").notNull().default(0),
  teamImage: text("team_image"),
  createdAt: timestamp("created_at").defaultNow()
});

// TeamMembers join table
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  isActive: boolean("is_active").notNull().default(true),
  joinedAt: timestamp("joined_at").defaultNow()
});

// Donations table
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  amount: doublePrecision("amount").notNull(),
  donorName: text("donor_name").notNull(),
  donorEmail: text("donor_email"),
  message: text("message"),
  teamId: integer("team_id").references(() => teams.id, { onDelete: "set null" }),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  isAnonymous: boolean("is_anonymous").default(false),
  isInHonorOf: boolean("is_in_honor_of").default(false),
  honoreeInfo: text("honoree_info"),
  stripePaymentId: text("stripe_payment_id"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow()
});

// Sponsors table
export const sponsors = pgTable("sponsors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tier: text("tier").notNull(), // gold, silver, bronze
  logo: text("logo"),
  websiteUrl: text("website_url"),
  description: text("description"),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  donationAmount: doublePrecision("donation_amount"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Event settings table
export const eventSettings = pgTable("event_settings", {
  id: serial("id").primaryKey(),
  eventName: text("event_name").notNull().default("Walk for Friendship"),
  eventDate: timestamp("event_date").notNull(),
  eventDescription: text("event_description"),
  goalAmount: doublePrecision("goal_amount").notNull().default(250000),
  raisedAmount: doublePrecision("raised_amount").notNull().default(0),
  registrationOpen: boolean("registration_open").default(true),
  lastUpdated: timestamp("last_updated").defaultNow()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImage: true,
  bio: true,
  phone: true,
  isAdmin: true
});

export const insertTeamSchema = createInsertSchema(teams).pick({
  name: true,
  description: true,
  captainId: true,
  goalAmount: true,
  teamImage: true
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).pick({
  teamId: true,
  userId: true,
  isActive: true
});

export const insertDonationSchema = createInsertSchema(donations).pick({
  amount: true,
  donorName: true,
  donorEmail: true,
  message: true,
  teamId: true,
  userId: true,
  isAnonymous: true,
  isInHonorOf: true,
  honoreeInfo: true,
  stripePaymentId: true,
  paymentStatus: true
});

export const insertSponsorSchema = createInsertSchema(sponsors).pick({
  name: true,
  tier: true,
  logo: true,
  websiteUrl: true,
  description: true,
  contactName: true,
  contactEmail: true,
  contactPhone: true,
  donationAmount: true,
  isActive: true
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;

export type InsertSponsor = z.infer<typeof insertSponsorSchema>;
export type Sponsor = typeof sponsors.$inferSelect;

export type EventSetting = typeof eventSettings.$inferSelect;
