import { type InferSelectModel } from "drizzle-orm";
import { mysqlTable, int, varchar, timestamp } from "drizzle-orm/mysql-core";

 const body = mysqlTable("body", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    logo: varchar("logo", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
  });
  
  export type Body = InferSelectModel<typeof body>;

    export default body