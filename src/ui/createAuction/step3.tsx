/* eslint-disable @typescript-eslint/no-explicit-any */
import image from "@assets/newAuctionImage.png";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import Image from "next/image";
import { INTERIOR_LINING } from "@data/internal";
import { type Data3 } from ".";
import { TRANSMISSION } from "../../data/internal";
import { CARROSSERIE } from "../../data/internal";
const Step3 = ({ data, setData }: { data: Data3; setData: any }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      
     
      <div className="flex w-full flex-col gap-4 py-4  lg:w-[80%]">
        <div className="flex w-full flex-row items-center gap-6">
          <FormControl className="w-1/2">
            <InputLabel htmlFor="brand">Carrosserie / Body</InputLabel>
            <Select
              value={data.carrosserie}
              label="Carrosserie / Body"
              onChange={(e) =>
                setData({
                  ...data,
                  carrosserie: e.target.value,
                })
              }
            >
              {CARROSSERIE.map((o, i) => (
                <MenuItem key={i} value={i}>
                  {o}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className="w-1/2">
            <InputLabel htmlFor="model">Transmission</InputLabel>
            <Select
              value={data.transmission}
              labelId="model"
              label="Transmission"
              onChange={(e) =>
                setData({ ...data, transmission: e.target.value })
              }
            >
              {TRANSMISSION.map((o, i) => (
                <MenuItem key={i} value={i}>
                  {o}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="flex w-full flex-row items-center gap-6">
          <FormControl className="w-1/2">
            <InputLabel htmlFor="brand">Interior lining / Check</InputLabel>
            <Select
              value={data.check}
              label=" Interior lining / Check"
              onChange={(e) =>
                setData({
                  ...data,
                  check: e.target.value,
                })
              }
            >
              {INTERIOR_LINING.map((o, i) => (
                <MenuItem key={i} value={i}>
                  {o}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className="w-1/2">
            <OutlinedInput
              id="outlined-adornment-weight"
              type="number"
              value={data.kilometrage}
              onChange={(e) =>
                setData({ ...data, kilometrage: e.target.value })
              }
              endAdornment={<InputAdornment position="end">Km</InputAdornment>}
            />
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default Step3;
