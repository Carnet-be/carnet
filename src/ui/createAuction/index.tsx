/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import cx from "classnames";
import { BackIcon } from "../icons";
import { type TFuel } from "@data/internal";
import { useSession } from "next-auth/react";
import Step1 from "./step1";
import Step2 from "./step2";

export type Data1 = {
  brand?: number;
  fuel: TFuel;
  model?: number;
  buildYear?: number;
};
export type Data3 = {
  carrosserie?: number;
  transmission?: number;
  check?: number;
  kilometrage?:number
};
const CreateAuction = () => {
  const [step, setstep] = useState(1);
  const next = () => {
    let nextStep=step+1
    if(nextStep===2 && session) nextStep++ 
    setstep(nextStep)
  };
  const back = () => 
  {
    let nextStep=step-1
    if(nextStep===2 && session) nextStep--
    setstep(nextStep)
  };
  const {data:session}=useSession()
  const [isNext, setisNext] = useState(false);
  const [data1, setdata1] = useState<Data1>({
    fuel: "Gasoline",
  });
  const [data3, setdata3] = useState<Data3>({});
  useEffect(() => {
    const isNext1 =
      step === 1
        ? 
          data1.buildYear!==undefined && 
          data1.model!==undefined
        : true;
     const isNext3= step === 3
        ? (data3.kilometrage!==undefined && data3.carrosserie!==undefined && data3.transmission!==undefined&& data3.check==undefined)
          ? true
          : false
        : true;
    setisNext(isNext1);
  }, [data1, step]);

useEffect(() => {
  if(step===2 && session){
       next()
  }
}, [session])


  return (
    <>
      <input type="checkbox" id="create_auction" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box flex min-h-[450px] flex-col justify-between lg:max-w-2xl">
          <Stepper step={step} />
          {step == 1 && <Step1 data={data1} setData={setdata1} />}
          {step == 2 && <Step2 />}
          <div className="modal-action flex flex-row items-center">
            <label htmlFor="create_auction" className="btn-ghost btn-sm btn">
              annuler
            </label>
            <div className="flex-grow"></div>
            <button
              onClick={back}
              className={cx("btn-outline btn-primary btn-sm btn", {
                hidden: step <= 1,
              })}
            >
              <BackIcon />
            </button>
            <button
              onClick={next}
              className={cx("btn-primary btn-sm btn", {
                "btn-disabled": !isNext,
                "hidden":step==2
              })}
            >
              continuer
            </button>
          </div>
        </div>
      </div>
    </>
  );
};


const Stepper = ({ step }: { step: number }) => {
  return (
    <ul className="steps w-full">
      {Array.from({ length: 6 }, (_, i) => i + 1).map((k) => {
        return (
          <li
            key={k}
            className={cx("step", {
              "step-primary": k <= step,
            })}
          ></li>
        );
      })}
    </ul>
  );
};
export default CreateAuction;
