/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ButtonGroup,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  TextField,
  Select,
  Autocomplete,
} from "@mui/material";
import Upload from "@ui/components/upload";

import { useState, type MutableRefObject, useContext } from "react";
import { type Data6 } from ".";
import GoogleMapReact from "google-map-react";

import cx from "classnames";
import Map, { MapDialog } from "@ui/components/map";
import { useEffect } from "react";
import { LangCommonContext, LangContext } from "../../pages/hooks";
import { COUNTRIES } from "@data/internal";
import { BuyNow } from "./index";
import { set } from "lodash";
const Step6 = ({
  data,
  setData,
  defaultName,
  uploadRef,
  buyNow,
  setBuyNow,
  readOnly,
}: {
  data: Data6;
  setData: any;
  defaultName: string;
  uploadRef: MutableRefObject<undefined>;
  buyNow: BuyNow;
  setBuyNow: any;
  readOnly?: any;
}) => {
  // useEffect(() => {
  //   setData({ ...data, name: defaultName })
  // }, [])
  const text = useContext(LangContext);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex w-[96%] flex-col items-stretch gap-2">
        <TextField
          label={text("fields.name")}
          disabled
          size="small"
          value={data.name}
          defaultValue={defaultName}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <div className="flex flex-col items-stretch gap-1">
          <p className="text-[9px] italic opacity-60">
            {text("fields.description description")}
          </p>
          <TextField
            label={text("fields.description")}
            size="small"
            multiline
            minRows={2}
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </div>

        <Upload
          value={data.images}
          setValue={(v) => setData({ ...data, images: v })}
        />
        <div className="">
          <label className="flex flex-row items-center gap-3">
            <input
              type="checkbox"
              className="toggle-primary toggle"
              checked={!buyNow.buyNow}
              disabled={readOnly?.buyNow || false}
              onChange={(e) => {
                setBuyNow({ ...buyNow, buyNow: !buyNow.buyNow });
              }}
            />
            <span className="">{text("text.bidding system")}</span>
          </label>
        </div>
        {buyNow.buyNow ? (
          <div>
            <TextField
              label={text("fields.price")}
              type="number"
              value={buyNow.price}
              className="w-[300px]"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{"€"}</InputAdornment>
                ),
              }}
              onChange={(e) => setBuyNow({ ...buyNow, price: e.target.value })}
            />
          </div>
        ) : (
          <div className="flex flex-row items-center gap-3">
            <TextField
              label={text("fields.expected price")}
              type="number"
              value={data.expected_price}
              className="flex-grow"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{"€"}</InputAdornment>
                ),
              }}
              onChange={(e) =>
                setData({ ...data, expected_price: e.target.value })
              }
            />

            <div className="flex w-1/2 flex-col gap-1">
              <span className="text-sm ">
                {text("fields.auction duration")}
              </span>
              <div className="flex flex-row gap-2">
                {["3 days", "1 week", "2 weeks"].map((n, i) => {
                  return (
                    <button
                      key={i}
                      onClick={() => setData({ ...data, duration: n })}
                      className={cx(
                        "btn-primary btn-sm btn h-[2.3rem] rounded-md font-semibold",
                        {
                          //   "btn-disabled":n!=="3 days",
                          "btn-outline": data.duration !== n,
                        }
                      )}
                    >
                      <span className="">{text("duration." + n)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-row gap-2">
          <div className="flex flex-grow flex-col gap-1">
            <p className="text-[9px] italic opacity-60">
              {text("fields.address description")}
            </p>
            <TextField
              label={text("fields.address")}
              size="small"
              multiline
              minRows={3}
              value={data.address}
              onChange={(e) => setData({ ...data, address: e.target.value })}
            />
          </div>

          <MapDialog
            latitude={data.lat}
            longitude={data.lon}
            onClick={({ lat, lng }: { lat?: number; lng?: number }) => {
              setData({
                ...data,
                lat,
                lon: lng,
              });
            }}
            containerClass={
              "w-[25%] h-auto pt-4 flex flex-row items-center justify-center"
            }
          />
        </div>
        <div className="flex flex-row gap-1 text-xs">
          <Autocomplete
            // lang={}

            options={COUNTRIES.map((o) => o.name)}
            value={data.country}
            clearIcon={null}
            size="small"
            onChange={(e, v) => {
              setData({
                ...data,
                country: v,
              });
            }}
            className="w-1/2"
            renderInput={(params) => (
              <TextField {...params} label={text("fields.country")} />
            )}
          />
          <Autocomplete
            // lang={}

            options={
              COUNTRIES.filter((o) => o.name === data.country)[0]?.cities || []
            }
            value={data.city}
            sx={{
              fontSize: "0.8rem",
            }}
            clearIcon={null}
            size="small"
            onChange={(e, v) => {
              console.log("e", e);
              setData({
                ...data,
                city: v,
              });
            }}
            className="w-1/2"
            renderInput={(params) => (
              <TextField {...params} label={text("fields.city")} />
            )}
          />

          <TextField
            label="Zip"
            size="small"
            className="w-1/2"
            value={data.zipCode}
            onChange={(e) => setData({ ...data, zipCode: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default Step6;
