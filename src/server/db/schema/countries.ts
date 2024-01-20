import { type InferSelectModel } from "drizzle-orm";
import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

const countries = mysqlTable("countries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  flag: varchar("flag", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export default countries;
export type Country = InferSelectModel<typeof countries>;
