/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl, InputAdornment, InputLabel, OutlinedInput, Rating } from "@mui/material";
import { type Data4 } from ".";

import { StarIcon } from "@ui/icons";
import { useState } from "react";
import type { Data7 } from './index';

// handling?: number;
// tires?: number;
// exterior?: number;
// interior?:number

const Step7 = ({ data, setData }: { data: Data7; setData: any }) => {


  return (
    <div className="flex flex-row items-center gap-4 px-8 transition-all">
        <FormControl required className="flex-grow ">
              <InputLabel htmlFor="model">Starting Price</InputLabel>
              <OutlinedInput
                id="outlined-adornment-weight"
                type="number"
                label="Starting Price"
                value={data.starting_price}
                onChange={(e) =>
                  setData({ ...data, starting_price: e.target.value })
                }
                endAdornment={
                  <InputAdornment position="end">
                    <span className="mesure"> </span>
                  </InputAdornment>
                }
              />
            </FormControl>

            <FormControl required className="w-1/3">
              <InputLabel htmlFor="model">Commission</InputLabel>
              <OutlinedInput
                id="outlined-adornment-weight"
                type="number"
                label="Commission"
                value={data.commission}
                onChange={(e) =>
                  setData({ ...data, commission: e.target.value })
                }
                endAdornment={
                  <InputAdornment position="end">
                    <span className="mesure">%</span>
                  </InputAdornment>
                }
              />
            </FormControl>
    </div>
  );
};

export default Step7;
