import type { Auction } from "@prisma/client";
import { isConfirmation } from "./date";

export type FullStatus = "published" | "pending"  | "pause"  | "completed"  | "confirmation";
export const getStatus = (a: Auction): FullStatus => {
  let state: FullStatus = a.state;
  if (a.isClosed || a.closedAt) state = "completed";
  if (a.state == "published") {
    if (isConfirmation(a.end_date)) {
      state = "confirmation";
    }
  }
  return state;
};
