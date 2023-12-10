import { type InferSelectModel } from "drizzle-orm";
import { mysqlTable, int, varchar, timestamp } from "drizzle-orm/mysql-core";

 const brand = mysqlTable("brand", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    countryId: int("country_id"),
    logo: varchar("logo", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
  });
  
  export type Brand = InferSelectModel<typeof brand>;

  export default brand
