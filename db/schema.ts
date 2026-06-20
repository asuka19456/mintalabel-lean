import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const productionRequests = pgTable("production_requests", {
  id: serial().primaryKey(),
  departmentFactory: text("department_factory").notNull(),
  line: text("line").notNull(),
  articleName: text("article_name").notNull(),
  destination: text("destination").notNull(),
  week: text("week").notNull(),
  status: text("status").notNull().default("wait"),
  highlight: text("highlight").notNull().default("NO"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial().primaryKey(),
  departmentFactory: text("department_factory").notNull(),
  line: text("line").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
