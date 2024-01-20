import { type InferSelectModel } from "drizzle-orm";
import {
  index,
  int,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

const garageStatistics = mysqlTable(
  "garage_statistics",
  {
    id: serial("id").primaryKey(),
    garageId: int("garage_id").notNull(),
    userId: int("user_id"),
    action: varchar("action", {
      length: 100,
      enum: ["view", "follow", "share"],
    }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    garageIdIdx: index("garage_id_idx").on(table.garageId),
  }),
);

export type GarageStatistics = InferSelectModel<typeof garageStatistics>;

export default garageStatistics;
