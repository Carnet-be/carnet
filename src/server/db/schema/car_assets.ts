import { type InferSelectModel } from "drizzle-orm";
import { mysqlTable, int, varchar, timestamp, index } from "drizzle-orm/mysql-core";

export const carAssets = mysqlTable(
    "car_assets",
    {
      id: int("id").autoincrement().primaryKey(),
      carId: int("car_id").notNull(),
      key: varchar("key", { length: 255 }).notNull(),
      url: varchar("url", { length: 255 }),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").onUpdateNow(),
    },
    (table) => ({ carIdIdx: index("car_id_idx").on(table.carId) }),
  );
  
  export type CarAssets = InferSelectModel<typeof carAssets>;