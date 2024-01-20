/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
// export const countries = mysqlTable("countries", {
//   id: int("id").autoincrement().primaryKey(),
//   name: varchar("name", { length: 255 }).notNull().unique(),
//   flag: varchar("flag", { length: 255 }),
//   createdAt: timestamp("createdAt").defaultNow(),
// });
// export type Country = InferSelectModel<typeof countries>;

// export const cities = mysqlTable(
//   "cities",
//   {
//     id: int("id").autoincrement().primaryKey(),
//     name: varchar("name", { length: 255 }).notNull().unique(),
//     countryId: int("country_id"),
//     createdAt: timestamp("createdAt").defaultNow(),
//   },
//   (table) => ({
//     countryIdIdx: index("country_id_idx").on(table.countryId),
//   }),
// );

// export type City = InferSelectModel<typeof cities>;

/// Brand table
// export const brand = mysqlTable("brand", {
//   id: int("id").autoincrement().primaryKey(),
//   name: varchar("name", { length: 255 }).notNull().unique(),
//   countryId: int("country_id"),
//   logo: varchar("logo", { length: 255 }),
//   createdAt: timestamp("createdAt").defaultNow(),
// });

// export type Brand = InferSelectModel<typeof brand>;

// export const brandRelations = relations(brand, ({ one, many }) => ({
//   country: one(countries, {
//     fields: [brand.countryId],
//     references: [countries.id],
//   }),
//   brands: many(model),
// }));

/// Model table

// export const model = mysqlTable(
//   "model",
//   {
//     id: int("id").autoincrement().primaryKey(),
//     name: varchar("name", { length: 255 }).notNull().unique(),
//     brandId: int("brand_id").notNull(),
//     createdAt: timestamp("createdAt").defaultNow(),
//   },
//   (table) => ({
//     unq: unique().on(table.name, table.brandId),
//   }),
// );

// export type Model = InferSelectModel<typeof model>;

// export const modelRelations = relations(model, ({ one }) => ({
//   brand: one(brand, {
//     fields: [model.brandId],
//     references: [brand.id],
//   }),
// }));

//Color

// export const colors = mysqlTable("colors", {
//   id: int("id").autoincrement().primaryKey(),
//   name: varchar("name", { length: 255 }).notNull().unique(),
//   value: varchar("value", { length: 255 }).notNull().unique(),
//   createdAt: timestamp("createdAt").defaultNow(),
// })

// export type Color = InferSelectModel<typeof colors>;

// export const colorRelations = relations(colors, ({ many }) => ({
//   cars:many(cars)
// }));

/// Body

// export const body = mysqlTable("body", {
//   id: int("id").autoincrement().primaryKey(),
//   name: varchar("name", { length: 255 }).notNull().unique(),
//   logo: varchar("logo", { length: 255 }),
//   createdAt: timestamp("createdAt").defaultNow(),
// });

// export type Body = InferSelectModel<typeof body>;

/// Car table
// export const auctionDetails = mysqlTable("auction_details", {
//   id: int("id").autoincrement().primaryKey(),
//   startingPrice: float("starting_price").default(0.0),
//   commission: float("commission").default(0.0),
//   duration: mysqlEnum("duration", ["3d", "7d", "14d", "30d"]).default("3d"),
//   expectedPrice: float("expected_price").default(0.0),
//   startedAt: timestamp("started_at"),
//   endedAt: timestamp("ended_at"),
//   createdAt: timestamp("createdAt").defaultNow(),
//   updatedAt: timestamp("updatedAt").onUpdateNow(),
// });

// export type AuctionDetails = InferSelectModel<typeof auctionDetails>;

// export const carAssets = mysqlTable(
//   "car_assets",
//   {
//     id: int("id").autoincrement().primaryKey(),
//     carId: int("car_id").notNull(),
//     key: varchar("key", { length: 255 }).notNull(),
//     url: varchar("url", { length: 255 }),
//     createdAt: timestamp("createdAt").defaultNow(),
//     updatedAt: timestamp("updatedAt").onUpdateNow(),
//   },
//   (table) => ({ carIdIdx: index("car_id_idx").on(table.carId) }),
// );

// export type CarAssets = InferSelectModel<typeof carAssets>;

// export const carAssetsRelations = relations(carAssets, ({ one }) => ({
//   car: one(cars, {
//     fields: [carAssets.carId],
//     references: [cars.id],
//   }),
// }));

// export const cars = mysqlTable(
//   "cars",
//   {
//     id: int("id").autoincrement().primaryKey(),
//     belongsTo: varchar("belongs_to", { length: 255 }).notNull(),
//     state: mysqlEnum("state", ["new", "used"]),
//     type: mysqlEnum("type", ["auction", "direct"]).notNull(),
//     name: varchar("name", { length: 255 }).notNull(),
//     createdAt: timestamp("createdAt").defaultNow(),
//     updatedAt: timestamp("updatedAt").onUpdateNow(),
//     description: text("description"),
//     bodyId: int("body_id"),
//     brandId: int("brand_id").notNull(),
//     modelId: int("model_id"),
//     year: int("year"),
//     colorId: int("color"),
//     fuel: mysqlEnum("fuel", ["gasoline", "diesel", "electricity", "hybrid"]),
//     status: mysqlEnum("status", [
//       "pending",
//       "published",
//       "paused",
//       "finished",
//       "completed",
//       "sold",
//     ]),
//     statusChangedAt: timestamp("status_changed_at"),
//     auctionDetailsId: int("auction_details_id"),
//     minPrice: float("min_price"),
//     maxPrice: float("max_price"),
//     inRange:boolean("in_range").default(false),
//     price: float("price"),
//     countryId: int("country_id"),
//     cityId: int("city_id"),
//     address: varchar("address", { length: 255 }),
//     lat: float("lat"),
//     lon: float("lon"),
//     zipCode: varchar("zip_code", { length: 15 }),
//   },
//   (table) => ({
//     belongsToIdx: index("belongs_to_idx").on(table.belongsTo),
//     bodyIdIdx: index("body_id_idx").on(table.bodyId),
//     colorIdIdx: index("color_id_idx").on(table.colorId),
//   }),
// );

// export type Car = InferSelectModel<typeof cars>;
// export const carRelations = relations(cars, ({ one, many }) => ({
//   brand: one(brand, {
//     fields: [cars.brandId],
//     references: [brand.id],
//   }),
//   model: one(model, {
//     fields: [cars.modelId],
//     references: [model.id],
//   }),
//   auctionDetails: one(auctionDetails, {
//     fields: [cars.auctionDetailsId],
//     references: [auctionDetails.id],
//   }),
//   images: many(carAssets),
//   specs: one(carSpecs, {
//     fields: [cars.id],
//     references: [carSpecs.carId],
//   }),
//   options: many(carToOption),
//   specsRating: many(carSpecsRating),
//   biddings: many(biddings),
//   body: one(body, {
//     fields: [cars.bodyId],
//     references: [body.id],
//   }),
//   color: one(colors, {
//     fields: [cars.colorId],
//     references: [colors.id],
//   })
// }));

// Car extra details
// export const carSpecs = mysqlTable(
//   "car_specs",
//   {
//     id: int("id").autoincrement().primaryKey(),
//     body: int("carrosserie"),
//     transmission: mysqlEnum("transmission", ['manual', 'automatic', 'semi-automatic']),
//     doors: int("doors"),
//     cv: float("cv"),
//     cc: float("cc"),
//     co2: float("co2"),
//     mileage: float("kilometrage"),
//     version: varchar("version", { length: 255 }),
//     createdAt: timestamp("createdAt").defaultNow(),
//     updatedAt: timestamp("updatedAt").onUpdateNow(),
//     carId: int("car_id").notNull(),
//   },
//   (table) => ({
//     carIdIdx: index("car_id_idx").on(table.carId),
//   }),
// );

// export type CarSpecs = InferSelectModel<typeof carSpecs>;

// export const carSpecsRating = mysqlTable(
//   "car_specs_rating",
//   {
//     id: int("id").autoincrement().primaryKey(),
//     handling: int("handling"),
//     tires: int("tires"),
//     exterior: int("exterior"),
//     interior: int("interior"),
//     createdAt: timestamp("createdAt").defaultNow(),
//     updatedAt: timestamp("updatedAt").onUpdateNow(),
//     carId: int("car_id").notNull(),
//   },
//   (table) => ({
//     carIdIdx: index("car_id_idx").on(table.carId),
//   }),
// );

// export type CarSpecsRating = InferSelectModel<typeof carSpecsRating>;

// export const carSpecsRatingRelations = relations(carSpecsRating, ({ one }) => ({
//   car: one(cars, {
//     fields: [carSpecsRating.carId],
//     references: [cars.id],
//   }),
// }));

// Car options
// export const carOption = mysqlTable("car_option", {
//   id: int("id").autoincrement().primaryKey(),
//   name: varchar("name", { length: 255 }),
//   createdAt: timestamp("createdAt").defaultNow(),
//   updatedAt: timestamp("updatedAt").onUpdateNow(),
// });

// export type CarOption = InferSelectModel<typeof carOption>;
// export const carToOption = mysqlTable(
//   "car_to_option",
//   {
//     id: int("id").autoincrement().primaryKey(),
//     carId: int("car_id"),
//     optionId: int("option_id"),
//     createdAt: timestamp("createdAt").defaultNow(),
//     updatedAt: timestamp("updatedAt").onUpdateNow(),
//   },
//   (table) => ({
//     carIdIdx: index("car_id_idx").on(table.carId),
//     optionIdIdx: index("option_id_idx").on(table.optionId),
//   }),
// );
// export type CarToOption = InferSelectModel<typeof carToOption>;

// export const carToOptionRelations = relations(carToOption, ({ one }) => ({
//   car: one(cars, {
//     fields: [carToOption.carId],
//     references: [cars.id],
//   }),
//   option: one(carOption, {
//     fields: [carToOption.optionId],
//     references: [carOption.id],
//   }),
// }));

// bid table

// export const biddings = mysqlTable(
//   "biddings",
//   {
//     id: int("id").autoincrement().primaryKey(),
//     carId: int("car_id").notNull(),
//     bidderId: int("bidder_id").notNull(),
//     amount: float("amount").notNull(),
//     createdAt: timestamp("createdAt").defaultNow(),
//     isWinner: boolean("is_winner").default(false),
//   },
//   (table) => ({
//     carIdIdx: index("car_id_idx").on(table.carId),
//     bidderIdIdx: index("bidder_id_idx").on(table.bidderId),
//   }),
// );

// export type Bidding = InferSelectModel<typeof biddings>;

// export const biddingsRelations = relations(biddings, ({ one }) => ({
//   car: one(cars, {
//     fields: [biddings.carId],
//     references: [cars.id],
//   }),
// }));

// export const garages= mysqlTable('garages',{
//   id:serial('id').primaryKey(),
//   name:varchar('name',{length:255}).notNull(),
//   orgId: varchar('org_id',{length:255}).notNull(),
//   cover:varchar('cover',{length:255}),
//   about:text('about'),

//   updatedAt:timestamp('updatedAt').defaultNow(),
//   updatedAt:timestamp('updatedAt').onUpdateNow()
// }, (table) => ({
//   orgIdIdx: index("org_id_idx").on(table.orgId),
// }))

// export type Garage = InferSelectModel<typeof garages>

// export const garageStatistics = mysqlTable('garage_statistics',{
//   id:serial('id').primaryKey(),
//   garageId:int('garage_id').notNull(),
//   userId:int('user_id'),
//   action:varchar('action',{length:100, enum:["view", "follow", "share"]}).notNull(),
//   updatedAt:timestamp('updatedAt').defaultNow(),
// }, (table) => ({
//   garageIdIdx: index("garage_id_idx").on(table.garageId),
// }))

// export type GarageStatistics = InferSelectModel<typeof garageStatistics>
