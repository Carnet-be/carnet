
import type {Address, Auction, AuctionOptions, AuctionRating, AuctionSpecs, User,Bid, AssetImage } from "@prisma/client";

//Auth
export type TLogin={
  email:string,
  password:string
}
export type PSignup={
  username:string,
  email:string,
}
export type TSignup = PSignup&{
    confirmPassword:string
    password:string,
  };
  
export type TSignupAuc = TSignup;

export type TSignupBidder = TSignup&{
    nomEntreprise:string
  };

  //
  export type UserType="BID"|"AUC"|"ADMIN"|"STAFF"
  export type Utilisateur =PSignup&{
  
    type:UserType,//BID=bidder AUC=auctionnaire

  }

export type TAuction=Auction &{specs:AuctionSpecs,address:Address,options:AuctionOptions,rating:AuctionRating,bids:TBid[],bidder:TUser,images:AssetImage[]}
export type TUser=User &{auctions:Auction[],image:AssetImage|null}
export type TBid=Bid &{bidder:TUser}