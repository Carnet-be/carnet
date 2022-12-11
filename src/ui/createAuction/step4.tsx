/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rating } from "@mui/material";
import { EXTERIOR, HANDLING, INTERIOR, TIRES } from "@data/internal";
import { type Data4 } from ".";

import { StarIcon } from "@ui/icons";
import { useState } from "react";

// handling?: number;
// tires?: number;
// exterior?: number;
// interior?:number

const Step4 = ({ data, setData }: { data: Data4; setData: any }) => {
  const [hover1, setHover1] = useState(-1);
  const [hover2, setHover2] = useState(-1);
  const [hover3, setHover3] = useState(-1);
  const [hover4, setHover4] = useState(-1);

  return (
    <div className="flex flex-col items-center gap-4 px-8 transition-all">
      <div className="flex w-full flex-row items-center gap-8 rounded-md border px-4 py-2 h-[65px]">
        <span className="w-[100px] font-semibold text-primary">Handling</span>

        <div className="flex flex-grow flex-col gap-1">
          <Rating
            value={data.handling||0}
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
          {data.handling !== null && (
            <span className="pl-2 text-sm italic text-black/70">
              {HANDLING[hover1 !== -1 ? hover1 : data.handling || 1000]||""}
            </span>
          )}
        </div>
      </div>
      <div className="flex w-full flex-row items-center gap-8 rounded-md border px-4 py-2 h-[65px]">
        <span className="w-[100px] font-semibold text-primary">Exterior</span>

        <div className="flex flex-grow flex-col  gap-1">
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
          {data.exterior !== null && (
            <span className="pl-2 text-sm italic text-black/70">
              {EXTERIOR[hover2 !== -1 ? hover2 : data.exterior  || 1000]||""}
            </span>
          )}
        </div>
      </div>
      <div className="flex w-full flex-row items-center gap-8 rounded-md border px-4 py-2 h-[65px]">
        <span className="w-[100px] font-semibold text-primary">Interior</span>

        <div className="flex flex-grow flex-col  gap-1">
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
          {data.interior !== null && (
            <span className="pl-2 text-sm italic text-black/70">
              {INTERIOR[hover3 !== -1 ? hover3 : data.interior  || 1000]||""}
            </span>
          )}
        </div>
      </div>

      <div className="flex w-full flex-row items-center gap-8 rounded-md border px-4 py-2 h-[65px]">
        <span className="w-[100px] font-semibold text-primary">Tires</span>

        <div className="flex flex-grow flex-col  gap-1">
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
          {data.tires !== null && (
            <span className="pl-2 text-sm italic text-black/70">
              {TIRES[hover4 !== -1 ? hover4 : data.tires || 0]}
            </span>
          )}
        </div>
      </div>

    </div>
  );
};

export default Step4;
