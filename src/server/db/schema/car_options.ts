import { type InferSelectModel } from "drizzle-orm";
import { mysqlTable, int, varchar, timestamp } from "drizzle-orm/mysql-core";

 const carOption = mysqlTable("car_option", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  });

    export default carOption
  
  export type CarOption = InferSelectModel<typeof carOption>;