import { type InferSelectModel } from "drizzle-orm";
import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const assets = mysqlTable(
  "assets",
  {
    id: int("id").autoincrement().primaryKey(),
    ref: int("ref").notNull(),
    key: varchar("key", { length: 255 }).notNull(),
    url: varchar("url", { length: 255 }),
    type: mysqlEnum("type", ["image", "video", "audio"]),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({ refIdx: index("ref_idx").on(table.ref) }),
);

export type CarAssets = InferSelectModel<typeof assets>;
