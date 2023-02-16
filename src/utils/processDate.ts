/* eslint-disable @typescript-eslint/no-explicit-any */
import { type DurationType } from "@prisma/client";

export class ProcessDate {
  date: Date | undefined;
  constructor(date: Date | string=new Date()) {
    if (date instanceof String) {
      this.date = new Date(date);
    }
    if (date instanceof Date) {
      this.date = date;
    }
  }
  getDuration(d: "3 days" | "1 week" | "2 weeks"): DurationType {
    switch (d) {
      case "3 days":
        return "ThreeDays";
      case "1 week":
        return "OneWeek";
      case "2 weeks":
        return "TwoWeek";
        default:
        return "ThreeDays"
    }
  }
  getDurationName(d:DurationType):  "3 days" | "1 week" | "2 weeks" {
    switch (d) {
      case "ThreeDays":
        return "3 days";
      case "OneWeek":
        return "1 week";
      case  "TwoWeek":
        return "2 weeks";
        default:
        return "3 days"
    }
  }
  addDays(numOfDays: number, date = new Date()) {
    date.setDate(date.getDate() + numOfDays);
    return date;
  }
  endDate(durationType: DurationType) {
    switch (durationType) {
      case "ThreeDays":
        return this.addDays(3);
      case "OneWeek":
        return this.addDays(7);
      case "TwoWeek":
        return this.addDays(14);

      default:
        return this.addDays(3);
    }
  }
  getSecondsDiff(startDate:any, endDate:any) {
    const msInSecond = 1000;
  
    return Math.round(
      Math.abs(endDate - startDate) / msInSecond
    );
  }
  getSecondsFronmNow() {
    const msInSecond = 1000;
  const now= new Date()
    return Math.round((this.date as any - (now as any)) / msInSecond
    );
  }
  getSecondsFromDate(initDate?:Date) {
    const msInSecond = 1000;
  const now=initDate|| new Date()
    return Math.round((this.date as any - (now as any)) / msInSecond
    );
  }
}
