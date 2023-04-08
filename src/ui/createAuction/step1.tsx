/* eslint-disable @typescript-eslint/no-explicit-any */
import image from "@assets/newAuctionImage.png";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { BRAND, COLORS } from "@data/internal";
import { type Data1 } from ".";
import { ArrowRightIconFill, CheckIcon } from "@ui/icons";
import { ArrowLeftIconFill } from "../icons";
import Slider from "react-slick";
import { SampleNextArrow, SamplePrevArrow } from "./step3";
import cx from "classnames";
import { BsCheck } from "react-icons/bs";
import { AiFillCheckCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useLang } from "../../pages/hooks";
import AutoComplete from "@ui/components/autoComplete";
import { trpc } from "@utils/trpc";

const Step1 = ({
  data,
  setData,
  disabled,
}: {
  data: Data1;
  setData: any;
  disabled: boolean;
}) => {
  const { text } = useLang({
    file: "dashboard",
    selector: "auction",
  });
  const field = (name: string) => text(`fields.${name}`);
  const [model, setModel] = useState<string[]>([]);
  const [year, setYear] = useState<number[]>([]);
  const [time, setTime] = useState(Date.now());
  const { data: brands, isLoading: isGettingBrands } =
    trpc.admin.getBrandAutoComplete.useQuery();
  const { isLoading: isGettingModels } =
    trpc.admin.getModelByBrandName.useQuery(data.brand, {
      enabled: !!data.brand,
      onSuccess(data) {
        console.log(data);
        setModel(data.map((o) => o.name));
        const years = data.filter((o) => !!o.year).map((o) => o.year as number);
        setYear(years);
      },
      onError(err) {
        console.log(err);
      },
    });
  const [open, setOpen] = useState<"brand" | "model" | undefined>(undefined);
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
      <h5>{text("steps.title")}</h5>
      <div className="flex w-full flex-col gap-4 py-4  lg:w-[80%]">
        <div className="flex flex-row gap-3">
          <Autocomplete
            // lang={}
            disabled={disabled}
            open={open == "brand"}
            onOpen={() => setOpen("brand")}
            onClose={() => setOpen("model")}
            options={brands || []}
            value={data.brand}
            loading={isGettingBrands}
            onChange={(e, v) => {
              setData({
                ...data,
                brand: v,
                model: undefined,
                buildYear: undefined,
              });
            }}
            className="w-1/2"
            renderInput={(params) => (
              <TextField {...params} required label={field("brand")} />
            )}
          />
          <Autocomplete
            // lang={}
            disabled={disabled}
            options={[...new Set(model)]}
            value={data.model}
            open={open == "model"}
            isOptionEqualToValue={(option, value) => option === value}
            onOpen={() => setOpen("model")}
            onClose={() => setOpen(undefined)}
            loading={isGettingModels}
            onChange={(e, v) => {
              setData({ ...data, model: v });
            }}
            className="w-1/2"
            renderInput={(params) => (
              <TextField {...params} required label={field("model")} />
            )}
          />
        </div>

        <div className="flex flex-row gap-3">
          <Autocomplete
            // lang={}
            disabled={disabled}
            value={data.buildYear}
            options={year}
            loading={isGettingModels}
            onChange={(e, v) => {
              setData({ ...data, buildYear: v });
            }}
            className="w-1/2"
            renderInput={(params) => (
              <TextField {...params} required label={field("build year")} />
            )}
          />
          <FormControl required className="w-1/2">
            <InputLabel htmlFor="model">{field("fuel")}</InputLabel>
            <Select
              value={data.fuel}
              label={field("fuel")}
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
  name: string;
  onClick: () => void;
};
const BodyItem = ({ isActive, color, onClick, name }: BodyItemProps) => {
  const { text } = useLang({ file: "dashboard", selector: "auction" });
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        onClick={onClick}
        style={{ backgroundColor: color }}
        className={cx("h-[50px] w-[50px] cursor-pointer rounded-full  border", {
          "border-[3px] border-primary": isActive,
        })}
      ></div>
      <span
        className={cx(
          "text-[10px]",
          isActive && "rounded-md bg-primary px-2 py-[1px] text-white"
        )}
      >
        {text("color." + name.toLowerCase())}
      </span>
    </div>
  );
};
export default Step1;
