import { type InferSelectModel } from "drizzle-orm";
import { boolean, float, index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";


const cars = mysqlTable(
  "cars",
  {
    id: int("id").autoincrement().primaryKey(),
    belongsTo: varchar("belongs_to", { length: 255 }).notNull(),
    state: mysqlEnum("state", ["new", "used"]),
    type: mysqlEnum("type", ["auction", "direct"]).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
    description: text("description"),
    bodyId: int("body_id"),
    brandId: int("brand_id").notNull(),
    modelId: int("model_id"),
    year: int("year"),
    colorId: int("color"),
    fuel: mysqlEnum("fuel", ["gasoline", "diesel", "electricity", "hybrid"]),
    status: mysqlEnum("status", [
      "pending",
      "published",
      "paused",
      "finished",
      "completed",
      "sold",
    ]).notNull().default("pending"),
    statusChangedAt: timestamp("status_changed_at"),
    auctionDetailsId: int("auction_details_id"),
    minPrice: float("min_price"),
    maxPrice: float("max_price"),
    inRange: boolean("in_range").default(false),
    price: float("price"),
    countryId: int("country_id"),
    cityId: int("city_id"),
    address: varchar("address", { length: 255 }),
    lat: float("lat"),
    lon: float("lon"),
    zipCode: varchar("zip_code", { length: 15 }),
  },
  (table) => ({
    belongsToIdx: index("belongs_to_idx").on(table.belongsTo),
    bodyIdIdx: index("body_id_idx").on(table.bodyId),
    colorIdIdx: index("color_id_idx").on(table.colorId),
  }),
);

export type Car = InferSelectModel<typeof cars>;

export default cars