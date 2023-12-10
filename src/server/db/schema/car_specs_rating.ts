import { type InferSelectModel } from "drizzle-orm";
import { mysqlTable, int, timestamp, index, unique } from "drizzle-orm/mysql-core";

 const carSpecsRating = mysqlTable(
    "car_specs_rating",
    {
      id: int("id").autoincrement().primaryKey(),
      handling: int("handling"),
      tires: int("tires"),
      exterior: int("exterior"),
      interior: int("interior"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").onUpdateNow(),
      carId: int("car_id").notNull(),
    },
    (table) => ({
      carIdIdx: index("car_id_idx").on(table.carId),
      unique: unique("car_id_UNIQUE").on(table.carId),
    }),
  );
  
  export type CarSpecsRating = InferSelectModel<typeof carSpecsRating>;
    
        export default carSpecsRating