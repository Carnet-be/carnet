import { type Auction } from "@prisma/client";

export class ProcessAuction {
  auction: Auction;
  constructor(auction: Auction) {
    this.auction = auction;
  }
  getDurationType() {
    switch (this.auction.duration) {
      case "ThreeDays":
        return "3 days";
      case "OneWeek":
        return "1 week";
      case "TwoWeek":
        return "2 weeks";
      default:
        return "3 days";
    }
  }

  getTimer(){
    return "2j 05h 34min"
  }

  
}
