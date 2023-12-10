import { type InferSelectModel } from "drizzle-orm";
import { mysqlTable, int, varchar, timestamp, unique } from "drizzle-orm/mysql-core";

const model = mysqlTable(
    "model",
    {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 255 }).notNull().unique(),
      brandId: int("brand_id").notNull(),
      createdAt: timestamp("created_at").defaultNow(),
    },
    (table) => ({
      unq: unique().on(table.name, table.brandId),
    }),
  );
  export default model
  export type Model = InferSelectModel<typeof model>;