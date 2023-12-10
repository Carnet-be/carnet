import { type InferSelectModel } from "drizzle-orm";
import { mysqlTable, int, varchar, timestamp } from "drizzle-orm/mysql-core";

const colors = mysqlTable("colors", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    value: varchar("value", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow(),
  })
  
  export type Color = InferSelectModel<typeof colors>;

    export default colors