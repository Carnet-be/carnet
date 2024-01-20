import { type InferSelectModel } from "drizzle-orm";
import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

const carOptions = mysqlTable("car_options", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export default carOptions;

export type CarOption = InferSelectModel<typeof carOptions>;
