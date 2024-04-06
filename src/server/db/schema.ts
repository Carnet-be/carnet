import {
  boolean,
  doublePrecision,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const assets = pgTable(
  "assets",
  {
    id: serial("id").notNull().primaryKey(),
    ref: integer("ref").notNull(),
    key: varchar("key", { length: 255 }).notNull(),
    url: varchar("url", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at"),
    type: varchar("type", { length: 100, enum: ["image", "video", "audio"] }),
  },
  (table) => {
    return {
      refIdx: index("ref_idx").on(table.ref),
    };
  },
);

export const biddings = pgTable(
  "biddings",
  {
    id: serial("id").notNull().primaryKey(),
    carId: integer("car_id").notNull(),
    bidderId: varchar("bidder_id", { length: 255 }).notNull(),
    amount: doublePrecision("amount").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    isWinner: integer("is_winner").default(0),
  },
  (table) => {
    return {
      bidderIdIdx: index("bidder_id_idx").on(table.bidderId),
      carIdIdx: index("car_id_idx").on(table.carId),
    };
  },
);

export const bodies = pgTable("bodies", {
  id: serial("id").notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  logo: varchar("logo", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const brands = pgTable(
  "brands",
  {
    id: serial("id").notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    countryId: integer("country_id"),
    logo: varchar("logo", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      brandsNameUnique: unique("brands_name_unique").on(table.name),
    };
  },
);

export const carOptions = pgTable(
  "car_options",
  {
    id: serial("id").notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      carOptionsNameUnique: unique("car_options_name_unique").on(table.name),
    };
  },
);

export const carToOption = pgTable("car_to_option", {
  id: serial("id").notNull().primaryKey(),
  carId: integer("car_id")
    .references(() => cars.id)
    .notNull(),
  optionId: integer("option_id")
    .references(() => carOptions.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cars = pgTable(
  "cars",
  {
    id: serial("id").notNull().primaryKey(),
    belongsTo: varchar("belongsTo", { length: 255 }).notNull(),
    state: varchar("state", { length: 100, enum: ["new", "used"] }),
    type: varchar("type", {
      length: 100,
      enum: ["auction", "direct"],
    }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at"),
    description: text("description"),
    bodyId: integer("body_id").references(() => bodies.id),
    brandId: integer("brand_id").references(() => brands.id),
    modelId: integer("model_id").references(() => models.id),
    year: integer("year"),
    color: integer("color").references(() => colors.id),
    fuel: varchar("fuel", {
      length: 100,
      enum: ["gasoline", "diesel", "electricity", "hybrid"],
    }),
    status: varchar("status", {
      length: 100,
      enum: ["pending", "published", "paused", "finished", "completed", "sold"],
    })
      .default("pending")
      .notNull(),
    statusChangedAt: timestamp("status_changed_at"),
    minPrice: doublePrecision("min_price"),
    maxPrice: doublePrecision("max_price"),
    inRange: boolean("in_range"),
    price: doublePrecision("price"),
    countryId: integer("country_id"),
    cityId: integer("city_id"),
    address: varchar("address", { length: 255 }),
    lat: doublePrecision("lat"),
    lon: doublePrecision("lon"),
    zipCode: varchar("zip_code", { length: 15 }),
    startingPrice: doublePrecision("starting_price"),
    commission: doublePrecision("commission"),
    duration: varchar("duration", {
      length: 100,
      enum: ["3d", "7d", "14d", "30d"],
    }).default("3d"),
    expectedPrice: doublePrecision("expected_price"),
    startedAt: timestamp("started_at"),
    endedAt: timestamp("ended_at"),
    handling: integer("handling"),
    tires: integer("tires"),
    exterior: integer("exterior"),
    interior: integer("interior"),
    transmission: varchar("transmission", {
      length: 100,
      enum: ["manual", "automatic", "semi-automatic"],
    }),
    doors: integer("doors"),
    cv: doublePrecision("cv"),
    cc: doublePrecision("cc"),
    co2: doublePrecision("co2"),
    kilometrage: doublePrecision("kilometrage"),
    version: varchar("version", { length: 255 }),
  },
  (table) => {
    return {
      belongsToIdx: index("belongs_to_idx").on(table.belongsTo),
    };
  },
);

export const cities = pgTable(
  "cities",
  {
    id: serial("id").notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    countryId: integer("country_id")
      .notNull()
      .references(() => countries.id),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      citiesNameUnique: unique("cities_name_unique").on(table.name),
    };
  },
);

export const colors = pgTable(
  "colors",
  {
    id: serial("id").notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    value: varchar("value", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      colorsNameUnique: unique("colors_name_unique").on(table.name),
      colorsValueUnique: unique("colors_value_unique").on(table.value),
    };
  },
);

export const countries = pgTable(
  "countries",
  {
    id: serial("id").notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    flag: varchar("flag", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      countriesNameUnique: unique("countries_name_unique").on(table.name),
    };
  },
);

// export const garageStatistics = pgTable("garage_statistics", {
//   id: serial("id").notNull().primaryKey(),
//   garageId: integer("garage_id")
//     .references(() => garages.id)
//     .notNull(),
//   userId: integer("user_id"),
//   action: varchar("action", { length: 100 }).notNull(),
//   createdAt: timestamp("created_at").defaultNow(),
// });

export const garages = pgTable(
  "garages",
  {
    id: serial("id").notNull().primaryKey(),
    orgId: varchar("org_id", { length: 255 }).notNull(),
    cover: varchar("cover", { length: 255 }),
    about: text("about"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at"),
    state: varchar("state", {
      length: 100,
      enum: ["published", "draft", "expired"],
    }).default("draft"),
  },
  (table) => {
    return {
      orgIdIdx: index("org_id_idx").on(table.orgId),
    };
  },
);

export const models = pgTable(
  "models",
  {
    id: serial("id").notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    brandId: integer("brand_id")
      .notNull()
      .references(() => brands.id),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      modelsNameYearUnique: unique("models_name_brand_unique").on(
        table.name,
        table.brandId,
      ),
    };
  },
);

export const profiles = pgTable("organizations", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  email: varchar("email", { length: 255 }),
  email2: varchar("email2", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
  phone2: varchar("phone2", { length: 255 }),
  address: text("address"),
});
