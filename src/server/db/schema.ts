import {
  boolean,
  float,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  serial,
  text,
  timestamp,
  tinyint,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const assets = mysqlTable(
  "assets",
  {
    id: int("id").autoincrement().notNull(),
    ref: int("ref").notNull(),
    key: varchar("key", { length: 255 }).notNull(),
    url: varchar("url", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).onUpdateNow(),
    type: mysqlEnum("type", ["image", "video", "audio"]),
  },
  (table) => {
    return {
      refIdx: index("ref_idx").on(table.ref),
      assetsId: primaryKey(table.id),
    };
  },
);

export const biddings = mysqlTable(
  "biddings",
  {
    id: int("id").autoincrement().notNull(),
    carId: int("car_id").notNull(),
    bidderId: int("bidder_id").notNull(),
    amount: float("amount").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    isWinner: tinyint("is_winner").default(0),
  },
  (table) => {
    return {
      bidderIdIdx: index("bidder_id_idx").on(table.bidderId),
      carIdIdx: index("car_id_idx").on(table.carId),
      biddingsId: primaryKey(table.id),
    };
  },
);

export const bodies = mysqlTable(
  "bodies",
  {
    id: int("id").autoincrement().notNull(),
    name: varchar("name", { length: 255 }),
    logo: varchar("logo", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => {
    return {
      bodiesId: primaryKey(table.id),
    };
  },
);

export const brands = mysqlTable(
  "brands",
  {
    id: int("id").autoincrement().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    countryId: int("country_id"),
    logo: varchar("logo", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => {
    return {
      brandsId: primaryKey(table.id),
      brandsNameUnique: unique("brands_name_unique").on(table.name),
    };
  },
);

export const carOptions = mysqlTable(
  "car_options",
  {
    id: int("id").autoincrement().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => {
    return {
      carOptionsId: primaryKey(table.id),
      carOptionsNameUnique: unique("car_options_name_unique").on(table.name),
    };
  },
);

export const carToOption = mysqlTable(
  "car_to_option",
  {
    id: int("id").autoincrement().notNull(),
    carId: int("car_id"),
    optionId: int("option_id"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => {
    return {
      carIdIdx: index("car_id_idx").on(table.carId),
      optionIdIdx: index("option_id_idx").on(table.optionId),
      carToOptionId: primaryKey(table.id),
    };
  },
);

export const cars = mysqlTable(
  "cars",
  {
    id: int("id").autoincrement().notNull(),
    belongsTo: varchar("belongsTo", { length: 255 }).notNull(),
    state: mysqlEnum("state", ["new", "used"]),
    type: mysqlEnum("type", ["auction", "direct"]).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).onUpdateNow(),
    description: text("description"),
    bodyId: int("body_id"),
    brandId: int("brand_id").notNull(),
    modelId: int("model_id"),
    year: int("year"),
    color: int("color"),
    fuel: mysqlEnum("fuel", ["gasoline", "diesel", "electricity", "hybrid"]),
    status: mysqlEnum("status", [
      "pending",
      "published",
      "paused",
      "finished",
      "completed",
      "sold",
    ])
      .default("pending")
      .notNull(),
    statusChangedAt: timestamp("status_changed_at", { mode: "string" }),
    minPrice: float("min_price"),
    maxPrice: float("max_price"),
    inRange: boolean("in_range"),
    price: float("price"),
    countryId: int("country_id"),
    cityId: int("city_id"),
    address: varchar("address", { length: 255 }),
    lat: float("lat"),
    lon: float("lon"),
    zipCode: varchar("zip_code", { length: 15 }),
    startingPrice: float("starting_price"),
    commission: float("commission"),
    duration: mysqlEnum("duration", ["3d", "7d", "14d", "30d"]).default("3d"),
    expectedPrice: float("expected_price"),
    startedAt: timestamp("started_at", { mode: "string" }),
    endedAt: timestamp("ended_at", { mode: "string" }),
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
    kilometrage: float("kilometrage"),
    version: varchar("version", { length: 255 }),
  },
  (table) => {
    return {
      belongsToIdx: index("belongs_to_idx").on(table.belongsTo),
      bodyIdIdx: index("body_id_idx").on(table.bodyId),
      colorIdIdx: index("color_id_idx").on(table.color),
      carsId: primaryKey(table.id),
    };
  },
);

export const cities = mysqlTable(
  "cities",
  {
    id: int("id").autoincrement().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    countryId: int("country_id"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => {
    return {
      countryIdIdx: index("country_id_idx").on(table.countryId),
      citiesId: primaryKey(table.id),
      citiesNameUnique: unique("cities_name_unique").on(table.name),
    };
  },
);

export const colors = mysqlTable(
  "colors",
  {
    id: int("id").autoincrement().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    value: varchar("value", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => {
    return {
      colorsId: primaryKey(table.id),
      colorsNameUnique: unique("colors_name_unique").on(table.name),
      colorsValueUnique: unique("colors_value_unique").on(table.value),
    };
  },
);

export const countries = mysqlTable(
  "countries",
  {
    id: int("id").autoincrement().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    flag: varchar("flag", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => {
    return {
      countriesId: primaryKey(table.id),
      countriesNameUnique: unique("countries_name_unique").on(table.name),
    };
  },
);

export const garageStatistics = mysqlTable(
  "garage_statistics",
  {
    id: serial("id").notNull(),
    garageId: int("garage_id").notNull(),
    userId: int("user_id"),
    action: varchar("action", { length: 100 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => {
    return {
      garageIdIdx: index("garage_id_idx").on(table.garageId),
      garageStatisticsId: primaryKey(table.id),
    };
  },
);

export const garages = mysqlTable(
  "garages",
  {
    id: serial("id").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    orgId: varchar("org_id", { length: 255 }).notNull(),
    cover: varchar("cover", { length: 255 }),
    about: text("about"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).onUpdateNow(),
    state: varchar("state", { length: 100 }),
  },
  (table) => {
    return {
      orgIdIdx: index("org_id_idx").on(table.orgId),
      garagesId: primaryKey(table.id),
    };
  },
);

export const models = mysqlTable(
  "models",
  {
    id: int("id").autoincrement().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    brandId: int("brand_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    year: int("year"),
  },
  (table) => {
    return {
      modelsId: primaryKey(table.id),
      modelsNameYearUnique: unique("models_name_year_unique").on(
        table.name,
        table.year,
      ),
    };
  },
);
