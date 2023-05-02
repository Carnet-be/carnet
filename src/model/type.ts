/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  Address,
  Auction,
  AuctionOptions,
  AuctionRating,
  AuctionSpecs,
  User,
  Bid,
  AssetImage,
} from "@prisma/client";

//Auth
export type TLogin = {
  email: string;
  password: string;
};
export type PSignup = {
  username: string;
  email: string;
  tel: string;
};
export type TSignup = PSignup & {
  confirmPassword: string;
  password: string;
};

export type TSignupAuc = TSignup;

export type TSignupBidder = TSignup & {
  nomEntreprise: string;
};

//
export type UserType = "BID" | "AUC" | "ADMIN" | "STAFF";
export type Utilisateur = PSignup & {
  type: UserType; //BID=bidder AUC=auctionnaire
};

export type TAuction = Auction & {
  specs: AuctionSpecs;
  address: Address;
  options: AuctionOptions;
  rating: AuctionRating;
  bids: TBid[];
  bidder: TUser;
  images: AssetImage[];
};
export type TUser = User & {
  auctions: Auction[];
  image: AssetImage | null;
  favoris_auctions: Auction[];
};
export type TBid = Bid & { bidder: TUser };

export type TypeNotification =
  | "new user"
  | "new auction"
  | "new message"
  | "higher bid"
  | "winner"
  | "new bid"
  | "auction modified"
  | "cancel winner"
  | "auction expired"
  | "auction 1h left"
  | "auction 3h left";

export type TAudience = {
  id: string;
  name: string;
  hasRead: boolean;
  type: UserType;
};
export type TNotification = {
  type: TypeNotification;
  date: Date;
  uid?: string;
  hasRead?: string[];
  [key: string]: any;
};

export type Lang = "fr" | "en";
