import { type InferSelectModel } from "drizzle-orm";
import {
  index,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

const garages = mysqlTable(
  "garages",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    orgId: varchar("org_id", { length: 255 }).notNull(),
    cover: varchar("cover", { length: 255 }),
    about: text("about"),
    state: varchar("state", { length: 100, enum: ["active", "inactive"] }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    orgIdIdx: index("org_id_idx").on(table.orgId),
  }),
);

export type Garage = InferSelectModel<typeof garages>;

export default garages;
