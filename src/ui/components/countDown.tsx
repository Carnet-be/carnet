/* eslint-disable react-hooks/exhaustive-deps */
import type { DurationType } from "@prisma/client";
import { TimerIcon } from "@ui/icons";
import { ProcessDate } from "@utils/processDate";
import moment from "moment";
import { useEffect, useState } from "react";
import cx from "classnames";

export function executeEverySecond(endDate:Date,initDate?:Date) {
 
  const process = new ProcessDate(endDate);
  const secondLeft = process.getSecondsFronmNow(initDate);

  return  moment.duration(secondLeft<=0?0:secondLeft, "s");
}
const CountDown = ({
  endDate,
  onTimeOut,
  variant
}: {
  endDate: Date;
  onTimeOut: () => void;variant:"primary"|"secondary"
}) => {
  const [leftTime, setleft] = useState<moment.Duration>(executeEverySecond(endDate));


  useEffect(() => {
    const interval = setInterval(() =>leftTime.asSeconds()>0&& setleft(executeEverySecond(endDate)), 1000);
    return () => {
      clearInterval(interval);
    };
  }, [executeEverySecond]);
useEffect(()=>{

  if(leftTime.asSeconds()<=0){
    console.log("Testing isTime out")
    onTimeOut()
  }
},[leftTime])
 if(variant=="primary"){
  return (
    <div
      className={cx(
        "flex flex-row items-center justify-center gap-1 px-3 py-6 font-semibold text-2xl",
        leftTime.asSeconds()<=0 ? "text-red-500" : " text-primary"
      )}
    >
      <TimerIcon className="text-2xl" />
      <span>
        {leftTime?.days()}
        <span className="text-base font-light">days</span>
      </span>
      <span>
        {leftTime?.hours()}
        <span className="text-base font-light">h</span>
      </span>
      <span>
        {leftTime?.minutes()}
        <span className="text-base font-light">m</span>
      </span>
      <span>
        {leftTime?.seconds()}
        <span className="text-base font-light">s</span>
      </span>
    </div>
  );
 }
  return (
  <div
    className={cx(
      "flex flex-row items-center justify-center gap-1 font-semibold text-sm",
      leftTime.asSeconds()<=0 ? "text-red-500" : " text-primary"
    )}
  >
    <TimerIcon className="text-lg" />
    <span>
      {leftTime?.days()}
      <span className="text-base font-light">d</span>
    </span>
    <span>
      {leftTime?.hours()}
      <span className="text-base font-light">h</span>
    </span>
    <span>
      {leftTime?.minutes()}
      <span className="text-base font-light">m</span>
    </span>
    {/* <span>
      {leftTime?.seconds()}
      <span className="text-base font-light">s</span>
    </span> */}
  </div>
);
};

export default CountDown;
