/* eslint-disable @typescript-eslint/no-explicit-any */
import image from "@assets/newAuctionImage.png";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Image from "next/image";
import { BRAND } from "@data/internal";
import { type Data1 } from ".";
const Step1 = ({ data, setData }: { data: Data1; setData: any }) => {
    return (
      <div className="flex flex-col items-center gap-4">
        <Image alt="image" src={image} height={40} />
        <h5>Vous voulez vendre votre voiture?</h5>
        <div className="flex w-full flex-col gap-4 py-4  lg:w-[80%]">
          <div className="flex w-full flex-row items-center gap-6">
            <FormControl className="w-1/2">
              <InputLabel htmlFor="brand">Marque</InputLabel>
              <Select
                value={data.brand}
                label="Marque"
                onChange={(e) => {
                  console.log(typeof e.target.value);
  
                  setData({
                    ...data,
                    brand: e.target.value,
                    model: 0,
                    buildYear: 0,
                  });
                }}
              >
                {BRAND.map((o, i) => (
                  <MenuItem key={i} value={i}>
                    {o.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="w-1/2">
              <InputLabel htmlFor="model">Modèle</InputLabel>
              <Select
                value={data.model}
                labelId="model"
                label="Modèle"
                disabled={data.brand ? false : data.brand == 0 ? false : true}
                onChange={(e) => setData({ ...data, model: e.target.value })}
              >
                {BRAND[data.brand || 0]?.model.map((o, i) => (
                  <MenuItem key={i} value={i}>
                    {o}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="flex w-full flex-row items-center gap-6">
            <FormControl className="w-1/2">
              <InputLabel htmlFor="brand">Année</InputLabel>
              <Select
                value={data.buildYear}
                label="Année"
                disabled={data.brand ? false : data.brand == 0 ? false : true}
                onChange={(e) =>
                  setData({
                    ...data,
                    buildYear: e.target.value,
                  })
                }
              >
                {BRAND[data.brand || 0]?.buildYear.map((o, i) => (
                  <MenuItem key={i} value={i}>
                    {o}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="w-1/2">
              <InputLabel htmlFor="model">Carburant</InputLabel>
              <Select
                value={data.fuel}
                label="Cardurant"
                onChange={(e) => setData({ ...data, fuel: e.target.value })}
              >
                {["Gasoline", "Diesel ", "Electricity", "Hybrid"].map((f, i) => (
                  <MenuItem key={i} value={f}>
                    {f}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
    );
  };

export default Step1