import { createServerFn } from "@tanstack/react-start";
import { db } from "../../db/index.js";
import { chatMessages } from "../../db/schema.js";
import { asc } from "drizzle-orm";

export const getMessages = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(chatMessages).orderBy(asc(chatMessages.createdAt));
});

export const sendMessage = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { departmentFactory: string; line: string; message: string }) => data
  )
  .handler(async ({ data }) => {
    const [row] = await db
      .insert(chatMessages)
      .values({
        departmentFactory: data.departmentFactory,
        line: data.line,
        message: data.message,
      })
      .returning();
    return row;
  });

export const clearAllMessages = createServerFn({ method: "POST" }).handler(async () => {
  await db.delete(chatMessages);
  return { success: true };
});
