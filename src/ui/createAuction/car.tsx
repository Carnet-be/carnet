/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef, useState } from "react";
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
import { trpc } from "@utils/trpc";
import { toast } from "react-hot-toast";
import {
  AssetImage,
  type FuelType,
  type AuctionState,
  Auction,
} from "@prisma/client";
import { Router, useRouter } from "next/router";
import type { TCar } from "@model/type";
import { TAuction } from "@model/type";
import { ProcessDate } from "@utils/processDate";
import Step7 from "./step7";
import { sendNotification } from "../../repository";
import { LangCommonContext, LangContext, useLang } from "../../pages/hooks";
import type { BuyNow, Data1, Data3, Data4, Data5, Data6, Data7} from ".";
import { Stepper } from ".";

const CreateAuctionCar = ({
  auction,

  onCancel,
  id,
  refetch,
  afterPublish,
  isAdmin,
}: {
  auction?: TCar;
  isEdit?: boolean;
  onCancel?: () => void;
  id?: string;
  refetch?: () => void;
  afterPublish?: (first: AuctionState, second: AuctionState) => void;
  isAdmin?: boolean;
}) => {
  const { text } = useLang({
    file: "dashboard",
    selector: "auction",
  });
  const { text: common } = useLang(undefined);
  const [edit, setedit] = useState(auction);
  const [step, setstep] = useState(1);
  const next = () => {
    let nextStep = step + 1;
    if (auction) {
    } else {
      if (nextStep === 2 && session) nextStep++;
    }
    setstep(nextStep);
  };
  const back = () => {
    let nextStep = step - 1;
    if (auction) {
    } else {
      if (nextStep === 2 && session) nextStep--;
    }
    setstep(nextStep);
  };
  const uploadRef = useRef();
  const { data: session } = useSession();
  const [isNext, setisNext] = useState(false);
  const [isValid, setisValid] = useState(false);
  const [data1, setdata1] = useState<Data1>({
    brand: auction?.brand,
    model: auction?.model,
    buildYear: auction?.build_year || undefined,
    fuel: "Gasoline",
  });
  const [data3, setdata3] = useState<Data3>({});
  const [data7, setdata7] = useState<Data7>({});
  const [data4, setdata4] = useState<Data4>({});
  const [buyNow, setBuyNow] = useState<BuyNow>({
    buyNow: false,
    price: undefined,
  });
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

  const [data6, setdata6] = useState<Data6>({ images: [], duration: "3 days" });
  useEffect(() => {
    console.log("update editable auction");
    if (edit) {
      console.log("isEdit");
      const {
        brand,
        build_year,
        fuel,
        name,
        model,
        color,
        specs,
        address,
        options,
        rating,
        images,
        price,
      } = edit;
      const d1: Data1 = {
        brand,
        model,
        buildYear: build_year,
        color: color || undefined,
        fuel,
      };
      const {
        carrosserie,
        cc,
        co2,
        cv,
        kilometrage,
        doors,
        version,
        transmission,
      } = specs;
      console.log(specs);
      const d3: Data3 = {
        carrosserie: carrosserie === null ? undefined : carrosserie,
        transmission: transmission === null ? undefined : transmission,
        cc: cc || undefined,
        co2: co2 || undefined,
        cv: cv || undefined,
        kilometrage: kilometrage || undefined,
        doors: doors ? doors.toString() : "0" || undefined,
        version: version || undefined,
      };

      const { handling, tires, exterior, interior } = rating;
      const d4: Data4 = {
        handling: handling || undefined,
        tires: tires || undefined,
        exterior: exterior || undefined,
        interior: interior || undefined,
      };
      const o: any = { ...options };
      delete o.id;
      delete o.auction_id;
      delete o.auction;
      console.log(Object.keys(o));
      const d5: Data5 = {
        ...o,
      };

      const { description } = edit;
      const { address: adresse, zipCode, city, country, lat, lon } = address;

      const d6: Data6 = {
        name,
        images,
        duration: "3 days",
        address: adresse || undefined,
        description: description || undefined,
        zipCode: zipCode || undefined,
        city: city || undefined,
        country: country || undefined,
        lat: lat || undefined,
        lon: lon || undefined,
      };
      setBuyNow({
        buyNow: true,
        price: edit.price,
      });
      setdata3(d3);
      setdata4(d4);
      setdata5(d5);
      setdata6(d6);
      setdata1(d1);
    } else {
      console.log("no Edit");
    }
  }, [edit]);

  useEffect(() => {
    const isNext1 =
      step === 1
        ? data1.brand !== undefined &&
          // data1.buildYear !== undefined &&
          data1.model !== undefined &&
          data1.color !== undefined
        : true;
    const isNext3 =
      step === (auction ? 2 : 3)
        ? data3.kilometrage &&
          data3.carrosserie !== undefined &&
          data3.transmission !== undefined &&
          data3.cc !== undefined &&
          data3.doors !== undefined
          ? true
          : false
        : true;
    setisNext(isNext1 && isNext3);
  }, [data1, step, data3]);

  useEffect(() => {
    if (step === 2 && session && !auction) {
      next();
    }
  }, [session]);

  useEffect(() => {
    let valide = true;

    if (data6.address == undefined) valide = false;

    if (data6.description == undefined) valide = false;
    if (data6.city == undefined) valide = false;
    if (data6.country == undefined) valide = false;
    if (data6.zipCode == undefined) valide = false;
    // if (data6.lat == undefined) valide = false;
    // if (data6.lon == undefined) valide = false;
    if (buyNow.buyNow) {
      if (buyNow.price == undefined) valide = false;
    } else {
      if (data6.duration == undefined) valide = false;
      if (data6.expected_price == undefined) valide = false;
    }

    setisValid(step === 5 && valide);
  }, [data6, data1]);
  const router = useRouter();
  const { mutate: addAuction, isLoading } =
    trpc.auctionnaire.addAuction.useMutation({
      onError: (err) => {
        toast.dismiss();
        console.log("Error from AddAuction > ", err);
        toast.error("Erreur lors de l'ajout");
      },
      onSuccess: (data, v) => {
        toast.dismiss();
        toast.success("Opération réussi");
        sendNotification({
          type: "new auction",
          date: new Date(),
          auction_id: data.id,
          auctioner_id: data.auctionnaire_id,
        });
        //if data typeof is auction
        if (v.buyNow.buyNow) {
          router.push("/dashboard/entreprise/garage");
        } else {
          router.push("/dashboard/entreprise/myauctions");
        }

        router.push("/dashboard/entreprise/myauctions");
        ref.current?.click();
      },
      onMutate: () => toast.loading("En cours de traitement"),
    });
  const { mutate: updateAuction, isLoading: isUpdating } =
    trpc.auctionnaire.updateCar.useMutation({
      onError: (err) => {
        toast.dismiss();
        console.log("Error from Update Auction > ", err);
        toast.error("Failed updating");
      },
      onSuccess: (data) => {
        toast.dismiss();
        toast.success("Opération réussi");

        //  router.push("/dashboard/entreprise/myauctions")
        if (afterPublish && auction && auction.state !== data[0].state)
          afterPublish(auction?.state, data[0].state);
        if (refetch) {
          refetch();
        }
        ref.current?.click();
      },
      onMutate: () => toast.loading("Processing"),
    });
  const onValid = () => {
    if (edit) {
      updateAuction({
        data1,
        data3,
        data4,
        data5,
        data6,
        auction: edit,

        buyNow,
      });
    } else {
      addAuction({ data1, data3, data4, data5, data6, buyNow });
    }
  };
  const onPublish = ({ state, log }: { state: AuctionState; log: string }) =>
    updateAuction({
      data1,
      data3,
      data4,
      data5,
      data6,
      auction: edit,
      state,
      buyNow,
    });
  const ref = useRef<HTMLLabelElement | null>(null);
  return (
    <LangContext.Provider value={text}>
      <LangCommonContext.Provider value={common}>
        <input
          type="checkbox"
          id={id || "create_auction"}
          className="modal-toggle"
        />
        <div className={cx("modal fixed top-0 left-0 z-[1000]")}>
          <div className="modal-box flex min-h-[500px] flex-col justify-between gap-2 lg:max-w-2xl">
            <StepperEdit isAdmin={isAdmin} step={step} />

            {step == 1 && (
              <Step1
                data={data1}
                setData={setdata1}
                disabled={auction == undefined ? false : true}
              />
            )}

            {step == 2 && <Step3 data={data3} setData={setdata3} />}
            {step == 3 && <Step4 data={data4} setData={setdata4} />}
            {step == 4 && <Step5 data={data5} setData={setdata5} />}
            {step == 5 && (
              <Step6
                data={data6}
                setBuyNow={setBuyNow}
                buyNow={buyNow}
                readOnly={{
                  buyNow: true,
                }}
                uploadRef={uploadRef}
                setData={setdata6}
                defaultName={edit?.name || ""}
              />
            )}

            <div className="modal-action flex flex-row items-center">
              <label
                ref={ref}
                onClick={onCancel}
                htmlFor={id || "create_auction"}
                className="btn-ghost btn-sm btn"
              >
                {common("button.cancel")}
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
                  hidden: (step == 2 && !auction) || step == 5,
                })}
              >
                {common("button.next")}
              </button>
              <button
                onClick={onValid}
                className={cx("btn-primary btn-sm btn", {
                  "btn-disabled": !isValid || isLoading || isUpdating,
                  hidden: auction || step !== 5,
                })}
              >
                {common("button.validate")}
              </button>
              <button
                onClick={() =>
                  onPublish({
                    log:
                      auction?.state == "pause"
                        ? "edit"
                        : step == 5
                        ? "published"
                        : "edit",
                    state:
                      step == 5 ? "published" : auction?.state || "published",
                  })
                }
                className={cx("btn-warning btn-sm btn", {
                  hidden: !auction,
                })}
              >
                {common(
                  "button." +
                    (auction?.state == "pause"
                      ? "save"
                      : step == 5
                      ? "save and publish"
                      : "save")
                )}
              </button>
            </div>
          </div>
        </div>
      </LangCommonContext.Provider>
    </LangContext.Provider>
  );
};

export default CreateAuctionCar;

const StepperEdit = ({
  step,
  isAdmin,
}: {
  step: number;
  isAdmin?: boolean;
}) => {
  const t = useContext(LangContext);
  const text = (key: string) => t(`steps.${key}`);
  return (
    <ul className="steps w-full  text-[10px] font-bold">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((k, i) => {
        return (
          <li
            key={k}
            className={cx("step", {
              "step-primary": k <= step,
            })}
          >
            {k === 1 && text("identify")}
            {k === 2 && text("specs")}
            {k === 3 && text("options")}
            {k === 4 && text("rating")}

            {k === 5 && text("validation")}
          </li>
        );
      })}
    </ul>
  );
};
