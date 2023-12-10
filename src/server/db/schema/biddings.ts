import { type InferSelectModel } from "drizzle-orm";
import { mysqlTable,boolean, int, float, timestamp, index } from "drizzle-orm/mysql-core";


const biddings = mysqlTable(
    "biddings",
    {
      id: int("id").autoincrement().primaryKey(),
      carId: int("car_id").notNull(),
      bidderId: int("bidder_id").notNull(),
      amount: float("amount").notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      isWinner: boolean("is_winner").default(false),
    },
    (table) => ({
      carIdIdx: index("car_id_idx").on(table.carId),
      bidderIdIdx: index("bidder_id_idx").on(table.bidderId),
    }),
  );
  
  export type Bidding = InferSelectModel<typeof biddings>;

    export default biddings