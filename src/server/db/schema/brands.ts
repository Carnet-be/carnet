import { type InferSelectModel } from "drizzle-orm";
import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

const brands = mysqlTable("brands", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  countryId: int("country_id"),
  logo: varchar("logo", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Brand = InferSelectModel<typeof brands>;

export default brands;
