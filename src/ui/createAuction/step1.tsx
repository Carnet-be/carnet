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
const Step1 = ({ data, setData }: { data: Data1; setData: any }) => {
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

        <div className="flex flex-row gap-3">
          <FormControl className="w-1/2">
            <InputLabel htmlFor="brand">Année</InputLabel>
            <Select
              value={data.buildYear}
              label="Année"
              disabled={data.brand === undefined ? true : false}
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
        <span className="translate-x-2 translate-y-3">Color</span>
        <Slider {...settings} className="">
          {COLORS.map((o, i) => {
            const isActive = data.color == o;
            return (
              <BodyItem
                key={i}
                isActive={isActive}
                color={o}
                onClick={() => {
                  setData({ ...data, color: o });
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

  onClick: () => void;
};
const BodyItem = ({ isActive, color, onClick }: BodyItemProps) => {
  return (
    <div
      onClick={onClick}
      style={{ backgroundColor: color }}
      className={cx("h-[50px] w-[50px] cursor-pointer rounded-full", {
        "border-[3px] border-primary": isActive,
      })}
    ></div>
  );
};
export default Step1;
