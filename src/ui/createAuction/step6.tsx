/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonGroup, InputAdornment, TextField } from "@mui/material";
import Upload from "@ui/components/upload";
import { Button, DatePicker } from "antd";
import { useState, type MutableRefObject } from "react";
import { type Data6 } from ".";
import GoogleMapReact from "google-map-react";

import cx from "classnames";
import Map from "@ui/components/map";
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
  const defaultProps = {
    center: {
      lat: 33.98087546234331,
      lng: -6.8596261794178,
    },
    zoom: 14,
  };
  const [position, setdefaultProps] = useState(defaultProps);
  const onAddMarker = (a: any) => {
    console.log(a);
  };

  const onClickChild = (id: any) => console.log(id);

  const onChangeLatitude = (v: any) =>
    setdefaultProps((old) => ({
      ...old,
      center: { ...old.center, lat: parseFloat(v.target.value) || 0 },
    }));

  const onChangeLongitude = (v: any) =>
    setdefaultProps((old) => ({
      ...old,
      center: { ...old.center, lng: parseFloat(v.target.value) || 0 },
    }));
  const onDeleteMarker = () => {
    console.log("Deleting");
  };
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-[96%] flex-col items-stretch gap-4">
        <TextField
          label="Nom de l'auction"
      
          size="small"
          value={data.name||defaultName}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <TextField
          label="Description"
          size="small"
          multiline
          minRows={2}
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />
        <Upload
          uploadRef={uploadRef}
          value={data.images}
          setValue={(v) => setData({ ...data, images: v })}
        />
        <div className="flex flex-row items-center gap-3">
          <TextField
            label="Expected Price"
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
            <span className="text-sm ">Auction Duration</span>
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
                    <span className="">{n}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-2">
          <div className="flex flex-grow flex-col gap-1">
            <TextField
              label="Adresse"
              size="small"
              multiline
              minRows={2}
              value={data.address}
              onChange={(e) => setData({ ...data, address: e.target.value })}
            />

            <div className="flex flex-row gap-1">
              <TextField
                label="Country"
                size="small"
                value={data.country}
                onChange={(e) => setData({ ...data, country: e.target.value })}
              />
              <TextField
                label="City"
                size="small"
                value={data.city}
                onChange={(e) => setData({ ...data, city: e.target.value })}
              />
              <TextField
                label="Zip"
                size="small"
                value={data.zipCode}
                onChange={(e) => setData({ ...data, zipCode: e.target.value })}
              />
            </div>
          </div>

          <Map
            options={{ zoomControl: false }}
            latitude={0}
            longitude={0}
            onClick={(el) => {
              console.log(el);
            }}
            containerClass={"w-[50%] h-auto bg-red-100"}
          />
        </div>
      </div>
    </div>
  );
};

export default Step6;
