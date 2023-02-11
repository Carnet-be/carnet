/* eslint-disable @typescript-eslint/no-explicit-any */
import image from "@assets/newAuctionImage.png";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Image from "next/image";
import { BRAND, COLORS } from "@data/internal";
import { type Data1 } from ".";
import { ArrowRightIconFill, CheckIcon } from "@ui/icons";
import { ArrowLeftIconFill } from "../icons";
import Slider from "react-slick";
import { SampleNextArrow, SamplePrevArrow } from "./step3";
import cx from "classnames";
import { BsCheck } from "react-icons/bs";
import { AiFillCheckCircle } from 'react-icons/ai';
import { useEffect, useState } from "react";
const Step1 = ({ data, setData,disabled }: { data: Data1; setData: any,disabled:boolean }) => {

 const [time, setTime] = useState(Date.now());

  useEffect(() => {
  const interval = setInterval(() => setTime(Date.now()), 100);
  return () => {
    clearInterval(interval);
  };
}, []);
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <Image alt="image" src={image} height={60} />
      <h5>Vous voulez vendre votre voiture?</h5>
      <div className="flex w-full flex-col gap-4 py-4  lg:w-[80%]">
        <div className="flex flex-row gap-3">
          <FormControl required className="w-1/2">
            <InputLabel htmlFor="brand">Marque</InputLabel>
            <Select
              value={data.brand}
              disabled={disabled}
              label="Marque"
              defaultValue={data.brand}
              onChange={(e) => {
                console.log(typeof e.target.value);

                setData({
                  ...data,
                  brand: e.target.value,
                  model: 0,
                  buildYear: BRAND[e.target.value as number||0]?.buildYear[0],
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
          <FormControl required className="w-1/2">
            <InputLabel htmlFor="model">Modèle</InputLabel>
            <Select
              value={data.model}
              labelId="model"
              label="Modèle"
            
              disabled={disabled?true:data.brand ? false : data.brand == 0 ? false : true}
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

        <div className="flex flex-row gap-3">
          <FormControl  required className="w-1/2">
            <InputLabel htmlFor="brand">Année</InputLabel>
            <Select
              value={data.buildYear}
              label="Année"
              disabled={disabled?true:data.brand === undefined ? true : false}
              onChange={(e) =>
                setData({
                  ...data,
                  buildYear: e.target.value,
                })
              }
            >
              {BRAND[data.brand || 0]?.buildYear
                .sort()
                .reverse()
                .map((o, i) => (
                  <MenuItem key={i} value={o}>
                    {o}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl required className="w-1/2">
            <InputLabel htmlFor="model">Carburant</InputLabel>
            <Select
              value={data.fuel}
              label="Cardurant"
              disabled={disabled}
              onChange={(e) => setData({ ...data, fuel: e.target.value })}
            >
              {["Gasoline", "Diesel", "Electricity", "Hybrid"].map((f, i) => (
                <MenuItem key={i} value={f}>
                  {f}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Slider {...settings} className="">
          {COLORS.map((o, i) => {
            const isActive = data.color == o.value;
            return (
              <BodyItem
                key={i}
                name={o.name}
                isActive={isActive}
                color={o.value}
                onClick={() => {
                  setData({ ...data, color: o.value });
                }}
              />
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

type BodyItemProps = {
  isActive: boolean;
  color: string;
name:string,
  onClick: () => void;
};
const BodyItem = ({ isActive, color, onClick,name }: BodyItemProps) => {
  return (
   <div className="flex flex-col items-center gap-1">
     <div
      onClick={onClick}
      style={{ backgroundColor: color }}
      className={cx("h-[50px] w-[50px] cursor-pointer rounded-full  border", {
        "border-[3px] border-primary": isActive,
      })}
    ></div>
      <span className={cx("text-[10px]",isActive&&"text-white bg-primary rounded-md px-2 py-[1px]")}>{name}</span>
   </div>
  );
};
export default Step1;
