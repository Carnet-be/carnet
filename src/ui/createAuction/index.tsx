/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import cx from "classnames";
import { BackIcon } from "../icons";
import { type TFuel } from "@data/internal";
import { useSession } from "next-auth/react";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import Step5 from "./step5";
import Step6 from "./step6";
import { BRAND } from "@data/internal";
import { type FileType } from "rsuite/esm/Uploader";

export type Data1 = {
  brand?: number;
  fuel: TFuel;
  model?: number;
  color?:string,
  buildYear?: number;
};
export type Data3 = {
  carrosserie?: number;
  transmission?: number;
  doors?: number;
  cv?:number,
  cc?:number,
  version?:string,
  co2?:number,
  kilometrage?: number;
};
export type Data4 = {
  handling?: number;
  tires?: number;
  exterior?: number;
  interior?: number;
};

export type Data5 = {
  airco: boolean;
  electric_windows: boolean;
  climate_control: boolean;
  panoramic_roof_or_open_roof: boolean;
  central_locking: boolean;
  xenon_lighting: boolean;
  light_alloy_wheels: boolean;
  four_by_four: boolean;
  power_steering: boolean;
  cruise_control: boolean;
  radio_cd: boolean;
  parking_sensors: boolean;
  on_board_computer: boolean;
  parking_camera: boolean;
  start_stop: boolean;
  electric_mirrors: boolean;
  abs: boolean;
  tow_hook: boolean;
  dead_angle_detection: boolean;
};

export type Data6 = {
  name?: string;
  images: FileType[];
  pricing?: number;
  expected_price?: number;
  duration: "3 days"|"1 week"|"2 weeks";
  address?: string;
  description?: string;
  zipCode?:string,
  city?:string,
  country?:string,
  lat?:number,
  lon?:number
};
const CreateAuction = () => {
  const [step, setstep] = useState(1);
  const next = () => {
    let nextStep = step + 1;
    if (nextStep === 2 && session) nextStep++;
    setstep(nextStep);
  };
  const back = () => {
    let nextStep = step - 1;
    if (nextStep === 2 && session) nextStep--;
    setstep(nextStep);
  };
  const uploadRef = useRef();
  const { data: session } = useSession();
  const [isNext, setisNext] = useState(false);
  const [isValid, setisValid] = useState(false);
  const [data1, setdata1] = useState<Data1>({
    fuel: "Gasoline",
  });
  const [data3, setdata3] = useState<Data3>({});

  const [data4, setdata4] = useState<Data4>({});
  const [data5, setdata5] = useState<Data5>({
    airco: false,
    electric_windows: false,
    climate_control: false,
    panoramic_roof_or_open_roof: false,
    central_locking: false,
    xenon_lighting: false,
    light_alloy_wheels: false,
    four_by_four: false,
    power_steering: false,
    cruise_control: false,
    radio_cd: false,
    parking_sensors: false,
    on_board_computer: false,
    parking_camera: false,
    start_stop: false,
    electric_mirrors: false,
    abs: false,
    tow_hook: false,
    dead_angle_detection: false,
  });

  const [data6, setdata6] = useState<Data6>({ images: [],duration:"3 days" });
  useEffect(() => {
    const isNext1 =
      step === 1
        ? data1.brand !== undefined &&
          data1.buildYear !== undefined &&
          data1.model !== undefined &&
          data1.color !== undefined
        : true;
    const isNext3 =
      step === 3
        ? data3.kilometrage &&
          data3.carrosserie !== undefined &&
          data3.transmission !== undefined &&
          data3.cc !== undefined &&
          data3.cv !== undefined &&
          data3.version !== undefined 
          &&
          data3.doors !== undefined 
          &&
          data3.co2 !== undefined 
  
          ? true
          : false
        : true;
    setisNext(isNext1 && isNext3);
  }, [data1, step, data3]);

  useEffect(() => {
    if (step === 2 && session) {
      next();
    }
  }, [session]);

  useEffect(() => {
    const isNext =
      step === 6
        ? data6.name &&
          data6.address &&
          data6.duration &&
          data6.expected_price 
          &&
          data6.description &&
          data6.country&&
          data6.city 
          ? true
          : false
        : true;

    setisValid(isNext);
  }, [data6,data1]);


  return (
    <>
      <input type="checkbox" id="create_auction" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box flex min-h-[450px] flex-col justify-between lg:max-w-2xl gap-6">
          <Stepper step={step} />
  
          {step == 1 && <Step1 data={data1} setData={setdata1} />}
          {step == 2 && <Step2 />}
          {step == 3 && <Step3 data={data3} setData={setdata3} />}
          {step == 5 && <Step4 data={data4} setData={setdata4} />}
          {step == 4 && <Step5 data={data5} setData={setdata5} />}
          {step == 6 && (
            <Step6
              data={data6}
              uploadRef={uploadRef}
              setData={setdata6}
              defaultName={
                BRAND[data1.brand || 0]?.title +
                " " +
                BRAND[data1.brand || 0]?.model[data1.model || 0] + " "+  data1.buildYear
              }
            />
          )}
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
                hidden: step == 2 || step == 6,
              })}
            >
              continuer
            </button>
            <button
              className={cx("btn-primary btn-sm btn", {
                "btn-disabled": !isValid,
                hidden: step !== 6,
              })}
            >
              valider
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
      {Array.from({ length: 6 }, (_, i) => i + 1).map((k,i) => {
        return (
          <li
            key={k}
            className={cx("step", {
              "step-primary": k <= step,
            })}
          >
            {k===1 &&"Identify"}
            {k===2 &&"Login / Registration"}
            {k===3 &&"Specs"}
            {k===4 &&"Options"}
            {k===5 &&"Rating"}
            {k===6 &&"Validation"} 
          </li>
        );
      })}
    </ul>
  );
};
export default CreateAuction;
