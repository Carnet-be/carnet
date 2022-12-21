import type {Auction, User } from "@prisma/client";

export type TAuction=Auction
export type TUser=User &{auctions:Auction[]}