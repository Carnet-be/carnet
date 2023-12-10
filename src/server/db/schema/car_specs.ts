import { type InferSelectModel } from "drizzle-orm";
import { mysqlTable, int, mysqlEnum, float, varchar, timestamp, index, unique } from "drizzle-orm/mysql-core";

const carSpecs = mysqlTable(
    "car_specs",
    {
      id: int("id").autoincrement().primaryKey(),
      body: int("carrosserie"),
      transmission: mysqlEnum("transmission", ['manual', 'automatic', 'semi-automatic']),
      doors: int("doors"),
      cv: float("cv"),
      cc: float("cc"),
      co2: float("co2"),
      mileage: float("kilometrage"),
      version: varchar("version", { length: 255 }),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").onUpdateNow(),
      carId: int("car_id").notNull(),
    },
    (table) => ({
      carIdIdx: index("car_id_idx").on(table.carId),
      unique: unique("car_id_UNIQUE").on(table.carId),
    }),
  );
  
  export type CarSpecs = InferSelectModel<typeof carSpecs>;

    export default carSpecs