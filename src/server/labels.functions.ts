import { createServerFn } from "@tanstack/react-start";
import { db } from "../../db/index.js";
import { productionRequests } from "../../db/schema.js";
import { eq, asc } from "drizzle-orm";

export const getRequests = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(productionRequests).orderBy(asc(productionRequests.createdAt));
});

export const addRequest = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      departmentFactory: string;
      line: string;
      articleName: string;
      destination: string;
      week: string;
    }) => data
  )
  .handler(async ({ data }) => {
    const [row] = await db
      .insert(productionRequests)
      .values({
        departmentFactory: data.departmentFactory,
        line: data.line,
        articleName: data.articleName,
        destination: data.destination,
        week: data.week,
        status: "wait",
        highlight: "NO",
      })
      .returning();
    return row;
  });

export const updateStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number; status: string }) => data)
  .handler(async ({ data }) => {
    await db
      .update(productionRequests)
      .set({ status: data.status })
      .where(eq(productionRequests.id, data.id));
    return { success: true };
  });

export const deleteRequest = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await db.delete(productionRequests).where(eq(productionRequests.id, data.id));
    return { success: true };
  });

export const clearAllRequests = createServerFn({ method: "POST" }).handler(async () => {
  await db.delete(productionRequests);
  return { success: true };
});
