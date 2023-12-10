import { type InferSelectModel } from "drizzle-orm";
import { mysqlTable, int, timestamp, index } from "drizzle-orm/mysql-core";

 const carToOption = mysqlTable(
  "car_to_option",
  {
    id: int("id").autoincrement().primaryKey(),
    carId: int("car_id"),
    optionId: int("option_id"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => ({
    carIdIdx: index("car_id_idx").on(table.carId),
    optionIdIdx: index("option_id_idx").on(table.optionId),
  }),
);

export type CarToOption = InferSelectModel<typeof carToOption>;

export default carToOption;