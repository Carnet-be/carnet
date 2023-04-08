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
import Map from "@ui/components/map";
import { useEffect } from "react";
import { LangCommonContext, LangContext } from "../../pages/hooks";
import { COUNTRIES } from "@data/internal";
const Step6 = ({
  data,
  setData,
  defaultName,
  uploadRef,
}: {
  data: Data6;
  setData: any;
  defaultName: string;
  uploadRef: MutableRefObject<undefined>;
}) => {
  // useEffect(() => {
  //   setData({ ...data, name: defaultName })
  // }, [])
  const text = useContext(LangContext);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-[96%] flex-col items-stretch gap-4">
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
            <span className="text-sm ">{text("fields.auction duration")}</span>
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

        <div className="flex flex-row gap-2">
          <div className="flex flex-grow flex-col gap-1">
            <p className="text-[9px] italic opacity-60">
              {text("fields.address description")}
            </p>
            <TextField
              label={text("fields.address")}
              size="small"
              multiline
              minRows={2}
              value={data.address}
              onChange={(e) => setData({ ...data, address: e.target.value })}
            />
          </div>

          <Map
            options={{ zoomControl: false }}
            latitude={data.lat || 0}
            longitude={data.lon || 0}
            onClick={(el: google.maps.MapMouseEvent) => {
              console.log(el);
              if (el.latLng) {
                setData({
                  ...data,
                  lat: el.latLng.lat(),
                  lon: el.latLng.lng(),
                });
              }
            }}
            containerClass={"w-[40%] h-auto bg-red-100"}
          />
        </div>
        <div className="flex flex-row gap-1 text-xs">
          <Autocomplete
            // lang={}
            freeSolo={true}
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
            freeSolo={true}
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
