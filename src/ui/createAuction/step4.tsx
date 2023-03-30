/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rating } from "@mui/material";
import { EXTERIOR, HANDLING, INTERIOR, TIRES } from "@data/internal";
import { type Data4 } from ".";

import { StarIcon } from "@ui/icons";
import { useContext, useState } from "react";
import { LangCommonContext, LangContext } from "../../pages/hooks";

// handling?: number;
// tires?: number;
// exterior?: number;
// interior?:number

const Step4 = ({ data, setData }: { data: Data4; setData: any }) => {
  const [hover1, setHover1] = useState(-1);
  const [hover2, setHover2] = useState(-1);
  const [hover3, setHover3] = useState(-1);
  const [hover4, setHover4] = useState(-1);
  const common = useContext(LangCommonContext);
  const text = useContext(LangContext);
  const rate = (s: string) => text(`rating text.${s}`);
  return (
    <div className="flex flex-col items-center gap-4 px-8 transition-all">
      <div className="flex h-[70px] w-full flex-col items-start gap-1 rounded-md border px-4 py-2">
        <div className="flex flex-row items-center gap-8">
          <span className="w-[100px] font-semibold text-primary">
            {text("fields.handling")}
          </span>
          <Rating
            value={data.handling || 0}
            onChange={(event, newValue) => {
              setData({ ...data, handling: newValue });
            }}
            onChangeActive={(event, newHover) => {
              setHover1(newHover);
            }}
            size="large"
            icon={
              <StarIcon
                style={{ margin: "0px 5px", padding: "0px" }}
                fontSize="inherit"
              />
            }
            emptyIcon={
              <StarIcon
                style={{ opacity: 0.55, margin: "0px 5px", padding: "0px" }}
                fontSize="inherit"
              />
            }
          />
        </div>
        <div className="flex flex-row items-center gap-8">
          <span className="w-[100px] font-semibold text-primary"></span>
          {data.handling !== null && (
            <span className="pl-2 text-sm italic text-black/70">
              {rate(`handling.${hover1 !== -1 ? hover1 : data.handling}`)}
            </span>
          )}
        </div>
      </div>
      <div className="flex h-[70px] w-full flex-col items-start gap-1 rounded-md border px-4 py-2">
        <div className="flex flex-row items-center gap-8">
          <span className="w-[100px] font-semibold text-primary">
            {text("fields.exterior")}
          </span>

          <Rating
            value={data.exterior}
            onChange={(event, newValue) => {
              setData({ ...data, exterior: newValue });
            }}
            onChangeActive={(event, newHover) => {
              setHover2(newHover);
            }}
            size="large"
            icon={
              <StarIcon
                style={{ margin: "0px 5px", padding: "0px" }}
                fontSize="inherit"
              />
            }
            emptyIcon={
              <StarIcon
                style={{ opacity: 0.55, margin: "0px 5px", padding: "0px" }}
                fontSize="inherit"
              />
            }
          />
        </div>
        <div className="flex flex-row items-center gap-8">
          <span className="w-[100px] font-semibold text-primary"></span>
          {data.exterior !== null && (
            <span className="pl-2 text-sm italic text-black/70">
              {rate(`exterior.${hover2 !== -1 ? hover2 : data.exterior}`)}
            </span>
          )}
        </div>
      </div>
      <div className="flex h-[70px] w-full flex-col items-start gap-1 rounded-md border px-4 py-2">
        <div className="flex flex-row items-center gap-8">
          <span className="w-[100px] font-semibold text-primary">
            {text("fields.interior")}
          </span>

          <Rating
            value={data.interior}
            onChange={(event, newValue) => {
              setData({ ...data, interior: newValue });
            }}
            onChangeActive={(event, newHover) => {
              setHover3(newHover);
            }}
            size="large"
            icon={
              <StarIcon
                style={{ margin: "0px 5px", padding: "0px" }}
                fontSize="inherit"
              />
            }
            emptyIcon={
              <StarIcon
                style={{ opacity: 0.55, margin: "0px 5px", padding: "0px" }}
                fontSize="inherit"
              />
            }
          />
        </div>
        <div className="flex flex-row items-center gap-8">
          <span className="w-[100px] font-semibold text-primary"></span>
          {data.interior !== null && (
            <span className="pl-2 text-sm italic text-black/70">
              {rate(`interior.${hover3 !== -1 ? hover3 : data.interior}`)}
            </span>
          )}
        </div>
      </div>

      <div className="flex h-[70px] w-full flex-col items-start gap-1 rounded-md border px-4 py-2">
        <div className="flex flex-row items-center gap-8">
          <span className="w-[100px] font-semibold text-primary">
            {text("fields.tires")}
          </span>

          <Rating
            value={data.tires}
            onChange={(event, newValue) => {
              setData({ ...data, tires: newValue });
            }}
            onChangeActive={(event, newHover) => {
              setHover4(newHover);
            }}
            size="large"
            icon={
              <StarIcon
                style={{ margin: "0px 5px", padding: "0px" }}
                fontSize="inherit"
              />
            }
            emptyIcon={
              <StarIcon
                style={{ opacity: 0.55, margin: "0px 5px", padding: "0px" }}
                fontSize="inherit"
              />
            }
          />
        </div>
        <div className="flex flex-row items-center gap-8">
          <span className="w-[100px] font-semibold text-primary"></span>
          {data.tires !== null && (
            <span className="pl-2 text-sm italic text-black/70">
              {rate(`tires.${hover4 !== -1 ? hover4 : data.tires}`)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step4;
