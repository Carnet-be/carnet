import { type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  float,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

const cars = mysqlTable(
  "cars",
  {
    id: int("id").autoincrement().primaryKey(),
    belongsTo: varchar("belongsTo", { length: 255 }).notNull(),
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
    ])
      .notNull()
      .default("pending"),
    statusChangedAt: timestamp("status_changed_at"),
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
    startingPrice: float("starting_price").default(0.0),
    commission: float("commission").default(0.0),
    duration: mysqlEnum("duration", ["3d", "7d", "14d", "30d"]).default("3d"),
    expectedPrice: float("expected_price").default(0.0),
    startedAt: timestamp("started_at"),
    endedAt: timestamp("ended_at"),
    handling: int("handling"),
    tires: int("tires"),
    exterior: int("exterior"),
    interior: int("interior"),
    transmission: mysqlEnum("transmission", [
      "manual",
      "automatic",
      "semi-automatic",
    ]),
    doors: int("doors"),
    cv: float("cv"),
    cc: float("cc"),
    co2: float("co2"),
    mileage: float("kilometrage"),
    version: varchar("version", { length: 255 }),
  },
  (table) => ({
    belongsToIdx: index("belongs_to_idx").on(table.belongsTo),
    bodyIdIdx: index("body_id_idx").on(table.bodyId),
    colorIdIdx: index("color_id_idx").on(table.colorId),
  }),
);

export type Car = InferSelectModel<typeof cars>;

export default cars;

