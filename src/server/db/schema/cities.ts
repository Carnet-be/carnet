import { type InferSelectModel } from "drizzle-orm";
import {
  index,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

const cities = mysqlTable(
  "cities",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    countryId: int("country_id"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    countryIdIdx: index("country_id_idx").on(table.countryId),
  }),
);

export default cities;
export type City = InferSelectModel<typeof cities>;
