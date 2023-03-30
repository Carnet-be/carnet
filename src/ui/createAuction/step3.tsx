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

import Slider from "react-slick";
import cx from "classnames";
import { ArrowRightIconFill, CheckIcon } from "@ui/icons";
import { ArrowLeftIconFill } from "../icons";
import { RiErrorWarningLine } from "react-icons/ri";
import { Collapse } from "antd";
import { useContext } from "react";
import { LangCommonContext, LangContext } from "../../pages/hooks";
const { Panel } = Collapse;
// var settings = {
//   dots: true,
//   infinite: false,
//   speed: 500,
//   slidesToShow: 4,
//   slidesToScroll: 4,
//   initialSlide: 0,
//   responsive: [
//     {
//       breakpoint: 1024,
//       settings: {
//         slidesToShow: 3,
//         slidesToScroll: 3,
//         infinite: true,
//         dots: true
//       }
//     },
//     {
//       breakpoint: 600,
//       settings: {
//         slidesToShow: 2,
//         slidesToScroll: 2,
//         initialSlide: 2
//       }
//     },
//     {
//       breakpoint: 480,
//       settings: {
//         slidesToShow: 1,
//         slidesToScroll: 1
//       }
//     }
//   ]
// };
export function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <ArrowRightIconFill
      className={className + " text-[17px] text-black"}
      onClick={onClick}
    />
  );
}

export function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <ArrowLeftIconFill
      className={className + " text-[17px] text-black"}
      onClick={onClick}
    />
  );
}
const Step3 = ({ data, setData }: { data: Data3; setData: any }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  const common = useContext(LangCommonContext);
  const text = useContext(LangContext);
  const fields = (s: string) => text("fields." + s);
  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div className="flex w-full flex-col gap-4 py-4  lg:w-[80%]">
          <Slider {...settings} className="mb-4">
            {CARROSSERIE.map((o, i) => {
              console.log(data.carrosserie);
              const isActive = data.carrosserie == i;
              return (
                <BodyItem
                  key={i}
                  isActive={isActive}
                  title={text("carossery." + o.title.toLowerCase())}
                  img={o.img}
                  onClick={() => {
                    setData({ ...data, carrosserie: i });
                  }}
                />
              );
            })}
          </Slider>

          <div className="flex w-full flex-row items-center gap-3">
            <FormControl required className="w-1/2">
              <InputLabel htmlFor="brand">{fields("doors")}</InputLabel>
              <Select
                value={data.doors}
                label={fields("doors")}
                onChange={(e) =>
                  setData({
                    ...data,
                    doors: e.target.value,
                  })
                }
              >
                {[2, 3, 4, 5, 6, 7].map((o, i) => (
                  <MenuItem key={i} value={o}>
                    {o}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl required className="w-1/2">
              <InputLabel htmlFor="model">{fields("transmission")}</InputLabel>
              <Select
                value={data.transmission}
                labelId="model"
                label={fields("transmission")}
                onChange={(e) =>
                  setData({ ...data, transmission: e.target.value })
                }
              >
                {TRANSMISSION.map((o, i) => (
                  <MenuItem key={i} value={i}>
                    {text("transmission." + o.toLowerCase())}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="flex w-full flex-row items-center justify-center gap-2">
            <FormControl required className="flex-grow">
              <InputLabel htmlFor="model">{fields("engine size")}</InputLabel>
              <OutlinedInput
                label={fields("engine size")}
                id="outlined-adornment-weight"
                type="number"
                value={data.cc}
                onChange={(e) => setData({ ...data, cc: e.target.value })}
                endAdornment={
                  <InputAdornment position="end">
                    <span className="mesure"> CC</span>
                  </InputAdornment>
                }
              />
            </FormControl>

            <FormControl required className="flex-grow">
              <InputLabel htmlFor="model">{fields("mileage")}</InputLabel>
              <OutlinedInput
                id="outlined-adornment-weight"
                type="number"
                label={fields("mileage")}
                value={data.kilometrage}
                onChange={(e) =>
                  setData({ ...data, kilometrage: e.target.value })
                }
                endAdornment={
                  <InputAdornment position="end">
                    <span className="mesure"> Km</span>
                  </InputAdornment>
                }
              />
            </FormControl>
          </div>
          <div className="flex flex-row gap-3"></div>
          <Collapse
            bordered={false}
            onChange={(k) => {
              if (k.length <= 0) {
                setData({
                  ...data,
                  cv: undefined,
                  co2: undefined,
                  version: undefined,
                });
              }
            }}
            className="-mx-10"
          >
            <Panel header={text("text.optionals")} key="1">
              <div className="flex flex-row gap-3">
                <FormControl className="flex-grow">
                  <InputLabel htmlFor="model">
                    {fields("horse power")}
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-weight"
                    type="number"
                    label={fields("horse power")}
                    value={data.cv}
                    onChange={(e) => setData({ ...data, cv: e.target.value })}
                    endAdornment={
                      <InputAdornment position="end">
                        <span className="mesure"> CV</span>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormControl className="flex-grow">
                  <InputLabel htmlFor="model">
                    {fields("co2 emission")}
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-weight"
                    type="number"
                    label={fields("co2 emission")}
                    value={data.co2}
                    onChange={(e) => setData({ ...data, co2: e.target.value })}
                    endAdornment={
                      <InputAdornment position="end">
                        <span className="mesure"> g/km</span>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormControl className="flex-grow">
                  <InputLabel htmlFor="model">{fields("version")}</InputLabel>
                  <OutlinedInput
                    label="Version"
                    id="outlined-adornment-weight"
                    // type="number"

                    value={data.version}
                    onChange={(e) =>
                      setData({ ...data, version: e.target.value })
                    }
                    endAdornment={
                      <InputAdornment position="end" className="cursor-pointer">
                        {" "}
                        <label
                          htmlFor="find-verison"
                          className="btn-ghost btn-xs btn"
                        >
                          <RiErrorWarningLine className="text-2xl text-blue-400">
                            {" "}
                          </RiErrorWarningLine>
                        </label>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>
            </Panel>
          </Collapse>
        </div>
      </div>

      <input type="checkbox" id="find-verison" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative h-[500px]">
          <label
            htmlFor="find-verison"
            className="btn-sm btn-circle btn absolute right-2 top-2"
          >
            ✕
          </label>
        </div>
      </div>
    </>
  );
};

type BodyItemProps = {
  isActive: boolean;
  title: string;
  img: string;
  onClick: () => void;
};
const BodyItem = ({ isActive, title, img, onClick }: BodyItemProps) => {
  return (
    <div
      onClick={onClick}
      className={cx(
        "relative flex h-[100px] w-[110px] cursor-pointer flex-col rounded-md border",
        {
          "border-primary text-primary": isActive,
        }
      )}
    >
      <div
        className={cx("absolute top-1 right-1 text-lg", {
          hidden: !isActive,
        })}
      >
        <CheckIcon />
      </div>
      <Image
        src={"/assets/step2/" + img + ".svg"}
        alt={title}
        height={70}
        width={200}
      />
      <span className="text-center">{title}</span>
    </div>
  );
};
export default Step3;
