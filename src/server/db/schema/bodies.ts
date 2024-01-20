import { type InferSelectModel } from "drizzle-orm";
import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

const bodies = mysqlTable("bodies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }),
  logo: varchar("logo", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Body = InferSelectModel<typeof bodies>;

export default bodies;
