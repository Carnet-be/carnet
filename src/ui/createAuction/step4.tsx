/* eslint-disable @typescript-eslint/no-explicit-any */
import {  Rating } from "@mui/material";
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
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-row gap-8 items-center">
      <span className="font-semibold">Handling : </span>
    
      <Rating
        value={data.handling}
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
      <div className="flex flex-row items-center gap-3">
       
        {data.handling !== null && (
          <span className="text-sm font-semibold italic">
            {HANDLING[hover1 !== -1 ? hover1 : data.handling || 0]}
          </span>
        )}
      </div>
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
      <div className="flex flex-row items-center gap-3">
        <h6>EXTERIOR : </h6>
        {data.exterior !== null && (
          <span className="text-sm font-semibold italic">
            {EXTERIOR[hover2 !== -1 ? hover2 : data.exterior || 0]}
          </span>
        )}
      </div>
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
      <div className="flex flex-row items-center gap-3">
        <h6>INTERIOR : </h6>
        {data.interior !== null && (
          <span className="text-sm font-semibold italic">
            {INTERIOR[hover3 !== -1 ? hover3 : data.interior || 0]}
          </span>
        )}
      </div>

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
      <div className="flex flex-row items-center gap-3 transition-all">
        <h6>TIRES : </h6>
        {data.tires !== null && (
          <span className="text-sm font-semibold italic">
            {TIRES[hover4 !== -1 ? hover4 : data.tires || 0]}
          </span>
        )}
      </div>
    </div>
  );
};

export default Step4;
