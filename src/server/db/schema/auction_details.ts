import { type InferSelectModel } from "drizzle-orm";
import { mysqlTable, int, float, mysqlEnum, timestamp } from "drizzle-orm/mysql-core";

const auctionDetails = mysqlTable("auction_details", {
    id: int("id").autoincrement().primaryKey(),
    startingPrice: float("starting_price").default(0.0),
    commission: float("commission").default(0.0),
    duration: mysqlEnum("duration", ["3d", "7d", "14d", "30d"]).default("3d"),
    expectedPrice: float("expected_price").default(0.0),
    startedAt: timestamp("started_at"),
    endedAt: timestamp("ended_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  });
  
    export default auctionDetails
  export type AuctionDetails = InferSelectModel<typeof auctionDetails>;