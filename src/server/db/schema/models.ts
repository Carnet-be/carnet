import { type InferSelectModel } from "drizzle-orm";
import {
  int,
  mysqlTable,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

const models = mysqlTable(
  "models",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    brandId: int("brand_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    year: int("year"),
  },
  (table) => ({
    unq: unique().on(table.name, table.year),
  }),
);
export default models;
export type Model = InferSelectModel<typeof models>;
